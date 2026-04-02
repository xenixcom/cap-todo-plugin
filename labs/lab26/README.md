# Lab 26

This lab compares storage backends across relaunch.

The question is:

- when the same value is written into both `localStorage` and `IndexedDB`
- which backend survives an actual app relaunch on each host

This lab uses two modes:

- `seed`
- `verify`

## Result

Observed payloads:

- iOS:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify`:
    - `{"status":"ok","detail":"pass"}`
- Android:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify`:
    - `{"status":"ok","detail":"pass"}`

## Conclusion

- the relaunch problem from `lab19` is not a blanket WebView persistence failure
- both hosts preserved the `IndexedDB` value across relaunch
- both hosts also completed the combined backend verify successfully
- this narrows the earlier Android storage seam:
  - the problematic part is more likely specific to `localStorage`
  - it is not a general "all browser persistence disappears on Android relaunch" failure
