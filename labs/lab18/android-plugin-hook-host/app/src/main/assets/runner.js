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

window.addEventListener('load', async () => {
  const details = [];
  const hook = window.__todoHook__;
  const checks = window.__archetypeChecks__;

  try {
    for (const testCase of window.__cases__) {
      const fn = hook?.[testCase.method];
      if (typeof fn !== 'function') {
        details.push(`${testCase.id}: missing method ${testCase.method}`);
        continue;
      }

      try {
        const result = await fn.apply(hook, testCase.args ?? []);
        const validator = checks[testCase.id];
        const problem = validator ? validator(result) : null;
        details.push(problem ? `${testCase.id}: fail ${problem}` : `${testCase.id}: ok`);
      } catch (error) {
        const errorValidator = checks[`${testCase.id}_error`];
        if (errorValidator) {
          const problem = errorValidator(error);
          details.push(problem ? `${testCase.id}: fail ${problem}` : `${testCase.id}: ok`);
        } else {
          details.push(`${testCase.id}: error ${String(error?.message ?? error)}`);
        }
      }
    }
  } catch (error) {
    details.push(`runner: error ${String(error?.message ?? error)}`);
  }

  pushResult(details.join('; '));
});
