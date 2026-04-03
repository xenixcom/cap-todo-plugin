# Lab 32

This lab isolates the deploy-shape detail behind the storage seam.

The question is:

- if storage is written successfully
- then the app is redeployed over the existing install
- does `verify` still see the data
- and how does that differ from a true uninstall/reinstall

This lab uses the same storage host as `lab28`, but separates two deployment shapes:

- update install:
  - install over the existing app
- true reinstall:
  - uninstall first
  - then install again

## Result

- iOS:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify` after update install:
    - `{"status":"ok","detail":"pass"}`
  - `verify` after true reinstall:
    - `{"status":"fail","detail":"verify: expected ok got missing"}`
- Android:
  - `seed`:
    - `{"status":"ok","detail":"pass"}`
  - `verify` after update install:
    - `{"status":"ok","detail":"pass"}`
  - `verify` after true reinstall:
    - `{"status":"fail","detail":"verify: expected ok got missing"}`

## Conclusion

- the remaining storage seam from `lab28` was not "Android keeps losing storage while iOS keeps it"
- the real split was deployment-shape symmetry
- both hosts preserve storage across update install
- both hosts lose storage across a true uninstall/reinstall
- this means the storage mainline is now much cleaner:
  - relaunch is fine
  - update redeploy is fine
  - true reinstall wipes app-local storage on both hosts
