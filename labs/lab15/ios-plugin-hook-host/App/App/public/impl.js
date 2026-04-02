window.__todoHook__ = capacitorTodo.Todo;
window.__archetypeChecks__ = {
  permission_shape(result) {
    const value = result?.microphone;
    return ['prompt', 'granted', 'denied'].includes(value)
      ? null
      : `expected microphone state got ${String(value)}`;
  },
  availability_shape(result) {
    return typeof result?.supported === 'boolean' && typeof result?.enabled === 'boolean'
      ? null
      : `expected supported/enabled booleans got ${JSON.stringify(result)}`;
  },
  open_session(result) {
    return typeof result?.sessionId === 'string' && result.sessionId.length > 0
      ? null
      : `expected sessionId got ${JSON.stringify(result)}`;
  },
  close_session_invalid_token_error(error) {
    return String(error?.message ?? error);
  },
};
