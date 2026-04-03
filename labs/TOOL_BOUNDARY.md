# Tool Boundary

This file defines the intended boundary between:

- formal test units
- platform adapters
- orchestration

## 1. Formal Test Unit

Owned by:

- plugin/app repo authors
- humans and AI working at the contract layer

Contains:

- case ids
- case kinds
- arrange/act/expect intent
- normalized expectations

Preferred shape:

- semantic case data
- small case-kind family
- explicit expected normalized outcomes

Does not contain:

- `adb`
- `simctl`
- `xcodebuild`
- Gradle
- WebView host bootstrapping
- native fake wiring

## 2. Platform Adapter

Owned by:

- toolchain

Contains:

- host setup
- runtime launch
- permission strategy
- fixture injection
- platform shell commands
- result extraction
- semantic normalization

Minimum practical adapter output should be:

- one normalized JSON object per run
- with:
  - adapter/platform id
  - semantic status
  - detail

Examples:

- Android adapter may use:
  - `pm grant`
  - `pm revoke`
  - emulator host setup
  - WebView messaging primitives
- iOS adapter may use:
  - `simctl privacy`
  - simulator install/launch
  - `WKUIDelegate`
  - `WKScriptMessageHandler`

## 3. Orchestrator

Owned by:

- `captool`

Contains only:

- adapter discovery
- strategy selection
- adapter invocation
- result aggregation
- output/report formatting

Preferred minimum invocation model:

- `run <strategy>`

Preferred minimum adapter return:

- normalized JSON result

## 4. Normalization Rule

Semantic normalization should happen in adapters, not in the top-level runner.

Reason:

- otherwise the shared runner must learn:
  - platform-specific raw result grammar
  - strategy-specific interpretation
  - adapter-specific quirks

That would make the orchestrator too smart and too coupled.

If semantic normalization leaks upward, the toolchain starts rebuilding:

- adapter knowledge
- platform grammar knowledge
- strategy-specific interpretation tables

That is exactly the coupling this boundary is meant to prevent.

## 5. Practical Consequence

The formal model stays small only if:

- test units stay semantic
- adapters absorb platform detail
- the orchestrator stays thin

This is the main guardrail against sliding back into:

- three platform-specific test stacks
- or one giant shared DSL that hides platform details badly
