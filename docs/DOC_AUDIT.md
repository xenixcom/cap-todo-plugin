# Documentation Audit

This note records the current documentation review before any large merge,
deletion, or history cleanup.

The goal is to separate:

- documents that are still structurally useful
- documents that are partially stale but salvageable
- documents that may later be merged or removed

## Current Working Set

These documents still have a clear role and should be kept:

- `docs/ROADMAP.md`
- `docs/CAPTOOL_CONFIG.md`
- `docs/CAPABILITY_ARCHETYPES.md`
- `docs/REAL_WORLD_PRESSURE_TESTS.md`
- `docs/PORTING_NOTES.md`
- `tools/README.md`
- `tools/tests/README.md`
- `tests/README.md`
- `tests/contract/README.md`
- `tests/support/README.md`

These are the current “active documents” because they map directly to:

- version progress
- config shape
- real-world pressure testing
- toolchain usage
- formal test structure

## Salvageable But Stale

These documents still contain useful context, but now include stale wording,
stale examples, or stale historical assumptions:

- `docs/README.md`
- `docs/HANDOFF.md`
- `docs/PLUGIN_GUIDELINES.md`
- `tests/pipeline/README.md`

Typical stale patterns found:

- references to `test-plugin.sh`
- references to `clean artifacts` / `clean global-caches`
- references to “shell script” when the repo already treats `captool` as a
  formal toolchain entry
- old test counts
- older structure snapshots that predate `tests/support/`

These files should be updated or compressed before any major cleanup.

## Historical Notes

These notes still provide value, but should be treated as historical/supporting
context rather than primary navigation:

- `docs/PIPELINE_RETROSPECTIVE.md`

This file is still useful because it records why some transitional testing
approaches were kept or removed.

It should likely stay, but it should not compete with the main architecture
documents.

## Merge Candidates

The following merge directions are worth discussing later:

### Candidate A

- keep `docs/README.md` as the top-level entry
- trim `docs/HANDOFF.md`
- move long-lived principles into `docs/PLUGIN_GUIDELINES.md`

### Candidate B

- keep `docs/HANDOFF.md` as a transient project-state handoff note
- keep `docs/README.md` short and navigational only
- move detailed operational guidance into:
  - `tools/README.md`
  - `tests/README.md`
  - `docs/CAPTOOL_CONFIG.md`

Current bias:

- `docs/README.md` should become shorter
- `docs/HANDOFF.md` should become more explicitly “current state / handoff”
- `docs/PLUGIN_GUIDELINES.md` should remain the stable principles document

## Current Decisions

These decisions are now treated as active unless a later review overturns them:

- `docs/README.md`
  - keep
  - role: short navigation only
  - should not carry long project-state detail
- `docs/HANDOFF.md`
  - keep
  - role: current-state operational handoff
  - may be longer, but should avoid duplicating the roadmap and stable principles
- `docs/PLUGIN_GUIDELINES.md`
  - keep
  - role: stable principles document
  - should outlive a single branch or phase
- `docs/PIPELINE_RETROSPECTIVE.md`
  - keep
  - role: historical note
  - should not compete with primary navigation
- `docs/PORTING_NOTES.md`
  - keep
  - role: practical rename/migration checklist

## Immediate Convergence Targets

The next cleanup pass should continue reducing:

- repeated “single pipeline” manifesto text across multiple files
- repeated current-state summaries already covered by `docs/HANDOFF.md`
- repeated tool/config explanations already covered by:
  - `tools/README.md`
  - `docs/CAPTOOL_CONFIG.md`

## Low-Risk Structural Cleanup

Completed in this pass:

- removed empty leftover directories from earlier `/tests` shaping:
  - `tests/fixtures/`
  - `tests/helpers/`

## Immediate Cleanup Already Needed

Even without large restructuring, these rules should now be enforced:

- no user-facing document should mention `test-plugin.sh`
- no user-facing document should mention `clean artifacts` or
  `clean global-caches`
- `captool` version mentions should match the current tool version
- test-count examples should avoid hard-coding old counts unless the count is
  intentionally part of a milestone record

## Structure Drift To Watch

The repo now has these active structural anchors:

- `src/definitions.ts`
- `tests/contract`
- `tests/support`
- `tools/captool`
- `tools/tests`
- `captool.json`
- `captool.local.json`

Any document that still frames the repo around:

- old script names
- old cleanup names
- missing `tests/support`
- missing `tools/tests`
- missing `captool.json`

is now structurally behind the repo.

## Before Deleting Documents

Before removing any file, check:

1. Does another file already carry the same information?
2. Is the remaining file shorter and clearer after merge?
3. Is the deleted file only historical, or does it still contain unique design
   rationale?
4. Will deletion remove context needed for future branch/history cleanup?

## Branch/History Cleanup Timing

Do not aggressively clean branch/history until:

- stale docs are corrected
- the surviving document set is agreed
- the current phase boundary is clear

Otherwise history cleanup will happen before the repo vocabulary is stable.
