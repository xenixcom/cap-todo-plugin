# Docs

This directory holds the active documents for the current contract-first
Capacitor plugin workflow.

Use it as a navigation layer, not as a second project manifesto.

## Read Order

1. [`ROADMAP.md`](/Users/james/dev2/cap-todo-plugin/docs/ROADMAP.md)
   - version line and current phase
2. [`CAPTOOL_CONFIG.md`](/Users/james/dev2/cap-todo-plugin/docs/CAPTOOL_CONFIG.md)
   - shared config, local override, and runtime-state boundaries
3. [`CAPABILITY_ARCHETYPES.md`](/Users/james/dev2/cap-todo-plugin/docs/CAPABILITY_ARCHETYPES.md)
   - real-world plugin capability patterns
4. [`REAL_WORLD_PRESSURE_TESTS.md`](/Users/james/dev2/cap-todo-plugin/docs/REAL_WORLD_PRESSURE_TESTS.md)
   - pressure-test matrix against real plugin behavior
5. [`PLUGIN_GUIDELINES.md`](/Users/james/dev2/cap-todo-plugin/docs/PLUGIN_GUIDELINES.md)
   - stable development and testing principles
6. [`HANDOFF.md`](/Users/james/dev2/cap-todo-plugin/docs/HANDOFF.md)
   - current-state operational handoff

## Current Structure Anchors

- formal contract source:
  - [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)
- formal test units:
  - [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)
- shared test support:
  - [`tests/support`](/Users/james/dev2/cap-todo-plugin/tests/support)
- formal tool entry:
  - [`tools/captool`](/Users/james/dev2/cap-todo-plugin/tools/captool)
- tool self-tests:
  - [`tools/tests`](/Users/james/dev2/cap-todo-plugin/tools/tests)
- tool config:
  - [`captool.json`](/Users/james/dev2/cap-todo-plugin/captool.json)
  - `captool.local.json`

## Document Roles

- [`ROADMAP.md`](/Users/james/dev2/cap-todo-plugin/docs/ROADMAP.md)
  - phase progress and completion lines
- [`CAPTOOL_CONFIG.md`](/Users/james/dev2/cap-todo-plugin/docs/CAPTOOL_CONFIG.md)
  - config schema and override model
- [`CAPABILITY_ARCHETYPES.md`](/Users/james/dev2/cap-todo-plugin/docs/CAPABILITY_ARCHETYPES.md)
  - the capability patterns the system should eventually support
- [`REAL_WORLD_PRESSURE_TESTS.md`](/Users/james/dev2/cap-todo-plugin/docs/REAL_WORLD_PRESSURE_TESTS.md)
  - real-world pressure points and gaps
- [`PLUGIN_GUIDELINES.md`](/Users/james/dev2/cap-todo-plugin/docs/PLUGIN_GUIDELINES.md)
  - stable principles that should outlive a single branch
- [`HANDOFF.md`](/Users/james/dev2/cap-todo-plugin/docs/HANDOFF.md)
  - current repo status, recent decisions, and operational context
- [`PORTING_NOTES.md`](/Users/james/dev2/cap-todo-plugin/docs/PORTING_NOTES.md)
  - rename and identifier checklist for cloning this skeleton into another plugin
- [`PIPELINE_RETROSPECTIVE.md`](/Users/james/dev2/cap-todo-plugin/docs/PIPELINE_RETROSPECTIVE.md)
  - historical lessons from transitional testing paths
- [`DOC_AUDIT.md`](/Users/james/dev2/cap-todo-plugin/docs/DOC_AUDIT.md)
  - documentation cleanup decisions and merge/delete candidates

## Current Baseline

- current tool version:
  - `captool v0.5.3`
- current formal web suites:
  - `npm test`
- current tool self-tests:
  - `npm run test:tools`
- current all-platform entry:
  - `./tools/captool test all --report`

## Cleanup Rule

If a document starts duplicating:
- roadmap state
- stable principles
- current handoff detail

then shorten it and point back to the owning document instead of adding a new
long-form explanation here.
