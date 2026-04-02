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
  window.AndroidProbe.onResult(JSON.stringify(results));
});
