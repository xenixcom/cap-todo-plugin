# Lab 49

This lab isolates the effect of `AbortController` on the Android stripped single-target HTTP seam.

## Why this lab exists

`lab35` proved:

- single-target `10.0.2.2` works in the stripped Android seam host

`lab48` then showed:

- the broader multi-target stripped shape still fails
- but that lab also introduced timeout/abort

So this lab asks the narrower question:

- does `AbortController` itself break the otherwise-good single-target `10.0.2.2` case

## Result

Observed result:

- `{"status":"fail","detail":"[{\"id\":\"emulator_host\",\"ok\":true,\"status\":200,\"payload\":{\"ok\":true,\"from\":\"lab12\"}}]"}`

The outer `fail` shape is just how this small host records any non-`pass` detail string.
The important part is the payload:

- `ok: true`
- `status: 200`

## Conclusion

`AbortController` is **not** the thing that breaks the Android stripped HTTP seam.

Even with explicit timeout/abort:

- the single-target `10.0.2.2` case still succeeds

So the remaining split is now even narrower:

- `lab35` proved plain single-target works
- `lab49` proves single-target still works with timeout/abort
- `lab48` still fails in the stripped three-target shape

That means the unresolved seam is genuinely tied to the **multi-target stripped shape**, not to `AbortController` itself.
