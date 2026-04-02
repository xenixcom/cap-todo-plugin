window.__cases__ = [
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
    id: 'open_session_after_request',
    method: 'openSession',
  },
];
