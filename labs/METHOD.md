# Method

This file captures the current best definition of the method after `lab1` through `lab60`.

It is intentionally short and normative.

## Core Claim

The formal testing mainline should be defined at the app-facing layer, not at the private native unit-test layer.

## Current Definition

The method now points to this structure:

- one formal test unit
- platform execution adapters owned by the toolchain
- a thin orchestrator above adapters
- private native tests as optional helpers, not the formal mainline

## Formal Layer

The formal layer should contain:

- contract intent
- scenario/case definition
- expected normalized outcomes

It should **not** contain:

- platform-specific host logic
- native fixture wiring
- system-permission shell commands
- bulky mock DSL

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

## Strategic Meaning

This is not just a testing trick.

It is becoming:

- a formal engineering method
- a human/AI shared language
- a way to move AI-assisted development away from vague output and toward verifiable delivery
