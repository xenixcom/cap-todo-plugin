import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = ProbeBridgeViewController()
        window.makeKeyAndVisible()
        self.window = window
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}

@objc(ProbeBridgeViewController)
class ProbeBridgeViewController: CAPBridgeViewController {
    private var attempts = 0
    private var reported = false

    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.pollResult()
        }
    }

    private func pollResult() {
        guard !reported, let webView else { return }

        webView.evaluateJavaScript("window.__probeResult ?? null") { [weak self] value, _ in
            guard let self else { return }
            if self.reported { return }

            if let json = value as? String, json != "null" {
                self.reported = true
                ProbeResultWriter().write(fileName: "wkwebview-native-bridge-probe.json", json: json)
                return
            }

            self.attempts += 1
            if self.attempts >= 20 {
                webView.evaluateJavaScript(#"""
                JSON.stringify({
                  readyState: document.readyState,
                  hasCapacitor: !!window.Capacitor,
                  hasCapacitorExports: !!window.capacitorExports,
                  hasRegisterPlugin: typeof ((window.Capacitor || window.capacitorExports?.Capacitor || window.capacitorExports)?.registerPlugin),
                  hasPluginHeaders: Array.isArray((window.Capacitor || window.capacitorExports?.Capacitor || window.capacitorExports)?.PluginHeaders)
                })
                """#) { value, _ in
                    self.reported = true
                    let detail = (value as? String) ?? #"{"readyState":"unknown"}"#
                    ProbeResultWriter().write(
                        fileName: "wkwebview-native-bridge-probe.json",
                        json: #"{"status":"error","detail":"no probe result: \#(detail)"}"#
                    )
                }
                return
            }

            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.pollResult()
            }
        }
    }
}

private struct ProbeResultWriter {
    private let fileManager = FileManager.default

    func write(fileName: String, json: String) {
        do {
            let directory = try resultDirectory()
            let fileURL = directory.appendingPathComponent(fileName)
            try json.write(to: fileURL, atomically: true, encoding: .utf8)
        } catch {
            print("LAB41_WRITE_ERROR=\(error.localizedDescription)")
        }
    }

    private func resultDirectory() throws -> URL {
        let directory = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        if !fileManager.fileExists(atPath: directory.path) {
            try fileManager.createDirectory(at: directory, withIntermediateDirectories: true)
        }
        return directory
    }
}
