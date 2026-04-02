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
        let controller = ProbeViewController(resultWriter: resultWriter)

        window.rootViewController = controller
        window.makeKeyAndVisible()
        self.window = window

        return true
    }
}

@MainActor
private final class ProbeViewController: UIViewController, WKNavigationDelegate {
    private let resultWriter: ProbeResultWriter
    private lazy var webView: WKWebView = {
        let view = WKWebView(frame: .zero)
        view.navigationDelegate = self
        return view
    }()

    init(resultWriter: ProbeResultWriter) {
        self.resultWriter = resultWriter
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
        webView.loadHTMLString(Self.testHTML, baseURL: nil)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("window.__test__.add(1, 2)") { [resultWriter] result, error in
            if let error {
                resultWriter.write(status: "error", detail: error.localizedDescription)
                return
            }

            let renderedResult: String
            if let number = result as? NSNumber {
                renderedResult = number.stringValue
            } else {
                renderedResult = String(describing: result)
            }

            resultWriter.write(status: "ok", detail: renderedResult)
        }
    }

    private static let testHTML = """
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>WKWebView Host Probe</title>
      </head>
      <body>
        <script>
          window.__test__ = {
            add(a, b) {
              return a + b;
            }
          };
        </script>
      </body>
    </html>
    """
}

private struct ProbeResultWriter {
    private let fileManager = FileManager.default

    func write(status: String, detail: String) {
        do {
            let directory = try resultDirectory()
            let fileURL = directory.appendingPathComponent("wkwebview-host-probe.json")
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
