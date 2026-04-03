# Lab 51

This lab checks whether the stripped Android HTTP seam is order-sensitive.

## Why this lab exists

`lab50` showed:

- adding `localhost` to the stripped target list is enough to break the earlier-good `10.0.2.2` case

The remaining question is:

- does the failure depend on target order

## Shape

This lab reuses the stripped Android host again.

The case list is reversed:

- `localhost`
- `10.0.2.2`

## Result

Observed result:

- `{"status":"fail","detail":"[{\"id\":\"localhost_name\",\"error\":\"Failed to fetch\"},{\"id\":\"emulator_host\",\"error\":\"Failed to fetch\"}]"}`

## Conclusion

This shows the stripped Android seam is not just an order artifact.

Whether the order is:

- `10.0.2.2` then `localhost` (`lab50`)

or:

- `localhost` then `10.0.2.2` (`lab51`)

the result still collapses into:

- `localhost`: `Failed to fetch`
- `10.0.2.2`: `Failed to fetch`

So the seam is now even narrower:

- simply introducing `localhost` into the stripped Android target list is enough to poison the otherwise-good `10.0.2.2` case
- and that poisoning is not order-sensitive
