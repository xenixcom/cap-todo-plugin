# Lab 35

This lab rechecks the stripped-down Android HTTP seam.

The question is:

- in the most minimal file-loaded Android WebView probe
- does `http://10.0.2.2:<port>` actually work when isolated from the extra seam targets

This lab intentionally only keeps one target:

- `10.0.2.2`

## Result

- Android:
  - `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"ok\":true,\"status\":200,\"payload\":{\"ok\":true,\"from\":\"lab12\"}}]"}`

## Conclusion

- `10.0.2.2` itself is not the Android seam problem.
- In the stripped-down Android file-loaded WebView shape, `10.0.2.2` reaches the local HTTP stub successfully and returns `200`.
- This means the earlier `lab12` Android divergence was broader than a simple "Android cannot use `10.0.2.2`" story.
- The remaining split is narrower:
  - `localhost` and host LAN IP are still bad seam targets in this stripped-down Android emulator shape
  - but the emulator-host mapping itself is viable
