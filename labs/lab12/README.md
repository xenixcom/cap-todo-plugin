# Lab 12

This lab isolates the local HTTP seam behind host-backed WebViews.

The question is:

- from a bundled file-loaded page inside a host-backed WebView
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

iOS returned:

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

Android returned:

```json
[
  { "id": "emulator_host", "error": "Failed to fetch" },
  { "id": "localhost_name", "error": "Failed to fetch" },
  { "id": "host_lan_ip", "error": "Failed to fetch" }
]
```

## Conclusion

- `WKWebView` can reach a local HTTP stub from a bundled file-loaded page.
- `127.0.0.1`, `localhost`, and the Mac host LAN IP all worked in this minimal seam probe.
- Android did not mirror that result in the same seam-only shape:
  - `10.0.2.2`
  - `localhost`
  - host LAN IP
  all failed with `Failed to fetch`
- This does not overturn the broader Android HTTP-backed result from `lab7` or `lab11`.
- It means this seam probe is platform-sensitive:
  - iOS local seam: proven
  - Android local seam: still missing a condition in this stripped-down shape
- The `lab11` iOS failure was not a blanket "local HTTP from WKWebView is impossible" result.
