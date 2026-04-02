window.addEventListener("load", async () => {
  window.webkit.messageHandlers.probe.postMessage({ detail: "boot" });
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.webkit.messageHandlers.probe.postMessage({ detail: "ready" });
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.webkit.messageHandlers.probe.postMessage({ detail: "result:-1" });
  await new Promise((resolve) => setTimeout(resolve, 30));
  window.webkit.messageHandlers.probe.postMessage({ detail: "done" });
});
