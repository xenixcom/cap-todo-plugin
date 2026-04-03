window.__probe__ = {
  async withTimeout(promise, label, ms) {
    let timer;
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`${label}:timeout:${ms}`)), ms);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  },
};
