# Android WebView Host Lab

This lab is the Android counterpart to the iOS `WKWebView` host probe.

It should prove only one thing:

- an Android app host can launch
- create a `WebView`
- run:
  - `window.__test__.add(1, 2)`
- write the result to app-private storage

This lab is intentionally separate from:

- `demo/`
- `tests/contract`
- `tools/captool`
- plugin contract work

Expected result file inside app-private storage:

- `files/webview-host-probe.json`

## Current Status

Verified.

Observed result file payload:

```json
{"status":"ok","detail":"3"}
```

This means the current lab already proves:

- Android app host -> `WebView`
- `WebView` -> inline JS
- JS result -> host file output
