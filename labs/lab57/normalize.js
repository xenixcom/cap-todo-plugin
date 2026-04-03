#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const input = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'raw-results.json'), 'utf8'),
);

function parseDetail(detail) {
  return Object.fromEntries(
    String(detail)
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const idx = part.indexOf('=');
        return idx === -1 ? [part, ''] : [part.slice(0, idx), part.slice(idx + 1)];
      }),
  );
}

function normalizeGrantMicrophone(result) {
  const parsed = parseDetail(result.detail);

  if (result.platform === 'android') {
    const ok =
      parsed.before === 'granted' &&
      parsed.request === 'granted' &&
      parsed.after === 'granted' &&
      parsed.start === 'ok';
    return {
      platform: result.platform,
      semanticStatus: ok ? 'ok' : 'fail',
      rawStatus: result.status,
      detail: result.detail,
    };
  }

  if (result.platform === 'ios') {
    const ok =
      parsed.request === 'granted' &&
      parsed.after === 'granted' &&
      parsed.open === 'ok';
    return {
      platform: result.platform,
      semanticStatus: ok ? 'ok' : 'fail',
      rawStatus: result.status,
      detail: result.detail,
    };
  }

  return {
    platform: result.platform,
    semanticStatus: 'error',
    rawStatus: result.status,
    detail: `unsupported platform: ${result.platform}`,
  };
}

if (input.strategy !== 'grant-microphone') {
  throw new Error(`unsupported strategy: ${input.strategy}`);
}

const normalized = input.results.map(normalizeGrantMicrophone);

process.stdout.write(
  JSON.stringify({
    strategy: input.strategy,
    normalized,
  }),
);
