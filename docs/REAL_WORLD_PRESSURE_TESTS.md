# Real-World Pressure Tests

This note turns the capability archetype survey into a practical pressure-test
matrix for this repo.

The goal is simple:

- stop reasoning only from the sample `TodoPlugin`
- pressure-test the current system against real plugin capability patterns
- decide what to improve next without turning the toolchain into a closed system

## Current System Layers

Pressure tests are evaluated against these layers:

- `src/definitions.ts`
  - formal contract shape
- `tests/contract`
  - visible formal test units
- `tests/support`
  - thin shared test support
- `tools/captool`
  - formal tool entry
- `tools/tests`
  - toolchain self-tests

## Pressure-Test Method

For each archetype, ask:

1. Can `definitions.ts` express the contract cleanly?
2. Can `tests/contract` describe the intent without becoming bloated?
3. Can `tests/support` reduce repeated setup/assertion work without becoming a second framework?
4. Does `captool` need new semantics, config, or reporting?
5. What kind of drift risk appears first?

## Archetype Matrix

### 1. Permission Capability

Examples:

- geolocation
- speech recognition
- camera preview
- bluetooth

Typical contract shape:

- `checkPermissions()`
- `requestPermissions()`
- permission mapping

Current fit:

- `definitions.ts`
  - good first fit
- `tests/contract`
  - good first fit
- `tests/support`
  - only a first thin fit

Current weakness:

- only one sample permission type is modeled
- permission mapping patterns are still sample-grade

Likely next improvement:

- permission-oriented helper pattern
- multi-permission contract examples

### 2. Availability Capability

Examples:

- bluetooth available/enabled
- GPS enabled
- camera availability

Typical contract shape:

- `isAvailable()`
- `isEnabled()`
- unsupported vs unavailable

Current fit:

- `definitions.ts`
  - weak
- `tests/contract`
  - weak

Current weakness:

- the sample plugin does not yet force a real availability contract
- unsupported and unavailable are only partially explored through error paths

Likely next improvement:

- add explicit availability contract examples
- add drift checks for unsupported vs unavailable semantics

Current progress:

- first availability pressure point is now implemented in the sample contract
- `TodoPlugin` now exposes a minimal availability probe through
  `getAvailability()`
- current formal test coverage checks the distinction between:
  - platform support
  - option enablement

### 3. Session / Watch Capability

Examples:

- geolocation watch
- BLE scan/connect
- speech start/stop
- recorder/session start-stop

Typical contract shape:

- `start() / stop()`
- `watch() / clearWatch()`
- connect/disconnect session state

Current fit:

- `definitions.ts`
  - moderate
- `tests/contract`
  - moderate
- `tests/support`
  - early

Current weakness:

- current lifecycle model is sample-friendly but not yet watch/session-rich
- no formal watch-handle pattern exists

Likely next improvement:

- session/watch archetype example
- event and teardown coverage for long-lived operations

Current progress:

- a first session-like pressure point is now present in the sample contract
- `openSession()` / `closeSession(sessionId)` provide a minimal long-lived token flow
- current coverage now checks:
  - session creation
  - duplicate-session rejection
  - invalid token rejection
  - return to `idle` after session close

### 4. Event Stream Capability

Examples:

- status events
- scan result events
- progress/result callbacks
- location updates

Typical contract shape:

- `addListener(...)`
- stream payload contract
- unsubscribe / cleanup semantics

Current fit:

- `definitions.ts`
  - moderate
- `tests/contract`
  - moderate
- `tests/support`
  - early

Current weakness:

- current event coverage is still very light
- payload drift and duplicate-event drift are not yet deeply modeled

Likely next improvement:

- reusable stream/event assertions
- explicit event ordering and silence expectations

### 5. Resource Capability

Examples:

- filesystem
- sqlite
- nfc tag payloads
- barcode scan result payloads

Typical contract shape:

- read/write/open/remove/list
- resource identifiers
- error normalization

Current fit:

- `definitions.ts`
  - weak
- `tests/contract`
  - weak

Current weakness:

- the sample plugin does not yet model resource lifecycle
- options/lifecycle/status grouping is not enough for resource-heavy plugins

Likely next improvement:

- introduce one resource-oriented sample contract
- define resource result/error patterns

### 6. Platform Variant Capability

Examples:

- web fallback differs from native
- simulator differs from real device
- iOS and Android options differ while intent stays shared

Typical contract shape:

- shared formal intent
- platform-specific caveats and support level

Current fit:

- `captool.json`
  - good first fit
- `captool`
  - moderate
- `tests/contract`
  - early

Current weakness:

- `ios` tooling depth is ahead of `web` and `android`
- platform-variant semantics are documented more than they are pressure-tested

Likely next improvement:

- add platform-variant pressure-test cases
- clarify when divergence is accepted vs treated as drift

## Current Conclusion

The system is valid, but still sample-grade in several archetypes.

What is already strong:

- single formal contract line
- visible formal test units
- thin support layer
- single tool entry
- toolchain self-tests

What still needs real-world strengthening:

- availability patterns
- watch/session patterns
- event stream patterns
- resource patterns
- platform-variant pressure tests

## Suggested Next Order

1. Add one new archetype-driven sample pressure point
   - do not add many at once
2. Expand `tests/support` only when the spec clearly benefits
3. Re-check `captool` only after the new archetype exposes a tooling gap
4. Keep comparing every new abstraction against real plugin behavior

## Guardrail

Do not optimize for elegance alone.

A new abstraction is only justified if it makes at least one of these better:

- user plugin development
- AI collaboration clarity
- cross-platform drift detection
- real capability coverage
