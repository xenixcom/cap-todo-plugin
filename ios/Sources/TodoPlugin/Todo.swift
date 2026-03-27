import Foundation

@objc public class Todo: NSObject {
    
    public var onNotify: ((String, [String: Any]) -> Void)?

    @objc public func echo(_ value: String) -> String {
        let result = "\(value) from ios"
        print("[Todo]", "Echo called with: \(result)")
        
        let data: [String: Any] = [
            "time": DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium),
            "status": "success"
        ]
        
        onNotify?("updateTime", data)
        return result
    }

    @objc public func startRecording() {
        print("[Todo]", "startRecording called")
        return
    }

    @objc public func stopRecording() {
        print("[Todo]", "stopRecording called")
        return
    }

    @objc public func takePhoto() {
        print("[Todo]", "takePhoto called")
        return
    }

}
