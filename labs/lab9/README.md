# Lab 9

This lab explores storage-backed scenarios.

The question is:

- can a host-backed WebView probe validate app-facing storage behavior
- without dropping back to private native storage tests

The first scope is intentionally small:

- set
- get
- update
- delete

## Result

Both storage-backed probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"set: expected 3 got 3-fault; get: expected 3 got 3-fault; update: expected 4 got 4-fault; delete: expected null got 4-fault"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"set: expected 3 got 3-fault; get: expected 3 got 3-fault; update: expected 4 got 4-fault; delete: expected null got 4-fault"}`

Current conclusion:

- host-backed WebView tests can validate local storage contracts
- Android requires explicit `setDomStorageEnabled(true)` in the adapter
- storage-backed app-facing scenarios still fit the same one-test-unit direction
