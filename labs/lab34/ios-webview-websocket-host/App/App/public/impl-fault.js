window.__impl__ = {
  socketUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `ws://${host}:41734`;
  },
  async runCases(cases) {
    const socket = new WebSocket(this.socketUrl());
    const failures = [];

    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("socket open failed")), { once: true });
    });

    for (const testCase of cases) {
      const outcome = await new Promise((resolve, reject) => {
        const onMessage = (event) => {
          socket.removeEventListener("message", onMessage);
          try {
            const payload = JSON.parse(event.data);
            resolve({ kind: "value", value: payload.result - 1 });
          } catch (error) {
            resolve({ kind: "value", value: "unexpected" });
          }
        };

        socket.addEventListener("message", onMessage, { once: true });
        socket.send(JSON.stringify({ caseId: testCase.id, a: testCase.a, b: testCase.b }));
      });

      if (Object.hasOwn(testCase, "expectedError")) {
        if (outcome.kind !== "error" || !String(outcome.message).includes(testCase.expectedError)) {
          failures.push(`${testCase.id}: expected error including ${testCase.expectedError} got ${outcome.kind === "error" ? outcome.message : `value ${outcome.value}`}`);
        }
        continue;
      }

      if (outcome.kind !== "value" || outcome.value !== testCase.expected) {
        failures.push(`${testCase.id}: expected ${testCase.expected} got ${outcome.kind === "value" ? outcome.value : outcome.message}`);
      }
    }

    socket.close();
    return failures;
  },
};
