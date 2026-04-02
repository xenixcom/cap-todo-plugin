# Android WebView Sequence Host Lab

This lab is the Android counterpart to the iOS sequence-host probe.

It proves:

- Android app host launches
- `WebView` loads bundled local HTML/JS assets
- JS pushes multiple ordered messages through `addJavascriptInterface`
- the native host receives the full sequence
- the host writes a probe file

Expected result file inside app-private storage:

- `files/webview-sequence-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"boot -> ready -> result:3 -> done"}`
- fault:
  - `{"status":"fail","detail":"expected boot -> ready -> result:3 -> done got boot -> ready -> result:-1 -> done"}`
