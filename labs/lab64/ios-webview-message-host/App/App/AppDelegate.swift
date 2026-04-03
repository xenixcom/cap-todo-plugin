import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    private let resultWriter = ProbeResultWriter()

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        let arguments = ProcessInfo.processInfo.arguments
        let probeMode = arguments.contains("fault")
            ? "fault"
            : (ProcessInfo.processInfo.environment["PROBE_MODE"] ?? "normal")
        let controller = ProbeViewController(resultWriter: resultWriter, probeMode: probeMode)

        window.rootViewController = controller
        window.makeKeyAndVisible()
        self.window = window

        return true
    }
}

@MainActor
private final class ProbeViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {
    private let resultWriter: ProbeResultWriter
    private let probeMode: String
    private let helperWorld = WKContentWorld.world(name: "ProbeWorld")
    private var pageDetail: String?
    private var helperDetail: String?
    private lazy var webView: WKWebView = {
        let contentController = WKUserContentController()
        contentController.add(self, contentWorld: .page, name: "pageProbe")
        contentController.add(
            self,
            contentWorld: probeMode == "fault" ? .page : helperWorld,
            name: "helperProbe"
        )
        let configuration = WKWebViewConfiguration()
        let helperScript = WKUserScript(
            source: Self.helperScriptSource(),
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true,
            in: probeMode == "fault" ? .page : helperWorld
        )
        contentController.addUserScript(helperScript)
        configuration.userContentController = contentController
        let view = WKWebView(frame: .zero, configuration: configuration)
        view.navigationDelegate = self
        return view
    }()

    init(resultWriter: ProbeResultWriter, probeMode: String) {
        self.resultWriter = resultWriter
        self.probeMode = probeMode
        super.init(nibName: nil, bundle: nil)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        webView.frame = view.bounds
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(webView)
        webView.loadHTMLString(Self.testHTML(probeMode: probeMode), baseURL: nil)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // JS pushes the result to the host; there is nothing to pull here.
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let detail: String
        if let payload = message.body as? [String: Any], let raw = payload["detail"] {
            detail = String(describing: raw)
        } else {
            detail = String(describing: message.body)
        }

        if message.name == "pageProbe" {
            pageDetail = detail
        } else if message.name == "helperProbe" {
            helperDetail = detail
        }

        guard let pageDetail, let helperDetail else { return }

        let expectedPage = "pageValue:string|helperInjected:undefined"
        let expectedHelper = probeMode == "fault"
            ? "pageValue:string|helperInjected:string"
            : "pageValue:undefined|helperInjected:string"

        if pageDetail == expectedPage && helperDetail == expectedHelper {
            resultWriter.write(fileName: "wkcontentworld-probe.json", status: probeMode == "fault" ? "fail" : "ok", detail: "page=\(pageDetail); helper=\(helperDetail)")
        } else {
            resultWriter.write(fileName: "wkcontentworld-probe.json", status: "fail", detail: "page=\(pageDetail); helper=\(helperDetail)")
        }
    }

    private static func testHTML(probeMode: String) -> String {
        return """
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>WKContentWorld Probe</title>
          </head>
          <body>
            <script>
              window.pageValue = 'page';
              window.addEventListener('load', () => {
                const detail = [
                  'pageValue:' + typeof window.pageValue,
                  'helperInjected:' + typeof window.helperInjected
                ].join('|');
                window.webkit.messageHandlers.pageProbe.postMessage({ detail });
              });
            </script>
          </body>
        </html>
        """
    }

    private static func helperScriptSource() -> String {
        """
        window.helperInjected = 'helper';
        window.webkit.messageHandlers.helperProbe.postMessage({
          detail: [
            'pageValue:' + typeof window.pageValue,
            'helperInjected:' + typeof window.helperInjected
          ].join('|')
        });
        """
    }
}

private struct ProbeResultWriter {
    private let fileManager = FileManager.default

    func write(fileName: String = "wkwebview-host-probe.json", status: String, detail: String) {
        do {
            let directory = try resultDirectory()
            let fileURL = directory.appendingPathComponent(fileName)
            let payload = """
            {"status":"\(escape(status))","detail":"\(escape(detail))"}
            """

            try payload.write(to: fileURL, atomically: true, encoding: .utf8)
            print("WKWEBVIEW_HOST_PROBE_RESULT=\(fileURL.path)")
            print("WKWEBVIEW_HOST_PROBE_STATUS=\(status)")
            print("WKWEBVIEW_HOST_PROBE_DETAIL=\(detail)")
        } catch {
            print("WKWEBVIEW_HOST_PROBE_WRITE_ERROR=\(error.localizedDescription)")
        }
    }

    private func resultDirectory() throws -> URL {
        let directory = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        if !fileManager.fileExists(atPath: directory.path) {
            try fileManager.createDirectory(at: directory, withIntermediateDirectories: true)
        }
        return directory
    }

    private func escape(_ value: String) -> String {
        value
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
    }
}
