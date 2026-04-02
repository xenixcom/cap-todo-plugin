import { expect } from 'vitest';

import type { PluginErrorCode } from '../../src/definitions';

export function expectPluginError(
  promise: Promise<unknown>,
  code: PluginErrorCode,
): Promise<void> {
  return expect(promise).rejects.toMatchObject({
    code,
    message: expect.any(String),
  });
}
