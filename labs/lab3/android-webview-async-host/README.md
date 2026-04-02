# Android WebView Async Host Lab

This lab is the Android counterpart to the iOS async-host probe.

It proves:

- Android app host launches
- `WebView` loads inline HTML/JS
- JS resolves an async value and pushes the result through `addJavascriptInterface`
- the native host receives the pushed result
- the host writes a probe file

Expected result file inside app-private storage:

- `files/webview-async-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"3"}`
- fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"3"}`
- fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
