# Tools

This directory contains repo-local toolchain entrypoints.

Current entrypoints:

- `test-plugin.sh`
  - The single formal pipeline entry for plugin verification.
  - It orchestrates `web`, `ios`, and `android` validation.
  - It is a tool entrypoint, not the formal contract standard itself.

Boundary:

- `tools/`
  - execution, orchestration, cleanup, reporting, platform-specific tool adapters
- `tests/`
  - formal test definitions and formal contract suites
- `demo/`
  - final UI confirmation and feature showcase, not the formal pipeline host
