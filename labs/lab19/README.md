# Lab 19

This lab explores deeper storage-backed scenarios.

The question is:

- does host-backed storage survive an actual app relaunch
- and can the same route detect corrupt persisted data

This lab uses three modes:

- `seed`
- `verify`
- `corrupt`

## Result

Observed payloads:

- iOS:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify`:
    - `{"status":"ok","detail":"pass"}`
  - `corrupt`:
    - `{"status":"ok","detail":"pass"}`
- Android:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify`:
    - `{"status":"fail","detail":"verify: expected ok got missing"}`
  - `corrupt`:
    - `{"status":"ok","detail":"pass"}`

## Conclusion

- the host-backed route can validate storage corruption handling on both platforms
- actual relaunch persistence is now platform-sensitive
- iOS preserved the stored JSON across relaunch in this lab shape
- Android did not; the same relaunch verify step came back `missing`
- this exposes a new storage seam:
  - WebView local storage persistence across relaunch is not currently symmetric between iOS and Android in this host-lab setup
