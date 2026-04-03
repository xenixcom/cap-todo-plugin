async function invokeStep(hook, step) {
  const fn = hook[step.method];
  if (typeof fn !== 'function') {
    throw new Error(`missing hook method: ${step.method}`);
  }
  return fn.apply(hook, resolveArgs(step.args ?? [], step.context));
}

function readPath(value, path) {
  return String(path ?? '')
    .split('.')
    .filter(Boolean)
    .reduce((current, segment) => current?.[segment], value);
}

function resolveArg(arg, context) {
  if (Array.isArray(arg)) {
    return arg.map((item) => resolveArg(item, context));
  }
  if (arg && typeof arg === 'object') {
    if (Object.prototype.hasOwnProperty.call(arg, 'ref')) {
      return context[String(arg.ref)];
    }
    return Object.fromEntries(
      Object.entries(arg).map(([key, value]) => [key, resolveArg(value, context)])
    );
  }
  return arg;
}

function resolveArgs(args, context) {
  return args.map((arg) => resolveArg(arg, context));
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
        if (testCase.kind === 'callValue') {
          const result = await invokeStep(hook, testCase.act);
          const actual = readPath(result, testCase.expect?.path);
          if (actual !== testCase.expect?.equals) {
            failures.push(`${testCase.id}: expected ${String(testCase.expect?.equals)} got ${String(actual)}`);
          }
          continue;
        }

        if (testCase.kind === 'callError') {
          try {
            await invokeStep(hook, testCase.act);
            failures.push(`${testCase.id}: expected error including ${testCase.expectErrorIncludes} but call succeeded`);
          } catch (error) {
            const message = String(error?.message ?? error);
            if (!message.includes(testCase.expectErrorIncludes)) {
              failures.push(`${testCase.id}: expected error including ${testCase.expectErrorIncludes} got ${message}`);
            }
          }
          continue;
        }

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

        if (testCase.kind === 'flowSequence') {
          const context = {};
          for (const step of testCase.steps ?? []) {
            step.context = context;
            if (step.type === 'callVoid') {
              await invokeStep(hook, step);
              continue;
            }

            if (step.type === 'callValue') {
              const result = await invokeStep(hook, step);
              if (step.save?.name) {
                context[step.save.name] = step.save.path ? readPath(result, step.save.path) : result;
              }
              const actual = readPath(result, step.expect?.path);
              if (actual !== step.expect?.equals) {
                failures.push(`${testCase.id}: expected ${String(step.expect?.equals)} got ${String(actual)}`);
                break;
              }
              continue;
            }

            if (step.type === 'callError') {
              try {
                await invokeStep(hook, step);
                failures.push(`${testCase.id}: expected error including ${step.expectErrorIncludes} but call succeeded`);
              } catch (error) {
                const message = String(error?.message ?? error);
                if (!message.includes(step.expectErrorIncludes)) {
                  failures.push(`${testCase.id}: expected error including ${step.expectErrorIncludes} got ${message}`);
                }
              }
              if (failures[failures.length - 1]?.startsWith(`${testCase.id}:`)) {
                break;
              }
              continue;
            }

            failures.push(`${testCase.id}: unsupported flow step ${step.type}`);
            break;
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
