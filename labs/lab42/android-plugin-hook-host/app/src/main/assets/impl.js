window.__todoHook__ = capacitorTodo.Todo;
window.__diagnostics__ = {
  host_permission_before() {
    return `host-before=${String(window.AndroidProbe?.hostPermissionState?.() ?? 'unknown')}`;
  },
  initial_permissions(result) {
    return `initial=${String(result?.microphone)}`;
  },
  request_microphone(result) {
    return `request=${String(result?.microphone)}`;
  },
  after_request_permissions(result) {
    return `after=${String(result?.microphone)}`;
  },
  host_permission_after() {
    return `host-after=${String(window.AndroidProbe?.hostPermissionState?.() ?? 'unknown')}`;
  },
  open_session_after_request(result) {
    if (typeof result?.sessionId === 'string' && result.sessionId.length > 0) {
      return 'open=ok';
    }
    return `open=${JSON.stringify(result)}`;
  },
  open_session_after_request_error(error) {
    return `open=error:${String(error?.message ?? error)}`;
  },
};
