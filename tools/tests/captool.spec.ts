import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { getRepoRoot, runCaptool } from './support/runCaptool';

const repoRoot = getRepoRoot();
const reportsDir = path.join(repoRoot, 'reports');
const logsDir = path.join(repoRoot, 'logs');

const createdPaths: string[] = [];
const renamedPaths: Array<{ from: string; to: string }> = [];

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
  for (const entry of renamedPaths.splice(0).reverse()) {
    if (fs.existsSync(entry.to)) {
      fs.renameSync(entry.to, entry.from);
    }
  }

  for (const target of createdPaths.splice(0).reverse()) {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

function temporarilyRename(originalPath: string): string {
  const renamedPath = `${originalPath}.bak-selftest`;
  fs.renameSync(originalPath, renamedPath);
  renamedPaths.push({ from: originalPath, to: renamedPath });
  return renamedPath;
}

describe.sequential('captool self-tests', () => {
  it('doctor passes on the current repo baseline', () => {
    const result = runCaptool(['doctor']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Doctor Result: PASS');
    expect(result.stdout).toContain('[Platform Support]');
  });

  it('version prints the current captool version', () => {
    const result = runCaptool(['version']);

    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe('captool v0.4.2');
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

  it('doctor respects local config runtime overrides', () => {
    const localConfigPath = trackTempConfig({
      platforms: {
        ios: {
          runtime: {
            simulatorName: 'SelfTest Simulator',
          },
        },
      },
    });

    const result = runCaptool(['doctor'], {
      CAPTOOL_LOCAL_CONFIG: localConfigPath,
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('captool local config present');
    expect(result.stdout).toContain('SelfTest Simulator');
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

  it('report latest selects the newest report file', () => {
    trackFile(
      path.join(reportsDir, 'plugin-report-selftest-20990101_010101.txt'),
      ['Platform: web', 'Status: PASS', 'Marker: older'].join('\n'),
    );
    trackFile(
      path.join(reportsDir, 'plugin-report-selftest-20990101_020202.txt'),
      ['Platform: ios', 'Status: FAIL', 'Marker: newer'].join('\n'),
    );

    const result = runCaptool(['report', 'latest']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('plugin-report-selftest-20990101_020202.txt');
    expect(result.stdout).toContain('Marker: newer');
    expect(result.stdout).not.toContain('Marker: older');
  });

  it('local config overrides shared web build command', () => {
    const localConfigPath = trackTempConfig({
      platforms: {
        web: {
          build: {
            command: "printf 'LOCAL_OVERRIDE_BUILD\\n'",
          },
        },
      },
    });

    const result = runCaptool(['test', 'web'], {
      CAPTOOL_LOCAL_CONFIG: localConfigPath,
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('LOCAL_OVERRIDE_BUILD');
    expect(result.stdout).toContain('Result: Web PASS');
  });

  it('environment override wins over local config for web build command', () => {
    const localConfigPath = trackTempConfig({
      platforms: {
        web: {
          build: {
            command: "printf 'LOCAL_OVERRIDE_BUILD\\n'",
          },
        },
      },
    });

    const result = runCaptool(['test', 'web'], {
      CAPTOOL_LOCAL_CONFIG: localConfigPath,
      WEB_BUILD_CMD: "printf 'ENV_OVERRIDE_BUILD\\n'",
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('ENV_OVERRIDE_BUILD');
    expect(result.stdout).not.toContain('LOCAL_OVERRIDE_BUILD');
    expect(result.stdout).toContain('Result: Web PASS');
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

  it('test all skips platforms that are unsupported by design', () => {
    const configPath = trackTempConfig({
      platforms: {
        web: { supported: false },
        ios: { supported: false },
        android: { supported: false },
      },
    });

    const result = runCaptool(['test', 'all'], {
      CAPTOOL_CONFIG: configPath,
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('web: SKIPPED');
    expect(result.stdout).toContain('ios: SKIPPED');
    expect(result.stdout).toContain('android: SKIPPED');
    expect(result.stdout).toContain('失敗平台數: 0');
  });

  it('test all fails when a declared supported platform is missing', () => {
    const hiddenWebPath = path.join(repoRoot, 'src', 'web.ts');
    temporarilyRename(hiddenWebPath);

    const configPath = trackTempConfig({
      platforms: {
        web: { supported: true },
        ios: { supported: false },
        android: { supported: false },
      },
    });

    const result = runCaptool(['test', 'all'], {
      CAPTOOL_CONFIG: configPath,
    });

    expect(result.code).toBe(1);
    expect(result.stdout).toContain('web: FAIL');
    expect(result.stdout).toContain('Declared supported in captool.json but platform files are missing');
  });
});
