import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { getRepoRoot, runCaptool } from './support/runCaptool';

const repoRoot = getRepoRoot();
const reportsDir = path.join(repoRoot, 'reports');
const logsDir = path.join(repoRoot, 'logs');

const createdPaths: string[] = [];

function trackFile(filePath: string, content = ''): string {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  createdPaths.push(filePath);
  return filePath;
}

function trackTempConfig(config: unknown): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'captool-selftest-'));
  createdPaths.push(tempDir);
  const configPath = path.join(tempDir, 'captool.test.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  return configPath;
}

afterEach(() => {
  for (const target of createdPaths.splice(0).reverse()) {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

describe.sequential('captool self-tests', () => {
  it('doctor passes on the current repo baseline', () => {
    const result = runCaptool(['doctor']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Doctor Result: PASS');
    expect(result.stdout).toContain('[Platform Support]');
  });

  it('doctor fails when platform declaration is malformed', () => {
    const configPath = trackTempConfig({
      platforms: {
        web: { supported: true },
        ios: {},
        android: { supported: true },
      },
    });

    const result = runCaptool(['doctor'], {
      CAPTOOL_CONFIG: configPath,
    });

    expect(result.code).toBe(1);
    expect(result.stdout).toContain('ios: unsupported declaration missing or unreadable in captool.json');
    expect(result.stdout).toContain('Doctor Result: FAIL');
  });

  it('report list shows filename, platform, and status', () => {
    trackFile(
      path.join(
        reportsDir,
        'plugin-report-selftest-20990101_010101.txt',
      ),
      ['Platform: web', 'Status: PASS'].join('\n'),
    );

    const result = runCaptool(['report', 'list']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain(
      'plugin-report-selftest-20990101_010101.txt | platform=web | status=PASS',
    );
  });

  it('report latest fails clearly when no reports exist', () => {
    const existingReports = fs
      .readdirSync(reportsDir)
      .filter(name => name.startsWith('plugin-report-'));

    for (const name of existingReports) {
      const fullPath = path.join(reportsDir, name);
      const renamedPath = `${fullPath}.bak-selftest`;
      fs.renameSync(fullPath, renamedPath);
      createdPaths.push(renamedPath);
    }

    const result = runCaptool(['report', 'latest']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('找不到任何 report 檔案');
  });

  it('clean local removes generated report and log artifacts', () => {
    const reportFile = trackFile(
      path.join(reportsDir, 'plugin-report-selftest-20990101_020202.txt'),
      'Platform: web\nStatus: PASS\n',
    );
    const logFile = trackFile(path.join(logsDir, 'selftest.log'), 'hello\n');

    const result = runCaptool(['clean', 'local']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('已清理測試產物');
    expect(fs.existsSync(reportFile)).toBe(false);
    expect(fs.existsSync(logFile)).toBe(false);
  });
});
