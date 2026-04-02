`tools/tests/` contains internal self-tests for `captool`.

This layer is for toolchain development only.
It does not replace plugin formal contract tests in `tests/contract/`.

Initial focus:
- happy-path command behavior
- failure injection
- config/doctor/report/clean validation
