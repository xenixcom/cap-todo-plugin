# Lab 42

This lab rechecks the remaining Android permission transition seam after `lab40`.

The question is:

- if the Android host runtime permission is already granted,
- does the plugin-facing layer finally leave `prompt`
- and does `openSession()` start succeeding

## Shape

This lab reuses the `lab40` Android host and adds one narrow adapter diagnostic:

- `AndroidProbe.hostPermissionState()`

Two Android runs are then compared:

- denied
- externally granted through `pm grant android.permission.RECORD_AUDIO`

The page still exercises the same plugin-facing route:

- `checkPermissions()`
- `requestPermissions({ permissions: ['microphone'] })`
- `checkPermissions()`
- `openSession()`

## Result

Denied:

- `{"status":"fail","detail":"host-before=denied; initial=prompt; request=prompt; after=prompt; host-after=denied; open=error:Microphone permission is required"}`

Externally granted:

- `{"status":"fail","detail":"host-before=granted; initial=prompt; request=prompt; after=prompt; host-after=granted; open=error:Microphone permission is required"}`

## Conclusion

This sharply narrows the remaining Android permission seam:

- the host runtime permission can already be `granted`
- but the plugin-facing permission layer still stays at `prompt`
- and `openSession()` still fails on microphone permission

So the remaining problem is no longer:

- "the host never got runtime permission"

It is now:

- the Android plugin-facing permission/session layer still does not mirror that granted host state in this lab shape
