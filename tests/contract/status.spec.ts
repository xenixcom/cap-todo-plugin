import { beforeEach, describe, expect, it, vi } from 'vitest';

import { expectStatus } from '../support/contract';
import { expectPluginError } from '../support/errors';
import { createWebContractFixture, prepareWebContractFixture } from '../support/web';

describe('Contract: Status', () => {
  const fixture = createWebContractFixture();

  beforeEach(async () => {
    await prepareWebContractFixture(fixture, {
      permissionState: 'granted',
      removeListeners: true,
    });
  });

  it('getStatus 應回傳物件型別，且包含 status 欄位', async () => {
    await expect(fixture.plugin.getStatus()).resolves.toMatchObject({
      status: expect.any(String),
    });
  });

  it('status 只允許 init、idle、running 三種正式狀態', async () => {
    const seenStatuses = new Set<string>();
    const listener = vi.fn((event: { status: string }) => {
      seenStatuses.add(event.status);
    });

    await fixture.plugin.addListener('statusChange', listener);
    await fixture.plugin.start();
    await fixture.plugin.stop();
    await fixture.plugin.reset();

    const current = await fixture.plugin.getStatus();
    seenStatuses.add(current.status);

    expect([...seenStatuses].sort()).toEqual(['idle', 'init', 'running']);
  });

  it('getStatus 應與最近一次正式狀態轉移結果一致', async () => {
    await fixture.plugin.start();
    await fixture.plugin.stop();

    await expectStatus(fixture.plugin, 'idle');
  });

  it('start 後 getStatus 應回傳 running', async () => {
    await fixture.plugin.start();

    await expectStatus(fixture.plugin, 'running');
  });

  it('stop 後 getStatus 應回傳 idle', async () => {
    await fixture.plugin.start();
    await fixture.plugin.stop();

    await expectStatus(fixture.plugin, 'idle');
  });

  it('reset 後 getStatus 最終應回到 idle', async () => {
    await fixture.plugin.start();
    await fixture.plugin.reset();

    await expectStatus(fixture.plugin, 'idle');
  });

  it('statusChange event payload 應與 getStatus 的正式狀態一致', async () => {
    const listener = vi.fn();

    await fixture.plugin.addListener('statusChange', listener);
    await fixture.plugin.start();

    expect(listener).toHaveBeenCalledWith({
      status: 'running',
    });
    await expectStatus(fixture.plugin, 'running');
  });

  it('正式狀態變化時應觸發 statusChange event', async () => {
    const listener = vi.fn();

    await fixture.plugin.addListener('statusChange', listener);
    await fixture.plugin.start();
    await fixture.plugin.stop();

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(1, { status: 'running' });
    expect(listener).toHaveBeenNthCalledWith(2, { status: 'idle' });
  });

  it('未發生正式狀態變化時，不應額外推送 statusChange event', async () => {
    const listener = vi.fn();

    await fixture.plugin.addListener('statusChange', listener);
    await expectPluginError(fixture.plugin.stop(), 'INVALID_STATE');

    expect(listener).not.toHaveBeenCalled();
  });
});
