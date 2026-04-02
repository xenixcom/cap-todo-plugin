window.__test__ = {
  addAsync(a, b) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(a - b), 150);
    });
  },
};

window.addEventListener("load", async () => {
  const result = await window.__test__.addAsync(1, 2);
  window.webkit.messageHandlers.probe.postMessage({ detail: String(result), mode: "bundled" });
});
