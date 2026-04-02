window.addEventListener("load", async () => {
  const mode = window.__probeMode__ ?? "seed";
  const testCase = window.__cases__[0];
  const actual = await window.__storageProbe__[mode](testCase);

  let detail = "pass";
  if (mode === "seed" && actual !== "seeded") {
    detail = `seed: expected seeded got ${actual}`;
  }
  if (mode === "verify" && actual !== "local=ok; indexeddb=ok") {
    detail = `verify: expected local=ok; indexeddb=ok got ${actual}`;
  }

  window.webkit.messageHandlers.probe.postMessage({ detail });
});
