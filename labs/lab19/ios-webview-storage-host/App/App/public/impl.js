window.__storageProbe__ = {
  seed(testCase) {
    localStorage.setItem(testCase.key, JSON.stringify(testCase.value));
    return "seeded";
  },

  verify(testCase) {
    const raw = localStorage.getItem(testCase.key);
    if (raw == null) {
      return "missing";
    }
    try {
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed) === JSON.stringify(testCase.value) ? "ok" : `mismatch:${raw}`;
    } catch (error) {
      return `parse-error:${String(error?.message ?? error)}`;
    }
  },

  corrupt(testCase) {
    localStorage.setItem(testCase.key, "{not-json");
    const raw = localStorage.getItem(testCase.key);
    try {
      JSON.parse(raw);
      return "unexpected-parse-success";
    } catch (error) {
      return `parse-error:${String(error?.message ?? error)}`;
    }
  },
};
