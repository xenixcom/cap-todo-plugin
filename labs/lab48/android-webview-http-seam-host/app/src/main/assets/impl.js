window.__impl__ = {
  async probe(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error('timeout')), 1500);
    let response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
    const payload = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      payload,
    };
  },
};
