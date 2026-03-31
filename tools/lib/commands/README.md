# Captool Commands

This directory contains the current command layer behind `captool`.

Current commands:

- `test`
- `clean`
- `doctor`
- `report`

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
