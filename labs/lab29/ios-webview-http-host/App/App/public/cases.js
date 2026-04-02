window.__cases__ = [
  {
    id: "retry_503_then_ok",
    path: "/sum?a=1&b=2&mode=retry503&case=retry_503_then_ok",
    expect: { kind: "value", equals: 3 },
  },
  {
    id: "retry_timeout_then_ok",
    path: "/sum?a=1&b=2&mode=retryTimeout&case=retry_timeout_then_ok",
    expect: { kind: "value", equals: 3 },
  },
];
