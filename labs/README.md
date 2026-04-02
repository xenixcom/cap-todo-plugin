# Labs

This directory records experimental work that is intentionally kept outside the formal plugin testing mainline.

The purpose of these labs is to answer open technical questions with small, isolated probes before any strategy is pulled back into `captool`, `tests/contract`, or repo-wide documentation.

## Current conclusion

`lab1` through `lab6` now support a stronger definition of the testing model:

- formal test units can aim to be written once
- platform execution adapters belong to the toolchain, not to each plugin repo
- private native tests are optional helper coverage, not the formal test mainline
- host-backed WebView JS testing works on both iOS and Android without UI driving

## Completed labs

### `lab1`

Proved the minimal route:

- native host -> WebView -> JS -> single result
- normal and injected-fault cases were both detectable on iOS and Android

### `lab2`

Proved host-backed message push:

- JS -> native host active push
- normal and injected-fault cases were both detectable on iOS and Android

### `lab3`

Proved async delivery:

- JS promise/async result -> native host
- normal and injected-fault cases were both detectable on iOS and Android

### `lab4`

Proved packaged web assets:

- bundled local HTML/JS assets instead of inline pages
- normal and injected-fault cases were both detectable on iOS and Android

### `lab5`

Proved ordered multi-message handling:

- sequence-sensitive delivery such as `boot -> ready -> result -> done`
- order regressions and fault injections were detectable on iOS and Android

### `lab6`

Proved manifest-driven scenarios:

- bundled case data plus a generic runner
- hosts no longer need to hard-code individual cases
- this is the closest current lab to a future formal host-backed contract runner

### `lab7`

Proved HTTP-backed scenarios:

- bundled web probes can validate app-facing HTTP contracts
- deterministic local stub servers are enough for repeatable host-backed validation
- iOS and Android both pass and both detect injected regressions

### `lab8`

Proved WebSocket-backed scenarios:

- bundled web probes can validate persistent request/response communication
- local WebSocket stubs are enough for repeatable host-backed validation
- iOS and Android both pass and both detect injected regressions

### `lab9`

Proved storage-backed scenarios:

- bundled web probes can validate local storage contracts
- Android needs explicit DOM storage enablement in the adapter
- iOS and Android both pass and both detect injected regressions

## Open questions

These are still not settled and should only be explored through new labs:

- plugin-facing hook shape
- event and stream contracts beyond simple ordered messages
- deeper HTTP-backed scenarios such as timeout, malformed payloads, non-200 responses, retry, fallback, and offline handling
- deeper WebSocket scenarios such as reconnect, disconnect, idle timeout, protocol failure, and stream semantics
- deeper storage-backed scenarios such as persistence across relaunch, corrupt data, quota, and sandbox edge cases
- permission, availability, and session archetype mapping
- how a shared scenario manifest should be shaped for long-term formal use
- how `captool` should expose and orchestrate platform adapters

## Cleanup rule

Labs may keep source, config, and short readmes.

Labs must not keep bulky generated artifacts after a result has been recorded:

- Xcode `DerivedData`
- Gradle `.gradle`
- Gradle `build`
- app module `build`
- temporary `node_modules`
- simulator/emulator output that can be regenerated

Those artifacts are ignored in git and should be removed after each experiment round.
