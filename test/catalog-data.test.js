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
    ['lubricant-presentations.js', 'catalog-oem.js'],
    { window: {} }
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
  assert.equal(JSON.stringify(result.sales[0]), JSON.stringify([1038, 8, 12, 0, [['7501001', 1, 0]], 'pm']));
  assert.deepEqual(
    Object.keys(result.purchases).sort(),
    ['7501001', '7501002', '7504001', '7504002', '7505001']
  );
  assert.equal(result.purchases['7501001'], 24);
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.sales));
  assert.ok(result.sales.every(row => Object.isFrozen(row) && Object.isFrozen(row[4])));
  assert.ok(Object.isFrozen(result.purchases));
  assert.equal(result.initialPurchaseLines.length, 2);
  assert.equal(JSON.stringify(result.initialPurchaseLines.map(line => [line.code, line.desc, line.qty, line.cost])), JSON.stringify([
    ['7501001', 'Castrol GTX Aceite 20W-50 Mineral 1 L', 24, 3.35],
    ['7501002', 'Castrol GTX Aceite 20W-50 Mineral Galón 4 L', 8, 12.6]
  ]));
  assert.equal(JSON.stringify(result.purchaseFormDefaults), JSON.stringify([
    {code:'7501008',qty:12,cost:4.85,price:7.5},
    {code:'7504004',qty:10,cost:3.45,price:5.4}
  ]));
  assert.ok(Object.isFrozen(result.purchaseFormDefaults));
  assert.ok(result.purchaseFormDefaults.every(line => Object.isFrozen(line)));
  assert.ok(Object.isFrozen(result.initialPurchaseLines));
  assert.ok(result.initialPurchaseLines.every(line => Object.isFrozen(line)));
  assert.equal(result.purchaseLines.length, 3);
  assert.equal(JSON.stringify(result.purchaseLines.map(line => [line.code, line.qty, line.cost, line.sub])), JSON.stringify([
    ['7504001', 20, 3, 60],
    ['7504002', 10, 5.1, 51],
    ['7505001', 6, 15.6, 93.6]
  ]));
  assert.ok(Object.isFrozen(result.purchaseLines));
  assert.ok(result.purchaseLines.every(line => Object.isFrozen(line)));

  const main = await readFile(path.join(root, 'public', 'main.js'), 'utf8');
  assert.ok(main.includes('const seedSalesSpec=window.POS_SEED_OPERATIONS.sales;'));
  assert.ok(main.includes('const purchSpec=window.POS_SEED_OPERATIONS.purchases;'));
});

test('las presentaciones de lubricantes conservan sus cuatro configuraciones', async () => {
  const result = await evaluatePublicData(
    'lubricant-presentations.js',
    '({ keys: Object.keys(window.POS_LUBRICANT_PRES_CONFIG), litro: window.POS_LUBRICANT_PRES_CONFIG.litro("ABC"), galon: window.POS_LUBRICANT_PRES_CONFIG.galon("XYZ"), frozen: Object.isFrozen(window.POS_LUBRICANT_PRES_CONFIG) })',
    [],
    { window: {} }
  );
  assert.equal(JSON.stringify(result.keys), JSON.stringify(['litro', 'galon', 'paila', 'grasa']));
  assert.equal(result.litro.length, 5);
  assert.equal(result.litro[0].barcode, 'ABC');
  assert.equal(result.galon[0].barcode, 'XYZ');
  assert.equal(result.frozen, true);

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/lubricant-presentations.js"></script>') < html.indexOf('<script src="/catalog-master-data.js"></script>'));
});

