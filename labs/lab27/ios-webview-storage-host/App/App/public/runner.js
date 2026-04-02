window.addEventListener("load", () => {
  const mode = window.__probeMode__ ?? "seed";
  const testCase = window.__cases__[0];
  const actual = window.__storageProbe__[mode](testCase);

  let detail = "pass";
  if (mode === "seed" && actual !== "seeded") {
    detail = `seed: expected seeded got ${actual}`;
  }
  if (mode === "verify" && actual !== "ok") {
    detail = `verify: expected ok got ${actual}`;
  }
  if (mode === "corrupt" && !String(actual).startsWith("parse-error:")) {
    detail = `corrupt: expected parse-error got ${actual}`;
  }

  window.webkit.messageHandlers.probe.postMessage({ detail });
});
