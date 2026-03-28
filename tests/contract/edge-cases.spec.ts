import { beforeEach, describe, expect, it } from 'vitest';

import { createWebContractFixture } from './web-fixture';

describe('Contract: EdgeCases', () => {
  const fixture = createWebContractFixture();

  beforeEach(async () => {
    await fixture.plugin.reset();
    fixture.permissionState = 'prompt';
    fixture.supportsGetUserMedia = true;
  });

  it('requestPermissions 未提供 permissions 時，應請求所有正式對外權限', async () => {
    const result = await fixture.plugin.requestPermissions();

    expect(result).toEqual({
      microphone: 'granted',
    });
    expect(fixture.getUserMediaCalls).toBe(1);
  });

  it('requestPermissions 傳入空陣列時行為應明確且一致', async () => {
    const beforeCalls = fixture.getUserMediaCalls;
    const result = await fixture.plugin.requestPermissions({ permissions: [] });

    expect(result).toEqual({
      microphone: 'prompt',
    });
    expect(fixture.getUserMediaCalls).toBe(beforeCalls);
  });

  it('requestPermissions 傳入不合法權限值時應拋出 INVALID_ARGUMENT 或 UNSUPPORTED_PLATFORM', async () => {
    await expect(
      fixture.plugin.requestPermissions({
        permissions: ['camera' as never],
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_ARGUMENT',
    });
  });

  it('平台內部更細的權限狀態應映射為 prompt、granted、denied', async () => {
    fixture.permissionState = 'prompt';
    await expect(fixture.plugin.checkPermissions()).resolves.toEqual({
      microphone: 'prompt',
    });

    fixture.permissionState = 'granted';
    await expect(fixture.plugin.checkPermissions()).resolves.toEqual({
      microphone: 'granted',
    });

    fixture.permissionState = 'denied';
    await expect(fixture.plugin.checkPermissions()).resolves.toEqual({
      microphone: 'denied',
    });
  });

  it('echo 應維持最小 request/response contract，回傳 value 欄位', async () => {
    await expect(fixture.plugin.echo({ value: 'contract-ping' })).resolves.toEqual({
      value: 'contract-ping',
    });
  });

  it('resetOptions 與 reset 的責任分界應明確且不可互相取代', async () => {
    fixture.permissionState = 'granted';
    await fixture.plugin.start();
    await fixture.plugin.setOptions({ enabled: false, debug: true });

    await fixture.plugin.resetOptions();
    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'running',
    });
    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: true,
      debug: false,
    });

    await fixture.plugin.reset();
    await expect(fixture.plugin.getStatus()).resolves.toEqual({
      status: 'idle',
    });
  });

  it('重複呼叫 start 時應拋出 INVALID_STATE', async () => {
    fixture.permissionState = 'granted';
    await fixture.plugin.start();

    await expect(fixture.plugin.start()).rejects.toMatchObject({
      code: 'INVALID_STATE',
    });
  });

  it('重複呼叫 stop 時應拋出 INVALID_STATE', async () => {
    await expect(fixture.plugin.stop()).rejects.toMatchObject({
      code: 'INVALID_STATE',
    });
  });

  it('平台實作不得以靜默失敗、false 或空值取代正式錯誤契約', async () => {
    await expect(fixture.plugin.stop()).rejects.toMatchObject({
      code: 'INVALID_STATE',
      message: expect.any(String),
    });
  });
});
