window.addEventListener("load", async () => {
  window.webkit.messageHandlers.probe.postMessage({ detail: "boot" });
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.webkit.messageHandlers.probe.postMessage({ detail: "open" });
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.webkit.messageHandlers.probe.postMessage({ detail: "data:1" });
  await new Promise((resolve) => setTimeout(resolve, 40));
  window.webkit.messageHandlers.probe.postMessage({ detail: "data:2" });
  await new Promise((resolve) => setTimeout(resolve, 40));
  window.webkit.messageHandlers.probe.postMessage({ detail: "data:3" });
  await new Promise((resolve) => setTimeout(resolve, 40));
  window.webkit.messageHandlers.probe.postMessage({ detail: "closed" });
});
