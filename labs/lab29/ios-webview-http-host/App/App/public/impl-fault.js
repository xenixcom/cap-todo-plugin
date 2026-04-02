window.__impl__ = {
  baseUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `http://${host}:41739`;
  },

  async fetchValue(path) {
    const response = await Promise.race([
      fetch(`${this.baseUrl()}${path}`),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("timeout")), 500);
      }),
    ]);

    if (!response.ok) {
      throw new Error(`http ${response.status}`);
    }

    const payload = await response.json();
    if (typeof payload.result !== "number") {
      throw new Error("malformed payload");
    }

    return payload.result;
  },
};
