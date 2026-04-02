window.__cases__ = [
  {
    id: 'reset_emits_init_idle',
    kind: 'listenerSequence',
    setup: { event: 'statusChange' },
    act: [{ method: 'reset', args: [] }],
    expect: ['init', 'idle'],
  },
  {
    id: 'set_options_is_silent',
    kind: 'listenerSequence',
    setup: { event: 'statusChange' },
    act: [{ method: 'setOptions', args: [{ debug: true }] }],
    expect: [],
  },
  {
    id: 'removed_listener_stays_silent',
    kind: 'listenerSequenceAfterRemove',
    setup: { event: 'statusChange' },
    act: [{ method: 'reset', args: [] }],
    expect: [],
  },
];
