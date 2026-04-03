# Lab 46

This lab compares repeatable permission-deny shapes on Android and iOS.

## Why this lab exists

`lab45` already proved a repeatable Android grant shape:

- `adb install -g`

The next question is the other half:

- can a repeatable host-side deny shape also drive the app-facing permission flow

## Shape

Android reuses the `lab44` true native Capacitor bridge host:

- install app normally
- `pm revoke io.xenix.demo android.permission.RECORD_AUDIO`
- `pm set-permission-flags io.xenix.demo android.permission.RECORD_AUDIO user-set user-fixed`
- launch normally

iOS reuses the `lab40` host:

- simulator install
- `simctl privacy revoke microphone io.xenix.demo`
- launch normally

## Result

Android observed result:

- `{"status":"ok","detail":"native=true; header=true; before=prompt; request=denied; after=denied; start=error:Microphone permission is required"}`

iOS observed result:

- `{"status":"fail","detail":"initial=prompt; request=granted; after=granted; open=ok"}`

## Conclusion

Android deny can already be driven in a repeatable, non-UI way:

- `pm revoke` plus `user-fixed`

That is enough to force the app-facing permission flow into:

- `request=denied`
- `after=denied`
- `start=error:Microphone permission is required`

iOS is different in the current host-backed shape:

- `simctl privacy revoke microphone` by itself is not enough to force a denied outcome
- the current host explicitly grants media capture in its `WKUIDelegate` callback
- so the later app-facing permission request still turns into `granted`

This means the practical iOS deny strategy is narrower:

- simulator privacy controls are useful
- but if the host adapter itself grants media capture, deny validation must also flip the host callback to `.deny`

So the split is now clear:

- Android deny can already be normalized as a pure system-permission adapter step
- iOS deny needs host-adapter participation when the permission path depends on `WKUIDelegate` media-capture decisions
