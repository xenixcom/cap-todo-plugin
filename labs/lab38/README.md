# Lab 38

This lab explores deeper plugin-facing bridge-backed flow behavior.

The question is:

- can a host-backed WebView probe validate multi-step plugin-facing flows
- where success and error calls interleave
- and where later state/options must remain coherent after earlier failures

This lab extends the manifest with one additional semantic case kind:

- `flowSequence`

The flow stays intentionally narrow:

- disable the plugin
- observe options
- provoke `start()` failure
- confirm that state and options remain coherent
- reset and confirm defaults are restored

It also keeps one existing listener case:

- `reset()` still emits `init -> idle`

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"disabled_start_preserves_state_and_options: expected false got true; failed_start_then_reset_restores_idle_defaults: expected idle got running; reset_emits_init_idle: expected init -> idle got init -> stopped"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"disabled_start_preserves_state_and_options: expected false got true; failed_start_then_reset_restores_idle_defaults: expected idle got running; reset_emits_init_idle: expected init -> idle got init -> stopped"}`

## Conclusion

- real plugin-facing flows can be validated across multiple interleaved steps
- both hosts preserved coherent state and options after an intentional `start()` failure
- the manifest still did not need to become a giant DSL
- one extra narrow case kind, `flowSequence`, was enough to express this deeper bridge-backed behavior
