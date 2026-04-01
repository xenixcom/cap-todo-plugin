# Captool Config

`captool.json` is the repo-level configuration file for `captool`.

It is intended for:

- shared project defaults
- shared platform support declaration
- shared platform-specific build/test/runtime defaults

It is not intended for:

- per-invocation runtime state
- test results
- machine-local secrets or machine-specific paths
- temporary device/session values

## Current Shape

```json
{
  "platforms": {
    "<platform>": {
      "supported": true,
      "build": {},
      "test": {},
      "runtime": {}
    }
  }
}
```

## Meaning

- `platforms.<name>.supported`
  - whether this repo intends to support the platform
  - used together with detected file/path presence
- `platforms.<name>.build`
  - repo-shared defaults for platform build behavior
- `platforms.<name>.test`
  - repo-shared defaults for platform test behavior
- `platforms.<name>.runtime`
  - repo-shared defaults for platform runtime selection
  - for example simulator defaults

## Boundary

Good fit for `captool.json`:

- supported platform declaration
- default build command
- default test command
- default iOS scheme
- default iOS simulator name
- default derived data path

Not a fit for `captool.json`:

- `COMMAND`
- `FAILURES`
- `REPORT_FILE`
- `CURRENT_PLATFORM_FAILURE`
- active device/session IDs
- one-off CLI flags for a single invocation

## Override Model

Current direction:

- repo-shared defaults live in `captool.json`
- runtime state stays in shell variables
- machine-local differences should eventually be handled by:
  - CLI flags
  - environment variables
  - or a future local override layer

This separation keeps the repo config stable across machines while still allowing local flexibility.
