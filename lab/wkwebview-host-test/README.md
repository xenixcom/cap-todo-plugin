# WKWebView Host Test Spike

This lab is a minimal feasibility probe.

Goal:

- verify that an iOS host test can create a `WKWebView`
- load a tiny HTML/JS page
- call JS directly from XCTest
- read the JS result back without using UI automation

This is not a plugin test yet.
It is only the smallest probe for:

- host -> WebView -> JS
- JS result -> host

The first case is intentionally trivial:

- `window.__test__.add(1, 2) === 3`

If this path fails, there is no point trying to lift formal contract tests into
the WebView host layer.

If this path works, the next spike can decide whether to:

- load a richer local page
- load the real app bundle
- or try a plugin-facing contract call

## First Result

Attempted in:

- `ios/Tests/TodoPluginTests`
- package test target
- `xcodebuild test`

Probe used:

- create `WKWebView` in XCTest
- `loadHTMLString(...)`
- wait for navigation finish
- call `window.__test__.add(1, 2)` via `evaluateJavaScript`

Observed result:

- build passed
- test target launched
- page load never completed
- XCTest logged:
  - `This process does not have a UIApplication object and will not receive events!`

Current conclusion:

- `WKWebView + XCTest` is not enough inside the current pure package test target
- the next probe needs a real iOS host app / application-backed runtime
- this still supports the broader direction:
  - host-side JS testing remains plausible
  - but not from the current no-`UIApplication` package-test shape

## Second Result

Follow-up probe moved fully into:

- `lab/ios-wkwebview-host`

This app-hosted probe:

- boots an iOS app host
- creates a `WKWebView`
- loads inline HTML/JS
- evaluates:
  - `window.__test__.add(1, 2)`
- writes the result to:
  - `Documents/wkwebview-host-probe.json`

Observed result:

- app build succeeded
- app launched in the simulator
- result file was written successfully
- recorded payload:
  - `{"status":"ok","detail":"3"}`

Updated conclusion:

- the host-backed iOS path is viable
- the missing piece was the app-hosted runtime, not the JS call/return idea
- future work should continue inside `lab/`, not the mainline test structure

## Android Result

Follow-up probe now also exists in:

- `lab/android-webview-host`

This Android app-hosted probe:

- boots an Android app host
- creates a `WebView`
- loads inline HTML/JS
- evaluates:
  - `window.__test__.add(1, 2)`
- writes the result to:
  - `files/webview-host-probe.json`

Observed result:

- app build succeeded
- app launched in a headless emulator
- result file was written successfully
- recorded payload:
  - `{"status":"ok","detail":"3"}`

Final current conclusion:

- the host-backed WebView JS probe is viable on both iOS and Android
- the app-facing host -> WebView -> JS -> result path is no longer hypothetical
- the next decision is not feasibility, but how far to extend the probe toward
  plugin-facing contract cases

## Fault Injection Result

Both labs now also catch a deliberately broken `add()` implementation.

Observed payloads:

- iOS fault mode:
  - `{"status":"fail","detail":"expected 3 got -1"}`
- Android fault mode:
  - `{"status":"fail","detail":"expected 3 got -1"}`

This means the current labs do not only execute JS successfully.
They also detect a simple app-facing contract regression.
