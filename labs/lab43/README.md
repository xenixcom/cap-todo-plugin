# Lab 43

This lab pushes native/adapter fake-boundary pressure one step further.

The question is:

- can richer native timing and event complexity still stay inside adapter/host setup
- without forcing the formal test unit to grow a mock DSL

## Shape

This lab still does **not** use the plugin layer.

Instead, each host owns a richer native progression:

- initial denied/unavailable state
- timed permission update
- timed availability update
- timed session update
- native event log

The page still validates only a very small declarative test unit:

- final path assertions
- one sequence assertion

## Result

Android normal:

- `{"status":"ok","detail":"pass"}`

Android fault:

- `{"status":"fail","detail":"session_token: expected session-1 got session-bad; native_sequence: expected permission:granted|availability:enabled|session:opened got permission:granted|availability:enabled|session:stale"}`

iOS normal:

- `{"status":"ok","detail":"pass"}`

iOS fault:

- `{"status":"fail","detail":"session_token: expected session-1 got session-bad; native_sequence: expected permission:granted|availability:enabled|session:opened got permission:granted|availability:enabled|session:stale"}`

## Conclusion

This strengthens the adapter split again:

- even richer native timing and event complexity can stay below the formal test unit
- the manifest still does not need to absorb mock DSL
- iOS and Android both support the same split:
  - host owns the native progression
  - runner stays generic
  - cases stay thin and declarative
