window.addEventListener("load", async () => {
  const failures = [];

  for (const testCase of window.__cases__) {
    try {
      const actual = await window.__impl__.fetchValue(testCase.path);
      if (actual !== testCase.expected) {
        failures.push(`${testCase.id}: expected ${testCase.expected} got ${actual}`);
      }
    } catch (error) {
      failures.push(`${testCase.id}: ${String(error)}`);
    }
  }

  const detail = failures.length === 0 ? "pass" : failures.join("; ");
  window.AndroidProbe.onResult(detail);
});
