# Reading Notes

This file records the most useful findings from reading official platform documentation after `lab1` through `lab64`.

Its purpose is simple:

- do not rediscover the same native/platform facts over and over
- keep a clear boundary between:
  - what the platform already provides
  - what our labs proved
  - what still needs new investigation

This is a companion to:

- [README.md](/Users/james/dev2/cap-todo-plugin/labs/README.md)
- [INVENTORY.md](/Users/james/dev2/cap-todo-plugin/labs/INVENTORY.md)
- [NATIVE_CAPABILITY_MAP.md](/Users/james/dev2/cap-todo-plugin/labs/NATIVE_CAPABILITY_MAP.md)

## Reading Summary

The main pattern is now clear:

- many low-level capabilities were already present in native/platform APIs
- what was missing was not raw capability
- what was missing was:
  - integration
  - formal layering
  - adapter discipline
  - a non-UI-driven testing route organized around app-facing behavior

## 1. WebView Does Have Native Self-Test Entrypoints

The early intuition was correct:

- systems as large as `WebView` / `WKWebView` cannot realistically depend only on hand-testing or UI automation
- the platform already exposes many non-UI primitives for host/runtime interaction

Concrete examples:

- iOS:
  - `WKWebView.evaluateJavaScript(...)`
  - `WKScriptMessageHandler`
- Android:
  - `WebView.evaluateJavascript(...)`
  - `addJavascriptInterface(...)`
  - newer WebKit AndroidX message APIs

What the labs added:

- proof that these primitives can be composed into a coherent cross-platform testing route

## 2. Android Has More "Official" Modern WebView Paths Than We First Used

Important finding:

- `addJavascriptInterface(...)` is not the best long-term Android bridge story

Android official guidance now prefers:

- `WebViewCompat.addWebMessageListener(...)`
- `WebViewCompat.postWebMessage(...)`
- `JavaScriptReplyProxy`

Why this matters:

- it gives origin-aware messaging
- it is better aligned with a formal adapter design
- it suggests our labs validated the route, but the eventual Android adapter should likely upgrade to the newer messaging path

Practical note:

- our current labs using `addJavascriptInterface` were still useful
- they validated method viability
- but they do not necessarily define the final Android adapter implementation

What `lab62` added:

- `addWebMessageListener` is a practical host-backed primitive, not just a documentation hint
- it successfully carries results back to native in the upgraded Android host shape
- but it does **not** automatically erase the earlier stripped HTTP seam

So the refined takeaway is:

- it remains a strong formal Android adapter candidate
- but bridge modernization should not be confused with seam removal

## 3. Android Official Docs Also Point Toward Better Local Content Loading

Another important finding:

- Android docs strongly push local content toward:
  - `WebViewAssetLoader`
  - `https://appassets.androidplatform.net/...`

Why this matters:

- many stripped seam labs were built on `file://` / asset-loaded shapes
- official guidance suggests a more formal Android adapter should prefer HTTP-like app asset loading instead of long-term reliance on raw file origins

This may reduce or simplify seams around:

- `localhost`
- `10.0.2.2`
- origin behavior
- messaging access control

Important implication:

- some of our stripped Android seam labs may be diagnosing a temporary probe shape rather than the best final adapter shape

What `lab61` added:

- `WebViewAssetLoader` is also not a magic seam eraser
- the stripped `10.0.2.2 + localhost` failure still survives under:
  - `https://appassets.androidplatform.net/...`

So the refined takeaway is:

- `WebViewAssetLoader` still looks like the more official Android local-content route
- but not every seam was just a `file://` artifact

## 4. Android Permission Testing Already Has Strong Tooling Hooks

Key findings:

- `adb install -g`
- `pm grant`
- `pm revoke`
- permission flags

These mean:

- Android permission-sensitive testing does not necessarily require manual UI tapping
- the platform already gives repeatable permission-state control primitives

The labs then clarified:

