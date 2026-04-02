# Lab 25

This lab isolates whether iOS `WKWebView` timers keep running after `getUserMedia({ audio: true })` starts.

The question is:

- after `gum:start`
- do JS heartbeats keep advancing
- do scheduled `setTimeout(...)` breadcrumbs still fire
- or does the media-permission path freeze the page's observable JS progress

This lab intentionally skips the plugin layer.

## Result

- iOS:
  - `{"status":"fail","detail":"hasMediaDevices=true; hasGetUserMedia=true; visibility=visible; gum=getUserMedia:timeout:4500; heartbeat=17; breadcrumbs=4:load|9:gum:start|13:window.pageshow|501:timeout:500|1001:timeout:1000|2001:timeout:2000|4001:timeout:4000|4515:gum:error:getUserMedia:timeout:4500"}`

## Conclusion

- The page does not freeze after `gum:start`.
- JS heartbeats continue to advance.
- Scheduled `setTimeout(...)` breadcrumbs at `500ms`, `1000ms`, `2000ms`, and `4000ms` all still fire.
- The route eventually reports `getUserMedia:timeout:4500`.
- This means the remaining iOS seam is more precise than a general `WKWebView` event-loop freeze:
  - `getUserMedia({ audio: true })` remains pending in this host-backed probe shape while ordinary JS progress continues.
