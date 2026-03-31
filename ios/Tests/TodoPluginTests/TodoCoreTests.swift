import XCTest
@testable import TodoPlugin

final class TodoCoreTests: XCTestCase {
    func testEchoReturnsValueUnchanged() {
        let core = TodoCore()
        XCTAssertEqual(core.echo("contract-ping"), TodoEchoResult(value: "contract-ping"))
    }

    func testDefaultOptionsMatchContract() {
        let core = TodoCore()

        XCTAssertEqual(
            core.getOptions(),
            TodoOptions(enabled: true, debug: false)
        )
    }

    func testSetOptionsOnlyUpdatesProvidedFields() {
        let core = TodoCore()
        core.setOptions(enabled: nil, debug: true)

        XCTAssertEqual(
            core.getOptions(),
            TodoOptions(enabled: true, debug: true)
        )
    }

    func testResetOptionsRestoresDefaults() {
        let core = TodoCore()
        core.setOptions(enabled: false, debug: true)
        core.resetOptions()

        XCTAssertEqual(
            core.getOptions(),
            TodoOptions(enabled: true, debug: false)
        )
    }

    func testStartMovesStatusToRunning() throws {
        let core = TodoCore()
        try core.start(permissionState: "granted")

        XCTAssertEqual(core.getStatus().status, "running")
    }

    func testStopReturnsStatusToIdle() throws {
        let core = TodoCore()
        try core.start(permissionState: "granted")
        try core.stop()

        XCTAssertEqual(core.getStatus().status, "idle")
    }

    func testStartThrowsWhenDisabled() {
        let core = TodoCore()
        core.setOptions(enabled: false, debug: nil)

        XCTAssertThrowsError(try core.start(permissionState: "granted"))
    }

    func testValidateStartPreconditionsThrowsWhenDisabled() {
        let core = TodoCore()
        core.setOptions(enabled: false, debug: nil)

        XCTAssertThrowsError(try core.validateStartPreconditions())
    }

    func testValidateStartPreconditionsThrowsWhenStatusIsNotIdle() throws {
        let core = TodoCore()
        try core.start(permissionState: "granted")

        XCTAssertThrowsError(try core.validateStartPreconditions())
    }

    func testCompleteStartThrowsWhenPermissionDeniedWithoutChangingStatus() throws {
        let core = TodoCore()
        try core.validateStartPreconditions()

        XCTAssertThrowsError(try core.completeStart(permissionState: "denied"))
        XCTAssertEqual(core.getStatus().status, "idle")
    }
}
