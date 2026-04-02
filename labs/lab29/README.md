# Lab 29

This lab explores HTTP retry semantics.

The question is:

- can the host-backed route validate app-facing HTTP behavior that retries transient failures
- without turning the test unit into a retry/mocking DSL

The intended split is:

- test unit:
  - case id
  - request path
  - expected value after retry
- harness:
  - deterministic transient `503`
  - deterministic transient timeout
  - per-case call counters
  - fault variant with retry removed

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"retry_503_then_ok: expected value 3 but received error http 503; retry_timeout_then_ok: expected value 3 but received error timeout"}`
- Android normal:
  - `{"status":"fail","detail":"retry_timeout_then_ok: expected value 3 but received error timeout"}`
- Android fault:
  - `{"status":"fail","detail":"retry_503_then_ok: expected value 3 but received error http 503; retry_timeout_then_ok: expected value 3 but received error timeout"}`

## Conclusion

- both hosts can validate retry-after-`503`
- both hosts also detect the no-retry fault variant
- timeout retry is not symmetric:
  - iOS passes this lab shape
  - Android still times out on the retry-timeout case
- this surfaces a sharper HTTP seam:
  - retry semantics are not one thing
  - retry-after-response and retry-after-timeout can diverge by platform and execution shape
