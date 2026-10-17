import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function evaluatePublicData(file, expression, dependencies = []) {
  const sources = await Promise.all(
    [...dependencies, file].map(name => readFile(path.join(root, 'public', name), 'utf8'))
  );
  return runInNewContext(`${sources.join('\n')}\n${expression}`, {});
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
