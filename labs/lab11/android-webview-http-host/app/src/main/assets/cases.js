window.__cases__ = [
  {
    id: "sum_basic",
    path: "/sum?a=1&b=2",
    expect: { kind: "value", equals: 3 },
  },
  {
    id: "malformed_payload",
    path: "/sum?a=1&b=2&mode=malformed",
    expect: { kind: "error", includes: "malformed payload" },
  },
  {
    id: "http_503",
    path: "/sum?a=1&b=2&mode=503",
    expect: { kind: "error", includes: "http 503" },
  },
  {
    id: "timeout_case",
    path: "/sum?a=1&b=2&mode=timeout",
    expect: { kind: "error", includes: "timeout" },
  },
];
