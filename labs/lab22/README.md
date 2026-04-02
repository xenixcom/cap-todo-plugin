# Lab 22

This lab isolates the iOS `requestPermissions()` normal-path seam.

The question is:

- in a `WKWebView` host-backed probe
- does `Todo.requestPermissions({ permissions: ['microphone'] })`
  - resolve
  - reject
  - or stay pending
- and what happens immediately after that to:
  - `checkPermissions()`
  - `openSession()`

This is intentionally iOS-only.

## Result

- iOS:
  - `{"status":"error","detail":"no pushed result after didFinish: {\"href\":\"file:///.../probe.html\",\"hasTest\":\"undefined\",\"hasMessageHandler\":true}"}`

## Conclusion

- `requestPermissions({ permissions: ['microphone'] })` on the real plugin-facing path did not produce a final pushed result on iOS.
- The page loaded and the native message handler existed.
- The fault path for unsupported permissions already worked in the previous lab chain.
- So this lab sharpened the question:
  - the problematic seam is on the real microphone-request path, not on the existence of the bridge or the unsupported-permission path.
