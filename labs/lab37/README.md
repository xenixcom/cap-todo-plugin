# Lab 37

This lab checks whether the iOS pending `getUserMedia({ audio: true })` seam is caused by missing `WKUIDelegate` media-capture permission handling.

The host is copied from `lab25`, but the iOS `WKWebView` now also:

- sets `uiDelegate`
- implements `webView(_:requestMediaCapturePermissionFor:initiatedByFrame:type:decisionHandler:)`
- explicitly grants the requested capture permission

## Result

- iOS:
  - `{"status":"fail","detail":"hasMediaDevices=true; hasGetUserMedia=true; visibility=visible; gum=resolved; tracks=1; tracksStopped=true; heartbeat=0; breadcrumbs=6:load|9:gum:start|13:window.pageshow|224:gum:resolved|226:tracks:stopped"}`

## Conclusion

- The earlier iOS pending seam is not an unavoidable `WKWebView + getUserMedia(audio)` hard boundary.
- In this host-backed shape, the missing piece was explicit `WKUIDelegate` media-capture permission handling.
- Once the host grants media capture through the delegate callback:
  - `getUserMedia({ audio: true })` resolves
  - an audio track is created
  - the track can be stopped cleanly
- This sharply narrows the remaining permission/media risk:
  - the iOS seam is now a host-configuration requirement, not a core-method blocker.
