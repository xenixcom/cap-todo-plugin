# iOS WKWebView Bundled Host Lab

This lab asks whether `WKWebView` can load a bundled local probe page and still
push a correct result into the native host.

It proves:

- iOS app host launches
- `WKWebView` loads bundled local HTML/JS assets
- JS resolves an async value and posts a message through `WKScriptMessageHandler`
- the native host receives the pushed result
- the host writes a probe file

Expected result file path inside the simulator container:

- `Documents/wkwebview-bundled-probe.json`

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
