async function invokeStep(hook, step) {
  const fn = hook[step.method];
  if (typeof fn !== 'function') {
    throw new Error(`missing hook method: ${step.method}`);
  }
  return fn.apply(hook, step.args ?? []);
}

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
  const failures = [];
  const hook = window.__todoHook__;
  const eventAdapter = window.__eventAdapter__;

  try {
    if (!hook) {
      throw new Error('missing todo hook');
    }

    for (const testCase of window.__cases__) {
      try {
        if (testCase.kind === 'listenerSequence') {
          const events = [];
          const handle = await hook.addListener(testCase.setup.event, (event) => {
            events.push(eventAdapter.normalize(event));
          });
          for (const step of testCase.act ?? []) {
            await invokeStep(hook, step);
          }
          await new Promise((resolve) => setTimeout(resolve, 120));
          await handle.remove();
          if (JSON.stringify(events) !== JSON.stringify(testCase.expect)) {
            failures.push(`${testCase.id}: expected ${testCase.expect.join(' -> ')} got ${events.join(' -> ')}`);
          }
          continue;
        }

        if (testCase.kind === 'listenerSequenceAfterRemove') {
          const events = [];
          const handle = await hook.addListener(testCase.setup.event, (event) => {
            events.push(eventAdapter.normalize(event));
          });
          await handle.remove();
          for (const step of testCase.act ?? []) {
            await invokeStep(hook, step);
          }
          await new Promise((resolve) => setTimeout(resolve, 120));
          if (JSON.stringify(events) !== JSON.stringify(testCase.expect)) {
            failures.push(`${testCase.id}: expected ${testCase.expect.join(' -> ')} got ${events.join(' -> ')}`);
          }
          continue;
        }

        failures.push(`${testCase.id}: unsupported case kind ${testCase.kind}`);
      } catch (error) {
        failures.push(`${testCase.id}: threw ${error.message}`);
      }
    }
  } catch (error) {
    failures.push(`runner: ${error.message}`);
  }

  pushResult(failures.length === 0 ? 'pass' : failures.join('; '));
});
