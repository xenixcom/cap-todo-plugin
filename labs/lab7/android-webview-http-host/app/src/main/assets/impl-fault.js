window.__impl__ = {
  baseUrl() {
    const host = /Android/i.test(navigator.userAgent) ? "10.0.2.2" : "127.0.0.1";
    return `http://${host}:41707`;
  },
  async fetchValue(path) {
    const response = await fetch(`${this.baseUrl()}${path}`);
    const payload = await response.json();
    return payload.result - 1;
  },
};
