# Lab 39

This lab explores native/adapter seam complexity versus fake-boundary pressure.

The question is:

- can native-side fake state stay inside the host adapter
- without leaking mock description into the formal test unit

This lab intentionally does **not** use the plugin layer.

Instead, each host injects one native fixture object before the page runs:

- iOS:
  - `WKUserScript` at document start
- Android:
  - `WebViewClient.onPageFinished(...)` injects `window.__nativeFixture__`

The test unit stays very small:

- one path
- one expected value

The native fixture has two adapter-owned variants:

- normal
  - microphone granted
  - availability enabled
  - session open allowed
- fault
  - microphone denied
  - availability disabled
  - session open blocked

## Result

Observed payloads:

- iOS normal:
  - `{"status":"ok","detail":"pass"}`
- iOS fault:
  - `{"status":"fail","detail":"permission_granted: expected granted got denied; availability_enabled: expected true got false; session_open_allowed: expected true got false"}`
- Android normal:
  - `{"status":"ok","detail":"pass"}`
- Android fault:
  - `{"status":"fail","detail":"permission_granted: expected granted got denied; availability_enabled: expected true got false; session_open_allowed: expected true got false"}`

## Conclusion

- native fake-boundary pressure can stay in the adapter/host layer
- the formal test unit still stayed small:
  - path
  - expected value
- iOS and Android both support the same split:
  - host injects native fixture
  - runner stays generic
  - cases stay declarative and thin
- this is a positive result against the fear that native seams would force mock syntax back into the formal manifest
