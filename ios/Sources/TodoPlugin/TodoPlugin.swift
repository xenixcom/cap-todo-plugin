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

    private var enabled = true
    private var debug = false
    private var status = "idle"
    private var pendingStartCall: CAPPluginCall?

    @objc func getStatus(_ call: CAPPluginCall) {
        call.resolve([
            "status": status
        ])
    }

    @objc func getOptions(_ call: CAPPluginCall) {
        call.resolve(currentOptions())
    }

    @objc func setOptions(_ call: CAPPluginCall) {
        if let nextEnabled = call.getBool("enabled") {
            enabled = nextEnabled
        }

        if let nextDebug = call.getBool("debug") {
            debug = nextDebug
        }

        call.resolve()
    }

    @objc func resetOptions(_ call: CAPPluginCall) {
        enabled = true
        debug = false
        call.resolve()
    }

    @objc func echo(_ call: CAPPluginCall) {
        call.resolve([
            "value": call.getString("value") ?? ""
        ])
    }

    @objc func start(_ call: CAPPluginCall) {
        if !enabled {
            reject(call, code: "INVALID_STATE", message: "Plugin is disabled")
            return
        }

        if status != "idle" {
            reject(call, code: "INVALID_STATE", message: "Plugin can only start from idle")
            return
        }

        ensureMicrophonePermission(call: call) {
            self.setStatus("running")
            call.resolve()
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        if status != "running" {
            reject(call, code: "INVALID_STATE", message: "Plugin can only stop from running")
            return
        }

        setStatus("idle")
        call.resolve()
    }

    @objc func reset(_ call: CAPPluginCall) {
        setStatus("init")
        enabled = true
        debug = false
        setStatus("idle")
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

    private func ensureMicrophonePermission(call: CAPPluginCall, onGranted: @escaping () -> Void) {
        let current = checkPermissionsInternal()
        if isGranted(current["microphone"]) {
            onGranted()
            return
        }

        pendingStartCall = call
        requestPermissionsInternal {
            let updated = self.checkPermissionsInternal()
            if self.isGranted(updated["microphone"]) {
                onGranted()
            } else {
                self.reject(call, code: "PERMISSION_DENIED", message: "Microphone permission is required")
            }
            self.pendingStartCall = nil
        }
    }

    private func isGranted(_ state: String?) -> Bool {
        return state == "granted"
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

    private func setStatus(_ nextStatus: String) {
        if status == nextStatus {
            return
        }

        status = nextStatus
        notifyListeners("statusChange", data: ["status": nextStatus])
    }

    private func currentOptions() -> [String: Any] {
        [
            "enabled": enabled,
            "debug": debug,
        ]
    }

    private func reject(_ call: CAPPluginCall, code: String, message: String) {
        call.reject(message, code, nil)
    }
}
