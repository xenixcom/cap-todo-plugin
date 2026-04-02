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

async function runNormal() {
  const details = [];
  const hook = window.__todoHook__;
  const diagnostics = window.__diagnostics__;

  for (const testCase of window.__cases__) {
    const fn = hook?.[testCase.method];
    if (typeof fn !== 'function') {
      details.push(`${testCase.id}=missing`);
      continue;
    }

    try {
      const result = await fn.apply(hook, testCase.args ?? []);
      const formatter = diagnostics[testCase.id];
      details.push(formatter ? formatter(result) : `${testCase.id}=ok`);
    } catch (error) {
      const formatter = diagnostics[`${testCase.id}_error`];
      details.push(formatter ? formatter(error) : `${testCase.id}=error:${String(error?.message ?? error)}`);
    }
  }

  pushResult(details.join('; '));
}

async function runFault() {
  const hook = window.__todoHook__;
  const diagnostics = window.__diagnostics__;

  try {
    await hook.requestPermissions({ permissions: ['camera'] });
    pushResult('expected unsupported permission error but request resolved');
  } catch (error) {
    const problem = diagnostics.unsupported_request_error?.(error);
    pushResult(problem ?? 'pass');
  }
}

window.addEventListener('load', async () => {
  try {
    const mode = /probe-fault\.html$/.test(String(window.location.href)) ? 'fault' : 'normal';
    if (mode === 'fault') {
      await runFault();
      return;
    }
    await runNormal();
  } catch (error) {
    pushResult(`runner:error:${String(error?.message ?? error)}`);
  }
});
