# Lab 17

This lab explores how `captool` could absorb platform adapters without pulling the
entire research stack into its mainline yet.

The question is:

- can one thin orchestration layer drive both iOS and Android host-backed adapters
- without hard-coding platform-specific logic into the caller each time

This lab keeps the adapter contract intentionally small:

- `prepare`
- `run normal`
- `run fault`

The adapters are only responsible for:

- building the platform host
- launching it
- reading the probe result file
- returning one normalized JSON payload

The caller is responsible for:

- selecting adapters
- choosing mode
- aggregating normalized outputs

## Result

Observed payloads from the thin adapter runner:

- normal:
  - `{"mode":"normal","results":[{"platform":"ios","status":"ok","detail":"pass"},{"platform":"android","status":"ok","detail":"pass"}]}`
- fault:
  - `{"mode":"fault","results":[{"platform":"ios","status":"fail","detail":"echo_roundtrip: expected hello-manifest got hello-manifest-fault; reset_emits_init_idle: expected init -> idle got init -> stopped"},{"platform":"android","status":"fail","detail":"echo_roundtrip: expected hello-manifest got hello-manifest-fault; reset_emits_init_idle: expected init -> idle got init -> stopped"}]}`

## Conclusion

- `captool` does not need to absorb every host detail directly
- a thin adapter protocol is already enough to drive host-backed execution
- the caller can stay small if each platform adapter agrees to:
  - prepare itself
  - run one mode
  - emit one normalized JSON result
- this supports the direction that platform execution adapters belong in the toolchain, while the top-level command can remain compact
