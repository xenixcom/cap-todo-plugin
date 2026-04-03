# Labs

This directory records experimental work that is intentionally kept outside the formal plugin testing mainline.

The purpose of these labs is to answer open technical questions with small, isolated probes before any strategy is pulled back into `captool`, `tests/contract`, or repo-wide documentation.

## Current conclusion

`lab1` through `lab31` now support a stronger definition of the testing model:

- formal test units can aim to be written once
- platform execution adapters belong to the toolchain, not to each plugin repo
- private native tests are optional helper coverage, not the formal test mainline
- host-backed WebView JS testing works on both iOS and Android without UI driving

What is already strongly supported:

- generic host-backed WebView execution works on both platforms
- plugin-facing JS API calls can be exercised through the same route
- listeners, sequences, and reconnect lifecycles can be validated without UI driving
- a small semantic manifest shape is enough for mixed scenarios
- a thin adapter protocol is enough for toolchain orchestration

What is not settled yet:

- permission state transitions still expose a real seam
- storage persistence across relaunch is not yet symmetric
- stripped-down seam diagnostics are not always symmetric with broader scenario labs
- deeper network and storage edge cases still need more pressure

## Current seam map

The current labs do not suggest that the core direction is wrong.

They do suggest that platform seams still matter and must keep being mapped explicitly:

- `lab12`
  - iOS local HTTP seam works in the stripped-down form
  - Android seam-only variant does not mirror that result
- `lab18`
  - external OS permission toggles do not yet produce a trustworthy app-facing permission contract result
- `lab19`
  - relaunch persistence is currently asymmetric between iOS and Android

So the current state is:

- the core method is holding
- but some host/environment seams are still not normalized

## Completed labs

### `lab1`

Proved the minimal route:

- native host -> WebView -> JS -> single result
- normal and injected-fault cases were both detectable on iOS and Android

### `lab2`

Proved host-backed message push:

- JS -> native host active push
- normal and injected-fault cases were both detectable on iOS and Android

### `lab3`

Proved async delivery:

- JS promise/async result -> native host
- normal and injected-fault cases were both detectable on iOS and Android

### `lab4`

Proved packaged web assets:

- bundled local HTML/JS assets instead of inline pages
- normal and injected-fault cases were both detectable on iOS and Android

### `lab5`

Proved ordered multi-message handling:

- sequence-sensitive delivery such as `boot -> ready -> result -> done`
- order regressions and fault injections were detectable on iOS and Android

### `lab6`

Proved manifest-driven scenarios:

- bundled case data plus a generic runner
- hosts no longer need to hard-code individual cases
- this is the closest current lab to a future formal host-backed contract runner

### `lab7`

Proved HTTP-backed scenarios:

- bundled web probes can validate app-facing HTTP contracts
- deterministic local stub servers are enough for repeatable host-backed validation
- iOS and Android both pass and both detect injected regressions

### `lab8`

Proved WebSocket-backed scenarios:

- bundled web probes can validate persistent request/response communication
- local WebSocket stubs are enough for repeatable host-backed validation
- iOS and Android both pass and both detect injected regressions

### `lab9`

Proved storage-backed scenarios:

- bundled web probes can validate local storage contracts
- Android needs explicit DOM storage enablement in the adapter
- iOS and Android both pass and both detect injected regressions

### `lab10`

Proved the first plugin-facing hook:

- bundled web probes can load the repo's real built plugin JS API
- the same generic runner can call `Todo` contract methods on both hosts
- iOS and Android both pass and both detect injected regressions

### `lab11`

Explored mock-pressure boundaries:

- Android proved that richer fake HTTP behavior can stay in the harness/stub layer
- the test unit itself stayed small: request path plus expected value/error
- iOS now also passes after fixing the lab wiring
- this means the mock-pressure question itself is not blocked by a WKWebView boundary

### `lab12`

Isolated the local HTTP seam:

