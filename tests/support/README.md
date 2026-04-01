`tests/support/` contains small shared support for formal test units.

Keep this layer thin:
- shared setup helpers
- reusable assertions
- lightweight capability-oriented test support

Do not let `support/` become a second contract layer.
`tests/contract/` remains the visible source of testing intent.
