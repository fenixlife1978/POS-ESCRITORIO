import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const sourceFile = join(publicDir, 'main.js');
const outputFile = join(publicDir, 'main.bundle.js');
const modules = [
  'inventory-module.js',
  'purchasing-module.js',
  'payments-module.js',
  'fiscal-reports.js',
  'cash-z-module.js',
  'database-settings-module.js'
];
const marker = '/* ---------- arranque ---------- */';
const core = readFileSync(sourceFile, 'utf8');
if (core.split(marker).length !== 2) {
  throw new Error('No se encontró exactamente una marca de arranque en public/main.js');
}
const fragments = modules.map(name => readFileSync(join(publicDir, name), 'utf8')).join('\n\n');
const bundle = core.replace(marker, fragments + '\n\n' + marker);
writeFileSync(outputFile, bundle, 'utf8');
console.log('POS bundle generado:', outputFile, '(' + bundle.length + ' caracteres; ' + modules.length + ' módulos funcionales)');
