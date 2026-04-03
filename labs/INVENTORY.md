# Labs Inventory

This file is the high-level inventory of `lab1` through `lab60`.

It is intentionally different from [README.md](/Users/james/dev2/cap-todo-plugin/labs/README.md):

- `README.md`
  - carries the rolling technical record
- `INVENTORY.md`
  - groups labs by theme
  - separates primary experiments from clarification/support labs
  - prepares the ground for later retrospective and strategy review

## How To Read This

Not every lab is an equal-sized result.

Many later labs exist to:

- isolate a seam
- rule out a false lead
- clarify an earlier failure
- narrow a platform-specific runtime issue

So the important unit here is not:

- "60 independent results"

It is:

- "a smaller number of major themes, each supported by a chain of labs"

## Theme 1: Core Host-Backed WebView Route

Primary labs:

- `lab1`
- `lab2`
- `lab3`
- `lab4`
- `lab5`
- `lab6`

What these established:

- host-backed WebView execution works on iOS and Android
- results can move both directions:
  - host pulls JS return values
  - JS pushes results to host
- sync and async scenarios both work
- bundled local assets work
- ordered message sequences work
- a manifest-driven runner is viable

Why this theme matters:

- it is the real foundation of the method
- without this theme, the rest of the testing model would collapse

## Theme 2: Real Hybrid-App Capability Coverage

Primary labs:

- `lab7`
- `lab8`
- `lab9`
- `lab20`
- `lab29`
- `lab30`
- `lab31`
- `lab33`
- `lab34`

Supporting labs:

- `lab19`
- `lab26`
- `lab27`
- `lab28`
- `lab32`

What these established:

- HTTP-backed contracts work
- WebSocket-backed contracts work
- storage-backed contracts work
- reconnect, retry, fallback, protocol failure, relaunch, reinstall, and corruption seams can all be pressure-tested

Important supporting clarifications:

- `lab19`, `lab26`, `lab27`, `lab28`, `lab32`
  - narrowed storage persistence questions
- `lab29` and `lab30`
  - separated retry-after-response from retry-after-timeout
  - showed timeout retry requires true abort

Why this theme matters:

- it proves the method is not limited to toy `add()`-style probes
- it reaches realistic hybrid app behavior

## Theme 3: Plugin-Facing And True Bridge Coverage

Primary labs:

- `lab10`
- `lab14`
- `lab15`
- `lab16`
- `lab17`
- `lab38`
- `lab41-bridge-host`
- `lab59`

Supporting labs:

- `lab44`

What these established:

- real plugin-facing JS API can be exercised through the host-backed route
- listener behavior is testable
- archetype coverage exists for:
  - permission
  - availability
  - session
- a small manifest case-family still covers the deepest tested plugin-facing flows
- the route also works inside a true native Capacitor bridge host

Important supporting clarifications:

- `lab44`
  - showed true Android bridge-host permission runs can go green once permission flow is completed correctly

Why this theme matters:

- it connects the method back to the original plugin problem
- it proves this is not only a generic WebView trick

## Theme 4: Mock Pressure, Native Fakes, And Adapter Containment

Primary labs:

- `lab11`
- `lab39`
- `lab43`
- `lab56`
- `lab57`
- `lab60`

Supporting labs:

- `lab12`
- `lab13`

What these established:

- formal test units do not need to absorb complex mock DSL pressure
- native fake state can stay in adapter/host setup
- even heavier timing/event complexity can stay below the formal unit
- a thin adapter contract is enough for orchestration
- orchestration and semantic normalization should be separated
- remaining seams now classify as adapter/host concerns, not formal blockers

Important supporting clarifications:

- `lab12`
  - isolated the iOS local HTTP seam and removed one false lead
- `lab13`
  - was a diagnostic follow-up that helped prove `lab11` was not failing because richer fetch shape was impossible

Why this theme matters:

- it protects the method from collapsing into:
  - a new giant DSL
  - or a reimplementation of a full test framework

## Theme 5: Permission And Media Seams

Primary labs:

- `lab18`
- `lab21`
- `lab22`
- `lab23`
- `lab25`
- `lab37`
- `lab40`
- `lab45`
- `lab46`
- `lab47`
- `lab54`
- `lab58`

Supporting labs:

- `lab15`
- `lab24`
- `lab36`
- `lab42`

What these established:

- permission was the deepest real seam family encountered
- iOS media permission is not a hard WebView blocker
- it requires host media-capture wiring
- Android permission can be toolized repeatably
- iOS deny can also be toolized, but its observable shape differs
- the formal contract should normalize deny as capability blocking, not raw state equality

Important supporting clarifications:

- `lab22`, `lab23`, `lab25`
  - narrowed the earlier iOS black-hole into a pending `getUserMedia(audio)` seam
- `lab37`
  - proved that seam flips green once `WKUIDelegate` media-capture callback is implemented
- `lab45`
  - proved repeatable Android grant without manual UI
- `lab46`, `lab47`
  - split Android deny from iOS deny
- `lab54`
  - narrowed Android grant strategy to permission-specific `pm grant`

Why this theme matters:

- this is where the method met the most realistic platform friction
- and still came out with adapter-level, toolizable answers

## Theme 6: Stripped Seam Diagnostics

Primary labs:

- `lab12`
- `lab35`
- `lab48`
- `lab49`
- `lab50`
- `lab51`
- `lab53`
- `lab55`

What these established:

- stripped seam probes can diverge from broader scenario labs
- `10.0.2.2` itself is viable
- `AbortController` is not the seam cause
- host LAN IP is not the poisoning target
- `localhost` is the special target that interferes with the otherwise-good emulator-host mapping

Why this theme matters:

- it is a good example of why later labs exist:
  - not to create new pillars
  - but to keep narrowing a suspicious seam until the false leads are gone

## Theme 7: Formalization Closure

Primary labs:

- `lab56`
- `lab57`
- `lab58`
- `lab59`
- `lab60`

What these established:

- `captool` can stay a thin orchestrator
- semantic normalization is cleaner inside adapters
- deny contract should be expressed semantically
- current manifest shape is still sufficient
- remaining known seams are no longer formal blockers

Why this theme matters:

- this theme is the bridge from research to future mainline design

## Primary Versus Support Labs

The labs below are best understood as support/clarification labs, not standalone pillars:

- `lab12`
- `lab13`
- `lab19`
- `lab24`
- `lab26`
- `lab27`
- `lab28`
- `lab32`
- `lab35`
- `lab36`
- `lab42`
- `lab44`
- `lab48`
- `lab49`
- `lab50`
- `lab51`
- `lab53`
- `lab55`

They still matter.

But their role is mainly:

- seam isolation
- false-lead removal
- result correction
- scope narrowing

## Practical Inventory Summary

If we compress `lab1` through `lab60` into one view, the strongest supported statements are:

- one formal test unit remains a viable goal
- execution adapters belong in the toolchain, not in every repo
- private native tests are optional helpers, not the formal mainline
- host-backed WebView testing is viable across iOS and Android
- true native Capacitor bridge hosts also fit the method
- manifest growth has remained controlled
- adapter/host layers can absorb far more complexity than originally feared

## Still Open, But No Longer Core Method Risks

What still remains open is narrower:

- whether to keep investigating the Android `localhost` / `10.0.2.2` seam root cause
- whether future, still-untested plugin-facing flows eventually force a new manifest case kind
- deeper storage edges such as quota / sandbox details

These are no longer the same class of concern as:

- "is the whole method wrong"
- "must we go back to private native tests as the formal mainline"

They are follow-up questions, not foundation questions.
