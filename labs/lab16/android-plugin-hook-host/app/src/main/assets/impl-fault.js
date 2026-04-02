const faultBaseTodo = capacitorTodo.Todo;
window.__todoHook__ = new Proxy(faultBaseTodo, {
  get(target, prop, receiver) {
    if (prop === 'echo') {
      return async (...args) => {
        const result = await target.echo(...args);
        return { ...result, value: `${result?.value ?? ''}-fault` };
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
