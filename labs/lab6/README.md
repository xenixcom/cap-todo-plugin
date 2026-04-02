# Lab 6

This lab explores the next layer after `lab5`.

`lab1` to `lab5` proved:

- host-backed WebView JS testing works on both iOS and Android
- single result, pushed result, async result, bundled assets, and ordered messages all work

`lab6` asks a different question:

- can a bundled web probe read a scenario manifest and evaluate multiple cases from data
- instead of hard-coding a single case into the page script

This is closer to:

- formal test cases as data
- reusable contract scenario manifests
- a future host-backed formal test runner

## Result

Both manifest-host probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"add_basic: expected 3 got -1; add_negative: expected 3 got -5"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"add_basic: expected 3 got -1; add_negative: expected 3 got -5"}`

Current conclusion:

- the web probe can read bundled case data and run a generic runner
- host adapters do not need to hard-code individual cases
- this is a strong precursor to a future host-backed formal contract runner
