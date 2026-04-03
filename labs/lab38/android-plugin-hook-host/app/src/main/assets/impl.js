window.__todoHook__ = capacitorTodo.Todo;
window.__eventAdapter__ = {
  normalize(event) {
    return event?.status ?? 'unknown';
  },
};
