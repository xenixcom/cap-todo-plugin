# iOS WKWebView Manifest Host Lab

This lab asks whether `WKWebView` can load a bundled scenario manifest and a
generic runner, instead of hard-coding a single case in the page script.

It proves:

- iOS app host launches
- `WKWebView` loads bundled local HTML/JS assets
- JS reads bundled case data and posts an aggregate result through `WKScriptMessageHandler`
- the native host receives the pushed result
- the host writes a probe file

Expected result file path inside the simulator container:

- `Documents/wkwebview-manifest-probe.json`

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
