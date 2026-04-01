import { expect } from 'vitest';

type StatusValue = 'init' | 'idle' | 'running';

type OptionsShape = {
  enabled: boolean;
  debug: boolean;
};

type ContractPlugin = {
  getStatus(): Promise<{ status: StatusValue }>;
  getOptions(): Promise<OptionsShape>;
};

export async function expectStatus(
  plugin: ContractPlugin,
  status: StatusValue,
): Promise<void> {
  await expect(plugin.getStatus()).resolves.toEqual({ status });
}

export async function expectOptions(
  plugin: ContractPlugin,
  options: OptionsShape,
): Promise<void> {
  await expect(plugin.getOptions()).resolves.toEqual(options);
}
