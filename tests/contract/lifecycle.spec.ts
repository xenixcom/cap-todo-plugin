import { beforeEach, describe, expect, it } from 'vitest';

import { expectPluginError } from '../support/errors';
import { createWebContractFixture, prepareWebContractFixture } from '../support/web';

describe('Contract: Lifecycle', () => {
  const fixture = createWebContractFixture();

  beforeEach(async () => {
    await prepareWebContractFixture(fixture, {
      permissionState: 'granted',
      removeListeners: false,
    });
  });

  it('初始化完成後應進入 idle', async () => {
    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'idle',
    });
  });

  it('start 應從 idle 進入 running', async () => {
    await fixture.plugin.start();

    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'running',
    });
  });

  it('stop 應從 running 回到 idle', async () => {
    await fixture.plugin.start();
    await fixture.plugin.stop();

    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'idle',
    });
  });

  it('reset 應先進入 init，再回到 idle', async () => {
    await fixture.plugin.start();
    await fixture.plugin.reset();

    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'idle',
    });
  });

  it('reset 應同時重置 options 與內部運作狀態', async () => {
    await fixture.plugin.setOptions({ enabled: false, debug: true });
    await fixture.plugin.reset();

    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: true,
      debug: false,
    });
    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'idle',
    });
  });

  it('enabled = false 時 start 應拒絕啟動', async () => {
    await fixture.plugin.setOptions({ enabled: false });

    await expectPluginError(fixture.plugin.start(), 'INVALID_STATE');
  });
});
