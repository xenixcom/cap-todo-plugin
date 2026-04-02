window.__cases__ = [
  {
    id: 'permission_shape',
    method: 'checkPermissions',
  },
  {
    id: 'availability_shape',
    method: 'getAvailability',
  },
  {
    id: 'open_session',
    method: 'openSession',
  },
  {
    id: 'close_session_invalid_token',
    method: 'closeSession',
    args: ['missing-session'],
  },
];
