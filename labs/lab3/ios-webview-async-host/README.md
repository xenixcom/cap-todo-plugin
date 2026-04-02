# iOS WKWebView Async Host Lab

This lab asks whether WebView JavaScript can asynchronously resolve a result and
still push it into the native host.

It proves:

- iOS app host launches
- `WKWebView` loads inline HTML/JS
- JS resolves an async value and posts a message through `WKScriptMessageHandler`
- the native host receives the pushed result
- the host writes a probe file

Expected result file path inside the simulator container:

- `Documents/wkwebview-async-probe.json`

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
