# Lab 24

This lab isolates the iOS `getUserMedia({ audio: true })` seam with lifecycle breadcrumbs.

The question is:

- does `navigator.mediaDevices` exist in this `WKWebView` host
- does `getUserMedia` exist
- when called with `{ audio: true }`, does it:
  - resolve
  - reject
  - or stay pending

This lab intentionally skips the plugin layer.

## Result

- iOS:
  - `{"status":"error","detail":"no pushed result after didFinish: {\"href\":\"file:///.../probe.html\",\"hasTest\":\"undefined\",\"hasMessageHandler\":true}; probeState={\"startedAt\":...,\"heartbeat\":4,\"breadcrumbs\":[\"5:load\",\"11:gum:start\",\"17:window.pageshow\"]}; lifecycle=667:didBecomeActive"}`

## Conclusion

- `navigator.mediaDevices.getUserMedia({ audio: true })` starts executing inside the host-backed `WKWebView`.
- The page loads, the probe begins, and JS heartbeats run briefly.
- The probe reaches `gum:start`.
- After that point the route still does not deliver a final JS result.
- The current evidence suggests the seam is below the plugin layer:
  - it is tied to `WKWebView` media-permission runtime behavior itself, not to `plugin.js`.
- The current breadcrumb shape also suggests a stall/freeze around the real media-permission path rather than a simple immediate reject.
