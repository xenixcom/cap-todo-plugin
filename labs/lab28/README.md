# Lab 28

This lab probes storage behavior across reinstall/redeploy.

The question is:

- if the app writes storage successfully
- then gets uninstalled and reinstalled
- does the same `verify` step still see previously written data

This lab uses two modes:

- `seed`
- `verify`

## Result

Observed payloads:

- iOS:
  - `verify` after reinstall:
    - `{"status":"ok","detail":"pass"}`
- Android:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify` after reinstall:
    - `{"status":"fail","detail":"verify: expected ok got missing"}`

## Conclusion

- the heavier reinstall/redeploy shape really does matter
- Android reproduces the original `lab19` miss when `seed` and `verify` are separated by uninstall/reinstall
- iOS does not mirror that outcome in this lab shape; its `verify` still passes after reinstall
- this sharpens the storage seam again:
  - pure relaunch is not the issue
  - browser persistence as a whole is not the issue
  - the remaining difference is now specifically tied to Android under reinstall/redeploy
