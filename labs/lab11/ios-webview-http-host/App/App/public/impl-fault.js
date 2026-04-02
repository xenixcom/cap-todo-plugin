window.__impl__ = {
  baseUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `http://${host}:41731`;
  },

  async fetchValue(path) {
    try {
      const response = await Promise.race([
        fetch(`${this.baseUrl()}${path}`),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), 500);
        }),
      ]);

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        return payload.result ?? "unexpected";
      }

      if (typeof payload.result !== "number") {
        return payload.result ?? "unexpected";
      }

      return payload.result - 1;
    } catch (error) {
      if (error?.message === "timeout") {
        return "unexpected-timeout";
      }
      return "unexpected-error";
    }
  },
};
