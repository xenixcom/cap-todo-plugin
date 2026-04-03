# Lab 45

This lab checks whether Android permission-transition validation can be made repeatable without manual UI tapping.

## Why this lab exists

`lab44` showed two different outcomes in the same true native Capacitor bridge host:

- an unattended run stalled with `no probe result`
- a run that explicitly completed the Android permission dialog turned fully green

That left one practical question:

- do Android permission-transition labs need manual UI interaction
- or is there a repeatable host-side grant shape that already works

## Shape

This lab reuses the `lab44` true native bridge host unchanged:

- Android `BridgeActivity`
- bundled `capacitor.js`
- `registerPlugin('Todo')`
- native plugin headers

The page still runs:

- `checkPermissions()`
- `requestPermissions({ permissions: ['microphone'] })`
- `checkPermissions()`
- `start()`

The only change is the install/grant shape:

- uninstall the app
- reinstall with `adb install -g`
- launch normally

## Result

Observed result file:

- `{"status":"ok","detail":"native=true; header=true; before=granted; request=granted; after=granted; start=ok"}`

Relevant runtime facts:

- package runtime permissions show `RECORD_AUDIO: granted=true`
- `checkPermissions()` returns `{"microphone":"granted"}`
- `requestPermissions(...)` returns `{"microphone":"granted"}`
- `start()` succeeds

## Conclusion

Android permission-transition validation does not need to depend on manual dialog tapping in every lab shape.

At least in the true native bridge host route, a repeatable pre-granted install shape already works:

- `adb install -g`

So the Android permission question is now narrower:

- not "is the true bridge path broken"
- not "must this always be driven by manual UI interaction"

Instead, it is:

- which grant shape is the right normalized adapter strategy for permission-sensitive labs
