window.__cases__ = [
  {
    id: 'permission_granted',
    path: 'permission.microphone',
    equals: 'granted',
  },
  {
    id: 'availability_enabled',
    path: 'availability.enabled',
    equals: true,
  },
  {
    id: 'session_token',
    path: 'session.token',
    equals: 'session-1',
  },
  {
    id: 'native_sequence',
    path: '__events__',
    equals: 'permission:granted|availability:enabled|session:opened',
  },
];
