window.__cases__ = [
  { id: "set", action: "set", key: "todo:value", value: "3", expected: "3" },
  { id: "get", action: "get", key: "todo:value", expected: "3" },
  { id: "update", action: "set", key: "todo:value", value: "4", expected: "4" },
  { id: "delete", action: "delete", key: "todo:value", expected: null },
];
