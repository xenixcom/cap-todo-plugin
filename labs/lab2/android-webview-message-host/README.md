# Android WebView Message Host Lab

This lab is the Android counterpart to the iOS message-host probe.

It proves:

- Android app host launches
- `WebView` loads inline HTML/JS
- JS pushes a result through `addJavascriptInterface`
- the native host receives the pushed result
- the host writes a probe file

Expected result file inside app-private storage:

- `files/webview-message-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"3"}`
- fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
