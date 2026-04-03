window.addEventListener("load", async () => {
  const failures = [];

  for (const testCase of window.__cases__) {
    try {
      const actual = await window.__impl__.fetchValue(testCase.path);

      if (testCase.expect.kind === "error") {
        failures.push(
          `${testCase.id}: expected error including ${testCase.expect.includes} got expected value but received ${actual}`
        );
        continue;
      }

      if (actual !== testCase.expect.equals) {
        failures.push(
          `${testCase.id}: expected value ${testCase.expect.equals} got ${actual}`
        );
      }
    } catch (error) {
      const message = String(error?.message ?? error);

      if (testCase.expect.kind === "error") {
        if (!message.includes(testCase.expect.includes)) {
          failures.push(
            `${testCase.id}: expected error including ${testCase.expect.includes} got ${message}`
          );
        }
        continue;
      }

      failures.push(
        `${testCase.id}: expected value ${testCase.expect.equals} but received error ${message}`
      );
    }
  }

  const detail = failures.length === 0 ? "pass" : failures.join("; ");
  window.AndroidProbe.onResult(detail);
});
