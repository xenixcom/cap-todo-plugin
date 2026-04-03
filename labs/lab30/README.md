# Lab 30

This lab isolates timeout-retry behavior with explicit abort.

The question is:

- does Android still fail the retry-timeout case if the first timed-out fetch is explicitly aborted
- or was `lab29` failing because the timed-out request stayed alive and interfered with the retry

The intended split is:

- normal:
  - timeout uses `AbortController`
  - retry runs after a real abort
- fault:
  - keeps the non-aborting timeout shape

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"retry_503_then_ok: expected value 3 but received error http 503; retry_timeout_then_ok: expected value 3 but received error timeout"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"retry_503_then_ok: expected value 3 but received error http 503; retry_timeout_then_ok: expected value 3 but received error timeout"}`

## Conclusion

- explicit abort changes the timeout-retry outcome
- with `AbortController`, Android no longer stalls on the retry-timeout case
- both hosts pass the normal retry suite in this shape
- both hosts still fail the non-aborting fault variant
- this narrows the `lab29` seam:
  - the earlier Android timeout-retry failure was not "retry impossible on Android"
  - it was specifically tied to leaving the timed-out request alive instead of aborting it
