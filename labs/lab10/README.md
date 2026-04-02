# Lab 10

This lab explores the first `plugin-facing hook`.

The question is:

- can a host-backed WebView probe run the repo's real exported plugin JS API
- without falling back to UI driving or private native test code

The scope stays intentionally narrow:

- use the real built `dist/plugin.js`
- use the real `@capacitor/core/dist/capacitor.js`
- call the plugin-facing `Todo` API from bundled web assets
- validate contract-style cases through a generic runner

This is not the full native bridge question yet.

It proves the app-facing plugin call shape first.

## Result

Both plugin-hook probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"echo_roundtrip: expected hello-plugin got hello-plugin-fault; status_initial: expected idle got running; options_debug_true: expected true got false; options_enabled_preserved: expected true got false"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"echo_roundtrip: expected hello-plugin got hello-plugin-fault; status_initial: expected idle got running; options_debug_true: expected true got false; options_enabled_preserved: expected true got false"}`

Current conclusion:

- host-backed WebView tests can run the repo's real plugin-facing JS API
- the same scenario runner can validate plugin-shaped contracts on both iOS and Android
- this proves a real bridge-less plugin hook layer before tackling deeper native-bridge cases
