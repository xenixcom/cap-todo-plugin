# Lab 53

This lab checks whether host LAN IP poisons the stripped Android `10.0.2.2` seam when each request has explicit timeout/abort.

## Why this lab exists

The current seam map says:

- single-target `10.0.2.2` works
- single-target `10.0.2.2` still works with `AbortController`
- adding `localhost` poisons `10.0.2.2`

One open question remains:

- is `localhost` uniquely poisonous
- or can host LAN IP also destabilize the stripped `10.0.2.2` shape

## Shape

This lab reuses the stripped Android host again.

The case list is:

- `10.0.2.2`
- host LAN IP

Each request gets a short timeout and explicit abort so the runner cannot silently hang.

## Result

Observed result:

- `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"ok\":true,\"status\":200,\"payload\":{\"ok\":true,\"from\":\"lab12\"}},{\"id\":\"host_lan_ip\",\"error\":\"signal is aborted without reason\"}]"}`

## Conclusion

Host LAN IP does **not** poison the otherwise-good stripped `10.0.2.2` case.

The two-target result now splits cleanly:

- `10.0.2.2`
  - still returns `200`
- host LAN IP
  - times out and aborts on its own

So the remaining stripped Android HTTP seam is even narrower:

- `localhost` is the special target that poisons `10.0.2.2`
- host LAN IP is bad in this stripped shape, but it does **not** drag `10.0.2.2` down with it
