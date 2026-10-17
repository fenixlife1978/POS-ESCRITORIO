import test from 'node:test';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const electron = readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
const preload = readFileSync(new URL('../electron/preload.cjs', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../public/access.js', import.meta.url), 'utf8');
const pos = readFileSync(new URL('../public/main.js', import.meta.url), 'utf8');
const cashZ = readFileSync(new URL('../public/cash-z-module.js', import.meta.url), 'utf8');
const inventoryModule = readFileSync(new URL('../public/inventory-module.js', import.meta.url), 'utf8');
const purchasingModule = readFileSync(new URL('../public/purchasing-module.js', import.meta.url), 'utf8');
const paymentsModule = readFileSync(new URL('../public/payments-module.js', import.meta.url), 'utf8');
const fiscalModule = readFileSync(new URL('../public/fiscal-reports.js', import.meta.url), 'utf8');
const databaseModule = readFileSync(new URL('../public/database-settings-module.js', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const options = readFileSync(new URL('../public/pos-options.js', import.meta.url), 'utf8');
const operationOptions = readFileSync(new URL('../public/operation-options.js', import.meta.url), 'utf8');

test('el ejecutable implementa un servidor LAN con puerto configurable', () => {
  assert.match(electron, /http\.createServer/);
  assert.match(electron, /network:configure-server/);
  assert.match(electron, /listen\(port, '0\.0\.0\.0'/);
  assert.match(electron, /network:stop-server/);
});

test('las rutas de sincronización requieren clave de emparejamiento', () => {
  assert.match(electron, /authorization !== 'Bearer ' \+ networkConfig\.token/);
  assert.match(electron, /crypto\.randomBytes\(24\)\.toString\('hex'\)/);
  assert.match(electron, /network:configure-client/);
});

test('el servidor deduplica snapshots por dispositivo y hash', () => {
  assert.match(electron, /CREATE TABLE IF NOT EXISTS network_sync_events/);
  assert.match(electron, /INSERT OR IGNORE INTO network_sync_events/);
  assert.match(electron, /createHash\('sha256'\)/);
});

test('Electron expone solo métodos IPC específicos para la red', () => {
  assert.match(preload, /networkStartServer: options => ipcRenderer\.invoke\('network:configure-server'/);
  assert.match(preload, /networkConfigureClient: options => ipcRenderer\.invoke\('network:configure-client'/);
  assert.match(preload, /networkSyncNow: state => ipcRenderer\.invoke\('network:sync-now'/);
  assert.doesNotMatch(preload, /ipcRenderer\.on\(['"][^'"]+['"],\s*\(event/);
});

test('la aplicación reintenta sincronización automáticamente en segundo plano', () => {
  assert.match(pos, /setInterval\(\(\)=>\{if\(window\.posDesktop&&typeof window\.posDesktop\.networkSyncNow==='function'\)networkSyncAttempt\(\)\},20000\)/);
  assert.match(pos, /scheduleNetworkSync\(\)/);
  assert.match(pos, /operaciones guardadas localmente; se reintentará automáticamente/);
});

test('el administrador tiene panel para servidor y clientes LAN', () => {
  assert.match(ui, /Red y sincronización/);
  assert.match(ui, /Activar esta caja como servidor/);
  assert.match(ui, /Conectar esta caja como cliente/);
  assert.match(ui, /IP DETECTADA/);
});

test('el panel explica límites de red y recomienda reserva de IP', () => {
  assert.match(ui, /Reserva esta IP en el router/);
  assert.match(ui, /no cifra el tráfico/);
  assert.match(ui, /diferencias de inventario por ventas simultáneas requieren conciliación/);
});

test('el servidor anuncia descubrimiento LAN sin exigir IP fija', () => {
  assert.ok(electron.includes("const dgram = require('dgram')"));
  assert.ok(electron.includes('SIFER360_DISCOVER_V1'));
  assert.ok(electron.includes('SIFER360_SERVER_V1'));
  assert.ok(electron.includes('DISCOVERY_PORT = 38761'));
  assert.ok(electron.includes('function discoverLanServers'));
});

test('la interfaz permite encontrar automáticamente la IP actual del servidor', () => {
  assert.ok(preload.includes('networkDiscover'));
  assert.ok(ui.includes('Buscar servidor automáticamente'));
  assert.ok(ui.includes('networkDiscover()'));
  assert.ok(ui.includes('No hace falta configurar IP fija'));
});

test('la cola de operaciones tiene UUID, secuencia por dispositivo y estado de acuse', () => {
  assert.match(electron, /CREATE TABLE IF NOT EXISTS local_operation_outbox/);
  assert.match(electron, /UNIQUE\(device_id, device_seq\)/);
  assert.match(electron, /crypto\.randomUUID\(\)/);
  assert.match(electron, /network:operation-create/);
  assert.match(electron, /network:operation-pending/);
  assert.match(electron, /status='acked'/);
});

test('el servidor recibe operaciones idempotentes y detecta colisiones de secuencia', () => {
  assert.match(electron, /\/api\/sync\/events/);
  assert.match(electron, /CREATE TABLE IF NOT EXISTS network_received_operations/);
  assert.match(electron, /device-sequence-already-used/);
  assert.match(electron, /eventResult\.duplicates/);
  assert.match(preload, /networkCreateOperation/);
  assert.match(preload, /networkOperationStatus/);
});

test('el POS convierte nuevos registros operativos en eventos de la cola local', () => {
  assert.match(pos, /OPERATION_COLLECTIONS/);
  assert.match(operationOptions, /\['sales','sale'\]/);
  assert.match(operationOptions, /\['purchases','purchase'\]/);
  assert.match(pos, /captureNewOperations\(\)/);
  assert.match(pos, /networkCreateOperation\(/);
  assert.match(pos, /primeOperationBaseline\(\)/);
});

test('el servidor aplica una operación nueva una sola vez y reporta entidades en conflicto', () => {
  assert.match(electron, /allowedCollections/);
  assert.match(electron, /existingRecord/);
  assert.match(electron, /entity-already-exists-with-different-data/);
  assert.match(electron, /network_received_operations/);
  assert.match(electron, /conflictIds/);
});

test('CASHEA no precarga operaciones ficticias y elimina únicamente firmas semilla conocidas', () => {
  assert.match(pos, /S\.casheaMovimientos=\[\];/);
  assert.match(pos, /demoCasheaSignatures/);
  assert.match(pos, /Number\(m\.financiadoUsd\)===demo\.financiadoUsd/);
});

test('la liquidación CASHEA exige depósito real conciliado y guarda trazabilidad del lote', () => {
  assert.match(pos, /Monto neto depositado según banco/);
  assert.match(pos, /Liquidación rechazada/);
  assert.match(pos, /S\.casheaLiquidaciones\.push/);
  assert.match(pos, /depositadoUsd:depositUsd/);
  assert.match(pos, /includeBatch\?batch\.depositadoUsd/);
  assert.match(pos, /Referencia_Bancaria/);
});


test('el cobro exige referencias reales para los métodos electrónicos', () => {
  assert.match(pos, /const refPrompts=\{zelle:/);
  assert.match(pos, /voucher o código de autorización de la tarjeta/);
  assert.match(pos, /número de operación\/autorización de Biopago/);
  assert.match(pos, /referencia del pago móvil/);
  assert.match(pos, /referencia de la transferencia/);
  assert.match(pos, /finalize\(last,enteredAmts,isCred,cDays,enteredRefs,el\)/);
});

test('el asistente Cashea vuelve al modal de pago y conserva el plan aplicado', () => {
  assert.match(pos, /function payDlg\(draft\)/);
  assert.match(pos, /Volver al pago/);
  assert.match(pos, /payDlg\(draftNow\)/);
  assert.match(pos, /Confirme el cobro para finalizar la factura/);
  assert.match(pos, /Array\.from\(\{length:cuotasCount\}/);
});

test('Cashea no inventa una aprobación ni afirma conexión oficial inexistente', () => {
  assert.doesNotMatch(pos, /placeholder="CSH-894120" value="CSH-/);
  assert.doesNotMatch(pos, /const cRef=\(refs&&refs\.cashea\)\|\|\('CSH-'\+/);
  assert.match(pos, /código real de aprobación Cashea/);
  assert.match(pos, /no consulta ni confirma aprobaciones mediante la API oficial de Cashea/);
});

test('las liquidaciones CASHEA se encolan y se aceptan al sincronizar cajas', () => {
  assert.match(operationOptions, /\['casheaLiquidaciones','cashea-settlement'\]/);
  assert.match(electron, /'casheaLiquidaciones'/);
  assert.match(electron, /allowedCollections\.has\(collection\)/);
});

test('cobros expone efectivo, Zelle, pago móvil, transferencia, tarjeta, Biopago y Cashea', () => {
  for (const method of ['efUSD','efBs','zelle','pmovil','transf','punto','biopago','cashea']) {
    assert.match(options, new RegExp("id:'" + method + "'"));
  }
  assert.match(pos, /id="pm-'\+m\.id\+'" data-m="'\+m\.id\+'/);
  assert.match(pos, /const pays=METHODS\.filter\(m=>amts\[m\.id\]>0\)/);
  assert.match(pos, /Enviar saldo pendiente a/);
  assert.match(pos, /S\.cxc\.push/);
});

test('CASHEA permite seleccionar liquidaciones parciales y concilia solo el lote seleccionado', () => {
  assert.match(pos, /const allPendings = \(S\.casheaMovimientos \|\| \[\]\)\.filter/);
  assert.match(pos, /data-liq-op=/);
  assert.match(pos, /pendings = allPendings\.filter/);
  assert.match(pos, /totFinanciado = r2\(pendings\.reduce/);
  assert.match(pos, /Math\.abs\(depositUsd-netoUsd\)>0\.01/);
  assert.match(pos, /m\.estado = 'Liquidado'/);
});

test('CASHEA registra reversión auditada, exige autorización y devuelve operaciones a pendientes', () => {
  assert.match(pos, /function reverseCasheaSettlement\(/);
  assert.match(pos, /requestPin\('Revertir liquidación CASHEA '\+lot\.id\)/);
  assert.match(pos, /No se puede revertir: el servicio de autorización no está disponible/);
  assert.match(pos, /lot\.estado='Revertido'/);
  assert.match(pos, /tipo:'REVERSIÓN'/);
  assert.match(pos, /m\.estado='Pendiente Liquidación'/);
  assert.match(pos, /data-csh-reverse=/);
});

test('la liquidación CASHEA guarda referencia bancaria y el depósito real conciliado', () => {
  assert.match(pos, /refBancaria = ref/);
  assert.match(pos, /depositadoUsd:depositUsd/);
  assert.match(pos, /diferenciaUsd:r2\(depositUsd-netoUsd\)/);
});

test('SQLite valida integridad antes de guardar y mantiene respaldo recuperable', () => {
  assert.match(electron, /function databaseIntegrityStatus\(/);
  assert.match(electron, /PRAGMA integrity_check/);
  assert.match(electron, /Se impidió guardar SQLite/);
  assert.match(electron, /const backup = target \+ '\.bak'/);
  assert.match(electron, /fs\.copyFileSync\(target, backupTemporary\)/);
  assert.match(electron, /const backup = file \+ '\.bak'/);
  assert.match(electron, /file \+ '\.corrupt-'/);
  assert.match(electron, /integrity_check/);
});


test('main.js queda reducido y las responsabilidades operativas viven en módulos separados', () => {
  assert.ok(pos.length < 220000, 'main.js debe quedar por debajo de 220 KB tras extraer módulos funcionales');
  assert.doesNotMatch(pos, /function recoverDlg/); assert.match(inventoryModule, /function recoverDlg/);
  assert.doesNotMatch(pos, /function comprasDlg/); assert.match(purchasingModule, /function comprasDlg/);
  assert.doesNotMatch(pos, /function casheaPaymentAssistantDlg/); assert.match(paymentsModule, /function casheaPaymentAssistantDlg/);
  assert.doesNotMatch(pos, /function downloadBlob/); assert.match(fiscalModule, /function downloadBlob/);
  assert.doesNotMatch(pos, /function getZHistory/); assert.match(cashZ, /function getZHistory/);
  assert.doesNotMatch(pos, /function databaseSettingsDlg/); assert.match(databaseModule, /function databaseSettingsDlg/);
  for (const src of ['/inventory-module.js','/purchasing-module.js','/payments-module.js','/fiscal-reports.js','/cash-z-module.js','/database-settings-module.js']) assert.ok(indexHtml.includes('<script src="'+src+'"></script>'));
});
test('el arqueo Z calcula fondos, vuelto y movimientos solo de la caja y turno correctos', () => {
  const zSource = pos + '\n' + cashZ;
  const start = zSource.indexOf('function zExpectedByMethod(sales,opening)');
  const end = zSource.indexOf('\nfunction zDiffStatus', start);
  assert.ok(start >= 0 && end > start, 'debe existir el cálculo puro del arqueo Z');
  const calc = vm.runInNewContext(zSource.slice(start, end) + '\n;zExpectedByMethod', {
    METHODS: [{ id: 'efBs' }, { id: 'efUSD' }, { id: 'pmovil' }],
    S: { cfg: { rate: 10 }, movimientosCaja: [
      { id: 'M1', cashbox: '01', ts: 200, currency: 'USD', amount: 3, direction: 'IN' },
      { id: 'M2', cashbox: '01', ts: 201, currency: 'BS', amount: 10, direction: 'OUT' },
      { id: 'M3', cashbox: '02', ts: 202, currency: 'USD', amount: 100, direction: 'IN' },
      { id: 'M4', cashbox: '01', ts: 99, currency: 'USD', amount: 100, direction: 'IN' }
    ] },
    r2: n => Math.round((Number(n) + Number.EPSILON) * 100) / 100
  });
  const result = calc([{ pays: [{ id: 'efUSD', amount: 10 }, { id: 'pmovil', amount: 50 }], change: 5, rate: 10 }], { cashbox: '01', openedAt: 100, bs: 100, usd: 20 });
  assert.equal(result.efUSD, 28, 'USD debe incluir apertura, cobro, vuelto y movimiento de caja vigente');
  assert.equal(result.efBs, 90, 'Bs debe descontar las salidas de efectivo del turno');
  assert.equal(result.pmovil, 50, 'pagos electrónicos no deben mezclarse con el efectivo físico');
});

test('los movimientos físicos de caja se guardan, se restauran y se incluyen en sincronización', () => {
  const snapshotStart = pos.indexOf('function stateSnapshot()');
  const snapshotEnd = pos.indexOf('\nfunction persistenceError', snapshotStart);
  assert.ok(snapshotStart >= 0 && snapshotEnd > snapshotStart, 'debe existir un snapshot de estado persistible');
  const snapshot = pos.slice(snapshotStart, snapshotEnd);
  assert.match(snapshot, /movimientosCaja:S\.movimientosCaja\|\|\[\]/);
  const loadStart = pos.indexOf('function load()');
  const loadEnd = pos.indexOf('\nfunction ', loadStart + 20);
  assert.ok(loadStart >= 0 && loadEnd > loadStart, 'debe existir la restauración del estado');
  assert.match(pos.slice(loadStart, loadEnd), /S\.movimientosCaja=Array\.isArray\(d\.movimientosCaja\)/);
  const loadBody = pos.slice(loadStart, loadEnd);
  assert.ok(loadBody.indexOf('S.sales=Array.isArray(d.sales)?d.sales:S.sales') < loadBody.indexOf('S.sales.forEach(x=>'), 'las ventas restauradas deben normalizar su caja después de cargarse');
  assert.ok(loadBody.indexOf('if(Array.isArray(d.cxc))S.cxc=d.cxc') < loadBody.indexOf('S.cxc.forEach(x=>'), 'los saldos CxC restaurados deben normalizar su caja después de cargarse');
});

test('la identidad de operaciones LAN separa facturas de cajas distintas con el mismo número', () => {
  const start = electron.indexOf('const BOX_SCOPED_SYNC_COLLECTIONS');
  const end = electron.indexOf('\nfunction mergeStateRecords', start);
  assert.ok(start >= 0 && end > start, 'el servidor debe definir identidad de registro con ámbito de caja');
  const syncRecordKey = vm.runInNewContext(electron.slice(start, end) + '\n;syncRecordKey');
  assert.notEqual(
    syncRecordKey({ no: 1, cashbox: '01' }, 'sales'),
    syncRecordKey({ no: 1, cashbox: '02' }, 'sales'),
    'dos cajas pueden emitir la misma secuencia de factura sin colisionar'
  );
  assert.equal(syncRecordKey({ id: 'RET-1' }, 'retentions'), 'RET-1', 'las colecciones globales conservan su identidad normal');
  assert.match(pos, /function operationEntityId\(item,collection\)/);
  assert.match(pos, /operationIdentity\(item,index,collection\)/);
  assert.match(pos, /operationIdentity\(item,i,key\)/);
});

test('la fusión LAN compara correctamente versiones ISO y numéricas sin resucitar datos antiguos', () => {
  const start = electron.indexOf('function recordVersion(');
  const end = electron.indexOf('\nfunction userDbPath()', start);
  assert.ok(start >= 0 && end > start, 'deben existir las funciones de versión y fusión del servidor');
  const helpers = vm.runInNewContext(electron.slice(start, end) + '\n;({ recordVersion, mergeStateRecords })');
  const isoMerged = helpers.mergeStateRecords(
    { sales: [{ id: 'F-1', updatedAt: '2026-10-17T10:00:00.000Z', status: 'updated' }] },
    { sales: [{ id: 'F-1', updatedAt: '2026-10-17T09:00:00.000Z', status: 'stale' }] }
  );
  assert.equal(isoMerged.sales[0].status, 'updated', 'una fecha ISO más antigua no debe reemplazar la versión actual');
  const numericMerged = helpers.mergeStateRecords(
    { sales: [{ id: 'F-2', ts: 200, status: 'old' }] },
    { sales: [{ id: 'F-2', ts: 300, status: 'new' }] }
  );
  assert.equal(numericMerged.sales[0].status, 'new', 'una versión numérica más reciente debe prevalecer');
  const combined = helpers.mergeStateRecords({ movimientosCaja: [{ id: 'MOV-1', cashbox: '01', amount: 10 }] }, { movimientosCaja: [{ id: 'MOV-1', cashbox: '02', amount: 20 }] });
  assert.equal(combined.movimientosCaja.length, 2, 'las dos cajas deben conservar sus movimientos aunque coincida el ID');
});

test('la fusión del servidor conserva todas las colecciones operativas del snapshot del POS', () => {
  const mergeBlock = electron.match(/function mergeStateRecords\(base, incoming\) \{[\s\S]*?const arrays = new Set\(\[([^\]]+)\]\)/);
  assert.ok(mergeBlock, 'el servidor debe fusionar explícitamente las colecciones tipo array');
  const mergedCollections = [...mergeBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
  for (const collection of [
    'sales', 'purchases', 'cxc', 'cxp', 'cortesZ', 'kardex', 'counts', 'held', 'movimientosCaja',
    'casheaMovimientos', 'casheaLiquidaciones', 'cambiosDivisas', 'retencionesIva', 'lotesSudeban'
  ]) {
    assert.ok(mergedCollections.includes(collection), 'la sincronización no debe reemplazar datos de ' + collection + ' por el snapshot de una sola caja');
  }
});

test('el mapeo del POS y la lista blanca del servidor aceptan exactamente las mismas colecciones', () => {
  const mapping = [...operationOptions.matchAll(/Object\.freeze\(\['([^']+)','[^']+'\]\)/g)].map(match => match[1]);
  const allowedBlock = electron.match(/const allowedCollections = new Set\(\[([^\]]+)\]\)/);
  assert.ok(allowedBlock, 'el servidor debe declarar explícitamente su lista blanca');
  const allowed = [...allowedBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);

  assert.equal(new Set(mapping).size, mapping.length, 'no debe haber colecciones duplicadas en el mapeo');
  assert.deepEqual([...mapping].sort(), [...allowed].sort(), 'cada colección encolada debe ser aceptada por el servidor y viceversa');
});
