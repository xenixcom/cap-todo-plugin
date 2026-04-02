window.__todoHook__ = capacitorTodo.Todo;
window.__diagnostics__ = {
  unsupported_request_error(error) {
    const message = String(error?.message ?? error);
    return message.includes('Unsupported permission request')
      ? null
      : `expected Unsupported permission request got ${message}`;
  },
};
