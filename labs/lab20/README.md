# Lab 20

This lab explores WebSocket reconnect semantics.

The question is:

- if the server closes the socket after the first successful response
- can the host-backed WebView route still validate a client contract that requires reconnect

This lab uses a reconnecting stub:

- first request succeeds
- server then closes the socket
- second request requires a reconnect

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

- Both hosts can validate reconnect-required WebSocket behavior.
- The normal path proves the client can reconnect after the server closes the first socket.
- The fault path proves the route can detect reuse of a closed socket instead of reconnecting.
- This moves WebSocket coverage beyond simple request/response and into connection lifecycle semantics.
