window.__todoHook__ = capacitorTodo.Todo;
window.__archetypeChecks__ = {
  permission_granted(result) {
    const value = result?.microphone;
    return value === 'granted' ? null : `expected granted got ${String(value)}`;
  },
  open_session_after_grant(result) {
    return typeof result?.sessionId === 'string' && result.sessionId.length > 0
      ? null
      : `expected sessionId got ${JSON.stringify(result)}`;
  },
};
