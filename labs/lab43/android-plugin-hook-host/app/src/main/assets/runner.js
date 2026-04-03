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

function readPath(value, path) {
  return String(path ?? '')
    .split('.')
    .filter(Boolean)
    .reduce((current, segment) => current?.[segment], value);
}

async function waitForFixture(timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (window.__nativeFixture__ && window.__nativeDone__ === true) {
      return window.__nativeFixture__;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`native fixture timeout:${timeoutMs}`);
}

window.addEventListener('load', async () => {
  const failures = [];

  try {
    const fixture = await waitForFixture(2000);
    for (const testCase of window.__cases__ ?? []) {
      const actual = testCase.path === '__events__'
        ? (window.__nativeEventLog__ ?? []).join('|')
        : readPath(fixture, testCase.path);
      if (actual !== testCase.equals) {
        failures.push(`${testCase.id}: expected ${String(testCase.equals)} got ${String(actual)}`);
      }
    }
  } catch (error) {
    failures.push(`runner: ${String(error?.message ?? error)}`);
  }

  pushResult(failures.length === 0 ? 'pass' : failures.join('; '));
});
