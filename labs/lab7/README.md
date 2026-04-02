# Lab 7

This lab explores HTTP-backed scenarios.

The question is:

- can a host-backed WebView probe validate app-facing behavior that depends on HTTP
- using a deterministic local stub instead of a flaky external service

The intended shape is:

- bundled probe assets
- local stub HTTP server
- JS fetch-based scenario runner
- host adapters only collect final pass/fail detail

## Result

Both HTTP-backed probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"sum_basic: expected 3 got 2; sum_negative: expected 3 got 2"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"sum_basic: expected 3 got 2; sum_negative: expected 3 got 2"}`

Current conclusion:

- host-backed WebView tests can validate HTTP-backed app-facing contracts
- a deterministic local stub server is enough for this class of lab
- Android needs emulator-host routing (`10.0.2.2`) while iOS simulator can use `127.0.0.1`
