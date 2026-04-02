# Capability Archetypes

This note records the first external survey of real Capacitor plugins and
extracts the capability patterns that appear repeatedly in production plugins.

The goal is not to copy external repos.
The goal is to check whether this repo's `definitions + tests + captool`
direction can eventually serve real plugin development rather than only the
current sample plugin.

## Survey Baseline

Sampled repositories included:

- official plugins
  - `ionic-team/capacitor-geolocation`
  - `ionic-team/capacitor-filesystem`
  - `ionic-team/capacitor-google-maps`
  - `ionic-team/capacitor-barcode-scanner`
- community plugins
  - `capacitor-community/bluetooth-le`
  - `capacitor-community/sqlite`
  - `capacitor-community/background-geolocation`
  - `capacitor-community/speech-recognition`
  - `capacitor-community/text-to-speech`
  - `capacitor-community/camera-preview`
- broader ecosystem references
  - `capawesome-team/capacitor-plugins`
  - `ionic-team/create-capacitor-plugin`

## High-Level Findings

- Many mature Capacitor plugins have strong API and setup documentation.
- Many do not expose a clear formal test-unit layer.
- Many rely heavily on native capability behavior, platform policy, and
  environment constraints.
- Simulator and browser support are often partial.
- Real-device-only validation is common for some capabilities.

This means our current direction is unusual, but the problem space is real.
If the system is to help users broadly, it must handle native capability
patterns, not only sample-plugin logic.

## Core Archetypes

### 1. Permission Capability

Typical shape:

- `checkPermissions()`
- `requestPermissions()`
- permission-state mapping

Common risks:

- platform-specific raw permission states leaking through
- unsupported permissions being silently ignored
- request and check semantics drifting apart

### 2. Availability Capability

Typical shape:

- `isAvailable()`
- `isEnabled()`
- unsupported vs unavailable distinction

Common risks:

- unsupported platform and temporary unavailability being merged together
- capability checks becoming inconsistent across platforms

### 3. Session / Lifecycle Capability

Typical shape:

- `start()`
- `stop()`
- `connect() / disconnect()`
- `watch() / clearWatch()`
- `open() / close()`

Common risks:

- invalid-state handling drifting
- repeated calls silently succeeding
- reset/restart semantics becoming ambiguous

### 4. Event / Stream Capability

Typical shape:

- `addListener(...)`
- progress/result/state events
- watch subscriptions

Common risks:

- event payload drift
- events emitted when state did not actually change
- different platforms exposing subtly different event contracts

### 5. Resource Capability

Typical shape:

- file/database/tag/barcode/audio-like operations
- read/write/open/remove/list

Common risks:

- resource naming/path semantics drifting
- native errors leaking without contract normalization
- options evolving without test coverage

### 6. Platform Variant Capability

Typical shape:

- same formal intent
- different per-platform caveats, options, or support level

Common risks:

- web becoming a fake baseline that does not match native behavior
- iOS and Android diverging without explicit contract documentation
- platform-specific caveats living only in README text

## What This Means For This Repo

Current strengths:

- single formal contract source in `src/definitions.ts`
- visible formal suites in `tests/contract`
- shared support layer in `tests/support`
- single tool entry in `tools/captool`
- internal `captool` self-tests in `tools/tests`

Current gaps:

- the sample plugin is still more demonstrative than archetype-driven
- `tests/support` has only the first thin helper layer
- `android` and `web` tooling/config depth still trails `ios`
- capability-oriented helper patterns are not yet explicit

## Immediate Use

This note should be used as a pressure test for future changes:

- when expanding `definitions.ts`
- when shaping `tests/support`
- when deciding what `captool` should understand
- when checking whether a proposed helper is broadly useful or only sample-specific

## Guardrail

The system should not become a closed internal framework.

Every new abstraction should be checked against real plugin capability patterns:

- Does it help a user building a real native-capability plugin?
- Does it help AI read and extend formal test intent?
- Does it reduce drift risk between platforms?
- Or does it only make the sample repo look more elegant?
