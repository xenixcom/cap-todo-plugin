function pushResult(detail) {
  if (window.webkit?.messageHandlers?.probe) {
    window.webkit.messageHandlers.probe.postMessage({ detail });
    return;
  }
  throw new Error('missing native probe bridge');
}

window.addEventListener('load', async () => {
  const details = [];

  try {
    details.push(`hasMediaDevices=${Boolean(navigator.mediaDevices)}`);
    details.push(`hasGetUserMedia=${Boolean(navigator.mediaDevices?.getUserMedia)}`);

    if (!navigator.mediaDevices?.getUserMedia) {
      pushResult(details.join('; '));
      return;
    }

    try {
      const stream = await window.__probe__.withTimeout(
        navigator.mediaDevices.getUserMedia({ audio: true }),
        'getUserMedia',
        3000
      );
      details.push('gum=resolved');
      details.push(`tracks=${Array.isArray(stream?.getTracks?.()) ? stream.getTracks().length : 'unknown'}`);
      try {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        details.push('tracksStopped=true');
      } catch (error) {
        details.push(`tracksStopped=${String(error?.message ?? error)}`);
      }
    } catch (error) {
      details.push(`gum=${String(error?.message ?? error)}`);
    }
  } catch (error) {
    details.push(`runner=${String(error?.message ?? error)}`);
  }

  pushResult(details.join('; '));
});
