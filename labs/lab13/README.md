# Lab 13

This lab explores the next layer after `lab5`.

`lab1` to `lab5` proved:

- host-backed WebView JS testing works on both iOS and Android
- sync pull, sync push, async push, bundled assets, and simple ordered sequences all work

`lab13` asks a different question:

- can the host validate stream closure semantics
- not just ordered messages, but also "no stray message after close"

This is closer to:

- event streams with lifecycle boundaries
- unsubscribe / close correctness
- stream contracts where late extra events are a regression

## Intended result

- normal:
  - `boot -> open -> data:1 -> data:2 -> data:3 -> closed`
- fault:
  - same sequence, but followed by an illegal late `data:999`

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"boot -> open -> data:1 -> data:2 -> data:3 -> closed"}`
- iOS fault:
  - `{"status":"fail","detail":"expected boot -> open -> data:1 -> data:2 -> data:3 -> closed got boot -> open -> data:1 -> data:2 -> data:3 -> closed -> data:999"}`
- Android normal:
  - `{"status":"ok","detail":"boot -> open -> data:1 -> data:2 -> data:3 -> closed"}`
- Android fault:
  - `{"status":"fail","detail":"expected boot -> open -> data:1 -> data:2 -> data:3 -> closed got boot -> open -> data:1 -> data:2 -> data:3 -> closed -> data:999"}`

## Conclusion

- host-backed WebView testing can validate stream closure, not just ordered delivery
- both hosts can catch a late extra event after `closed`
- this is a more realistic stream boundary than the simpler `lab5` sequence check

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
