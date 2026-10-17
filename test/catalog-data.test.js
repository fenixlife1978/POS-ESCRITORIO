import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function evaluatePublicData(file, expression, dependencies = [], context = {}) {
  const sources = await Promise.all(
    [...dependencies, file].map(name => readFile(path.join(root, 'public', name), 'utf8'))
  );
  return runInNewContext(`${sources.join('\n')}\n${expression}`, context);
}

test('el mapa OEM se carga como datos no vacíos', async () => {
  const result = await evaluatePublicData(
    'catalog-oem.js',
    '({ count: Object.keys(VERIFIED_OEM_MAP).length, valuesValid: Object.values(VERIFIED_OEM_MAP).every(v => typeof v === "string" && v.trim().length > 0) })'
  );
  assert.ok(result.count > 10, 'debe conservar las referencias OEM existentes');
  assert.equal(result.valuesValid, true);
});

test('el catálogo maestro conserva productos y presentaciones', async () => {
  const result = await evaluatePublicData(
    'catalog-master-data.js',
    '({ count: MASTER_CURATED_CATALOG.length, first: MASTER_CURATED_CATALOG[0], configKeys: Object.keys(LUBRICANT_PRES_CONFIG) })',
    ['catalog-oem.js']
  );
  assert.ok(result.count > 30, 'el catálogo maestro no debe quedar vacío ni truncado');
  assert.equal(typeof result.first.code, 'string');
  assert.equal(typeof result.first.desc, 'string');
  assert.ok(Array.isArray(result.first.presentations));
  assert.ok(result.configKeys.length > 0, 'debe conservar la configuración de presentaciones');
});

test('la matriz de vehículos y los tipos de componentes conservan su estructura', async () => {
  const result = await evaluatePublicData(
    'catalog-automotive-data.js',
    '({ models: AUTO_MODELS_MATRIX, components: COMPONENT_TYPES })'
  );
  assert.ok(result.models.length > 20, 'debe conservar la matriz de vehículos');
  assert.ok(result.components.length > 10, 'debe conservar los tipos de repuestos');
  assert.ok(result.models.every(v => v.make && v.model && v.years && Array.isArray(v.engines)));
  assert.ok(result.components.every(v => v.name && v.dept && v.cat && v.subcat));
});


test('las opciones estáticas del POS se cargan antes de main.js y conservan sus valores', async () => {
  const result = await evaluatePublicData(
    'pos-options.js',
    'window.POS_OPTIONS',
    [],
    { window: {} }
  );
  assert.equal(result.MOTIVOS.length, 10);
  assert.equal(result.UM_OPTIONS.length, 10);
  assert.equal(result.TAX_OPTIONS.length, 5);
  assert.equal(result.TICKET_FONTS.length, 6);
  assert.equal(result.METHODS.length, 8);
  assert.ok(result.METHODS.some(v => v.id === 'pmovil'));
  assert.ok(result.METHODS.some(v => v.id === 'cashea' && v.isCashea));
  assert.ok(Object.keys(result.IC).length > 20);
  assert.ok(typeof result.IC.inventario === 'string');
  assert.ok(result.UM_OPTIONS.some(v => v.id === 'und'));
  assert.ok(result.TAX_OPTIONS.some(v => v.type === 'E' && v.rate === 0));
  assert.ok(result.TICKET_FONTS.some(v => v.id === 'ibm'));

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/pos-options.js"></script>') < html.indexOf('<script src="/main.js"></script>'));
});
