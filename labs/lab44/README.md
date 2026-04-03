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

Observed result file:

- `{"status":"error","detail":"no probe result"}`

The important signal came from Android log output during the same run:

- `checkPermissions()` returned `{"microphone":"prompt"}`
- `requestPermissions(...)` crossed the native bridge
- then Android logged:
  - `Unable to find a Capacitor plugin to handle permission requestCode`
- a later `start()` still failed with:
  - `PERMISSION_DENIED`

## Conclusion

This means the Android permission seam survives the stronger host shape:

- it is not just a plugin-JS fallback artifact
- it is now much more specifically narrowed to the Android permission callback / requestCode handling path inside the native bridge route
