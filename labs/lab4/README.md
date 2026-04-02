# Lab 4

This lab explores the next layer after `lab3`.

`lab1` to `lab3` proved:

- host-backed WebView JS testing is viable on both iOS and Android
- sync pull, sync push, and async push all work

`lab4` asks a different question:

- can the host load a local bundled test page instead of inline HTML
- and still observe the same app-facing JS result correctly

This is closer to:

- real bundled web assets
- a reusable probe page
- eventual formal test pages living as files instead of inline strings

## Result

Both bundled-host probes now work on both platforms.

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"3"}`
- iOS fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`
- Android normal:
  - `{"status":"ok","detail":"3"}`
- Android fault:
  - `{"status":"fail","detail":"expected 3 got -1"}`

Current conclusion:

- the host-backed path does not depend on inline HTML strings
- both platforms can load bundled local web assets and still validate app-facing JS behavior
- both platforms still catch a deliberately broken bundled implementation
