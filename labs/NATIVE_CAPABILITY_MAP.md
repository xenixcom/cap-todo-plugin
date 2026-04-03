# Native Capability Map

This file maps three things side by side:

- native/platform capabilities that already exist
- what our labs actually proved on top of them
- where the real novelty is method integration rather than new low-level capability

It is a companion to:

- [README.md](/Users/james/dev2/cap-todo-plugin/labs/README.md)
- [INVENTORY.md](/Users/james/dev2/cap-todo-plugin/labs/INVENTORY.md)

## Why This File Exists

After `lab1` through `lab64`, one important retrospective question is:

- which parts were already supported by native primitives
- which parts were genuinely new engineering work

This matters because it prevents two opposite mistakes:

- underestimating the work by saying "the platform already had everything"
- overstating the novelty by pretending the low-level primitives did not already exist

## 1. Host -> WebView -> JS

Native/platform primitives:

- iOS:
  - `WKWebView.evaluateJavaScript(...)`
- Android:
  - `WebView.evaluateJavascript(...)`

What our labs proved:

- host-backed execution can use these primitives to run app-facing JS contracts
- this works for:
  - sync values
  - async values
  - bundled assets
  - scenario manifests

Relevant labs:

- `lab1`
- `lab3`
- `lab4`
- `lab6`

What is not "already solved" by the primitive itself:

- unified test-unit shape
- cross-platform adapter design
- result normalization
- scenario semantics

## 2. JS -> Native Host

Native/platform primitives:

- iOS:
  - `WKScriptMessageHandler`
- Android:
  - `addJavascriptInterface(...)`
  - `WebViewCompat.addWebMessageListener(...)`

What our labs proved:

- these primitives are sufficient to carry:
  - pushed results
  - ordered sequences
  - async completions
  - event-style notifications

Relevant labs:

- `lab2`
- `lab5`
- `lab13`
- `lab62`

What is not "already solved" by the primitive itself:

- formal result protocol
- cross-platform sequence assertions
- shared manifest runner behavior
- unrelated origin/network seams

## 3. Web Assets As Formal Test Carriers

Native/platform primitives:

- iOS:
  - bundled app resources loaded into `WKWebView`
- Android:
  - `file:///android_asset/...`
  - `WebViewAssetLoader`
  - `https://appassets.androidplatform.net/...`

What our labs proved:

- formal test units do not need to be hard-coded inside the host
- bundled HTML/JS assets can carry:
  - cases
  - runner
  - implementation variants
  - plugin-facing probes

Relevant labs:

- `lab4`
- `lab6`
- `lab16`
- `lab61`
- `lab63`

What is not "already solved" by the primitive itself:

- disciplined manifest design
- bounded case-kind growth
- keeping test units readable
- preserving every old seam behavior when the loading primitive changes

## 4. HTTP / WebSocket / Storage Runtime

Native/platform primitives:

- Web platform in WebView:
  - `fetch`
  - `WebSocket`
  - `localStorage`
  - `IndexedDB`

What our labs proved:

- host-backed formal testing can cover realistic runtime contracts:
  - HTTP success/error/fallback/retry
  - WebSocket reconnect/protocol failure
  - storage persistence/corruption/reinstall seams

Relevant labs:

- `lab7`
- `lab8`
- `lab9`
- `lab19`
- `lab20`
- `lab29`
- `lab30`
- `lab31`
- `lab33`
- `lab34`
- `lab26`
- `lab27`
- `lab28`
- `lab32`

What is not "already solved" by the primitive itself:

- repeatable stub/stress harnesses
- contract-oriented assertions
- cross-platform seam mapping

## 5. Media / Permission Request Wiring

Native/platform primitives:

- iOS:
  - `WKUIDelegate` media capture permission callback
  - Simulator `simctl privacy`
- Android:
  - `WebChromeClient.onPermissionRequest(...)`
  - `adb install -g`
  - `pm grant / revoke`

What our labs proved:

- permission/media testing does not require manual UI in every case
- the main requirement is correct host wiring plus repeatable system-permission strategy

Relevant labs:

- `lab37`
- `lab40`
- `lab45`
- `lab46`
- `lab47`
- `lab54`
- `lab58`

What is not "already solved" by the primitive itself:

- cross-platform formal permission contract design
- normalization of:
  - Android `denied`
  - iOS `prompt + blocked`

## 6. True Capacitor Bridge Host

Native/platform primitives:

- Capacitor native host runtime
- `capacitor.js`
- plugin headers / bridge registration
- plugin method dispatch

What our labs proved:

- the method is not limited to generic WebView toy probes
- it also works in:
  - Android `BridgeActivity`
  - iOS `CAPBridgeViewController`-style host

Relevant labs:

- `lab41-bridge-host`
- `lab44`
- `lab45`
- `lab46`
- `lab54`

What is not "already solved" by the primitive itself:

- formal plugin contract execution model
- thin toolchain orchestration
- adapter-level normalization

## 7. Toolized Adapter Layer

Native/platform primitives:

- none as a complete built-in solution

This is where the work becomes mostly ours.

What our labs proved:

- a thin top-level runner can orchestrate platform adapters
- adapters can absorb:
  - build/install
  - permission setup
  - launch
  - result-file lookup
- semantic normalization is cleaner inside adapters than in one shared parser layer

Relevant labs:

- `lab17`
- `lab39`
- `lab43`
- `lab56`
- `lab57`
- `lab60`

What is genuinely ours here:

- the split between:
  - one formal test unit
  - platform execution adapters
  - thin orchestrator
- the decision to demote private native tests to optional helpers
- the decision to keep mock/fake complexity below the formal unit

## 7.1 iOS Harness Isolation

Native/platform primitives:

- `WKContentWorld`
- `WKUserScript(..., in: WKContentWorld)`

What our labs proved:

- this is a real and useful isolation boundary
- page globals can remain clean while host helper code runs in a named world
- helper pollution becomes observable when the helper is intentionally moved back into `.page`

Relevant labs:

- `lab64`

What is not "already solved" by the primitive itself:

- full runner architecture
- naming/ownership conventions for helper worlds

## 8. Stripped Seam Diagnostics

Native/platform primitives:

- Android emulator host mapping:
  - `10.0.2.2`
- local networking in WebView

What our labs proved:

- the important seam is not "Android WebView cannot do local HTTP"
- the seam is much narrower:
  - `localhost` specifically interferes with the otherwise-good `10.0.2.2` mapping in the stripped Android shape

Relevant labs:

- `lab12`
- `lab35`
- `lab48`
- `lab49`
- `lab50`
- `lab51`
- `lab53`
- `lab55`

What is not "already solved" by the primitive itself:

- explanation of the exact root cause

This is a good example of a remaining adapter/runtime seam that does not undermine the overall method.

## What Was Already There vs What We Added

Already there:

- WebView execution primitives
- JS/native message bridge primitives
- permission control tooling
- emulator/simulator host controls
- Capacitor bridge host primitives

What we added:

- one coherent testing model across those primitives
- evidence that app-facing formal tests can stand above private native tests
- adapter/toolchain layering
- normalization strategy
- manifest discipline
- a seam map showing where platform differences still live

## Short Conclusion

The native platforms already provided many of the building blocks.

What was missing was not low-level capability.

What was missing was:

- method integration
- formal layering
- adapter discipline
- evidence that this route can replace the old assumption that hybrid/plugin testing must start from UI driving or private native tests