- iOS bundled file-loaded `WKWebView` successfully reached a local HTTP stub
- `127.0.0.1`, `localhost`, and host LAN IP all worked on iOS
- Android did not mirror the same seam-only result:
  - `10.0.2.2`, `localhost`, and host LAN IP all failed with `Failed to fetch`
- this seam diagnosis still helped rule out a false iOS boundary while also surfacing a platform-specific Android seam difference

### `lab13`

Proved stream closure validation:

- both hosts validated a longer stream, not just a short fixed sequence
- both hosts passed the normal stream:
  - `boot -> open -> data:1 -> data:2 -> data:3 -> closed`
- both hosts detected an illegal late event after `closed`
- this pushes the method further toward real stream/lifecycle contract checking

### `lab14`

Proved deeper plugin-facing bridge-backed listener behavior:

- both hosts validated real `Todo.addListener('statusChange', ...)`
- both hosts passed:
  - `reset()` emits `init -> idle`
  - `setOptions()` stays silent
  - `remove()` keeps a later `reset()` silent
- both hosts also detected an injected listener regression in the fault variant

### `lab15`

Measured plugin-facing archetype coverage through the real bridge:

- both hosts confirmed that `checkPermissions()` is bridged and returns the expected permission shape
- both hosts confirmed that `getAvailability()` is bridged and returns the expected availability shape
- both hosts confirmed that `openSession()` is bridged, but currently fails on microphone permission
- both hosts confirmed that `closeSession()` is bridged and surfaces invalid-token errors
- this means permission, availability, and session archetypes are all present at the real plugin-facing bridge layer

### `lab16`

Explored the long-term manifest shape:

- both hosts passed a mixed manifest that combined:
  - value-return calls
  - expected-error calls
  - listener sequences
- both hosts also detected injected regressions in the value and listener cases
- this suggests the long-term manifest does not need to become a giant free-form DSL
- a small family of semantic case kinds is currently enough to express mixed plugin-facing scenarios

### `lab17`

Explored how a toolchain entrypoint could absorb platform adapters:

- one thin runner drove both iOS and Android through the same adapter protocol
- the adapter contract stayed intentionally small:
  - `prepare`
  - `run normal`
  - `run fault`
- the adapters handled build, launch, and result-file reading
- the caller only selected adapters, mode, and aggregated normalized JSON
- this suggests `captool` can stay compact if platform execution details remain behind thin adapter boundaries

### `lab18`

Explored real permission-state transitions under external OS control:

- both hosts were driven through external `grant` / `revoke`
- neither host mapped those toggles cleanly into the plugin-facing permission contract
- both hosts stayed at `prompt` in all four runs
- both hosts also showed the same surprising split:
  - after external `grant`, `openSession()` still failed on microphone permission
  - after external `revoke`, `openSession()` unexpectedly succeeded
- this turns the permission question into a sharper seam problem:
  - external OS permission control is not yet enough by itself to produce trustworthy app-facing permission-state tests in this host-lab shape

### `lab19`

Explored deeper storage-backed behavior:

- both hosts passed `seed`
- both hosts passed `corrupt`
- iOS also passed `verify`, which means persisted JSON survived relaunch in this lab shape
- Android failed `verify` with `missing`
- this surfaces a new platform seam:
  - local storage persistence across relaunch is not currently symmetric between iOS and Android in the host-backed setup

### `lab20`

Explored WebSocket reconnect semantics:

- both hosts passed the normal reconnect flow
- the server closed the first socket after a successful response
- both hosts then reconnected and successfully completed the second request
- both hosts also detected the fault variant:
  - the client reused a closed socket instead of reconnecting
  - the runner surfaced this as `socket not open (3)`
- this pushes WebSocket coverage from simple request/response into connection lifecycle semantics

### `lab21`

Explored the plugin-facing `requestPermissions()` seam:

- both hosts proved that the unsupported-permission branch is real:
  - `requestPermissions({ permissions: ['camera'] })` crossed the bridge and surfaced the expected error
- Android also produced a concrete normal-path result:
  - `checkPermissions()` stayed `prompt`
  - `requestPermissions({ permissions: ['microphone'] })` still yielded `prompt`
  - `openSession()` remained blocked on microphone permission
