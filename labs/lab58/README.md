# Lab 58

This lab formalizes the permission-deny contract shape across iOS and Android.

## Why this lab exists

The raw app-facing deny results are different:

- Android:
  - `request=denied`
  - `after=denied`
  - `start=error:Microphone permission is required`
- iOS:
  - `request=prompt`
  - `after=prompt`
  - `open=error:Microphone permission is required`

That leaves one contract question:

- should the formal contract assert raw permission-state equality
- or should it assert the shared user-visible capability outcome

## Result

Observed normalizer output:

- `{"semantic":"blocked","platforms":[{"platform":"android","rawState":"denied","blocked":true},{"platform":"ios","rawState":"prompt","blocked":true}]}`

## Conclusion

The formal contract should **not** require raw permission-state equality here.

The stable cross-platform contract is:

- the capability is blocked
- permission-sensitive action does not proceed

So the normalized deny contract should be expressed in semantic terms such as:

- `blocked`
- `actionDenied`

not as a raw platform state string such as:

- `denied`
- `prompt`
