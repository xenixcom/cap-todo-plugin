window.addEventListener("load", async () => {
  try {
    const failures = await window.__impl__.runCases(window.__cases__);
    const detail = failures.length === 0 ? "pass" : failures.join("; ");
    window.AndroidProbe.onResult(detail);
  } catch (error) {
    window.AndroidProbe.onResult(String(error));
  }
});
