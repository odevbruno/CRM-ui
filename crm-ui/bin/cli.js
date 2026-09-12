#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REGISTRY_DIR = path.join(ROOT, 'registry');
const CONFIG_FILE = 'crm-ui.json';

function loadIndex() {
  return JSON.parse(fs.readFileSync(path.join(REGISTRY_DIR, 'index.json'), 'utf8'));
}
function loadItem(name) {
  const file = path.join(REGISTRY_DIR, 'items', `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function writeFileSafe(fullPath, content, force) {
  if (fs.existsSync(fullPath) && !force) {
    console.log(`  \x1b[33mpulado\x1b[0m (já existe): ${path.relative(process.cwd(), fullPath)}  — use --force para sobrescrever`);
    return false;
  }
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  \x1b[32mescrito\x1b[0m: ${path.relative(process.cwd(), fullPath)}`);
  return true;
}

function cmdInit(args) {
  const dirFlagIdx = args.indexOf('--dir');
  const targetDir = dirFlagIdx >= 0 ? args[dirFlagIdx + 1] : 'src/components/crm-ui';

  const tokens = loadItem('tokens');
  for (const f of tokens.files) {
    const dest = path.join(process.cwd(), targetDir, f.path);
    writeFileSafe(dest, f.content, args.includes('--force'));
  }

  const config = { targetDir };
  fs.writeFileSync(path.join(process.cwd(), CONFIG_FILE), JSON.stringify(config, null, 2));
  console.log(`\nConfig salvo em ./${CONFIG_FILE} → targetDir: ${targetDir}\n`);
  console.log('Próximos passos:');
  console.log(`  1. Importe uma vez no CSS global do projeto:`);
  console.log(`       @import "./${path.join(targetDir, 'tokens.css')}";`);
  console.log(`  2. Faça merge de ${path.join(targetDir, 'tailwind.snippet.js')} dentro de theme.extend no tailwind.config.js do projeto.`);
  console.log(`  3. Rode: npx crm-ui add button card pageheader   (ou "npx crm-ui add visao-geral" para uma tela inteira)\n`);
}

function resolveDeps(names, seen) {
  seen = seen || new Set();
  for (const name of names) {
    if (seen.has(name)) continue;
    const item = loadItem(name);
    if (!item) {
      console.error(`\x1b[31mitem não encontrado no registry: ${name}\x1b[0m`);
      continue;
    }
    seen.add(name);
    if (item.registryDependencies && item.registryDependencies.length) {
      resolveDeps(item.registryDependencies, seen);
    }
  }
  return seen;
}

function cmdAdd(args) {
  const force = args.includes('--force');
  const names = args.filter((a) => a !== '--force');
  if (!names.length) {
    console.log('Uso: npx crm-ui add <nome> [<nome> ...]  (ex.: add button card visao-geral)');
    return;
  }
  const config = loadConfig();
  if (!config) {
    console.error('Nenhum crm-ui.json encontrado. Rode "npx crm-ui init" primeiro.');
    process.exit(1);
  }
  const all = resolveDeps(names);
  console.log(`Instalando: ${[...all].join(', ')}\n`);
  for (const name of all) {
    const item = loadItem(name);
    for (const f of item.files) {
      const subdir = f.target === 'root' ? '' : f.target;
      const dest = path.join(process.cwd(), config.targetDir, subdir, f.path);
      writeFileSafe(dest, f.content, force);
    }
  }
  console.log('\nPronto. Ajuste os imports se o seu path alias for diferente de "../components/*".');
}

function cmdList() {
  const idx = loadIndex();
  console.log('\nComponentes:');
  idx.components.forEach((c) => console.log(`  ${c.name.padEnd(14)} ${c.description}`));
  console.log('\nTelas:');
  idx.screens.forEach((c) => console.log(`  ${c.name.padEnd(14)} ${c.description}`));
  console.log('\nDocs/extras: screens-spec (spec das telas restantes), tokens (instalado via init)\n');
}

const [, , cmd, ...rest] = process.argv;
if (cmd === 'init') cmdInit(rest);
else if (cmd === 'add') cmdAdd(rest);
else if (cmd === 'list') cmdList();
else {
  console.log('crm-ui — CLI do design system VendCota\n');
  console.log('  npx crm-ui init                 configura tokens + tailwind + crm-ui.json');
  console.log('  npx crm-ui list                  lista componentes e telas disponíveis');
  console.log('  npx crm-ui add <nomes...>         copia componente(s)/tela(s) pro projeto');
  console.log('  npx crm-ui add screens-spec       copia a spec das telas restantes (Markdown)\n');
}
