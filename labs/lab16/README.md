# Lab 16

This lab explores the long-term manifest shape.

The question is:

- can one small manifest family express mixed plugin-facing scenarios
- without collapsing back into free-form test code or a giant DSL

This lab intentionally mixes only three case kinds:

- value-return calls
- expected-error calls
- listener sequences

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"echo_roundtrip: expected hello-manifest got hello-manifest-fault; reset_emits_init_idle: expected init -> idle got init -> stopped"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"echo_roundtrip: expected hello-manifest got hello-manifest-fault; reset_emits_init_idle: expected init -> idle got init -> stopped"}`

## Conclusion

- a small manifest family can already cover mixed plugin-facing scenarios
- the current useful minimum is not one giant generic schema
- three narrow case kinds were enough here:
  - `callValue`
  - `callError`
  - `listenerSequence`
- this supports a long-term direction where the formal manifest stays compact and adds a few semantic case kinds only when they earn their keep
