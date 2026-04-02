# Lab 23

This lab isolates the iOS `getUserMedia({ audio: true })` seam directly.

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
  - `{"status":"error","detail":"no pushed result after didFinish: {\"href\":\"file:///.../probe.html\",\"hasTest\":\"undefined\",\"hasMessageHandler\":true}"}`

## Conclusion

- Removing the plugin layer did not remove the problem.
- A direct `navigator.mediaDevices.getUserMedia({ audio: true })` probe still failed to push a final result.
- This moved the suspected seam below `plugin.js` and below `requestPermissions()`.
- The remaining problem was therefore narrowed to the `WKWebView` media-permission runtime path itself.
