# Lab 12

This lab isolates the iOS local HTTP seam behind `WKWebView`.

The question is:

- from a bundled file-loaded page inside `WKWebView`
- which local host route, if any, can reach a deterministic HTTP stub

The probe keeps everything else out of the way:

- one `/ping` endpoint
- one static JSON payload
- three host candidates
  - `127.0.0.1`
  - `localhost`
  - the Mac host LAN IP

This is not a contract lab.

It is a seam-diagnostics lab.

## Result

iOS returned the following probe detail:

```json
[
  {
    "id": "loopback_ip",
    "status": 200,
    "ok": true,
    "payload": { "ok": true, "from": "lab12" }
  },
  {
    "id": "localhost_name",
    "status": 200,
    "ok": true,
    "payload": { "ok": true, "from": "lab12" }
  },
  {
    "id": "host_lan_ip",
    "status": 200,
    "ok": true,
    "payload": { "ok": true, "from": "lab12" }
  }
]
```

## Conclusion

- `WKWebView` can reach a local HTTP stub from a bundled file-loaded page.
- `127.0.0.1`, `localhost`, and the Mac host LAN IP all worked in this minimal seam probe.
- The `lab11` iOS failure is not a blanket "local HTTP from WKWebView is impossible" result.
- The remaining problem is narrower and sits in the richer mock/harness shape used by `lab11`.
