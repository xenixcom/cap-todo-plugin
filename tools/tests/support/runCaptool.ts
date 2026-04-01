import { spawnSync } from 'node:child_process';
import path from 'node:path';

export interface RunCaptoolResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

const repoRoot = path.resolve(__dirname, '../../..');
const captoolPath = path.join(repoRoot, 'tools/captool');

export function runCaptool(
  args: string[],
  env: NodeJS.ProcessEnv = {},
): RunCaptoolResult {
  const result = spawnSync(captoolPath, args, {
    cwd: repoRoot,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  return {
    code: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

export function getRepoRoot(): string {
  return repoRoot;
}
