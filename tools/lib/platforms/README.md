# Captool Platform Adapters

This directory contains the platform adapter layer behind `captool test`.

Role:

- translate a shared formal testing intent into platform-specific execution
- keep platform toolchain details out of `commands/test.sh`
- return success/failure through shell exit code
- append platform-local summary/failure lines through the shared globals used by `run_platform`

Shared intent:

- run the formal test flow for one platform
- respect the current high-level test policy:
  - selected platform
  - fast mode
  - report/log collection
  - artifact policy

What belongs here:

- web:
  - npm / build / vitest execution details
- ios:
  - simulator resolution
  - xcodebuild flow
  - fast-path reuse
  - device cleanup
- android:
  - gradle assemble/test flow
  - android-specific build and test invocation

What does not belong here:

- top-level CLI parsing
- `all` platform iteration
- final PASS/FAIL counting across platforms
- report file creation
- final summary formatting

Adapter contract:

- each adapter exposes one public runner:
  - `run_web_tests`
  - `run_ios_tests`
  - `run_android_tests`
- each runner:
  - returns `0` on success
  - returns non-zero on failure
  - may append lines to:
    - `CURRENT_PLATFORM_SUMMARY`
    - `CURRENT_PLATFORM_FAILURE`
- each runner may ignore unsupported optimizations when needed
  - for example `--fast` is a shared user-facing intent
  - but each platform may implement it differently, or treat it as a no-op

Stability rule:

- adapters should align to shared intent, not force identical low-level toolchains
- platform differences are acceptable
- user-facing semantics should stay consistent

Support declaration rule:

- a plugin may support one, two, or three platforms
- future platform selection should not rely only on directory guessing
- platform support should be resolved from:
  - declared support
    - from `captool.json`
  - detected presence
- these should remain separate states:
  - supported and present
  - unsupported by design
  - declared but missing / misconfigured

Private test rule:

- platform-private tests may still exist for platform-local confidence
- they should be traceable by the toolchain
- they should not automatically redefine the formal contract pass criteria
