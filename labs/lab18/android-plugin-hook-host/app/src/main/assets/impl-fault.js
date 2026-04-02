window.__todoHook__ = capacitorTodo.Todo;
window.__archetypeChecks__ = {
  permission_granted(result) {
    const value = result?.microphone;
    return value === 'denied' ? null : `expected denied got ${String(value)}`;
  },
  open_session_after_grant(result) {
    return `expected permission error but got ${JSON.stringify(result)}`;
  },
  open_session_after_grant_error(error) {
    const message = String(error?.message ?? error);
    return message.includes('Microphone permission is required')
      ? null
      : `expected Microphone permission is required got ${message}`;
  },
};
