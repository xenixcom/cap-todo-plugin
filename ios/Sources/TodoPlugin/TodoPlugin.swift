import Capacitor
import Foundation
import AVFoundation

@objc(TodoPlugin)
public class TodoPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "TodoPlugin"
    public let jsName = "Todo"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getOptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setOptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resetOptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reset", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise),
    ]

    private let core = TodoCore()

    public override func load() {
        core.onStatusChange = { [weak self] status in
            self?.notifyListeners("statusChange", data: ["status": status])
        }
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        call.resolve([
            "status": core.getStatus().status
        ])
    }

    @objc func getOptions(_ call: CAPPluginCall) {
        call.resolve(currentOptions())
    }

    @objc func setOptions(_ call: CAPPluginCall) {
        core.setOptions(enabled: call.getBool("enabled"), debug: call.getBool("debug"))
        call.resolve()
    }

    @objc func resetOptions(_ call: CAPPluginCall) {
        core.resetOptions()
        call.resolve()
    }

    @objc func echo(_ call: CAPPluginCall) {
        let result = core.echo(call.getString("value") ?? "")
        call.resolve([
            "value": result.value
        ])
    }

    @objc func start(_ call: CAPPluginCall) {
        do {
            let permissions = checkPermissionsInternal()
            try core.start(permissionState: permissions["microphone"] ?? "denied")
            call.resolve()
        } catch let error as TodoPluginError {
            reject(call, code: error.code, message: error.message)
        } catch {
            reject(call, code: "OPERATION_FAILED", message: "Start failed")
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        do {
            try core.stop()
            call.resolve()
        } catch let error as TodoPluginError {
            reject(call, code: error.code, message: error.message)
        } catch {
            reject(call, code: "OPERATION_FAILED", message: "Stop failed")
        }
    }

    @objc func reset(_ call: CAPPluginCall) {
        core.reset()
        call.resolve()
    }

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        call.resolve(checkPermissionsInternal())
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        let requested =
            call.getArray("permissions", String.self)
            ?? ["microphone"]

        let invalid = requested.first {
            $0 != "microphone"
        }

        if invalid != nil {
            reject(call, code: "INVALID_ARGUMENT", message: "Unsupported permission request")
            return
        }

        if requested.isEmpty {
            call.resolve(checkPermissionsInternal())
            return
        }

        requestPermissionsInternal {
            call.resolve(self.checkPermissionsInternal())
        }
    }

    private func checkPermissionsInternal() -> [String: String] {
        [
            "microphone": permissionState(
                AVAudioSession.sharedInstance().recordPermission
            )
        ]
    }

    private func requestPermissionsInternal(completion: @escaping () -> Void) {
        AVAudioSession.sharedInstance().requestRecordPermission { _ in
            DispatchQueue.main.async {
                completion()
            }
        }
    }

    private func permissionState(_ status: Any) -> String {
        switch status {

        case let v as AVAudioSession.RecordPermission:
            switch v {
                case .granted: return "granted"
                case .undetermined: return "prompt"
                case .denied: return "denied"
                @unknown default: return "denied"
            }

        default:
            return "denied"
        }
    }

    private func currentOptions() -> [String: Any] {
        let options = core.getOptions()
        return [
            "enabled": options.enabled,
            "debug": options.debug,
        ]
    }

    private func reject(_ call: CAPPluginCall, code: String, message: String) {
        call.reject(message, code, nil)
    }
}
