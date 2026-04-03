# Lab 54

This lab compares a narrower Android permission grant shape against the earlier blanket install grant.

## Why this lab exists

`lab45` already proved that Android permission-sensitive bridge labs can go green with:

- `adb install -g`

That solved the practical blocking problem, but it did not settle the adapter strategy question:

- should the normalized Android grant shape be a blanket install-time grant
- or can a narrower permission-specific grant work just as well

## Shape

This lab reuses the `lab44` true native Capacitor bridge host unchanged.

The page still runs:

- `checkPermissions()`
- `requestPermissions({ permissions: ['microphone'] })`
- `checkPermissions()`
- `start()`

The only change is the grant method:

- install normally
- run:
  - `adb shell pm grant io.xenix.demo android.permission.RECORD_AUDIO`
- launch normally

## Result

Observed result:

- `{"status":"ok","detail":"native=true; header=true; before=granted; request=granted; after=granted; start=ok"}`

## Conclusion

Android does not need to rely on blanket `adb install -g` in order to make the bridge-host permission flow go green.

A narrower permission-specific adapter step is already sufficient:

- `adb shell pm grant io.xenix.demo android.permission.RECORD_AUDIO`

That makes the adapter strategy clearer:

- `adb install -g` remains a valid coarse-grained convenience shape
- but the more normalized adapter strategy should prefer:
  - permission-specific `pm grant`
  - paired with permission-specific deny/reset commands when needed
