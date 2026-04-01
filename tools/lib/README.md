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
  - adapter layer for `captool test`
  - translates shared test intent into `web` / `ios` / `android` execution

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
- `tools/tests/`
  - internal verification for the toolchain itself
- `tests/`
  - formal test units, not tool internals

Platform role:

- `commands/test.sh`
  - orchestration and shared testing policy
- `platforms/`
  - platform execution adapters
  - low-level toolchain details live here, not in top-level command dispatch

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
