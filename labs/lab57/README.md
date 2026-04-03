# Lab 57

This lab compares shared result normalization against adapter-local normalization.

## Why this lab exists

`lab56` proved:

- one generic runner can orchestrate real Android and iOS adapters
- but the two adapters still returned different raw result shapes

That leaves one design question:

- should semantic normalization live in a shared layer above adapters
- or should adapters normalize their own outputs before returning

## Shape

This lab does not build or launch hosts again.

It reuses the observed `lab56` raw outputs:

- Android:
  - `status=ok`
  - `detail=native=true; header=true; before=granted; request=granted; after=granted; start=ok`
- iOS:
  - `status=fail`
  - `detail=initial=prompt; request=granted; after=granted; open=ok`

Then it applies one shared strategy-aware normalizer for:

- `grant-microphone`

## Conclusion

Shared normalization is possible, but only by teaching the shared layer:

- strategy-specific semantics
- per-platform detail parsing rules
- per-adapter raw shape assumptions

That means a shared normalizer quickly starts absorbing:

- adapter knowledge
- host-specific detail grammar
- strategy-specific business rules

So this lab supports a cleaner split:

- adapters should return semantically normalized results
- the top-level runner should aggregate, not reinterpret raw platform detail strings
