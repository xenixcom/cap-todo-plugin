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

Direction:

- The next stage is to turn this directory into a clearer toolchain surface rather than keep growing one large script.
- The long-term naming direction for the formal tool is `captool`.
- Expected long-term commands include:
  - `captool test`
  - `captool clean`
  - `captool doctor`
  - `captool report`
  - `captool create`
- `captool create` is a future idea for scaffolding a plugin with the contract-first workflow built in, not just generating an empty template.
