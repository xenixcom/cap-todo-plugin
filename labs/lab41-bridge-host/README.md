# Lab 41

This lab re-checks the plugin-facing route inside a true Capacitor native bridge host.

## Why this lab exists

Earlier plugin-facing labs proved a lot:

- app-facing plugin contracts can be exercised inside host-backed WebView probes
- listeners, flows, sequences, and state coherence can be validated on both platforms

But there was still one large doubt:

- the repo's built `dist/plugin.js` registers a `web` implementation
- so those labs strongly proved the app-facing contract layer
- but they did not yet prove the same layer inside a true native Capacitor bridge host

This lab removes that doubt.

## Shape

The lab copies the existing Capacitor demo host into `labs/lab41-bridge-host` and replaces the bundled page with a very small probe.

The probe page:

- loads `capacitor.js`
- uses `registerPlugin('Todo')`
- does not import `dist/plugin.js`
- checks for native plugin headers
- calls:
  - `Todo.checkPermissions()`
  - `Todo.echo({ value: 'bridge-echo' })`

The hosts then poll `window.__probeResult` and write a result file.

## Result

Android:

- `{"status":"ok","detail":"native=true; header=true; permission=prompt; echo=bridge-echo"}`

iOS:

- `{"status":"ok","detail":"native=true; header=true; permission=prompt; echo=bridge-echo"}`

## Conclusion

This lab proves that the route is valid inside a true native Capacitor bridge host.

That matters because it removes the strongest remaining doubt around the method:

- the host-backed route is not limited to generic WebView probes
- it is not limited to plugin-facing JS fallback shapes
- it also works when the host is a real Capacitor bridge host and the page depends on native plugin headers
