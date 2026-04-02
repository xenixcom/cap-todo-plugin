function getPath(target, path) {
  return path.split(".").reduce((value, segment) => value?.[segment], target);
}

async function invokeStep(hook, step) {
  const fn = hook[step.method];
  if (typeof fn !== "function") {
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

  throw new Error("missing native probe bridge");
}

window.addEventListener("load", async () => {
  const failures = [];
  const hook = window.__todoHook__;

  try {
    if (!hook) {
      throw new Error("missing todo hook");
    }

    for (const testCase of window.__cases__) {
      try {
        for (const step of testCase.arrange ?? []) {
          await invokeStep(hook, step);
        }

        const result = await invokeStep(hook, testCase.act);
        const actual = getPath(result, testCase.expect.path);
        if (actual !== testCase.expect.equals) {
          failures.push(
            `${testCase.id}: expected ${testCase.expect.equals} got ${actual}`
          );
        }
      } catch (error) {
        failures.push(`${testCase.id}: threw ${error.message}`);
      }
    }
  } catch (error) {
    failures.push(`runner: ${error.message}`);
  }

  pushResult(failures.length === 0 ? "pass" : failures.join("; "));
});
