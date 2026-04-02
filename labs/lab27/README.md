# Lab 27

This lab re-checks the `localStorage` relaunch seam without reinstalling the app between `seed` and `verify`.

The question is:

- if the app is only force-stopped and relaunched
- does the original `lab19` localStorage value still survive on each host

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

- the original Android failure from `lab19` is not a pure relaunch problem
- when the app is only force-stopped and relaunched, `localStorage` survives on both hosts
- this strongly suggests the earlier Android miss was caused by the broader execution shape around reinstall/redeploy
- the storage seam now narrows again:
  - Android `localStorage` is viable across relaunch
  - the earlier failure belongs to a heavier app lifecycle shape, not to relaunch alone