- `pm grant` is a better normalized adapter strategy than always using blanket `install -g`

So the reading takeaway is:

- permission automation is not a hack here
- it is compatible with platform-native tooling

More concretely, the following `adb shell pm` capabilities already map well to adapter responsibilities:

- `install -g`
  - coarse-grained blanket runtime permission grant
- `grant <package> <permission>`
  - narrower permission-specific grant
- `revoke <package> <permission>`
  - explicit deny
- permission flags such as `user-set` / `user-fixed`
  - closer simulation of user denial state
- `uninstall`
  - useful for reinstall/redeploy seam testing

So for Android, `adb` is not just a convenience tool.
It is effectively part of the adapter control surface.

## 4.1 iOS Simulator Already Has Matching Host-Control Primitives

Key findings from `simctl`:

- `install`
- `uninstall`
- `launch`
- `terminate`
- `get_app_container`
- `privacy grant / revoke / reset`
- `spawn`
- `diagnose`

Why this matters:

- these are exactly the kinds of operations our host-backed labs repeatedly needed
- that means iOS simulator-side control is also already exposed as CLI primitives

Most relevant examples:

- `simctl privacy booted grant microphone <bundle-id>`
- `simctl privacy booted revoke microphone <bundle-id>`
- `simctl privacy booted reset microphone <bundle-id>`
- `simctl get_app_container booted <bundle-id> data`

Important caution:

- the `simctl privacy` help explicitly warns that forcing permissions can mask bugs if the app is not also correctly configured
- so these commands are strong adapter tools, but they do not replace proper host/runtime validation

The reading takeaway is:

- for iOS simulator, `simctl` is not just a convenience wrapper
- it is also part of the practical adapter control surface

## 5. Android Permission/Media Paths Depend On More Than Just "Did We Write A Callback"

Important doc detail:

- `WebChromeClient.onPermissionRequest(...)` has secure-origin implications

Why this matters:

- media/permission behavior is not only about callback wiring
- origin/load shape can matter too

This aligns with what the labs showed:

- some permission/media seams were not random
- they were tied to host/runtime shape

## 6. iOS Media Permission Was Not A Hard `WKWebView` Wall

Docs plus labs now line up clearly:

- the iOS media permission path was not fundamentally blocked by `WKWebView`
- the real missing piece was host-side media-capture permission handling

Practical lesson:

- when something looks like a deep WebView limit, first check host delegate/configuration responsibilities
- do not jump too quickly to "the platform cannot do this"

## 7. iOS Has Underused Formalization Candidates

Two important iOS APIs now stand out for future work:

- `WKURLSchemeHandler`
- `WKContentWorld`

Why `WKURLSchemeHandler` matters:

- custom resource serving
- possible alternative to some local HTTP stub shapes
- more formal, native-controlled fixture/resource injection

What `lab63` added:

- `WKURLSchemeHandler` does successfully serve:
  - page HTML
  - bundled JS harness assets
- but the earlier green local HTTP seam from `loadFileURL` does **not** carry over unchanged

So the refined takeaway is:

- `WKURLSchemeHandler` is promising
- but it is not a drop-in replacement for every existing file-loaded iOS probe shape

Why `WKContentWorld` matters:

- cleaner isolation between:
  - app JS
  - injected harness JS
  - host helper JS

This suggests the eventual iOS adapter may be able to become cleaner than the current experimental shape.

What `lab64` added:

- this is a real practical isolation primitive
- the page world can stay clean while host helper code runs in a named world
- intentionally moving the helper back into `.page` makes the contamination immediately visible

So the refined takeaway is:

- `WKContentWorld` is one of the strongest formal-adapter upgrade candidates we have found

## 8. There Is A Difference Between "Primitive Exists" And "Method Exists"

This is the most important conceptual reading takeaway.

It would be wrong to say:

- "the platform already had everything, so the work was obvious"

It would also be wrong to say:

- "we invented new low-level WebView capability"

