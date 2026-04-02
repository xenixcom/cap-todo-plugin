# Host-Backed WebView Testing Plan

This note defines the next probe after the failed pure-package `WKWebView`
 experiment.

## Decision

Start with `iOS`, not Android.

Reason:

- the failure mode is already concrete on iOS
- the missing piece is now clear: a host-backed test bundle with
  `UIApplication`
- this is the shortest path to proving whether app-facing WebView JS testing is
  viable

Android should be studied in parallel, but not implemented first.

## What Failed

The first spike used:

- `XCTest`
- pure package test target
- `WKWebView`
- `loadHTMLString(...)`
- `evaluateJavaScript(...)`

Build succeeded, but the test never completed page load.

Observed runtime signal:

- `This process does not have a UIApplication object and will not receive events!`

Current conclusion:

- the problem is not `evaluateJavaScript`
- the problem is the host shape

## Next Probe

Use an app-hosted iOS test bundle.

Desired shape:

1. real iOS host app process
2. `UIApplication` exists
3. test code owns a `WKWebView`
4. load tiny HTML/JS
5. call:
   - `window.__test__.add(1, 2)`
6. assert `3`

## Minimal Scope

Do not include:

- Capacitor plugin calls
- bridge listeners
- permissions
- event streams
- Android implementation
- shared test generation

Only prove:

- host -> WebView -> JS
- JS result -> host

## iOS Target Shape To Research

- app-hosted XCTest bundle
- smallest possible host app
- how to keep it UI-light
- whether the test can create and own `WKWebView` directly
- whether a hidden or non-user-visible host window is enough

## Current Repo Host Candidate

The most natural host inside this repo is:

- `demo/ios/App`

Reason:

- it already has a real iOS app process
- it already has `@UIApplicationMain`
- it already exists as the Capacitor demo host

Current limitation observed in repo structure:

- `demo/ios/App/App.xcodeproj` currently has only the `App` target
- there is no app-hosted test bundle yet

So the next engineering step is not:

- extend the current pure package tests

It is:

- add an app-hosted XCTest target to `demo/ios/App`
- make that target own a minimal `WKWebView` probe

## Android Follow-Up

Once the iOS host-backed path is proven or disproven, compare against:

- `WebView.evaluateJavascript(...)`
- `addJavascriptInterface(...)`
- `Espresso-Web`

Android remains the second step, not the first.

## Exit Criteria

This spike only needs to answer one question:

Can a native host-backed test reliably call JavaScript inside a WebView and get
the result back without falling into a second full testing standard?

If yes:

- move toward plugin-facing probes

If no:

- stop trying to treat host-backed WebView testing as the future formal path
