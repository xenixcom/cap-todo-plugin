# iOS WKWebView Message Host Lab

This lab asks whether WebView JavaScript can proactively push a result into the
native host.

It proves:

- iOS app host launches
- `WKWebView` loads inline HTML/JS
- JS posts a message through `WKScriptMessageHandler`
- the native host receives the pushed result
- the host writes a probe file

Expected result file path inside the simulator container:

- `Documents/wkwebview-message-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"3"}`
- fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
