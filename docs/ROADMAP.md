# Roadmap

This roadmap treats the current work as a staged evolution from a working
concept into a real-world plugin-development toolchain.

The key idea is:

- the hardest `0 -> 1` phase has already happened
- the next work is `1 -> 10`
- progress should remain visible and bounded

To keep the project disciplined, each minor phase should aim to prove one main
thing before expanding again.

## Version Line

### v0.1.x

Establish the working backbone.

Goals:

- single formal tool entry: `tools/captool`
- `test / clean / doctor / report`
- `captool.json` and `captool.local.json`
- first `/tests` scaffold
- first `captool` self-tests
- three-platform baseline working

### v0.2.x

Stabilize the formal contract line.

Goals:

- tighten `definitions.ts` to `/tests` alignment
- refine `tests/support` as a thin layer
- improve naming and spec readability
- stabilize summaries and failure reporting

### v0.3.x

First capability-archetype expansion.

Goals:

- availability capability
- permission capability
- session/watch capability
- prove the system is not only for the sample plugin

Done criteria:

- at least three real-world capability archetypes have a first pressure point
- those pressure points are reflected in:
  - `definitions.ts`
  - `tests/contract`
  - `tests/support` only where clearly needed
- formal tests still stay readable and do not collapse into a second framework
- the repo can explain, in concrete terms, how the current sample moved closer to
  real plugin behavior instead of only growing abstractions

Current status:

- availability capability
  - first pressure point complete
- permission capability
  - first pressure point complete
- session/watch capability
  - first pressure point complete
- real-world grounding
  - capability archetype survey complete
  - pressure-test matrix complete
  - sample contract now reflects multiple real-world capability patterns

### v0.4.x

Expand toolchain self-tests.

Goals:

- deeper `captool` self-tests
- more failure injection
- config override precedence checks
- report/log regression checks
- misconfiguration handling checks

Current status:

- `v0.4.3`
  - deeper self-tests expanded
  - config override precedence checks completed
  - report/log regression checks expanded
- `v0.4.4`
  - failure injection expanded
  - failing web build and failing contract command are both covered
- `v0.4.5`
  - misconfiguration handling checks completed
  - missing shared config is covered in both `doctor` and `test all`
  - `v0.4.x` completion line reached

### v0.5.x

Improve platform realism.

Goals:

- close the tooling/config depth gap across `web`, `ios`, and `android`
- preserve shared formal intent while accepting real platform differences
- avoid fake symmetry

Current status:

- `v0.5.0`
  - platform realism config fields added across `web`, `ios`, and `android`
  - iOS simulator device type/runtime are no longer hard-coded in adapter logic
  - Android build task and test mode are now explicit
  - Web fast-mode build behavior is now configurable
- `v0.5.1`
  - platform realism self-tests added
  - Web fast-mode retention is verified
  - Android build task and test mode are verified

### v0.6.x

Prepare template strategy.

Goals:

- separate `scripts` vs `template` thinking more clearly
- clarify what belongs to reusable scaffolding
- prepare the shape needed for future `captool create`

### v0.7.x

Pressure-test against real plugin types.

Goals:

- filesystem-like plugin patterns
- bluetooth/location-like patterns
- event-stream-heavy patterns
- resource/state-heavy patterns such as sqlite

### v0.8.x

Simplify and reduce over-design.

Goals:

- merge concepts that proved redundant
- cut unnecessary complexity
- keep user-facing flow readable
- keep AI-facing structure precise without becoming bloated

### v0.9.x

Release-candidate style consolidation.

Goals:

- full documentation alignment
- regression checks across formal tests and toolchain self-tests
- history/branch/template cleanup as needed
- confirm the system is ready for broader real-world usage

### v1.0.0

First real-world-ready methodology release.

Definition of done:

- contract-first plugin development line is stable
- formal test units are clear and scalable
- `captool` is a real toolchain entry, not just a script
- the system has been pressure-tested against real capability patterns
- the system demonstrably improves user plugin development and AI collaboration

## Discipline Rule

Each minor phase should stay within a small number of major proof points.

The project should avoid trying to solve everything in one jump.
The roadmap exists to prevent self-inflation and to keep progress measurable.
