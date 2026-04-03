# Lab 34

This lab explores WebSocket protocol-failure semantics.

The question is:

- if the server sends a malformed frame instead of a valid JSON payload
- can the host-backed route validate that the client surfaces a protocol error instead of silently accepting it

The intended split is:

- normal:
  - valid case still succeeds
  - malformed frame is surfaced as a protocol parse error
- fault:
  - malformed frame is treated as if it were acceptable

## Result

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"sum_basic: expected 3 got 2; malformed_frame: expected error including protocol parse error got value unexpected"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"sum_basic: expected 3 got 2; malformed_frame: expected error including protocol parse error got value unexpected"}`

## Conclusion

- both hosts can validate protocol-failure handling for malformed WebSocket frames
- the normal path proves the client can still:
  - accept valid frames
  - surface malformed frames as a protocol parse error
- the fault path proves the route can detect a client that silently accepts malformed frames
- this pushes WebSocket coverage beyond reconnect and idle-timeout into protocol-failure semantics
