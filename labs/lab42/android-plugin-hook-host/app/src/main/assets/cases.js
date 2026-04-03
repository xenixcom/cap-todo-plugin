window.__cases__ = [
  {
    id: 'host_permission_before',
    method: '__hostPermissionBefore',
  },
  {
    id: 'initial_permissions',
    method: 'checkPermissions',
  },
  {
    id: 'request_microphone',
    method: 'requestPermissions',
    args: [{ permissions: ['microphone'] }],
  },
  {
    id: 'after_request_permissions',
    method: 'checkPermissions',
  },
  {
    id: 'host_permission_after',
    method: '__hostPermissionAfter',
  },
  {
    id: 'open_session_after_request',
    method: 'openSession',
  },
];
