import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const pos = readFileSync(new URL('../public/main.js', import.meta.url), 'utf8');
const cashZ = readFileSync(new URL('../public/cash-z-module.js', import.meta.url), 'utf8');
const fiscalModule = readFileSync(new URL('../public/fiscal-reports.js', import.meta.url), 'utf8');
const inventoryModule = readFileSync(new URL('../public/inventory-module.js', import.meta.url), 'utf8');
const purchasingModule = readFileSync(new URL('../public/purchasing-module.js', import.meta.url), 'utf8');
const paymentsModule = readFileSync(new URL('../public/payments-module.js', import.meta.url), 'utf8');
const databaseModule = readFileSync(new URL('../public/database-settings-module.js', import.meta.url), 'utf8');
const source = [cashZ, fiscalModule, inventoryModule, purchasingModule, paymentsModule, databaseModule, pos].join('\n');
const access = readFileSync(new URL('../public/access.js', import.meta.url), 'utf8');

test('Corte Z carga la apertura antes de calcular el inicio del turno', () => {
  const fn = source.slice(source.indexOf('function corteZDlg(){'), source.indexOf('function buildChrome(', source.indexOf('function corteZDlg(){')));
  assert.match(fn, /let active=readActiveOpening\(\);/);
  assert.match(fn, /const shiftStart=\(\)=>active&&active\.openedAt/);
  assert.doesNotMatch(fn, /const shiftStart=active&&active\.openedAt[\s\S]{0,150}const active=/);
});

test('Corte Z permite registrar fondo inicial cuando no hay turno abierto', () => {
  assert.match(source, /id="zOpeningBs"/);
  assert.match(source, /id="zOpeningUsd"/);
  assert.match(source, /id="zOpenShift"/);
  assert.match(source, /status:'abierta'/);
  assert.match(source, /writeActiveOpening\(active\)/);
});

test('el arqueo compara cada método de pago y calcula diferencia real menos sistema', () => {
  assert.match(source, /data-z-real=/);
  assert.match(source, /Saldo en sistema/);
  assert.match(source, /Monto real contado \/ conciliado/);
  assert.match(source, /r2\(real\[r\.id\]-r\.system\)/);
  assert.match(source, /shortageUsd/);
  assert.match(source, /surplusBs/);
  assert.match(source, /CONCILIADO · CUADRA/);
});

test('no permite cerrar hasta que todos los métodos tengan importe real explícito', () => {
  assert.match(source, /Complete el importe real de todos los métodos de pago/);
  assert.match(source, /!result\.total\.complete/);
});

test('el Corte Z guarda conciliación, observaciones, apertura y operador en el historial', () => {
  assert.match(source, /reconciliation:rec/);
  assert.match(source, /reconciliationStatus:status/);
  assert.match(source, /observations:\$\('\#zObservations',el\)\.value\.trim\(\)/);
  assert.match(source, /openingId:active\.id/);
  assert.match(source, /getZHistory\(\)\.push\(z\)/);
});

test('historial tiene acciones separadas para mostrar y reimprimir cada Corte Z', () => {
  assert.match(source, /data-z-view=/);
  assert.match(source, /data-z-print=/);
  assert.match(source, /if\(view\)[\s\S]{0,220}printCorteZ\(z,false\)/);
  assert.match(source, /if\(reprint\)[\s\S]{0,220}printCorteZ\(z,true\)/);
});

