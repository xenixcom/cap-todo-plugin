# iOS WKWebView Sequence Host Lab

This lab asks whether `WKWebView` can push multiple ordered messages and let the
native host validate the full sequence.

It proves:

- iOS app host launches
- `WKWebView` loads bundled local HTML/JS assets
- JS pushes multiple ordered messages through `WKScriptMessageHandler`
- the native host receives the full sequence
- the host writes a probe file

Expected result file path inside the simulator container:

- `Documents/wkwebview-sequence-probe.json`

Observed payloads:

- normal:
  - `{"status":"ok","detail":"boot -> ready -> result:3 -> done"}`
- fault:
  - `{"status":"fail","detail":"expected boot -> ready -> result:3 -> done got boot -> ready -> result:-1 -> done"}`
