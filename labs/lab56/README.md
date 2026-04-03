# Lab 56

This lab formalizes the `captool`/adapter boundary as a tiny runnable contract.

## Why this lab exists

Earlier labs already proved:

- platform execution can stay behind thin adapters
- permission strategies can be toolized
- host-specific fake state and runtime setup do not need to leak into test units

The remaining question is narrower:

- can one generic runner execute real platform adapters without knowing any host-specific details

## Contract

Each adapter only needs to support:

- `run <strategy>`

The adapter itself owns:

- build/install
- platform permission setup
- launch
- result-file lookup
- conversion to one normalized JSON payload

The caller only owns:

- which adapters to invoke
- which strategy key to pass
- how to aggregate the returned JSON

## Strategy used here

This lab uses one shared conceptual strategy:

- `grant-microphone`

Adapter internals differ:

- Android:
  - `pm grant io.xenix.demo android.permission.RECORD_AUDIO`
- iOS:
  - `simctl privacy grant microphone io.xenix.demo`
  - host callback remains `.grant`

## Expected value

If this works, it proves the top-level tool can stay thin even when adapter internals are very different.

## Result

Observed runner output:

- `{"strategy":"grant-microphone","results":[{"platform":"android","status":"ok","detail":"native=true; header=true; before=granted; request=granted; after=granted; start=ok"},{"platform":"ios","status":"fail","detail":"initial=prompt; request=granted; after=granted; open=ok"}]}`

The important part is not that the two adapters return identical payloads.
The important part is that:

- the caller did not know any `adb` details
- the caller did not know any `simctl` or `xcodebuild` details
- the caller only knew:
  - which adapters exist
  - which strategy key to pass
  - how to aggregate the returned JSON

## Conclusion

This is enough to make the `captool` boundary concrete:

- `captool` can stay a thin generic orchestrator
- platform-specific setup stays behind adapters
- host/runtime quirks can also stay behind adapters

This run also exposed one useful normalization detail:

- Android returned a clean green payload
- iOS passed through the raw host-shaped payload from `lab40`
  - `status: fail`
  - but `detail: initial=prompt; request=granted; after=granted; open=ok`

That means the remaining design work is not about host orchestration anymore.
It is about where final semantic normalization should happen:

- inside each adapter
- or in one shared result-normalization layer above adapters
