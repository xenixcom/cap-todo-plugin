# Lab 33

This lab explores HTTP fallback semantics.

The question is:

- if the primary HTTP origin is unreachable
- can the host-backed route validate a client contract that falls back to a secondary origin

The intended split is:

- normal:
  - try primary origin
  - on network failure, retry against fallback origin
- fault:
  - keep using the unreachable primary origin

## Result

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"fallback_after_network_error: expected value 3 but received error Load failed"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"fallback_after_network_error: expected value 3 but received error Failed to fetch"}`

## Conclusion

- both hosts can validate fallback-after-network-failure behavior
- the normal path proves the client can recover from an unreachable primary origin by switching to a fallback origin
- the fault path proves the route can still detect missing fallback logic
- the platform error strings differ:
  - iOS surfaces `Load failed`
  - Android surfaces `Failed to fetch`
- this extends HTTP coverage beyond retry into origin fallback behavior
