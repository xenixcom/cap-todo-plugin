# Android WebView Manifest Host Lab

This lab is the Android counterpart to the iOS manifest-host probe.

It proves:

- Android app host launches
- `WebView` loads bundled local HTML/JS assets
- JS reads bundled case data and pushes an aggregate result through `addJavascriptInterface`
- the native host receives the pushed result
- the host writes a probe file

Expected result file inside app-private storage:

- `files/webview-manifest-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"pass"}`
- fault:
  - `{"status":"fail","detail":"add_basic: expected 3 got -1; add_negative: expected 3 got -5"}`

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
