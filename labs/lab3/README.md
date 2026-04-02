# Lab 3

This lab explores the next layer after `lab2`.

`lab2` proved:

- JS can proactively push a result back into the native host
- both platforms can detect a broken synchronous implementation

`lab3` asks a different question:

- can the host still observe the correct result when JS resolves it asynchronously
- without relying on UI automation or private native unit coverage

This is closer to:

- promise-returning app-facing calls
- delayed callbacks
- async plugin-like behavior

## Result

Both host-backed async probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"3"}`
- iOS fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
- Android normal:
  - `{"status":"ok","detail":"3"}`
- Android fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`

Current conclusion:

- the host-backed path is not limited to synchronous JS
- both platforms can observe an asynchronously resolved app-facing result
- both platforms still catch a deliberately broken async implementation
