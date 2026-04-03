# Lab 44

This lab rechecks the Android permission transition seam inside a true native Capacitor bridge host.

## Why this lab exists

`lab42` already showed:

- the Android host runtime permission can be externally granted
- but the plugin-facing layer still stays at `prompt`

There was still one remaining doubt:

- maybe that seam only existed in the earlier plugin-JS-fallback route

This lab removes that doubt by moving the same question into the stronger `lab41` bridge-host shape.

## Shape

The host is a true Capacitor bridge host:

- Android `BridgeActivity`
- bundled `capacitor.js`
- `registerPlugin('Todo')`
- native plugin headers

The page then runs:

- `checkPermissions()`
- `requestPermissions({ permissions: ['microphone'] })`
- `checkPermissions()`
- `start()`

## Result

The first unattended run produced:

- `{"status":"error","detail":"no probe result"}`

That looked like a native bridge seam at first, because log output during that run showed:

- `checkPermissions()` returned `{"microphone":"prompt"}`
- `requestPermissions(...)` crossed the native bridge
- Android logged:
  - `Unable to find a Capacitor plugin to handle permission requestCode`

But a second run explicitly completed the Android system permission dialog.

Observed result file after tapping `Allow while using the app`:

- `{"status":"ok","detail":"native=true; header=true; before=granted; request=granted; after=granted; start=ok"}`

## Conclusion

This lab still proves that the question survives the stronger host shape:

- it is not just a plugin-JS fallback artifact
- the same transition question appears inside a true native Capacitor bridge host

But the final conclusion is stronger and more positive:

- the true native bridge host path itself can go green
- once the Android system permission dialog is actually completed, the app-facing flow becomes:
  - `before=granted`
  - `request=granted`
  - `after=granted`
  - `start=ok`

So the remaining seam is no longer best described as a permanently broken bridge callback path.

It is better described as:

- host-backed Android permission-transition validation must explicitly complete the system permission UI
- otherwise the probe can stall and look like a bridge failure
