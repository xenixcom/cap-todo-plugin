# Lab 40

This lab revisits the real plugin-facing microphone permission path after adding the missing host-side media-permission wiring.

The question is:

- was the old black-hole behavior on iOS caused by missing host media-permission handling
- and if that wiring is present, does the real app-facing permission flow become observable

The host changes are intentionally small:

- iOS:
  - keeps `NSMicrophoneUsageDescription`
  - sets `uiDelegate`
  - implements `webView(_:requestMediaCapturePermissionFor:initiatedByFrame:type:decisionHandler:)`
  - grants requested media capture
- Android:
  - declares `RECORD_AUDIO`
  - adds `WebChromeClient.onPermissionRequest(...)`
  - grants requested media resources

## Result

Observed payloads:

- iOS normal:
  - `{"status":"fail","detail":"initial=prompt; request=granted; after=granted; open=ok"}`
- iOS fault:
  - `{"status":"ok","detail":"pass"}`
- Android normal:
  - `{"status":"fail","detail":"initial=prompt; request=prompt; after=prompt; open=error:Microphone permission is required"}`
- Android fault:
  - `{"status":"ok","detail":"pass"}`

The normal payloads are marked `fail` only because this copied lab host still treats any non-`pass` detail as a fail-shaped result file.
The important content is the permission/session detail string itself.

## Conclusion

- the earlier iOS black-hole behavior was not a hard plugin or `WKWebView` blocker
- once the host wires media-permission handling correctly:
  - `requestPermissions({ permissions: ['microphone'] })` becomes observable
  - `checkPermissions()` moves to `granted`
  - `openSession()` succeeds
- the unsupported-permission branch still remains valid on both platforms
- Android does not mirror the same state transition yet:
  - it still stays at `prompt`
  - `openSession()` still fails on microphone permission
- this means the permission question is now much sharper:
  - iOS has been reduced to a host wiring requirement
  - Android still holds the remaining app-facing permission-state transition seam
