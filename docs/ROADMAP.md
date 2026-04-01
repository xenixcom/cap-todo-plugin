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

### v0.4.x

Expand toolchain self-tests.

Goals:

- deeper `captool` self-tests
- more failure injection
- config override precedence checks
- report/log regression checks
- misconfiguration handling checks

### v0.5.x

Improve platform realism.

Goals:

- close the tooling/config depth gap across `web`, `ios`, and `android`
- preserve shared formal intent while accepting real platform differences
- avoid fake symmetry

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
