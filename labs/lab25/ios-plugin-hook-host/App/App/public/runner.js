function pushResult(detail) {
  if (window.webkit?.messageHandlers?.probe) {
    window.webkit.messageHandlers.probe.postMessage({ detail });
    return;
  }
  throw new Error('missing native probe bridge');
}

const probeState = {
  startedAt: Date.now(),
  heartbeat: 0,
  breadcrumbs: [],
};

window.__probeState__ = probeState;

function breadcrumb(label) {
  probeState.breadcrumbs.push(`${Date.now() - probeState.startedAt}:${label}`);
}

setInterval(() => {
  probeState.heartbeat += 1;
}, 250);

setTimeout(() => breadcrumb('timeout:500'), 500);
setTimeout(() => breadcrumb('timeout:1000'), 1000);
setTimeout(() => breadcrumb('timeout:2000'), 2000);
setTimeout(() => breadcrumb('timeout:4000'), 4000);

window.addEventListener('focus', () => breadcrumb('window.focus'));
window.addEventListener('blur', () => breadcrumb('window.blur'));
window.addEventListener('pageshow', () => breadcrumb('window.pageshow'));
window.addEventListener('pagehide', () => breadcrumb('window.pagehide'));
document.addEventListener('visibilitychange', () => {
  breadcrumb(`visibility:${document.visibilityState}`);
});

window.addEventListener('load', async () => {
  const details = [];

  try {
    breadcrumb('load');
    details.push(`hasMediaDevices=${Boolean(navigator.mediaDevices)}`);
    details.push(`hasGetUserMedia=${Boolean(navigator.mediaDevices?.getUserMedia)}`);
    details.push(`visibility=${document.visibilityState}`);

    if (!navigator.mediaDevices?.getUserMedia) {
      pushResult(details.join('; '));
      return;
    }

    try {
      breadcrumb('gum:start');
      const stream = await window.__probe__.withTimeout(
        navigator.mediaDevices.getUserMedia({ audio: true }),
        'getUserMedia',
        4500
      );
      breadcrumb('gum:resolved');
      details.push('gum=resolved');
      details.push(`tracks=${Array.isArray(stream?.getTracks?.()) ? stream.getTracks().length : 'unknown'}`);
      try {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        breadcrumb('tracks:stopped');
        details.push('tracksStopped=true');
      } catch (error) {
        breadcrumb(`tracks:error:${String(error?.message ?? error)}`);
        details.push(`tracksStopped=${String(error?.message ?? error)}`);
      }
    } catch (error) {
      breadcrumb(`gum:error:${String(error?.message ?? error)}`);
      details.push(`gum=${String(error?.message ?? error)}`);
    }
  } catch (error) {
    breadcrumb(`runner:error:${String(error?.message ?? error)}`);
    details.push(`runner=${String(error?.message ?? error)}`);
  }

  details.push(`heartbeat=${probeState.heartbeat}`);
  details.push(`breadcrumbs=${probeState.breadcrumbs.join('|')}`);
  pushResult(details.join('; '));
});
