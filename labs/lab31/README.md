# Lab 31

This lab explores WebSocket idle-timeout semantics.

The question is:

- if the socket stays open after a successful request
- but the server later closes it because of idleness
- can the host-backed route still validate a client contract that must reconnect after idle expiry

The intended split is:

- normal:
  - reconnect after idle timeout
- fault:
  - reuse the stale socket after idle timeout

## Result

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"sum_negative: reconnect missing (socket not open (3))"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"sum_negative: reconnect missing (socket not open (3))"}`

## Conclusion

- Both hosts can validate reconnect-after-idle-timeout behavior.
- The normal path proves the client can recover after the server closes an idle socket.
- The fault path proves the route can still detect reuse of a stale socket instead of reconnecting.
- This extends WebSocket coverage from reconnect-after-response-close (`lab20`) to reconnect-after-idle-expiry.
