#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const seams = JSON.parse(fs.readFileSync(path.join(__dirname, 'seams.json'), 'utf8'));

const formalBlockers = seams.filter((seam) => seam.owner === 'formal').map((seam) => seam.id);
const adapterOwned = seams.filter((seam) => seam.owner === 'adapter').map((seam) => seam.id);

process.stdout.write(
  JSON.stringify({
    formalBlockers,
    adapterOwned,
    status: formalBlockers.length === 0 ? 'ok' : 'fail',
  }),
);
