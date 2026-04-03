# Lab 55

This lab checks whether `localhost` poisons the stripped Android shape globally or only poisons the emulator-host mapping.

## Why this lab exists

The current seam map says:

- `localhost + 10.0.2.2` breaks both targets
- `host LAN IP + 10.0.2.2` does **not** break `10.0.2.2`

That leaves one narrow question:

- does `localhost` poison any other external target in the stripped shape
- or is the poisoning specific to the emulator-host mapping

## Shape

This lab reuses the stripped Android host and the timeout/abort fetch shape.

The case list is:

- `localhost`
- host LAN IP

## Result

Observed result:

- `{"status":"fail","detail":"[{\"id\":\"localhost_name\",\"error\":\"Failed to fetch\"},{\"id\":\"host_lan_ip\",\"error\":\"signal is aborted without reason\"}]"}`

## Conclusion

`localhost` does **not** poison the stripped Android shape globally.

In this two-target shape:

- `localhost`
  - still fails immediately
- host LAN IP
  - still behaves like its own timeout/abort seam

That means the poisoning is now narrower than before:

- `localhost` is not breaking every other target
- it is specifically interfering with the otherwise-good `10.0.2.2` emulator-host mapping
