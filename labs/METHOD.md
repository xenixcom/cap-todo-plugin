# Method

This file captures the current best definition of the method after `lab1` through `lab64`.

It is intentionally short and normative.

## Core Claim

The formal testing mainline should be defined at the app-facing layer, not at the private native unit-test layer.

## Current Definition

The method now points to this structure:

- one formal test unit
- platform execution adapters owned by the toolchain
- a thin orchestrator above adapters
- private native tests as optional helpers, not the formal mainline

In practical terms this means:

- repo authors write semantic cases
- adapters execute those cases on real hosts
- the orchestrator coordinates adapters and reports normalized outcomes

## Formal Layer

The formal layer should contain:

- contract intent
- scenario/case definition
- expected normalized outcomes

The formal layer should be able to survive multiple execution hosts without changing its meaning.

It should **not** contain:

- platform-specific host logic
- native fixture wiring
- system-permission shell commands
- bulky mock DSL

When possible, the formal layer should describe:

- what is invoked
- what is observed
- what normalized outcome is expected

not:

- how the host is wired
- how the platform is manipulated

## Adapter Layer

The adapter layer is where platform-specific complexity belongs.

It may own:

- host build/install/launch
- permission grant/deny/reset strategy
- simulator/emulator control
- fixture injection
- native fake state
- result extraction
- semantic normalization

It may also choose cleaner native primitives when they improve adapter hygiene, for example:

- Android:
  - `WebViewAssetLoader`
  - `addWebMessageListener`
- iOS:
  - `WKURLSchemeHandler`
  - `WKContentWorld`

But recent labs add an important constraint:

- these are upgrade candidates, not assumed drop-in replacements
- each must still be validated against the execution shape it changes

## Orchestrator Layer

The orchestrator should remain thin.

It should do only:

- choose adapters
- choose strategy/mode
- invoke adapters
- aggregate normalized results
- report outcomes

It should not absorb:

- platform shell details
- host-specific permission plumbing
- raw result reinterpretation logic that belongs inside adapters

## Manifest Direction

The formal case language should stay small and semantic.

Current evidence supports a compact family such as:

- `callValue`
- `callError`
- `listenerSequence`
- `flowSequence`

The goal is disciplined semantic case kinds, not a general-purpose testing DSL.

This implies:

- test units should look more like semantic case data
- and less like free-form framework-bound test code

## Permission Direction

Permission contracts should be normalized semantically.

Example:

- Android deny may surface as `denied`
- iOS deny may surface as `prompt + blocked`

The formal contract should care about:

- capability blocked
- action denied

not raw platform-state equality.

## Tooling Direction

The toolchain should eventually provide:

- shared formal test-unit format
- per-platform execution adapters
- thin orchestration
- normalized reporting

Current evidence suggests:

- `WKContentWorld` is an especially strong iOS upgrade candidate because it gives real harness isolation without changing formal case semantics
- the other official primitives remain promising, but should be adopted carefully rather than assumed to erase existing seams

The toolchain should not require plugin repos to reinvent:

- simulator/emulator control
- native host bootstrapping
- permission shell recipes
- host result extraction

## Strategic Meaning

This is not just a testing trick.

It is becoming:

- a formal engineering method
- a human/AI shared language
- a way to move AI-assisted development away from vague output and toward verifiable delivery

The important point is not just that AI can generate code.

The important point is that humans and AI can work against:

- the same contract language
- the same execution model
- the same verification path
