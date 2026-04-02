# Lab 15

This lab measures real plugin archetype coverage through the native bridge.

The question is:

- through the real plugin JS API on iOS and Android
- which of these formal archetypes are actually bridged today:
  - permission
  - availability
  - session

This is a coverage-diagnostics lab.

It does not assume the answer is already positive.

## Result

Both platforms returned the same aggregate result:

- iOS normal:
  - `{"status":"fail","detail":"permission_shape: ok; availability_shape: ok; open_session: error Microphone permission is required; close_session_invalid_token: error Unknown session token"}`
- Android normal:
  - `{"status":"fail","detail":"permission_shape: ok; availability_shape: ok; open_session: error Microphone permission is required; close_session_invalid_token: error Unknown session token"}`

This means:

- `checkPermissions()` is bridged and returns the expected permission shape
- `getAvailability()` is bridged and returns the expected availability shape
- `openSession()` is bridged, but the current runtime blocks it on microphone permission
- `closeSession()` is bridged, and invalid-token handling surfaces through the real plugin API

So the important result is not the aggregate `fail` label itself.
The important result is that all three archetype families are now confirmed to exist at the
real plugin-facing bridge layer.
