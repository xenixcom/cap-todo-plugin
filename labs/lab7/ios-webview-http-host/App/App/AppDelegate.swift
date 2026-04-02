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
    private var reported = false
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

        guard let resourceURL = Bundle.main.resourceURL else {
            resultWriter.write(fileName: "wkwebview-http-probe.json", status: "error", detail: "missing bundle resource url")
            return
        }

        let publicURL = resourceURL.appendingPathComponent("public", isDirectory: true)
        let htmlURL = publicURL.appendingPathComponent(
            probeMode == "fault" ? "probe-fault.html" : "probe.html"
        )

        guard FileManager.default.fileExists(atPath: htmlURL.path) else {
            resultWriter.write(fileName: "wkwebview-http-probe.json", status: "error", detail: "missing bundled probe assets")
            return
        }

        webView.loadFileURL(htmlURL, allowingReadAccessTo: publicURL)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("""
        JSON.stringify({
          href: String(window.location.href),
          hasTest: typeof window.__test__,
          hasMessageHandler: !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.probe)
        })
        """) { [weak self] value, error in
            guard let self else { return }
            if self.reported { return }
            if let error {
                self.write(status: "error", detail: "didFinish js eval error: \(error.localizedDescription)")
                return
            }

            guard let detail = value as? String else {
                self.write(status: "error", detail: "didFinish returned non-string diagnostic")
                return
            }

            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                if self.reported { return }
                self.write(status: "error", detail: "no pushed result after didFinish: \(detail)")
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        write(status: "error", detail: "navigation failed: \(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        write(status: "error", detail: "provisional navigation failed: \(error.localizedDescription)")
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "probe" else { return }

        let detail: String
        if let payload = message.body as? [String: Any], let raw = payload["detail"] {
            detail = String(describing: raw)
        } else {
            detail = String(describing: message.body)
        }

        if detail == "pass" {
            write(status: "ok", detail: detail)
        } else {
            write(status: "fail", detail: detail)
        }
    }

    private func write(status: String, detail: String) {
        guard !reported else { return }
        reported = true
        resultWriter.write(fileName: "wkwebview-http-probe.json", status: status, detail: detail)
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
