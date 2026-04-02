# Lab 11

This lab explores test-unit mock pressure.

The question is:

- can the formal scenario shape stay small
- while more complex fake behavior lives outside the test unit

The intended split is:

- test unit:
  - case id
  - request path
  - expected value or expected error
- harness:
  - deterministic local HTTP stub
  - malformed payload branch
  - non-200 branch
  - timeout branch
  - fault injection branch

## Result

Android mock-pressure probe works. iOS exposes a real host-side boundary that is not yet resolved.

Observed payloads:

- iOS normal:
  - `{"status":"fail","detail":"sum_basic: expected value 3 but received error Load failed; malformed_payload: expected error including malformed payload got Load failed; http_503: expected error including http 503 got Load failed; timeout_case: expected error including timeout got Load failed"}`
- iOS fault:
  - `{"status":"fail","detail":"sum_basic: expected value 3 got 2; malformed_payload: expected error including malformed payload got expected value but received unexpected; http_503: expected error including http 503 got expected value but received unexpected; timeout_case: expected error including timeout got expected value but received unexpected-timeout"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"sum_basic: expected value 3 got 2; malformed_payload: expected error including malformed payload got expected value but received unexpected; http_503: expected error including http 503 got expected value but received unexpected; timeout_case: expected error including timeout got expected value but received unexpected-timeout"}`

Current conclusion:

- test units still do not need to describe complex fake behavior directly
- richer fake behavior can stay in the harness and stub layer
- Android proves this direction concretely
- iOS reveals an unresolved host-side constraint around local HTTP-backed fake handling from the WebView probe
- this lab is still valuable because it exposed a real pressure point instead of silently growing the test-unit language
