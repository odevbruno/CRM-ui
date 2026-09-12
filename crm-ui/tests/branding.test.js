'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '../..');
const LEGACY_BRAND = ['Cota', 'Flow'].join('');
const LEGACY_SLUG = LEGACY_BRAND.toLowerCase();
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.md', '.tsx', '.ts']);

function collectTextFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectTextFiles(fullPath);
    return TEXT_EXTENSIONS.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

test('VendCota is the only active product brand in the design system', () => {
  const files = [
    ...collectTextFiles(path.join(ROOT, 'crm-ui')),
    ...collectTextFiles(path.join(ROOT, 'docs')),
  ];
  const offenders = [];

  for (const file of files) {
    const relativePath = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    if (relativePath.toLowerCase().includes(LEGACY_SLUG)) offenders.push(`${relativePath} (path)`);
    if (content.includes(LEGACY_BRAND) || content.includes(LEGACY_SLUG)) offenders.push(`${relativePath} (content)`);
  }

  assert.deepEqual(offenders, []);
  assert.equal(
    fs.existsSync(path.join(ROOT, 'crm-ui/reference/vendcota-app.html')),
    true,
    'the canonical visual reference must use the VendCota filename',
  );
});
