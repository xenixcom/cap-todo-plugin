window.__impl__ = {
  socketUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `ws://${host}:41728`;
  },

  async connect() {
    const socket = new WebSocket(this.socketUrl());
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("socket open failed")), { once: true });
    });
    return socket;
  },

  async sendOnce(socket, testCase, keepAlive) {
    return new Promise((resolve, reject) => {
      if (socket.readyState !== WebSocket.OPEN) {
        reject(new Error(`socket not open (${socket.readyState})`));
        return;
      }

      const cleanup = () => {
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("close", onClose);
        socket.removeEventListener("error", onError);
      };

      const onMessage = (event) => {
        cleanup();
        try {
          const payload = JSON.parse(event.data);
          resolve(payload.result);
        } catch (error) {
          reject(error);
        }
      };

      const onClose = () => {
        cleanup();
        reject(new Error("socket closed before response"));
      };

      const onError = () => {
        cleanup();
        reject(new Error("socket errored before response"));
      };

      socket.addEventListener("message", onMessage, { once: true });
      socket.addEventListener("close", onClose, { once: true });
      socket.addEventListener("error", onError, { once: true });
      socket.send(JSON.stringify({ a: testCase.a, b: testCase.b, keepAlive }));
    });
  },

  async runCases(cases) {
    const failures = [];

    let socket = await this.connect();
    const first = await this.sendOnce(socket, cases[0], true);
    if (first !== cases[0].expected) {
      failures.push(`${cases[0].id}: expected ${cases[0].expected} got ${first}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 450));
    socket = await this.connect();
    const second = await this.sendOnce(socket, cases[1], true);
    if (second !== cases[1].expected) {
      failures.push(`${cases[1].id}: expected ${cases[1].expected} got ${second}`);
    }

    socket.close();
    return failures;
  },
};
