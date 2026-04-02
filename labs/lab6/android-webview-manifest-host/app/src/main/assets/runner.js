window.addEventListener("load", () => {
  const failures = [];

  for (const testCase of window.__cases__) {
    const actual = window.__impl__.add(testCase.a, testCase.b);
    if (actual !== testCase.expected) {
      failures.push(`${testCase.id}: expected ${testCase.expected} got ${actual}`);
    }
  }

  const detail = failures.length === 0 ? "pass" : failures.join("; ");
  window.AndroidProbe.onResult(detail);
});
