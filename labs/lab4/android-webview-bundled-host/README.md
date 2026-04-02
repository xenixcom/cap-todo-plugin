# Android WebView Bundled Host Lab

This lab is the Android counterpart to the iOS bundled-host probe.

It proves:

- Android app host launches
- `WebView` loads bundled local HTML/JS assets
- JS resolves an async value and pushes the result through `addJavascriptInterface`
- the native host receives the pushed result
- the host writes a probe file

Expected result file inside app-private storage:

- `files/webview-bundled-probe.json`

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

Observed payloads:

- normal:
  - `{"status":"ok","detail":"3"}`
- fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
