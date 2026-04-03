# Lab 47

This lab checks whether iOS permission-deny validation becomes repeatable once the host media-capture callback also denies.

## Why this lab exists

`lab46` showed a split:

- Android deny can already be forced with system permission tools alone
- iOS does not mirror that if the host still grants media capture in `WKUIDelegate`

So this lab asks the narrower follow-up:

- if simulator privacy is revoked
- and the host callback also returns `.deny`
- does the app-facing permission flow finally become a stable deny case

## Shape

This lab reuses the `lab40` iOS host and changes only one thing:

- `requestMediaCapturePermissionFor` returns `.deny` when `PROBE_MODE=deny`

The run shape is:

- install the app on the simulator
- `simctl privacy revoke microphone io.xenix.demo`
- launch with `SIMCTL_CHILD_PROBE_MODE=deny`

## Expected question

The app-facing flow should stop looking like a granted path and instead expose a deny-shaped outcome.

## Result

Observed result:

- `{"status":"fail","detail":"initial=prompt; request=prompt; after=prompt; open=error:Microphone permission is required"}`

## Conclusion

This closes the practical iOS deny question much more clearly:

- `simctl privacy revoke microphone` alone was not enough in `lab46`
- once the host callback also returns `.deny`, the app-facing flow stops looking granted

But the resulting iOS shape does not mirror Android:

- Android deny settles into:
  - `request=denied`
  - `after=denied`
- iOS deny in this host-backed shape settles into:
  - `request=prompt`
  - `after=prompt`
  - while the protected operation still fails

So the useful conclusion is:

- iOS deny can be toolized
- but its observable contract shape is `prompt + blocked`, not `denied`
