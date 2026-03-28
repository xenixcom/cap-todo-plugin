# Single Pipeline Host

This directory is reserved for the future app-level pipeline host.

## Purpose

The host in this directory is intended to sit near the real app calling layer:

- call plugin methods
- subscribe to plugin events
- receive results
- receive permission responses
- receive formal errors

It is not a demo layer.

## Rules

- The only formal entrypoint remains [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh).
- The host here must be driven by `test-plugin.sh`.
- The host here must follow the formal contract from [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts).
- The host here must execute the formal test units from [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract).
- `demo` must not become the formal pipeline host.

## Direction

- `web` already proves the formal contract pipeline can run end-to-end.
- `ios` and `android` should next be connected through a real host at this layer.
- Temporary private tests may still exist as transition tools, but they are not the destination.
