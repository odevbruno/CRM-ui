'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.md', '.tsx', '.ts']);

function option(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`Missing required option ${name}`);
  return process.argv[index + 1];
}

const oldName = option('--old-name');
const newName = option('--new-name');
const oldSlug = option('--old-slug');
const newSlug = option('--new-slug');

function replaceAll(value) {
  return value.split(oldName).join(newName).split(oldSlug).join(newSlug);
}

function collectFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

for (const rootName of ['crm-ui', 'docs']) {
  const rootDir = path.join(ROOT, rootName);
  for (const sourcePath of collectFiles(rootDir)) {
    const relativePath = path.relative(ROOT, sourcePath);
    const targetRelativePath = replaceAll(relativePath);
    const targetPath = path.join(ROOT, targetRelativePath);
    const shouldRead = TEXT_EXTENSIONS.has(path.extname(sourcePath));
    const sourceContent = shouldRead ? fs.readFileSync(sourcePath, 'utf8') : null;
    const targetContent = sourceContent === null ? null : replaceAll(sourceContent);

    if (targetPath !== sourcePath) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      if (targetContent === null) fs.copyFileSync(sourcePath, targetPath);
      else fs.writeFileSync(targetPath, targetContent, 'utf8');
      fs.unlinkSync(sourcePath);
      continue;
    }

    if (sourceContent !== null && targetContent !== sourceContent) {
      fs.writeFileSync(sourcePath, targetContent, 'utf8');
    }
  }
}
