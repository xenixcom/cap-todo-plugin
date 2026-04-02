# Lab 5

This lab explores the next layer after `lab4`.

`lab1` to `lab4` proved:

- host-backed WebView JS testing works on both iOS and Android
- sync pull, sync push, async push, and bundled assets all work

`lab5` asks a different question:

- can the host validate multiple pushed messages in order
- instead of only a single final result

This is closer to:

- event streams
- ordered lifecycle notifications
- listener-driven plugin behavior

## Result

Both sequence-host probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"boot -> ready -> result:3 -> done"}`
- iOS fault:
  - `{"status":"fail","detail":"expected boot -> ready -> result:3 -> done got boot -> ready -> result:-1 -> done"}`
- Android normal:
  - `{"status":"ok","detail":"boot -> ready -> result:3 -> done"}`
- Android fault:
  - `{"status":"fail","detail":"expected boot -> ready -> result:3 -> done got boot -> ready -> result:-1 -> done"}`

Current conclusion:

- host-backed WebView testing can validate ordered multi-message behavior
- the method is no longer limited to a single terminal result
- this is a meaningful step toward event/stream-like contract verification
