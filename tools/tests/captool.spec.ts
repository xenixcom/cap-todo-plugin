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
    expect(result.stdout.trim()).toBe('captool v0.5.1');
  });

  it('help shows the current captool version', () => {
    const result = runCaptool(['help']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('captool v0.5.1');
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

  it('report fails clearly when a specified report file does not exist', () => {
    const result = runCaptool(['report', 'does-not-exist.txt']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('指定的 report 不存在');
    expect(result.stderr).toContain('does-not-exist.txt');
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

  it('test web fast mode skips the web build command', () => {
    const result = runCaptool(['test', 'web', '--fast'], {
      WEB_BUILD_CMD: 'printf "SHOULD_NOT_RUN\\n"; exit 9',
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('使用 Web 快速模式：跳過發佈型 build。');
    expect(result.stdout).not.toContain('SHOULD_NOT_RUN');
    expect(result.stdout).toContain('Result: Web PASS');
  });

  it('test web fast mode can retain build when config disables skip', () => {
    const localConfigPath = trackTempConfig({
      platforms: {
        web: {
          runtime: {
            fastSkipsBuild: false,
          },
        },
      },
    });

    const result = runCaptool(['test', 'web', '--fast'], {
      CAPTOOL_LOCAL_CONFIG: localConfigPath,
      WEB_BUILD_CMD: 'printf "FAST_BUILD_RETAINED\\n"',
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Web 快速模式已要求，但依 config 保留 build 步驟。');
    expect(result.stdout).toContain('FAST_BUILD_RETAINED');
    expect(result.stdout).toContain('Result: Web PASS');
  });

  it('test web writes report and log files when requested', () => {
    const logPath = path.join(logsDir, 'selftest-web.log');

    const result = runCaptool(['test', 'web', '--report', '--logs=selftest-web.log']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Report file: ./reports/plugin-report-web-');
    expect(result.stdout).toContain('Log file: ./logs/selftest-web.log');
    expect(fs.existsSync(logPath)).toBe(true);

    const reportFiles = fs
      .readdirSync(reportsDir)
      .filter(name => name.startsWith('plugin-report-web-') && name.endsWith('.txt'));

    expect(reportFiles.length).toBeGreaterThan(0);

    const latestReport = path.join(reportsDir, reportFiles.sort().at(-1)!);
    const reportContent = fs.readFileSync(latestReport, 'utf8');
    const logContent = fs.readFileSync(logPath, 'utf8');

    expect(reportContent).toContain('Platform: web');
    expect(reportContent).toContain('Status: PASS');
    expect(logContent).toContain('Step: Web 測試');
    expect(logContent).toContain('Result: Web PASS');
  }, 20000);

  it('test web writes logs to an explicit path when a full path is provided', () => {
    const explicitLogDir = fs.mkdtempSync(path.join(os.tmpdir(), 'captool-log-selftest-'));
    createdPaths.push(explicitLogDir);
    const explicitLogPath = path.join(explicitLogDir, 'explicit.log');

    const result = runCaptool(['test', 'web', `--logs=${explicitLogPath}`]);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain(`Log file: ${explicitLogPath}`);
    expect(fs.existsSync(explicitLogPath)).toBe(true);

    const logContent = fs.readFileSync(explicitLogPath, 'utf8');
    expect(logContent).toContain('Step: Web 測試');
    expect(logContent).toContain('Result: Web PASS');
  }, 20000);

  it('test web fails when the build command fails', () => {
    const result = runCaptool(['test', 'web'], {
      WEB_BUILD_CMD: 'printf "BUILD_FAIL_MARKER\\n"; exit 7',
    });

    expect(result.code).toBe(1);
    expect(result.stdout).toContain('BUILD_FAIL_MARKER');
    expect(result.stdout).toContain('Result: Web FAIL');
  });

  it('test web writes a fail report when the contract command fails', () => {
    const result = runCaptool(['test', 'web', '--report'], {
      CONTRACT_TEST_CMD: 'printf "CONTRACT_FAIL_MARKER\\n"; exit 6',
    });

    expect(result.code).toBe(1);
    expect(result.stdout).toContain('CONTRACT_FAIL_MARKER');
    expect(result.stdout).toContain('Result: Web FAIL');
    expect(result.stdout).toContain('Report file: ./reports/plugin-report-web-');

    const reportFiles = fs
      .readdirSync(reportsDir)
      .filter(name => name.startsWith('plugin-report-web-') && name.endsWith('.txt'));

    expect(reportFiles.length).toBeGreaterThan(0);

    const latestReport = path.join(reportsDir, reportFiles.sort().at(-1)!);
    const reportContent = fs.readFileSync(latestReport, 'utf8');
    expect(reportContent).toContain('Result: FAIL');
    expect(reportContent).toContain('Failure Summary:');
  }, 20000);

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

  it('clean rejects an unknown target', () => {
    const result = runCaptool(['clean', 'nope']);

    expect(result.code).toBe(2);
    expect(result.stderr).toContain('未知 clean 目標: nope');
    expect(result.stderr).toContain('./tools/captool clean [local|global|all]');
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

  it('test android reflects configured build task and test mode', () => {
    const localConfigPath = trackTempConfig({
      platforms: {
        android: {
          build: {
            task: 'assembleRelease',
          },
          test: {
            mode: 'integration',
          },
        },
      },
    });

    const result = runCaptool(['test', 'android'], {
      CAPTOOL_LOCAL_CONFIG: localConfigPath,
      ANDROID_GRADLE_CMD: 'printf "ANDROID_BUILD_TASK %s\\n"',
      ANDROID_TEST_CMD: 'printf "ANDROID_TEST_COMMAND\\n"',
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Android test mode: integration');
    expect(result.stdout).toContain('ANDROID_BUILD_TASK assembleRelease');
    expect(result.stdout).toContain('ANDROID_TEST_COMMAND');
    expect(result.stdout).toContain('Result: Android PASS');
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

  it('doctor fails clearly when the shared captool config is missing', () => {
    const missingConfigPath = path.join(os.tmpdir(), `missing-captool-${Date.now()}.json`);

    const result = runCaptool(['doctor'], {
      CAPTOOL_CONFIG: missingConfigPath,
    });

    expect(result.code).toBe(1);
    expect(result.stdout).toContain(`missing captool config: ${missingConfigPath}`);
    expect(result.stdout).toContain('Doctor Result: FAIL');
  });

  it('test all fails clearly when the shared captool config is missing', () => {
    const missingConfigPath = path.join(os.tmpdir(), `missing-captool-${Date.now()}.json`);

    const result = runCaptool(['test', 'all'], {
      CAPTOOL_CONFIG: missingConfigPath,
    });

    expect(result.code).toBe(3);
    expect(result.stdout).toContain('web: FAIL');
    expect(result.stdout).toContain('Missing or unreadable platform declaration in captool.json');
    expect(result.stdout).toContain('ios: FAIL');
    expect(result.stdout).toContain('android: FAIL');
    expect(result.stdout).toContain('失敗平台數: 3');
  });

  it('test rejects an unknown argument', () => {
    const result = runCaptool(['test', 'web', '--wat']);

    expect(result.code).toBe(2);
    expect(result.stderr).toContain('未知參數: --wat');
  });
});
