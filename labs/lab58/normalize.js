#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'raw-results.json'), 'utf8'));

function parse(detail) {
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

const android = parse(input.android);
const ios = parse(input.ios);

const output = {
  semantic: 'blocked',
  platforms: [
    {
      platform: 'android',
      rawState: android.after,
      blocked: android.start?.startsWith('error:') ?? false,
    },
    {
      platform: 'ios',
      rawState: ios.after,
      blocked: ios.open?.startsWith('error:') ?? false,
    },
  ],
};

process.stdout.write(JSON.stringify(output));
