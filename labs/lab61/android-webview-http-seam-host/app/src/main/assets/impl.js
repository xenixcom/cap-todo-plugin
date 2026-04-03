window.__impl__ = {
  async probe(url) {
    const response = await fetch(url);
    const payload = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      payload,
    };
  },
};
