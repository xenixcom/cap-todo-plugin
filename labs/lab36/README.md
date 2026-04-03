# Lab 36

This lab explores the direct Android WebView `getUserMedia({ audio: true })` seam.

The question is:

- without the plugin layer
- in a file-loaded Android WebView host
- does direct audio `getUserMedia` stay pending, reject, or resolve

This lab mirrors the `lab25` question, but on Android.

## Result

- Android:
  - `{"status":"fail","detail":"hasMediaDevices=true; hasGetUserMedia=true; visibility=visible; gum=Could not start audio source; heartbeat=0; breadcrumbs=14:load|17:gum:start|20:window.pageshow|159:gum:error:Could not start audio source"}`

## Conclusion

- Android does not mirror the iOS pending seam from `lab25`.
- In this host-backed Android WebView shape:
  - `navigator.mediaDevices` exists
  - `getUserMedia({ audio: true })` exists
  - the call does not disappear into a pending black hole
  - it fails quickly with `Could not start audio source`
- This sharpens the remaining media-permission seam:
  - the pending behavior is currently specific to the iOS `WKWebView` path we have been probing
  - Android's direct WebView media path is observable and fails fast instead of stalling