test('reporte térmico incluye detalle de conciliación y aclara que no emite fiscal', () => {
  assert.match(source, /@page\{size:80mm auto/);
  assert.match(source, /ARQUEO DE CAJA · POR MÉTODO/);
  assert.match(source, /TOTALES COBRADOS · POR MÉTODO/);
  assert.match(source, /Diferencia/);
  assert.match(source, /ni registra una operación directamente en una impresora fiscal/);
});

test('Corte Z abre vista previa térmica de 80 mm antes de imprimir al confirmar el cierre', () => {
  assert.match(source, /Vista previa de impresión · Térmica 80 mm/);
  assert.match(source, /onclick="window\.print\(\)"/);
  assert.match(source, /\.zpreview-tools\{display:none!important\}/);
  assert.match(source, /msg\('Corte Z '\+z\.id\+' guardado\. Resultado: '\+status\+'\. Se abrirá la vista previa de 80 mm para imprimir\.'\);\s*printCorteZ\(z,false\);draw\(\);/);
});

test('el reporte Z destaca el arqueo por método antes de detallar movimientos físicos', () => {
  const printStart = source.indexOf('function printCorteZ(');
  const printEnd = source.indexOf('function corteZDlg(', printStart);
  const report = source.slice(printStart, printEnd);
  assert.match(report, /ARQUEO DE CAJA · POR MÉTODO/);
  assert.match(report, /RESULTADO DEL ARQUEO/);
  assert.match(report, /SISTEMA/);
  assert.match(report, /REAL CONTADO O CONCILIADO/);
  assert.match(report, /DIFERENCIA/);
  assert.ok(report.indexOf('ARQUEO DE CAJA · POR MÉTODO') < report.indexOf('MOVIMIENTOS DE EFECTIVO FÍSICO'));
  assert.match(report, /Este Corte Z no contiene detalle de arqueo por método/);
});

function extractFunction(name, nextName) {
  const start = source.indexOf('function ' + name + '(');
  const end = source.indexOf('function ' + nextName + '(', start);
  assert.ok(start >= 0 && end > start, 'Debe existir ' + name + ' y su siguiente función');
  return source.slice(start, end);
}

test('cálculo real de saldos por método incluye fondo inicial y resta el vuelto', () => {
  const methodSource = extractFunction('zExpectedByMethod', 'zDiffStatus');
  const calculate = runInNewContext(
    'const r2=n=>Math.round((n+Number.EPSILON)*100)/100;' +
    'const METHODS=[{id:"efUSD"},{id:"zelle"},{id:"cashea"},{id:"efBs"},{id:"punto"},{id:"biopago"},{id:"pmovil"},{id:"transf"}];' +
    'const S={cfg:{rate:10}};' + methodSource + ';zExpectedByMethod'
  );
  const result = calculate([
    { rate: 10, change: 1, pays: [{ id: 'efBs', amount: 110 }] },
    { rate: 10, change: 0, pays: [{ id: 'zelle', amount: 25 }, { id: 'punto', amount: 50 }] }
  ], { bs: 100, usd: 5 });
  assert.equal(result.efBs, 200);
  assert.equal(result.efUSD, 5);
  assert.equal(result.zelle, 25);
  assert.equal(result.punto, 50);
  assert.equal(result.cashea, 0);
});

test('estado de conciliación distingue cuadra, faltante, sobrante y mezcla', () => {
  const statusSource = extractFunction('zDiffStatus', 'printCorteZ');
  const status = runInNewContext(statusSource + ';zDiffStatus');
  assert.equal(status([{ diff: 0 }, { diff: 0.009 }]), 'CONCILIADO · CUADRA');
  assert.equal(status([{ diff: -3 }, { diff: 0 }]), 'FALTANTE');
  assert.equal(status([{ diff: 4 }, { diff: 0 }]), 'SOBRANTE');
  assert.equal(status([{ diff: -3 }, { diff: 4 }]), 'CON DIFERENCIAS · FALTANTES Y SOBRANTES');
});

test('la vista previa 80 mm está disponible antes de confirmar el cierre y no guarda el corte', () => {
  const fn = source.slice(source.indexOf('function corteZDlg(){'), source.indexOf('function buildChrome(', source.indexOf('function corteZDlg(){')));
  assert.match(fn, /id="zPreview">Vista previa del reporte Z · 80 mm/);
  assert.match(fn, /id="zClose">Confirmar cierre e imprimir/);
  assert.ok(fn.indexOf('id="zPreview"') < fn.indexOf('id="zClose"'));
  assert.match(fn, /if\(e\.target\.id==='zPreview'\)[\s\S]*?const draft=\{/);
  assert.match(fn, /payments:zPayTotals\(sales\)/);
  assert.match(fn, /reconciliation:rec/);
  assert.match(fn, /printCorteZ\(draft,false\);return;/);
  assert.match(source, /Object\.entries\(z\.payments\)\.map\(\(\[name,amount\]\)=>line\(name,name\.includes\('\(VES\)'\)\?bsf\(amount\):usd\(amount\)\)/);
});

test('el cierre explica visiblemente los requisitos y se habilita solo con arqueo completo', () => {
  assert.match(source, /id="zActionStatus" role="status" aria-live="polite"/);
  assert.match(source, /Arqueo incompleto: ingrese el monto real de los 8 métodos de pago/);
  assert.match(source, /Arqueo completo\. Puede revisar la vista previa de 80 mm y confirmar el cierre/);
  assert.match(source, /\$\('#zClose',el\)\.disabled=!opened\|\|!result\.total\.complete/);
});

test('el formulario de arqueo está destacado antes de movimientos de caja', () => {
  const fn = source.slice(source.indexOf('function corteZDlg(){'), source.indexOf('function buildChrome(', source.indexOf('function corteZDlg(){')));
  assert.match(fn, /id="zArqueoPanel"[\s\S]*?ARQUEO PREVIO POR MÉTODO DE PAGO/);
  assert.ok(fn.indexOf('id="zArqueoPanel"') < fn.indexOf('Movimientos de efectivo físico'));
  assert.match(fn, /id="zReconcile"/);
  assert.match(fn, /id="zTotals"/);
  assert.match(fn, /si no tuvo movimientos, escriba 0,00/i);
  assert.doesNotMatch(fn, /\$\('#zClose',el\)\.disabled=!opened;\s*\$\('#zPreview',el\)\.disabled=!opened;/);
});


test('Corte Z reutiliza la apertura de inicio de sesión y oculta la segunda apertura si ya existe turno', () => {
  const fn = source.slice(source.indexOf('function corteZDlg(){'), source.indexOf('function buildChrome(', source.indexOf('function corteZDlg(){')));
  assert.match(fn, /\$\('#zOpenPanel',el\)\.hidden=opened/);
  assert.match(fn, /La apertura de caja ya está registrada\. Se reutiliza el turno iniciado al entrar al POS/);
  assert.match(fn, /No se detectó una apertura válida para esta caja\. Registre el fondo inicial aquí solo si no se hizo al iniciar sesión/);
  assert.match(access, /sessionStorage\.setItem\('sifer360_active_opening',JSON\.stringify\(op\)\)/);
  assert.match(source, /const boxOpen=\(\)=>!!\(active&&String\(active\.cashbox\)===box&&active\.status==='abierta'\)/);
});
