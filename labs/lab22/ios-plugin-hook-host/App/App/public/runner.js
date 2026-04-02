function pushResult(detail) {
  if (window.webkit?.messageHandlers?.probe) {
    window.webkit.messageHandlers.probe.postMessage({ detail });
    return;
  }
  if (window.AndroidProbe?.onResult) {
    window.AndroidProbe.onResult(detail);
    return;
  }
  throw new Error('missing native probe bridge');
}

async function withTimeout(promise, label, ms) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label}:timeout:${ms}`)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

window.addEventListener('load', async () => {
  const hook = window.__todoHook__;
  const details = [];

  try {
    details.push(`hasMediaDevices=${Boolean(navigator.mediaDevices)}`);
    details.push(`hasGetUserMedia=${Boolean(navigator.mediaDevices?.getUserMedia)}`);

    const initial = await hook.checkPermissions();
    details.push(`initial=${String(initial?.microphone)}`);

    try {
      const requested = await withTimeout(
        hook.requestPermissions({ permissions: ['microphone'] }),
        'requestPermissions',
        3000
      );
      details.push(`request=resolved:${String(requested?.microphone)}`);
    } catch (error) {
      details.push(`request=${String(error?.message ?? error)}`);
    }

    try {
      const after = await withTimeout(hook.checkPermissions(), 'checkPermissionsAfter', 1000);
      details.push(`after=${String(after?.microphone)}`);
    } catch (error) {
      details.push(`after=${String(error?.message ?? error)}`);
    }

    try {
      const opened = await withTimeout(hook.openSession(), 'openSessionAfter', 1000);
      details.push(`open=${typeof opened?.sessionId === 'string' ? 'ok' : JSON.stringify(opened)}`);
    } catch (error) {
      details.push(`open=${String(error?.message ?? error)}`);
    }
  } catch (error) {
    details.push(`runner=${String(error?.message ?? error)}`);
  }

  pushResult(details.join('; '));
});
