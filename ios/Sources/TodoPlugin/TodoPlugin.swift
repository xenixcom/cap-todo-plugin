import Capacitor
import Foundation
import AVFoundation
import Photos

@objc(TodoPlugin)
public class TodoPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "TodoPlugin"
    public let jsName = "Todo"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startRecording", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopRecording", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "takePhoto", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise),
    ]

    private let implementation = Todo()

    // --------------------------------------------------
    // MARK: - Lifecycle
    // --------------------------------------------------

    override public func load() {
        implementation.onNotify = { [weak self] eventName, data in
            self?.notifyListeners(eventName, data: data)
        }
    }

    // --------------------------------------------------
    // MARK: - Actions
    // --------------------------------------------------

    @objc func echo(_ call: CAPPluginCall) {
        call.resolve([
            "value": implementation.echo(call.getString("value") ?? "")
        ])
    }

    @objc func startRecording(_ call: CAPPluginCall) {
        ensurePermissions(["microphone"], call: call) {
            self.implementation.startRecording()
            call.resolve()
        }
    }

    @objc func stopRecording(_ call: CAPPluginCall) {
        implementation.stopRecording()
        call.resolve()
    }

    @objc func takePhoto(_ call: CAPPluginCall) {
        ensurePermissions(["camera", "photos"], call: call) {
            self.implementation.takePhoto()
            call.resolve()
        }
    }

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        call.resolve(checkPermissionsInternal())
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        let requested =
            call.getArray("permissions", String.self)
            ?? ["camera", "microphone", "photos"]

        let current = checkPermissionsInternal()

        let missing = requested.filter {
            !isGranted(current[$0])
        }

        if missing.isEmpty {
            call.resolve(current)
            return
        }

        requestPermissionsInternal(missing) {
            call.resolve(self.checkPermissionsInternal())
        }
    }

    // --------------------------------------------------
    // MARK: - Permission Management
    // --------------------------------------------------

    private func ensurePermissions(_ required: [String], call: CAPPluginCall, onGranted: @escaping () -> Void) {
        let current = checkPermissionsInternal()

        let missing = required.filter {
            !isGranted(current[$0])
        }

        if missing.isEmpty {
            onGranted()
            return
        }

        requestPermissionsInternal(missing) {
            let updated = self.checkPermissionsInternal()
            let granted = required.allSatisfy {
                self.isGranted(updated[$0])
            }

            granted ? onGranted() : call.reject("Permission denied")
        }
    }

    private func isGranted(_ state: String?) -> Bool {
        return state == "granted" || state == "limited"
    }

    private func checkPermissionsInternal() -> [String: String] {
        [
            "camera": permissionState(
                AVCaptureDevice.authorizationStatus(for: .video)
            ),
            "microphone": permissionState(
                AVAudioSession.sharedInstance().recordPermission
            ),
            "photos": permissionState(
                PHPhotoLibrary.authorizationStatus(for: .readWrite)
            )
        ]
    }

    private func requestPermissionsInternal(_ permissions: [String], completion: @escaping () -> Void) {
        let group = DispatchGroup()

        for permission in permissions {
            group.enter()
            switch permission {
            case "camera":
                AVCaptureDevice.requestAccess(for: .video) { _ in group.leave() }
            case "microphone":
                AVAudioSession.sharedInstance()
                    .requestRecordPermission { _ in group.leave() }
            case "photos":
                PHPhotoLibrary.requestAuthorization(for: .readWrite) { _ in group.leave() }
            default:
                group.leave()
            }
        }

        group.notify(queue: .main, execute: completion)
    }

    private func permissionState(_ status: Any) -> String {
        switch status {

        case let v as AVAuthorizationStatus:
            switch v {
                case .authorized: return "granted"
                case .notDetermined: return "prompt"
                case .denied, .restricted: return "denied"
                @unknown default: return "denied"
            }

        case let v as AVAudioSession.RecordPermission:
            switch v {
                case .granted: return "granted"
                case .undetermined: return "prompt"
                case .denied: return "denied"
                @unknown default: return "denied"
            }

        case let v as PHAuthorizationStatus:
            switch v {
                case .authorized: return "granted"
                case .limited: return "limited"
                case .notDetermined: return "prompt"
                case .denied, .restricted: return "denied"
                @unknown default: return "denied"
            }

        default:
            return "denied"
        }
    }

}
