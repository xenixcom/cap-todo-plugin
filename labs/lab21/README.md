# Lab 21

This lab explores the plugin-facing `requestPermissions()` seam.

The question is:

- does real `requestPermissions({ permissions: ['microphone'] })` change anything visible at the app-facing layer
- does a later `checkPermissions()` reflect that change
- does `openSession()` align with the observed permission state
- and does the unsupported-permission error path really pass through the bridge

## Result

- Android normal:
  - `{"status":"fail","detail":"initial=prompt; request=prompt; after=prompt; open=error:Microphone permission is required"}`
- Android fault:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"ok","detail":"pass"}`
- iOS normal:
  - `{"status":"error","detail":"no pushed result after didFinish: {\"href\":\"file:///.../probe.html\",\"hasTest\":\"undefined\",\"hasMessageHandler\":true}"}`

## Conclusion

- The unsupported-permission branch is real on both hosts:
  - `requestPermissions({ permissions: ['camera'] })` crossed the bridge and surfaced the expected error.
- Android also produced a concrete normal-path result:
  - `checkPermissions()` stayed `prompt`
  - `requestPermissions({ permissions: ['microphone'] })` still yielded `prompt`
  - `openSession()` remained blocked on microphone permission
- iOS did not mirror that normal-path result.
- On iOS, the real microphone-request path failed to push a final result even though the page loaded and the native message handler existed.
- This turned the next question into a much smaller seam:
  - the remaining issue was on the real microphone-request path itself, not on bridge existence or on the unsupported-permission branch.
