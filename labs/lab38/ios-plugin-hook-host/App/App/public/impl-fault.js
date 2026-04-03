const faultBaseTodo = capacitorTodo.Todo;
window.__todoHook__ = new Proxy(faultBaseTodo, {
  get(target, prop, receiver) {
    if (prop === 'getStatus') {
      return async (...args) => {
        const result = await target.getStatus(...args);
        return { ...result, status: result?.status === 'idle' ? 'running' : result?.status };
      };
    }
    if (prop === 'getOptions') {
      return async (...args) => {
        const result = await target.getOptions(...args);
        return {
          ...result,
          enabled: !Boolean(result?.enabled),
          debug: !Boolean(result?.debug),
        };
      };
    }
    return Reflect.get(target, prop, receiver);
  },
});
window.__eventAdapter__ = {
  normalize(event) {
    const status = event?.status ?? 'unknown';
    return status === 'idle' ? 'stopped' : status;
  },
};
