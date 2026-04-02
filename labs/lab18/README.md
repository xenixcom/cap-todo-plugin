# Lab 18

This lab explores real permission-state transitions under external OS control.

The question is:

- if the host OS permission is granted or revoked outside the app
- does the real plugin-facing contract reflect that state change
- and does `openSession()` gate on it correctly

This lab intentionally stays narrow:

- `checkPermissions()`
- `openSession()`
- external OS permission toggling

It does not test the full system permission prompt UI yet.

## Result

Observed payloads:

- iOS after external grant:
  - `{"status":"fail","detail":"permission_granted: fail expected granted got prompt; open_session_after_grant: error Microphone permission is required"}`
- iOS after external revoke:
  - `{"status":"fail","detail":"permission_granted: fail expected denied got prompt; open_session_after_grant: ok"}`
- Android after external grant:
  - `{"status":"fail","detail":"permission_granted: fail expected granted got prompt; open_session_after_grant: error Microphone permission is required"}`
- Android after external revoke:
  - `{"status":"fail","detail":"permission_granted: fail expected denied got prompt; open_session_after_grant: ok"}`

## Conclusion

- external OS permission toggles do not currently map cleanly into the host-backed contract in this lab shape
- both platforms stayed at `prompt` under both external `grant` and `revoke`
- both platforms also showed the same surprising split:
  - after external grant, `openSession()` still failed on microphone permission
  - after external revoke, `openSession()` unexpectedly succeeded
- this means real permission-state transition testing is not solved by simple external `grant/revoke`
- the remaining question is now sharper:
  - which extra seam is missing between external OS permission control and the plugin-facing contract
