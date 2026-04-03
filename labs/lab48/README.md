# Lab 48

This lab revisits the stripped-down Android HTTP seam with explicit per-request timeout and abort.

## Why this lab exists

`lab12` showed an awkward stripped-down split:

- Android returned only failures for:
  - `10.0.2.2`
  - `localhost`
  - host LAN IP

Later labs narrowed that picture:

- `lab35` proved `10.0.2.2` itself is viable

So one remaining suspicion is:

- the broader three-target shape may be getting distorted by hanging targets

## Shape

This lab keeps the `lab12` Android host and the same three targets:

- `10.0.2.2`
- `localhost`
- host LAN IP

The only behavior change is:

- each `fetch` gets a short timeout
- timed-out requests are explicitly aborted

That forces the runner to finish with a full diagnostic result instead of hanging behind one bad target.

## Result

Observed result:

- `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"error\":\"Failed to fetch\"},{\"id\":\"localhost_name\",\"error\":\"Failed to fetch\"},{\"id\":\"host_lan_ip\",\"error\":\"timeout\"}]"}`

## Conclusion

This does **not** collapse the `lab12` split into a simple timeout/race story.

The timeout wrapper made the seam easier to read, but the result still shows:

- `10.0.2.2` fails in this stripped three-target shape
- `localhost` also fails
- host LAN IP hangs long enough to become a timeout

So the narrower conclusion is:

- `lab35` still proves `10.0.2.2` is viable in a single-target stripped probe
- but `lab48` shows the broader stripped multi-target shape is still genuinely unstable on Android
- this is a real stripped-shape seam, not just a missing timeout in the runner
