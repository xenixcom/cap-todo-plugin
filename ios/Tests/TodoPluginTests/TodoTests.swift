import XCTest
@testable import TodoPlugin

class TodoTests: XCTestCase {
    func testDefaultOptionsAndStatusMatchContract() {
        let core = TodoCore()

        XCTAssertEqual(core.getOptions(), TodoOptions(enabled: true, debug: false))
        XCTAssertEqual(core.getStatus(), TodoStatusResult(status: "idle"))
    }

    func testSetOptionsOnlyUpdatesProvidedFields() {
        let core = TodoCore()

        core.setOptions(enabled: nil, debug: true)

        XCTAssertEqual(core.getOptions(), TodoOptions(enabled: true, debug: true))
    }

    func testResetOptionsDoesNotChangeStatus() throws {
        let core = TodoCore()
        try core.start(permissionState: "granted")

        core.setOptions(enabled: false, debug: true)
        core.resetOptions()

        XCTAssertEqual(core.getOptions(), TodoOptions(enabled: true, debug: false))
        XCTAssertEqual(core.getStatus(), TodoStatusResult(status: "running"))
    }

    func testLifecycleTransitionsMatchContract() throws {
        let core = TodoCore()

        try core.start(permissionState: "granted")
        XCTAssertEqual(core.getStatus(), TodoStatusResult(status: "running"))

        try core.stop()
        XCTAssertEqual(core.getStatus(), TodoStatusResult(status: "idle"))
    }

    func testResetEmitsInitThenIdleAndResetsOptions() throws {
        let core = TodoCore()
        var statuses: [String] = []
        core.onStatusChange = { statuses.append($0) }

        try core.start(permissionState: "granted")
        core.setOptions(enabled: false, debug: true)
        core.reset()

        XCTAssertEqual(statuses, ["running", "init", "idle"])
        XCTAssertEqual(core.getOptions(), TodoOptions(enabled: true, debug: false))
        XCTAssertEqual(core.getStatus(), TodoStatusResult(status: "idle"))
    }

    func testStartRejectsWhenDisabled() {
        let core = TodoCore()
        core.setOptions(enabled: false, debug: nil)

        XCTAssertThrowsError(try core.start(permissionState: "granted")) { error in
            XCTAssertEqual(
                error as? TodoPluginError,
                TodoPluginError(code: "INVALID_STATE", message: "Plugin is disabled")
            )
        }
    }

    func testStartRejectsWhenPermissionDenied() {
        let core = TodoCore()

        XCTAssertThrowsError(try core.start(permissionState: "denied")) { error in
            XCTAssertEqual(
                error as? TodoPluginError,
                TodoPluginError(
                    code: "PERMISSION_DENIED",
                    message: "Microphone permission is required"
                )
            )
        }
    }

    func testStopRejectsOutsideRunningState() {
        let core = TodoCore()

        XCTAssertThrowsError(try core.stop()) { error in
            XCTAssertEqual(
                error as? TodoPluginError,
                TodoPluginError(code: "INVALID_STATE", message: "Plugin can only stop from running")
            )
        }
    }

    func testEchoReturnsValueUnchanged() {
        let core = TodoCore()

        XCTAssertEqual(core.echo("Hello, World!"), TodoEchoResult(value: "Hello, World!"))
    }
}
