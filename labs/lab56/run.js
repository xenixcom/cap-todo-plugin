#!/usr/bin/env node

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const adapters = JSON.parse(fs.readFileSync(path.join(root, 'adapters.json'), 'utf8'));
const strategy = process.argv[2] || 'grant-microphone';

const results = adapters.map((adapter) => {
  const output = execFileSync(path.join(root, adapter.command), [strategy], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  return JSON.parse(output);
});

process.stdout.write(JSON.stringify({ strategy, results }));
