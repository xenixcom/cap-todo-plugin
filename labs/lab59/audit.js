#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit.json'), 'utf8'));
const requiredKinds = [...new Set(input.scenarios.map((scenario) => scenario.kind))];
const missingKinds = requiredKinds.filter((kind) => !input.allowedKinds.includes(kind));

process.stdout.write(
  JSON.stringify({
    allowedKinds: input.allowedKinds,
    requiredKinds,
    missingKinds,
    status: missingKinds.length === 0 ? 'ok' : 'fail',
  }),
);