The more accurate view is:

- the platforms already had many primitives
- but a coherent method did not come pre-packaged
- the labs were necessary to prove:
  - which primitives mattered
  - which assumptions were false
  - which seams stayed above or below the formal layer

## 9. What Reading Already Helped Correct

Reading already corrected several earlier misconceptions or fuzzy fears:

- permission testing is not necessarily UI-bound
- host-backed WebView interaction is not necessarily forced through UI automation
- media permission failures can come from host configuration, not platform impossibility
- Android has more modern messaging APIs than the first working lab route
- local content loading should probably be revisited with more official shapes
- some official-shape upgrades improve adapter cleanliness without automatically erasing every seam

## 10. What To Avoid Re-Digging Without New Reason

These should now be treated as known baseline facts unless a new contradiction appears:

- host-backed non-UI WebView testing is possible
- Android permission grant/deny can be toolized
- iOS deny needs host callback participation when media capture is involved
- Android `addJavascriptInterface` is viable for experiments but not necessarily ideal for final design
- `localhost` is the special stripped Android seam target, not host LAN IP
- `WKContentWorld` is already backed by a successful isolation probe, not just by docs

## 11. Most Promising "Read More" Directions

If more reading is useful later, these are the most promising next directions:

- Android:
  - `WebViewAssetLoader`
  - `addWebMessageListener`
  - `addDocumentStartJavaScript`
- iOS:
  - `WKURLSchemeHandler`
  - `WKContentWorld`
  - related WebKit host configuration around permissions and navigation restrictions

These are the places most likely to improve the eventual formal adapter design.

Current evidence after `lab61` through `lab64` sharpens that list:

- strongest positive upgrade candidate:
  - `WKContentWorld`
- strong but not drop-in candidates:
  - `WebViewAssetLoader`
  - `addWebMessageListener`
  - `WKURLSchemeHandler`

## 12. Hardware Reading Direction Is Different From WebView Reading

Another important shift became clear while reading:

- hardware-adjacent testing should not be treated as one single problem

Instead, each capability needs its own classification:

- toolized live
- adapter fake
- device-required

This is why hardware should be read first, not rushed into labs.

### Location / GPS

Reading indicates:

- Android Emulator already has strong location simulation support
- iOS Simulator also exposes strong location simulation control
- `simctl location` is richer than a simple static coordinate:
  - `set`
  - `clear`
  - `run`
  - waypoint interpolation

So location is one of the best candidates for future formal adapter support.

### Camera

Reading indicates:

- Android Emulator has documented camera emulation paths
- Apple Simulator guidance still implies camera realism is weaker than on device

So camera likely splits into:

- toolizable contract-level behavior
- device-required media realism

### Sensors

Reading indicates:

- Android Emulator has especially rich extended controls for sensor-like inputs
- this makes Android a strong candidate for toolized live sensor testing

So sensor-heavy futures should likely start from Android reading first.

### Bluetooth / BLE

Reading indicates:

- Bluetooth is not "untestable"
- but it is also not as cleanly toolized as permissions or location
- Apple provides Bluetooth-related tooling and adjacent simulators, but not a simple universal simulator story

So BLE likely remains a mixed category:

- some adapter fake
- some tooling
- some device truth

## 13. Important Retrospective Lesson

The more we read after the labs, the clearer one pattern becomes:

- when a seam feels impossible, it is often worth asking:
  - "is this truly unsupported?"
  - or
  - "has the platform already documented a safer or more official route?"

This is exactly what happened with:

- permission control
- host media wiring
- Android messaging paths
- local content loading

So future work should keep the same discipline:

- read first
- then design
- then experiment

not the other way around by default

## Short Conclusion

The experiments gave us roots.

The reading gave us a map.

Together they now support a more mature conclusion:

- the platforms already provide many of the building blocks
- our real contribution is the organization of those blocks into a formal, host-backed, non-UI-driven testing route for hybrid/plugin work
