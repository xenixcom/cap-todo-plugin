window.addEventListener('load', async () => {
  const results = [];
  for (const testCase of window.__cases__) {
    try {
      const result = await window.__impl__.probe(testCase.url);
      results.push({ id: testCase.id, ...result });
    } catch (error) {
      results.push({ id: testCase.id, error: String(error?.message ?? error) });
    }
  }
  const detail = JSON.stringify(results);
  if (window.AndroidProbe?.onResult) {
    window.AndroidProbe.onResult(detail);
    return;
  }
  if (window.AndroidProbe?.postMessage) {
    window.AndroidProbe.postMessage(detail);
    return;
  }
  throw new Error('no AndroidProbe bridge');
});
