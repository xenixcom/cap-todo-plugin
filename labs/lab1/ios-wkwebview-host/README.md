# iOS WKWebView Host Lab

This lab is an app-hosted probe.

It does not use:

- plugin methods
- formal contract suites
- XCTest host bundles

It only proves:

- an iOS app host can launch
- a `WKWebView` can load a tiny HTML string
- the host can call:
  - `window.__test__.add(1, 2)`
- the JS result can be written back to the app container

The result file path inside the simulator container is:

- `Documents/wkwebview-host-probe.json`

## Current Status

Verified.

Observed result file payload:

```json
{"status":"ok","detail":"3"}
```

This means the current lab already proves:

- iOS app host -> `WKWebView`
- `WKWebView` -> inline JS
- JS result -> host file output

It also supports a simple fault-injection mode:

- default launch:
  - `{"status":"ok","detail":"3"}`
- launch with `fault` argument:
  - `{"status":"fail","detail":"expected 3 got -1"}`
