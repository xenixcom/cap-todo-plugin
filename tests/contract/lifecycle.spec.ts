import { beforeEach, describe, expect, it } from 'vitest';

import { expectOptions, expectStatus } from '../support/contract';
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
    await expectStatus(fixture.plugin, 'idle');
  });

  it('start 應從 idle 進入 running', async () => {
    await fixture.plugin.start();

    await expectStatus(fixture.plugin, 'running');
  });

  it('stop 應從 running 回到 idle', async () => {
    await fixture.plugin.start();
    await fixture.plugin.stop();

    await expectStatus(fixture.plugin, 'idle');
  });

  it('reset 應先進入 init，再回到 idle', async () => {
    await fixture.plugin.start();
    await fixture.plugin.reset();

    await expectStatus(fixture.plugin, 'idle');
  });

  it('reset 應同時重置 options 與內部運作狀態', async () => {
    await fixture.plugin.setOptions({ enabled: false, debug: true });
    await fixture.plugin.reset();

    await expectOptions(fixture.plugin, {
      enabled: true,
      debug: false,
    });
    await expectStatus(fixture.plugin, 'idle');
  });

  it('enabled = false 時 start 應拒絕啟動', async () => {
    await fixture.plugin.setOptions({ enabled: false });

    await expectPluginError(fixture.plugin.start(), 'INVALID_STATE');
  });

  it('openSession 應建立最小 session token 並進入 running', async () => {
    const result = await fixture.plugin.openSession();

    expect(result).toEqual({
      sessionId: expect.any(String),
    });
    await expectStatus(fixture.plugin, 'running');
  });

  it('closeSession 應接受活躍 token 並回到 idle', async () => {
    const result = await fixture.plugin.openSession();

    await fixture.plugin.closeSession(result.sessionId);

    await expectStatus(fixture.plugin, 'idle');
  });

  it('重複建立 session 應拋出 INVALID_STATE', async () => {
    await fixture.plugin.openSession();

    await expectPluginError(fixture.plugin.openSession(), 'INVALID_STATE');
  });

  it('關閉未知 session token 應拋出 INVALID_ARGUMENT', async () => {
    await expectPluginError(
      fixture.plugin.closeSession('unknown-session'),
      'INVALID_ARGUMENT',
    );
  });
});