- iOS did not mirror that normal-path behavior:
  - the page loaded
  - the native message handler existed
  - but the real microphone-request path did not push a final result
- this turned the permission question into a sharper iOS seam problem rather than a bridge-existence problem

### `lab22`

Isolated the iOS plugin-facing `requestPermissions()` normal path:

- the real microphone-request path still failed to push a final result
- the page loaded and the native message handler existed
- this narrowed the problem further:
  - the seam was on the real microphone-request path itself
  - not on the unsupported-permission path
  - and not on whether the bridge existed

### `lab23`

Removed the plugin layer and probed direct `getUserMedia({ audio: true })`:

- the same missing-result behavior remained
- this ruled out `plugin.js` as the primary source of the remaining iOS permission/media problem
- the suspected seam moved below the plugin layer into the `WKWebView` media-permission runtime path

### `lab24`

Isolated the iOS `getUserMedia({ audio: true })` seam below the plugin layer:

- the page loads
- the JS probe starts
- heartbeats tick briefly
- the probe reaches `gum:start`
- but no final JS result is pushed back to the native host
- this means the remaining iOS permission/media problem is now narrowed below `plugin.js`
- the current evidence points at a `WKWebView` media-permission runtime seam rather than a plugin-facing bridge seam

### `lab25`

Measured whether iOS JS progress freezes after `getUserMedia({ audio: true })` starts:

- the page does not freeze after `gum:start`
- JS heartbeats continue to advance
- scheduled `setTimeout(...)` breadcrumbs at `500ms`, `1000ms`, `2000ms`, and `4000ms` all still fire
- the route eventually reports `getUserMedia:timeout:4500`
- this narrows the iOS seam again:
  - it is not a general `WKWebView` event-loop freeze
  - it is a pending `getUserMedia({ audio: true })` path inside this host-backed probe shape

### `lab26`

Compared `localStorage` and `IndexedDB` across relaunch:

- both hosts passed `seed`
- both hosts also passed the combined `verify`
- this means the relaunch problem from `lab19` is not a blanket browser-persistence failure
- both hosts preserved the `IndexedDB` path strongly enough for the combined backend verification to pass
- this narrows the earlier Android storage seam:
  - the remaining suspicion is now more specific to `localStorage`
  - not to WebView persistence as a whole

### `lab27`

Re-checked `localStorage` across pure relaunch without reinstall:

- both hosts passed `seed`
- both hosts also passed `verify`
- this means the Android failure from `lab19` is not a pure relaunch problem
- `localStorage` survives when the app is only force-stopped and relaunched
- this pushes the earlier Android storage seam into a narrower place:
  - the problematic shape is tied to the heavier reinstall/redeploy path
  - not to relaunch alone

### `lab28`

Checked the heavier reinstall/redeploy shape directly:

- Android reproduced the earlier `missing` result when `seed` and `verify` were separated by uninstall/reinstall
- iOS did not mirror that result; its `verify` still passed after reinstall in this lab shape
- this sharpens the remaining storage seam once more:
  - the problematic condition is now specifically tied to Android under reinstall/redeploy
  - it is no longer explained by relaunch alone or by a blanket persistence failure

### `lab29`

Explored HTTP retry semantics:

- both hosts validated retry-after-`503`
- both hosts also detected the no-retry fault variant
- timeout retry is not symmetric:
  - iOS passed the retry-timeout case
  - Android still timed out on that same case
- this sharpens the HTTP seam:
  - retry-after-response and retry-after-timeout are not interchangeable
  - timeout retry behavior can still diverge by platform and execution shape

### `lab30`

Retested timeout retry with explicit abort:

- both hosts passed the normal retry suite
- both hosts still failed the non-aborting fault variant
- this sharply narrowed the `lab29` seam:
  - Android retry-after-timeout is viable when the timed-out request is explicitly aborted
  - the earlier Android failure was caused by the non-aborting timeout shape, not by retry itself

### `lab31`

Explored WebSocket idle-timeout reconnect behavior:

