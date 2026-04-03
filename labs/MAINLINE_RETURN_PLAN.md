# Mainline Return Plan

This file defines the safest path back from `labs/` into the formal mainline.

It is intentionally incremental.

## Principle

Do not move the full research stack back into the mainline in one jump.

Return only the most stable slices first.

## Stage 1: Documentation Return

Move back only the stabilized definitions:

- method definition
- tool boundary
- formal-layer principles
- adapter-layer principles

Goal:

- align the repo on the new model before changing code

## Stage 2: Adapter Contract Return

Extract a minimal adapter contract into toolchain space.

Candidate shape:

- `run <strategy>`
- normalized JSON result

Goal:

- prove that `captool` can call adapters without absorbing their internals

## Stage 3: Formal Test Unit Shape Return

Begin replacing free-form test code assumptions with a smaller formal case language.

Goal:

- move the mainline away from framework-bound test syntax
- toward a formal test-unit definition that can survive multiple hosts

## Stage 4: First Real Mainline Slice

Choose only one stable slice first, for example:

- plugin-facing call/value cases
- or permission-independent plugin contract cases

Goal:

- validate the return path with a low-risk subset

## Stage 5: Platform-Specific Hard Cases Later

Do not start the return path with:

- deeper media permission seams
- Bluetooth/device-required topics
- specialized stripped seam diagnostics

These should remain in research/support space until needed.

## Recommended Order

1. merge method documents
2. merge adapter contract definition
3. merge one stable formal test-unit slice
4. expand only after the first slice is proven stable

## What Not To Do

Do not:

- collapse labs directly into the mainline as-is
- reintroduce platform logic into test units
- make `captool` parse raw platform result strings
- assume every seam must be solved before any return to mainline

## Short Goal

Return to the mainline by moving:

- the cleanest definitions first
- the cleanest adapter contract second
- the riskiest platform seams last
