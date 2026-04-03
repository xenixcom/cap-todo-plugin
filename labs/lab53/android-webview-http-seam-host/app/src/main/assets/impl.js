window.__impl__ = {
  async probe(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    try {
      const response = await fetch(url, { signal: controller.signal });
      const payload = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        payload,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
