window.__impl__ = {
  baseUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `http://${host}:41739`;
  },

  async fetchOnce(path) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);
    let response;
    try {
      response = await fetch(`${this.baseUrl()}${path}`, { signal: controller.signal });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("timeout");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`http ${response.status}`);
    }

    const payload = await response.json();
    if (typeof payload.result !== "number") {
      throw new Error("malformed payload");
    }

    return payload.result;
  },

  async fetchValue(path) {
    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await this.fetchOnce(path);
      } catch (error) {
        const message = String(error?.message ?? error);
        lastError = error;
        if (!message.includes("http 503") && !message.includes("timeout")) {
          throw error;
        }
      }
    }
    throw lastError ?? new Error("retry exhausted");
  },
};
