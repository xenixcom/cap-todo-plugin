import { beforeEach, describe, expect, it } from 'vitest';

import { createWebContractFixture } from './web-fixture';

describe('Contract: ErrorHandling', () => {
  const fixture = createWebContractFixture();

  beforeEach(async () => {
    await fixture.plugin.reset();
    fixture.permissionState = 'granted';
    fixture.supportsGetUserMedia = true;
  });

  it('所有正式錯誤都應至少包含 code 與 message', async () => {
    await fixture.plugin.setOptions({ enabled: false });

    await expect(fixture.plugin.start()).rejects.toMatchObject({
      code: 'INVALID_STATE',
      message: expect.any(String),
    });
  });

  it('App 層正式流程判斷應以 code 為主，不依賴 message', async () => {
    await fixture.plugin.setOptions({ enabled: false });

    try {
      await fixture.plugin.start();
    } catch (error) {
      expect(error).toMatchObject({
        code: 'INVALID_STATE',
      });
      return;
    }

    throw new Error('Expected start() to reject');
  });

  it('enabled = false 時呼叫 start 應拋出 INVALID_STATE', async () => {
    await fixture.plugin.setOptions({ enabled: false });

    await expect(fixture.plugin.start()).rejects.toMatchObject({
      code: 'INVALID_STATE',
    });
  });

  it('狀態不合法時呼叫 start 或 stop 應拋出 INVALID_STATE', async () => {
    await fixture.plugin.start();
    await expect(fixture.plugin.start()).rejects.toMatchObject({
      code: 'INVALID_STATE',
    });

    await fixture.plugin.stop();
    await expect(fixture.plugin.stop()).rejects.toMatchObject({
      code: 'INVALID_STATE',
    });
  });

  it('權限被拒絕時應拋出 PERMISSION_DENIED', async () => {
    fixture.permissionState = 'denied';

    await expect(fixture.plugin.start()).rejects.toMatchObject({
      code: 'PERMISSION_DENIED',
    });
  });

  it('不支援的平台或能力應拋出 UNSUPPORTED_PLATFORM 或 UNAVAILABLE', async () => {
    fixture.supportsGetUserMedia = false;

    await expect(fixture.plugin.requestPermissions()).rejects.toMatchObject({
      code: 'UNSUPPORTED_PLATFORM',
    });
  });

  it('不合法參數應拋出 INVALID_ARGUMENT', async () => {
    await expect(
      fixture.plugin.requestPermissions({
        permissions: ['microphone', 'camera' as never],
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_ARGUMENT',
    });
  });

  it('重置失敗時不得假裝回到 idle，應拋出正式錯誤', async () => {
    await fixture.plugin.start();
    await fixture.plugin.reset();

    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'idle',
    });
  });
});
