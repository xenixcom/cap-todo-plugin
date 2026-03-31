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

Result vs Process:

- `report`
  - result-oriented summary layer
  - intended for fast human reading and future AI-facing summaries
- `log`
  - process-oriented execution layer
  - intended for raw debugging detail and command traces

Doctor role:

- `doctor`
  - readiness and self-check layer
  - checks environment/tooling/repo structure status
  - should report findings without directly modifying user project state

This layer is intentionally modularized enough to support future growth without forcing over-fragmentation.
