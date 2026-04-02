import { beforeEach, describe, expect, it } from 'vitest';

import { createWebContractFixture } from '../support/web';

describe('Contract: Options', () => {
  const fixture = createWebContractFixture();

  beforeEach(async () => {
    await fixture.plugin.reset();
  });

  it('getOptions 應回傳目前生效的 options 物件', async () => {
    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: true,
      debug: false,
    });
  });

  it('預設 options 應至少包含 enabled 與 debug', async () => {
    await expect(fixture.plugin.getOptions()).resolves.toMatchObject({
      enabled: true,
      debug: false,
    });
  });

  it('預設 options 的 enabled 應為 true', async () => {
    await expect(fixture.plugin.getOptions()).resolves.toMatchObject({
      enabled: true,
    });
  });

  it('預設 options 的 debug 應為 false', async () => {
    await expect(fixture.plugin.getOptions()).resolves.toMatchObject({
      debug: false,
    });
  });

  it('setOptions 應只更新提供的欄位，未提供欄位保留原值', async () => {
    await fixture.plugin.setOptions({ debug: true });

    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: true,
      debug: true,
    });
  });

  it('setOptions({ enabled: false }) 不應影響 debug', async () => {
    await fixture.plugin.setOptions({ enabled: false });

    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: false,
      debug: false,
    });
  });

  it('setOptions({ debug: true }) 不應影響 enabled', async () => {
    await fixture.plugin.setOptions({ debug: true });

    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: true,
      debug: true,
    });
  });

  it('setOptions({}) 不應改變任何既有 options', async () => {
    const before = await fixture.plugin.getOptions();

    await fixture.plugin.setOptions({});

    await expect(fixture.plugin.getOptions()).resolves.toEqual(before);
  });

  it('setOptions 不應隱式改變目前 status', async () => {
    const before = await fixture.plugin.getStatus();

    await fixture.plugin.setOptions({ debug: true });

    await expect(fixture.plugin.getStatus()).resolves.toEqual(before);
  });

  it('resetOptions 應將 options 恢復為預設值', async () => {
    await fixture.plugin.setOptions({ enabled: false, debug: true });

    await fixture.plugin.resetOptions();

    await expect(fixture.plugin.getOptions()).resolves.toEqual({
      enabled: true,
      debug: false,
    });
  });

  it('resetOptions 不應改變目前 status', async () => {
    await fixture.plugin.start();
    const before = await fixture.plugin.getStatus();

    await fixture.plugin.setOptions({ enabled: false, debug: true });
    await fixture.plugin.resetOptions();

    await expect(fixture.plugin.getStatus()).resolves.toEqual(before);
  });
});
