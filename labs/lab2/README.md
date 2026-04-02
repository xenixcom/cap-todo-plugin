# Lab 2

This lab explores the next layer after `lab1`.

`lab1` proved:

- host -> WebView -> JS
- JS return value -> host

`lab2` asks a different question:

- can JS proactively push a result back into the host
- without relying on the host to pull the value via `evaluateJavaScript(...)`

This is closer to:

- callbacks
- events
- stream-like notifications

## Result

Both host-backed message probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"3"}`
- iOS fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
- Android normal:
  - `{"status":"ok","detail":"3"}`
- Android fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`

Current conclusion:

- host pull is not the only viable path
- JS can proactively push an app-facing result into the native host
- both iOS and Android can catch a deliberately broken JS implementation on this path
