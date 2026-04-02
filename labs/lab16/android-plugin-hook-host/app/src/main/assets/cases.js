window.__cases__ = [
  {
    id: 'echo_roundtrip',
    kind: 'callValue',
    act: { method: 'echo', args: [{ value: 'hello-manifest' }] },
    expect: { path: 'value', equals: 'hello-manifest' },
  },
  {
    id: 'close_session_invalid_token',
    kind: 'callError',
    act: { method: 'closeSession', args: ['missing-session'] },
    expectErrorIncludes: 'Unknown session token',
  },
  {
    id: 'reset_emits_init_idle',
    kind: 'listenerSequence',
    setup: { event: 'statusChange' },
    act: [{ method: 'reset', args: [] }],
    expect: ['init', 'idle'],
  },
];
