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

test('el mapeo de sincronización conserva las colecciones y se carga antes del POS', async () => {
  const result = await evaluatePublicData(
    'operation-options.js',
    'window.POS_OPERATION_COLLECTIONS',
    [],
    { window: {} }
  );
  assert.equal(result.length, 15);
  assert.ok(result.some(([collection, type]) => collection === 'sales' && type === 'sale'));
  assert.ok(result.some(([collection, type]) => collection === 'casheaMovimientos' && type === 'cashea-operation'));
  assert.ok(result.some(([collection, type]) => collection === 'retentions' && type === 'tax-retention'));
  assert.ok(result.every(entry => Object.isFrozen(entry)));

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/operation-options.js"></script>') < html.indexOf('<script src="/main.js"></script>'));
});

test('las etiquetas cambiarias conservan tipos, clases y nombres visibles', async () => {
  const result = await evaluatePublicData(
    'currency-options.js',
    'window.POS_CURRENCY_OPTIONS',
    [],
    { window: {} }
  );
  const expectedTypes = ['ZELLE_PROV', 'USD_EFECTIVO', 'ZELLE_PROPIO', 'VENTA_USD'];
  assert.deepEqual(Object.keys(result.tipoLabel), expectedTypes);
  assert.deepEqual(Object.keys(result.tagClass), expectedTypes);
  assert.deepEqual(Object.keys(result.tagShort), expectedTypes);
  assert.equal(result.tipoLabel.ZELLE_PROV, 'COMPRA USD ZELLE PARA PAGO DIRECTO A PROVEEDOR (TRIANGULACIÓN)');
  assert.equal(result.tagClass.VENTA_USD, 'cambio-tag vta');
  assert.equal(result.tagShort.VENTA_USD, 'Venta USD');
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.tipoLabel));
  assert.ok(Object.isFrozen(result.tagClass));
  assert.ok(Object.isFrozen(result.tagShort));

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/currency-options.js"></script>') < html.indexOf('<script src="/main.js"></script>'));
});

test('los datos iniciales conservan sus 44 productos y orden de carga', async () => {
  const result = await evaluatePublicData(
    'seed-data.js',
    'window.POS_SEED_FACTORY((...args) => args)',
    [],
    { window: {} }
  );
  assert.equal(result.length, 44, 'debe conservar todos los productos iniciales');
  assert.equal(result[0][0], '7501001');
  assert.equal(result[0][1], 'Aceite 20W-50 Mineral 1 L');
  assert.equal(result[43][0], '7509003');
  assert.equal(result[43][1], 'Bandeja Recolectora de Aceite 15 L');

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/seed-data.js"></script>') < html.indexOf('<script src="/main.js"></script>'));
});

test('las operaciones semilla conservan ventas, compras y referencias', async () => {
  const result = await evaluatePublicData(
    'seed-data.js',
    'window.POS_SEED_OPERATIONS',
    [],
    { window: {} }
  );
  assert.equal(result.sales.length, 5);
  assert.deepEqual(Array.from(result.sales[0]), [1038, 8, 12, 0, [['7501001', 1, 0]], 'pm']);
  assert.deepEqual(
    Object.keys(result.purchases).sort(),
    ['7501001', '7501002', '7504001', '7504002', '7505001']
  );
  assert.equal(result.purchases['7501001'], 24);
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.sales));
  assert.ok(result.sales.every(row => Object.isFrozen(row) && Object.isFrozen(row[4])));
  assert.ok(Object.isFrozen(result.purchases));

  const main = await readFile(path.join(root, 'public', 'main.js'), 'utf8');
  assert.ok(main.includes('const seedSalesSpec=window.POS_SEED_OPERATIONS.sales;'));
  assert.ok(main.includes('const purchSpec=window.POS_SEED_OPERATIONS.purchases;'));
});
