# Lab 50

This lab narrows the Android stripped HTTP seam to a two-target shape.

## Why this lab exists

The current picture is:

- `lab35`: single-target `10.0.2.2` works
- `lab48`: three-target stripped shape fails
- `lab49`: `AbortController` is not the cause

So the next question is:

- does the seam appear as soon as a second target is introduced

## Shape

This lab reuses the stripped Android host from `lab35`.

The only change is the case list:

- `10.0.2.2`
- `localhost`

## Result

Observed result:

- `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"error\":\"Failed to fetch\"},{\"id\":\"localhost_name\",\"error\":\"Failed to fetch\"}]"}`

## Conclusion

This makes the stripped Android HTTP seam narrower again:

- the split already appears with only two targets
- the moment `localhost` is introduced into the stripped case list, the earlier-good `10.0.2.2` case also flips to `Failed to fetch`

So the unresolved question is no longer:

- "does it only break with three targets"

It is now:

- why does mixing `localhost` into the stripped Android target list poison the otherwise-good `10.0.2.2` case
