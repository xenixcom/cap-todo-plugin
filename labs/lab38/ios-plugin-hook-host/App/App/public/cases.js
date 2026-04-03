window.__cases__ = [
  {
    id: 'disabled_start_preserves_state_and_options',
    kind: 'flowSequence',
    steps: [
      { type: 'callVoid', method: 'setOptions', args: [{ enabled: false, debug: true }] },
      { type: 'callValue', method: 'getOptions', expect: { path: 'enabled', equals: false } },
      { type: 'callValue', method: 'getOptions', expect: { path: 'debug', equals: true } },
      { type: 'callError', method: 'start', expectErrorIncludes: 'Plugin is disabled' },
      { type: 'callValue', method: 'getStatus', expect: { path: 'status', equals: 'idle' } },
      { type: 'callValue', method: 'getOptions', expect: { path: 'enabled', equals: false } },
      { type: 'callValue', method: 'getOptions', expect: { path: 'debug', equals: true } },
      { type: 'callVoid', method: 'resetOptions', args: [] },
      { type: 'callValue', method: 'getOptions', expect: { path: 'enabled', equals: true } },
      { type: 'callValue', method: 'getOptions', expect: { path: 'debug', equals: false } },
    ],
  },
  {
    id: 'failed_start_then_reset_restores_idle_defaults',
    kind: 'flowSequence',
    steps: [
      { type: 'callVoid', method: 'setOptions', args: [{ enabled: false, debug: true }] },
      { type: 'callError', method: 'start', expectErrorIncludes: 'Plugin is disabled' },
      { type: 'callVoid', method: 'reset', args: [] },
      { type: 'callValue', method: 'getStatus', expect: { path: 'status', equals: 'idle' } },
      { type: 'callValue', method: 'getOptions', expect: { path: 'enabled', equals: true } },
      { type: 'callValue', method: 'getOptions', expect: { path: 'debug', equals: false } },
    ],
  },
  {
    id: 'reset_emits_init_idle',
    kind: 'listenerSequence',
    setup: { event: 'statusChange' },
    act: [{ method: 'reset', args: [] }],
    expect: ['init', 'idle'],
  },
];
