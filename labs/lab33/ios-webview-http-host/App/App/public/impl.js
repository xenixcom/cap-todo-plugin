window.__impl__ = {
  host() {
    return /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
  },

  async fetchWithTimeout(baseUrl, path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 500);
    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, { signal: controller.signal });
    } catch (error) {
      const message = String(error?.message ?? error);
      if (message.includes("AbortError")) {
        throw new Error("timeout");
      }
      throw error;
    } finally {
      clearTimeout(timer);
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
    const host = this.host();
    const primaryBaseUrl = `http://${host}:41743`;
    const fallbackBaseUrl = `http://${host}:41741`;

    try {
      return await this.fetchWithTimeout(primaryBaseUrl, path);
    } catch {
      return await this.fetchWithTimeout(fallbackBaseUrl, path);
    }
  },
};
