# Captool Commands

This directory contains the current command layer behind `captool`.

Current commands:

- `test`
- `clean`
- `doctor`
- `report`
- `version`

Reserved direction:

- `outdated`
- `update`
- `upgrade`

Future update/upgrade scope must be split into two independent targets:

- `scripts`
  - the repo-local toolchain itself
  - for example `tools/captool`, `tools/lib/*`, and related tool assets
- `template`
  - template/scaffold-derived repo content
  - potentially user-modified project files that must be treated much more conservatively

Compatibility rule:

- `doctor` may inspect and report status
- future `outdated` may inspect and compare versions
- future `update` / `upgrade` must not assume it is always safe to modify a partially customized user repo
- future platform support resolution should distinguish:
  - declared support
  - detected presence
- future private/platform-local tests may be tracked by tooling without replacing the formal contract path

Doctor rule:

- `doctor` should stay focused on readiness and self-check
- `doctor` should not directly update scripts or templates
- future update-oriented actions belong to separate commands, even when discovered by `doctor`

Reporting rule:

- `report` is the result-facing layer
- `log` is the process-facing layer
- future command work should avoid turning `report` into another raw log dump
