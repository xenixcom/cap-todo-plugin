# Hardware Test Matrix

This file summarizes how different native hardware capabilities are likely to fit into the host-backed testing model.

It does **not** claim that every capability is already fully solved.

Its purpose is to avoid collapsing into two bad extremes:

- "everything must be manual UI/device testing"
- "everything can be perfectly mocked in the same way"

Instead, this matrix separates capabilities into likely testing modes:

- toolized live
- adapter fake
- device-required

## How To Read This

These categories are not absolute forever.

They are current working guidance based on:

- the lab results so far
- platform tooling
- known simulator/emulator capabilities
- reading of native platform documentation

## 1. Location / GPS

Likely category:

- **toolized live**

Why:

- Android emulator already supports controllable location injection
- iOS Simulator also has mature location simulation paths

What this probably means for adapters:

- formal scenario:
  - "location becomes X"
  - "route progresses"
- adapter responsibility:
  - inject mock/live simulator location
  - control timing / progression

What still may need care:

- background location behavior
- permission shape
- route timing realism

Reading notes:

- Android Emulator extended controls and command surfaces already expose location simulation
- `simctl location` is richer than a simple static coordinate:
  - `set`
  - `clear`
  - `run <scenario>`
  - waypoint `start`

## 2. Camera

Likely category:

- **mixed**
  - some toolized live
  - some device-required

Why:

- Android emulator can simulate camera sources to some degree
- iOS often still pushes real camera work toward device testing

Reading notes:

- Android Emulator camera support is officially documented and includes:
  - basic camera functionality
  - virtual scene camera
  - imported images for camera-based apps
- older Apple Simulator guidance explicitly warns that Camera app behavior is not fully replicated in Simulator
- this strongly suggests:
  - contract-level camera flows may be toolizable
  - full camera pipeline truth still leans device-required

What this probably means for adapters:

- contract-level scenarios may still be testable:
  - permission denied / granted
  - "capture started"
  - "no camera available"
- but true image pipeline realism may still need:
  - device
  - or specialized camera simulation

## 3. Microphone / Audio Input

Likely category:

- **mixed**
  - toolized permission control
  - host wiring required
  - some device-required live validation

Why:

- our labs already showed permission/media seams are toolizable
- but audio capture realism is not identical to permission-path realism

Reading notes:

- on iOS, microphone permission and media-capture host wiring are controllable
- that does **not** automatically imply realistic audio-input testing
- audio pipeline truth should still be treated more cautiously than permission-path truth

What this probably means for adapters:

- permission and capability-blocking behavior:
  - toolized live / adapter-controlled
- actual audio signal quality / device path:
  - likely device-required

## 4. Bluetooth / BLE

Likely category:

- **mixed leaning device-required**

Why:

- BLE and broader Bluetooth behavior often depends on:
  - nearby devices
  - radio state
  - pairing state
  - protocol interaction
- tooling exists, but not always in a clean cross-platform simulator story

Reading notes:

- Apple still exposes Bluetooth development resources and tools such as:
  - Core Bluetooth docs
  - PacketLogger
  - accessory simulators in adjacent domains
- old Apple simulator BLE guidance existed, but was limited and is now retired
- this suggests Bluetooth is not "untestable"
- but it is also not as cleanly toolized as location or permissions

What this probably means for adapters:

- formal contract tests may split into:
  - adapter fake for capability / availability / state transitions
  - device/live validation for real transport behavior

## 5. Sensors

Likely category:

- **mixed**

Examples:

- accelerometer
- gyroscope
- motion
- orientation

Why:

- Android emulator often has stronger direct controls for sensors
- iOS may support some simulation, but not every sensor path equally

Reading notes:

- Android Emulator extended controls explicitly support:
  - device pose
  - accelerometer-like movement
  - magnetic field
  - proximity
  - light
  - pressure
  - relative humidity
- that makes Android especially promising for sensor-oriented adapter strategies

What this probably means for adapters:

- many sensor-driven contracts can probably be:
  - adapter fake
  - or toolized live in emulator/simulator
- but some motion realism may still be limited

## 6. Filesystem / Storage

Likely category:

- **toolized live**

Why:

- no special external hardware is required
- our labs already showed strong coverage here

What this probably means for adapters:

- setup/cleanup
- reinstall/relaunch control
- corruption injection
- quota/sandbox follow-up

This is one of the clearest categories for formal host-backed testing.

## 7. Network

Likely category:

- **toolized live**

Examples:

- HTTP
- WebSocket
- reconnect
- fallback
- retry

Why:

- our labs already showed this can be done repeatably
- local stub servers are sufficient for many contract-level behaviors

This is another category that fits the formal model well.

## 8. Permissions

Likely category:

- **toolized live**

Why:

- Android:
  - `pm grant`
  - `pm revoke`
  - flags
- iOS Simulator:
  - `simctl privacy`
- host callbacks can fill the remaining media-specific seam

What this probably means for adapters:

- permissions are not a reason to fall back to UI automation by default
- they should be part of formalized adapter strategy

## 9. Availability / Session / Capability State

Likely category:

- **adapter fake** or **toolized live**, depending on source

Why:

- many of these states are not hardware signals directly
- they are computed capability states exposed by plugin/runtime layers

What this probably means for adapters:

- many availability/session shapes can stay as:
  - adapter fixtures
  - host-side fake state

This aligns well with what the labs already proved.

## 10. Practical Matrix

Most likely current split:

- **Best fit for formal host-backed route**
  - permissions
  - HTTP
  - WebSocket
  - storage
  - many availability/session/state flows
  - some location/GPS

- **Good fit with adapter fake support**
  - many sensor contracts
  - some hardware state transitions
  - some Bluetooth availability/state contracts

- **Likely still needs true device coverage**
  - real camera pipeline
  - real microphone/audio path quality
  - deeper BLE/device interaction
  - some physical sensor realism

## Strategic Reading Takeaway

The important shift is this:

- native hardware testing should not be treated as one monolithic "manual device testing" bucket

Instead, it should be split into:

- toolized live
- adapter fake
- device-required

That split is much more compatible with the method we have been validating.

## Short Conclusion

For hybrid/plugin work, many hardware-adjacent contracts are still compatible with the formal host-backed model.

The key is to classify each capability correctly:

- what can be controlled by simulator/emulator/tooling
- what should be faked in the adapter
- what still needs device truth

## Reading-Based Follow-up Direction

The most promising next reading directions are:

- Android:
  - emulator extended controls
  - camera emulation
  - sensor control
  - Bluetooth testing surface
- Apple:
  - simulator location and route tooling
  - current limitations of camera/audio realism in Simulator
  - Core Bluetooth tooling and accessory simulators

These should be read more deeply before turning hardware topics into new labs.
