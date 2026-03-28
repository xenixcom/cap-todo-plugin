import Foundation

public struct TodoOptions: Equatable {
    public var enabled: Bool = true
    public var debug: Bool = false
}

public struct TodoStatusResult: Equatable {
    public var status: String
}

public struct TodoEchoResult: Equatable {
    public var value: String
}

public struct TodoPluginError: Error, Equatable {
    public let code: String
    public let message: String
}

public final class TodoCore {

    public var onStatusChange: ((String) -> Void)?

    private var options = TodoOptions()
    private var status = "idle"

    public init() {}

    public func getStatus() -> TodoStatusResult {
        TodoStatusResult(status: status)
    }

    public func getOptions() -> TodoOptions {
        options
    }

    public func setOptions(enabled: Bool?, debug: Bool?) {
        if let enabled {
            options.enabled = enabled
        }

        if let debug {
            options.debug = debug
        }
    }

    public func resetOptions() {
        options = TodoOptions()
    }

    public func echo(_ value: String) -> TodoEchoResult {
        TodoEchoResult(value: value)
    }

    public func start(permissionState: String) throws {
        if !options.enabled {
            throw TodoPluginError(code: "INVALID_STATE", message: "Plugin is disabled")
        }

        if status != "idle" {
            throw TodoPluginError(code: "INVALID_STATE", message: "Plugin can only start from idle")
        }

        if permissionState != "granted" {
            throw TodoPluginError(
                code: "PERMISSION_DENIED",
                message: "Microphone permission is required"
            )
        }

        setStatus("running")
    }

    public func stop() throws {
        if status != "running" {
            throw TodoPluginError(code: "INVALID_STATE", message: "Plugin can only stop from running")
        }

        setStatus("idle")
    }

    public func reset() {
        setStatus("init")
        resetOptions()
        setStatus("idle")
    }

    private func setStatus(_ nextStatus: String) {
        if status == nextStatus {
            return
        }

        status = nextStatus
        onStatusChange?(nextStatus)
    }
}
