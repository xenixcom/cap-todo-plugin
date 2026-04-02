window.addEventListener("load", async () => {
  try {
    const failures = await window.__impl__.runCases(window.__cases__);
    const detail = failures.length === 0 ? "pass" : failures.join("; ");
    window.webkit.messageHandlers.probe.postMessage({ detail });
  } catch (error) {
    window.webkit.messageHandlers.probe.postMessage({ detail: String(error) });
  }
});
