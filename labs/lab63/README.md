# Lab 63

This lab checks whether `WKURLSchemeHandler` can replace file-loaded bundled pages without breaking the earlier iOS local HTTP seam.

## Why this lab exists

The current picture is:

- `lab12`: a bundled file-loaded page inside `WKWebView` can reach:
  - `127.0.0.1`
  - `localhost`
  - host LAN IP
- Apple provides `WKURLSchemeHandler` as a more formal way to serve local resources

So the next question is:

- if the page is loaded through a custom scheme handler instead of `loadFileURL`
- does the earlier iOS local HTTP seam stay green

## Shape

This lab keeps the `lab12` case list and HTTP stub unchanged.

The only intentional host-side change is:

- from `loadFileURL(...allowingReadAccessTo:)`
- to `WKURLSchemeHandler` serving:
  - `lab63://bundle/probe.html`
  - and the linked bundled JS assets

## Result

- iOS:
  - `{"status":"error","detail":"no pushed result after didFinish: {\"href\":\"lab63://bundle/probe.html\",\"hasTest\":\"undefined\",\"hasCases\":\"object\",\"hasImpl\":\"object\",\"hasProbe\":\"function\",\"hasMessageHandler\":true}"}` 

## Conclusion

`WKURLSchemeHandler` successfully serves:

- `probe.html`
- `cases.js`
- `impl.js`
- `runner.js`

But the earlier `lab12` local HTTP seam does **not** stay green under this shape.

So `lab63` narrows the iOS picture in a useful way:

- the custom-scheme route itself works
- the JS harness is present
- the message handler is present
- but replacing `loadFileURL` with `WKURLSchemeHandler` changes the network/runtime behavior enough that the earlier local HTTP seam no longer completes

This means:

- `WKURLSchemeHandler` remains a serious formal-adapter candidate
- but it is **not** a drop-in replacement for the `lab12` file-loaded seam shape
