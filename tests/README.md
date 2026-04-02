`tests/` holds the formal test units that define plugin behavior against
[`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts).

Current shape:
- `tests/contract/`: visible scenario suites
- `tests/support/`: thin shared support used by suites
- `tests/pipeline/`: pipeline-oriented helpers used by the toolchain

Design rules:
- keep `.spec` files simple and readable
- let support code reduce repetition, not redefine contract behavior
- keep strong alignment with `definitions.ts`
- avoid turning `/tests` into a second application
