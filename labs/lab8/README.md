# Lab 8

This lab explores WebSocket-backed scenarios.

The question is:

- can a host-backed WebView probe validate long-lived remote communication
- without turning into a UI-driven test stack

The intended shape is:

- local WebSocket stub
- bundled probe assets
- request/response over a persistent connection
- host adapters collect only the final aggregate result

## Result

Both WebSocket-backed probes now work on both platforms.

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

- host-backed WebView tests can validate WebSocket request/response contracts
- a local long-lived socket does not force a UI-driven test stack
- this is a concrete precursor to future event/stream and reconnect labs
