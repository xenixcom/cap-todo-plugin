window.__cases__ = [
  {
    id: "echo_roundtrip",
    arrange: [],
    act: { method: "echo", args: [{ value: "hello-plugin" }] },
    expect: { path: "value", equals: "hello-plugin" },
  },
  {
    id: "status_initial",
    arrange: [],
    act: { method: "getStatus", args: [] },
    expect: { path: "status", equals: "idle" },
  },
  {
    id: "options_debug_true",
    arrange: [
      { method: "resetOptions", args: [] },
      { method: "setOptions", args: [{ debug: true }] },
    ],
    act: { method: "getOptions", args: [] },
    expect: { path: "debug", equals: true },
  },
  {
    id: "options_enabled_preserved",
    arrange: [
      { method: "resetOptions", args: [] },
      { method: "setOptions", args: [{ debug: true }] },
    ],
    act: { method: "getOptions", args: [] },
    expect: { path: "enabled", equals: true },
  },
  {
    id: "reset_options_restores_debug",
    arrange: [
      { method: "setOptions", args: [{ debug: true }] },
      { method: "resetOptions", args: [] },
    ],
    act: { method: "getOptions", args: [] },
    expect: { path: "debug", equals: false },
  },
];
