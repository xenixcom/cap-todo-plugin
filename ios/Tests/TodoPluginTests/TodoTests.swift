import XCTest
@testable import TodoPlugin

class TodoTests: XCTestCase {
    func testEcho() {
        let implementation = Todo()
        let value = "Hello, World!"
        let result = implementation.echo(value)

        XCTAssertEqual(result, "\(value) from ios")
    }
}
