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
    private lazy var webView: WKWebView = {
        let contentController = WKUserContentController()
        contentController.add(self, name: "probe")
        let configuration = WKWebViewConfiguration()
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
        guard message.name == "probe" else { return }

        let detail: String
        if let payload = message.body as? [String: Any], let raw = payload["detail"] {
            detail = String(describing: raw)
        } else {
            detail = String(describing: message.body)
        }

        if detail == "3" {
            resultWriter.write(fileName: "wkwebview-async-probe.json", status: "ok", detail: detail)
        } else {
            resultWriter.write(fileName: "wkwebview-async-probe.json", status: "fail", detail: "expected 3 got \(detail)")
        }
    }

    private static func testHTML(probeMode: String) -> String {
        let addBody = probeMode == "fault" ? "return a - b;" : "return a + b;"
        return """
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>WKWebView Host Probe</title>
          </head>
          <body>
            <script>
              window.__test__ = {
                addAsync(a, b) {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve((function(a, b) { \(addBody) })(a, b));
                    }, 150);
                  });
                }
              };
              window.addEventListener('load', async () => {
                const result = await window.__test__.addAsync(1, 2);
                window.webkit.messageHandlers.probe.postMessage({ detail: String(result), mode: 'async' });
              });
            </script>
          </body>
        </html>
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