test('los encabezados de exportación fiscal conservan nombres y orden', async () => {
  const result = await evaluatePublicData(
    'fiscal-export-headers.js',
    '({ sales: window.POS_FISCAL_EXPORT_HEADERS.sales, purchases: window.POS_FISCAL_EXPORT_HEADERS.purchases, igtf: window.POS_FISCAL_EXPORT_HEADERS.igtf, frozen: Object.isFrozen(window.POS_FISCAL_EXPORT_HEADERS) })',
    [],
    { window: {} }
  );
  assert.equal(result.sales.length, 22);
  assert.equal(result.sales[0], 'Nro_Operacion');
  assert.equal(result.sales[21], 'Tasa_BCV');
  assert.equal(result.purchases.length, 15);
  assert.equal(result.purchases[2], 'RIF_Proveedor');
  assert.equal(result.igtf.length, 11);
  assert.equal(result.igtf[8], 'Alicuota_IGTF');
  assert.equal(result.frozen, true);

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/fiscal-export-headers.js"></script>') < html.indexOf('<script src="/main.js"></script>'));
  assert.ok(!html.includes('\\n<script src="/access.js"></script>'), 'no debe quedar texto literal \\n antes del script de acceso');
  const main = await readFile(path.join(root, 'public', 'main.js'), 'utf8');
  assert.ok(main.includes('window.POS_FISCAL_EXPORT_HEADERS.sales'));
  assert.ok(main.includes('window.POS_FISCAL_EXPORT_HEADERS.purchases'));
  assert.ok(main.includes('window.POS_FISCAL_EXPORT_HEADERS.igtf'));
});

test('los atajos de teclado conservan contenido, orden e inmutabilidad', async () => {
  const result = await evaluatePublicData(
    'help-shortcuts.js',
    '({ shortcuts: window.POS_HELP_SHORTCUTS, frozen: Object.isFrozen(window.POS_HELP_SHORTCUTS), rowsFrozen: window.POS_HELP_SHORTCUTS.every(Object.isFrozen) })',
    [],
    { window: {} }
  );
  assert.equal(result.shortcuts.length, 17);
  assert.equal(JSON.stringify(result.shortcuts[0]), JSON.stringify(['F1', 'Control SENIAT/SUDEBAN']));
  assert.equal(JSON.stringify(result.shortcuts[11]), JSON.stringify(['F12', 'Cobrar']));
  assert.equal(JSON.stringify(result.shortcuts[16]), JSON.stringify(['Esc', 'Cerrar ventana o limpiar la búsqueda']));
  assert.equal(result.frozen, true);
  assert.equal(result.rowsFrozen, true);

  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="/help-shortcuts.js"></script>') < html.indexOf('<script src="/main.js"></script>'));
  const main = await readFile(path.join(root, 'public', 'main.js'), 'utf8');
  assert.ok(main.includes('const rows=window.POS_HELP_SHORTCUTS;'));
});


test('todos los scripts locales del HTML existen y los módulos de datos preceden al núcleo', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  const sources = [...html.matchAll(/<script\\s+src=["']([^"']+)["']/g)].map(match => match[1]);
  assert.ok(sources.length > 0, 'debe haber scripts de aplicación');
  assert.equal(new Set(sources).size, sources.length, 'no debe cargar un script local más de una vez');

  const localSources = sources.filter(src => src.startsWith('/'));
  const files = await Promise.all(localSources.map(async src => ({
    src,
    exists: await readFile(path.join(root, 'public', src.slice(1)), 'utf8').then(() => true, () => false)
  })));
  assert.ok(files.every(file => file.exists), 'todos los scripts locales referenciados deben existir');

  const mainIndex = sources.indexOf('/main.js');
  assert.ok(mainIndex >= 0, 'main.js debe estar referenciado');
  const dataModules = [
    '/catalog-oem.js',
    '/lubricant-presentations.js',
    '/catalog-master-data.js',
    '/catalog-automotive-data.js',
    '/pos-options.js',
    '/operation-options.js',
    '/currency-options.js',
    '/seed-data.js',
    '/fiscal-export-headers.js',
    '/help-shortcuts.js'
  ];
  for (const modulePath of dataModules) {
    assert.ok(sources.indexOf(modulePath) >= 0, modulePath + ' debe estar referenciado');
    assert.ok(sources.indexOf(modulePath) < mainIndex, modulePath + ' debe cargarse antes de main.js');
  }
  assert.ok(sources.indexOf('/access.js') > mainIndex, 'access.js debe conservar su posición posterior a main.js');
  assert.ok(!html.includes('\\\\n<script src="/access.js"></script>'), 'no debe reaparecer el texto literal \\n');
});
