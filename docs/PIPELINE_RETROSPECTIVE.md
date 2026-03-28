# Pipeline Retrospective

## Purpose

This note records what was learned while developing temporary private tests, reference harnesses, native core tests, and early bridge coverage.

The goal is to preserve the lessons without preserving every exploratory implementation path as long-term architecture.

## Core Conclusion

- The final target remains a single pipeline:
  - one formal contract in [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)
  - one formal test standard in [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)
  - one formal entrypoint in [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh)
- Private tests are not the target architecture.
- Private tests may exist temporarily to bootstrap or probe a platform boundary, but should not become a second standard.

## What Worked

- Starting from a small formal contract made the repo easier to align across `web`, `ios`, and `android`.
- Formal contract-first test design made it possible to implement and verify `web` end-to-end.
- Extracting native core behavior made `ios` and `android` easier to stabilize before touching bridge behavior.
- Using narrow bridge seams helped probe platform limits without rewriting the contract.

## What Did Not Scale Well

- Temporary reference harnesses and private test adapters quickly increased complexity.
- Once those layers started resembling real implementation, they created confusion about what was formal and what was only transitional.
- Platform-specific private tests are useful as probes, but they are costly if allowed to grow unchecked.

## Platform Lessons

### Web

- `web` currently represents the cleanest path.
- The formal contract tests can run directly against the real plugin implementation.
- This is the reference shape for the long-term pipeline.

### iOS

- `ios` can currently support a limited amount of real bridge coverage inside native tests.
- A small bridge seam for `statusChange` was added and successfully validated through `xcodebuild test`.
- Additional bridge-oriented checks for permission payload and request validation also work in the current XCTest setup.

### Android

- `android` core and helper coverage works well in local unit tests.
- Real bridge listener verification does not fit cleanly inside the current local unit test layer.
- Once tests touch `notifyListeners` and Android/Capacitor bridge objects directly, local unit tests hit SDK/mock boundaries.
- If Android bridge formal tests need to go deeper, the next layer should likely be Robolectric or instrumented tests.

## Design Rule Going Forward

- Prefer the single formal pipeline whenever possible.
- Do not expand private tests unless they are the minimum path needed to unblock pipeline development.
- If a temporary private test is added, document:
  - why it exists
  - what boundary it probes
  - what future pipeline capability should replace it

## Practical Next Step

- Continue building toward one pipeline that can call the real platform window and observe method results, events, and errors.
- Treat current native private tests as transition knowledge, not final testing architecture.
