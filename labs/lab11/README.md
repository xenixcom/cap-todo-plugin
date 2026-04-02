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

Android mock-pressure probe works. iOS now also works after fixing a wiring issue in the lab setup.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
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
- iOS now proves the same direction after the lab wiring was corrected
- the earlier iOS `Load failed` result was not a method boundary
- it was a lab-specific wiring issue
- this lab is still valuable because it exposed a real pressure point instead of silently growing the test-unit language
