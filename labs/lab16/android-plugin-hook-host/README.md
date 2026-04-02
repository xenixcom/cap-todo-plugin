# Android Plugin Hook Host Lab

This lab is the Android counterpart to the iOS plugin-hook probe.

It proves:

- Android app host launches
- `WebView` loads bundled local HTML/JS assets
- the bundled page loads real `capacitor.js` and the repo's built `plugin.js`
- the page calls the exported `Todo` JS API
- the host receives the aggregate result through `addJavascriptInterface`
- the host writes a probe file

Expected result file inside app-private storage:

- `files/webview-plugin-hook-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"pass"}`
- fault:
  - `{"status":"fail","detail":"echo_roundtrip: expected hello-plugin got hello-plugin-fault; status_initial: expected idle got running; options_debug_true: expected true got false; options_enabled_preserved: expected true got false"}`
