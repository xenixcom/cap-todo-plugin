# iOS Plugin Hook Host Lab

This lab is the iOS counterpart to the Android plugin-hook probe.

It proves:

- iOS app host launches
- `WKWebView` loads bundled local HTML/JS assets
- the bundled page loads real `capacitor.js` and the repo's built `plugin.js`
- the page calls the exported `Todo` JS API
- the host receives the aggregate result through `WKScriptMessageHandler`
- the host writes a probe file

Expected result file inside app-private storage:

- `Documents/wkwebview-plugin-archetype-probe.json`

Observed payloads:

- normal:
  - `{"status":"fail","detail":"permission_shape: ok; availability_shape: ok; open_session: error Microphone permission is required; close_session_invalid_token: error Unknown session token"}`
