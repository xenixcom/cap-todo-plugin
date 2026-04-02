window.__impl__ = {
  socketUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `ws://${host}:41708`;
  },
  async runCases(cases) {
    const socket = new WebSocket(this.socketUrl());
    const failures = [];

    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("socket open failed")), { once: true });
    });

    for (const testCase of cases) {
      const actual = await new Promise((resolve, reject) => {
        const onMessage = (event) => {
          socket.removeEventListener("message", onMessage);
          try {
            const payload = JSON.parse(event.data);
            resolve(payload.result);
          } catch (error) {
            reject(error);
          }
        };

        socket.addEventListener("message", onMessage, { once: true });
        socket.send(JSON.stringify({ a: testCase.a, b: testCase.b }));
      });

      if (actual !== testCase.expected) {
        failures.push(`${testCase.id}: expected ${testCase.expected} got ${actual}`);
      }
    }

    socket.close();
    return failures;
  },
};
