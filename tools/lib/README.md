# Captool Lib

This directory contains the internal modules behind `./tools/captool`.

Current layering:

- shared helpers
  - `common.sh`
  - `cli.sh`
  - `summary.sh`
- command layer
  - `commands/`
- platform layer
  - `platforms/`

Future command space:

- `outdated`
- `update`
- `upgrade`

Those future commands should keep `scripts` and `template` as separate compatibility scopes.

Boundary:

- `captool`
  - entrypoint, sourcing, top-level orchestration
- `tools/lib/`
  - internal implementation details
- `tests/`
  - formal test units, not tool internals

This layer is intentionally modularized enough to support future growth without forcing over-fragmentation.
