window.__todoHook__ = capacitorTodo.Todo;
window.__eventAdapter__ = {
  normalize(event) {
    const status = event?.status ?? 'unknown';
    return status === 'idle' ? 'stopped' : status;
  },
};