- both hosts passed the normal idle-timeout reconnect flow
- the server left the socket open after the first response, then later closed it because of idleness
- both hosts reconnected and successfully completed the second request after idle expiry
- both hosts also detected the fault variant:
  - the client tried to reuse a stale socket after idle timeout
  - the runner surfaced this as `socket not open (3)`
- this pushes WebSocket coverage beyond reconnect-after-response-close into reconnect-after-idle-expiry

### `lab32`

Separated update-install from true reinstall for storage persistence:

- both hosts passed `seed`
- both hosts also passed `verify` after update install
- both hosts failed `verify` after a true uninstall/reinstall
- this resolves the ambiguity left by `lab28`:
  - the important seam is deployment shape
  - not an iOS-versus-Android persistence difference by itself
- the storage picture is now cleaner:
  - relaunch is fine
  - update redeploy is fine
  - true reinstall wipes app-local storage on both hosts

### `lab33`

Explored HTTP fallback-after-network-failure behavior:

- both hosts passed the normal fallback flow
- the client first tried an unreachable primary origin
- both hosts then switched to the reachable fallback origin and completed the request
- both hosts also detected the fault variant where no fallback was attempted
- the failure wording is not identical:
  - iOS surfaces `Load failed`
  - Android surfaces `Failed to fetch`
- this pushes HTTP coverage beyond retry and into origin fallback behavior

### `lab34`

Explored WebSocket protocol-failure behavior:

- both hosts passed the normal flow
- valid frames still succeeded
- malformed frames were surfaced as a protocol parse error
- both hosts also detected the fault variant where malformed frames were silently accepted
- this pushes WebSocket coverage beyond reconnect and idle timeout into protocol-failure semantics

### `lab35`

Rechecked the stripped-down Android HTTP seam with only `10.0.2.2`:

- the Android seam-only host successfully reached the local HTTP stub through `10.0.2.2`
- the returned payload showed `ok: true`, `status: 200`
- this means the earlier `lab12` divergence was not "Android cannot use `10.0.2.2` from a file-loaded WebView"
- the narrower seam is now:
  - `localhost` and host LAN IP remain bad seam targets in this stripped-down emulator shape
  - `10.0.2.2` itself is viable

### `lab36`

Compared the direct Android WebView media seam with the earlier iOS result:

- Android exposes `navigator.mediaDevices` and `getUserMedia`
- the direct audio request does not stay pending
- instead it fails quickly with `Could not start audio source`
- this means the stubborn pending behavior from `lab25` is not a general hybrid/WebView property
- the remaining hard seam is now much narrower:
  - the pending path is specific to the iOS `WKWebView` route we have been probing
  - Android's direct WebView media path remains observable and fails fast

## Open questions

These are still not settled and should only be explored through new labs:

- deeper plugin-facing bridge-backed hook behavior
- native/adapter seam complexity versus fake-boundary pressure
- why the stripped-down Android `lab12` seam shape fails even though broader Android HTTP-backed labs pass
- deeper HTTP-backed scenarios such as timeout, malformed payloads, non-200 responses, retry, fallback, and offline handling
- deeper WebSocket scenarios such as protocol failure and richer stream semantics
- deeper storage-backed scenarios such as quota and sandbox edge cases
- real permission-state transition testing beyond simple external `grant` / `revoke`
- why iOS `getUserMedia({ audio: true })` stays pending in this host-backed `WKWebView` probe shape even though normal JS timing continues

## Suggested next order

If experiments continue one at a time, the current best order is:

1. permission seam follow-up
2. deeper HTTP edge cases
3. deeper WebSocket edge cases
4. deeper plugin-facing bridge behavior

## Cleanup rule

Labs may keep source, config, and short readmes.

Labs must not keep bulky generated artifacts after a result has been recorded:

- Xcode `DerivedData`
- Gradle `.gradle`
- Gradle `build`
- app module `build`
- temporary `node_modules`
- simulator/emulator output that can be regenerated

Those artifacts are ignored in git and should be removed after each experiment round.
