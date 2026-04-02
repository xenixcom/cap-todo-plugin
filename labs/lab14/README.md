# Lab 14

This lab explores deeper plugin-facing bridge-backed behavior.

The question is:

- can a host-backed WebView probe validate real plugin listener behavior
- not just method calls, but event delivery and listener removal semantics

The scope stays intentionally narrow:

- use the real built `dist/plugin.js`
- use the real `@capacitor/core/dist/capacitor.js`
- call the real `Todo.addListener('statusChange', ...)`
- validate:
  - `reset()` emits `init -> idle`
  - `setOptions()` does not emit `statusChange`
  - `remove()` makes a later `reset()` stay silent

This is a real native-bridge-facing listener question.

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"reset_emits_init_idle: expected init -> idle got init -> stopped"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"reset_emits_init_idle: expected init -> idle got init -> stopped"}`

## Conclusion

- real plugin listener behavior can be validated through the host-backed WebView route
- this now covers:
  - event delivery
  - silence when no event should fire
  - silence after `remove()`
- the method is no longer limited to plugin method calls alone
