window.__impl__ = {
  runStep(testCase) {
    switch (testCase.action) {
      case "set":
        localStorage.setItem(testCase.key, `${testCase.value}-fault`);
        return localStorage.getItem(testCase.key);
      case "get":
        return localStorage.getItem(testCase.key);
      case "delete":
        return localStorage.getItem(testCase.key);
      default:
        throw new Error(`unknown action ${testCase.action}`);
    }
  },
};
