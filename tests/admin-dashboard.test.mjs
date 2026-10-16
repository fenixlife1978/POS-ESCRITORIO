import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const main = readFileSync(new URL('../public/main.js', import.meta.url), 'utf8');
const access = readFileSync(new URL('../public/access.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');

test('admin login goes straight to the business dashboard, not activity cards', () => {
  assert.match(access, /function renderDashboard\(u\)\{if\(u\.role==='admin'\)[\s\S]{0,350}window\.SIFERDashboard\.show\(\);return;/);
  assert.match(html, /id="adminDashboard"/);
  assert.match(html, /id="btnDashboard"/);
  assert.match(main, /window\.SIFERDashboard=\{show:showDashboardScreen/);
});

test('dashboard includes sales KPIs, percent comparison, seven-day trend and operational indicators', () => {
  assert.match(main, /Ventas de hoy/);
  assert.match(main, /vs\. día anterior/);
  assert.match(main, /Ticket promedio/);
  assert.match(main, /Ventas · últimos 7 días/);
  assert.match(main, /Inventario bajo mínimo/);
  assert.match(main, /Cuentas por pagar/);
});

test('administrator has user and cashbox management modules in the complete toolbar', () => {
  assert.match(main, /\['usuarios','Usuarios'/);
  assert.match(main, /\['cajas','Gestión cajas'/);
  assert.match(access, /admin:\[[^\]]*'usuarios','cajas'/);
  assert.match(main, /function usersManagementDlg\(/);
  assert.match(main, /function cashboxesManagementDlg\(/);
  assert.match(access, /getUsers:\(\)=>initUsers\(\),setUsers:users=>\{if\(!Array\.isArray\(users\)\)return false;/);
});

test('cashiers and administrators cannot share a box assignment; admins need an assigned and open box to charge', () => {
  assert.match(main, /La caja '\+cashbox\+' ya está asignada a otro usuario/);
  assert.match(main, /if\(loginUser\.role==='admin'\)[\s\S]{0,500}currentCaja\(\)==='SIN-ASIGNAR'/);
  assert.match(main, /Abra primero el turno de su caja desde Reporte Z antes de cobrar/);
  assert.match(main, /No se puede deshabilitar una caja con turno abierto/);
});

test('dashboard returns through the header and management styles remain responsive', () => {
  assert.match(main, /dashboardButton\.addEventListener\('click',\(\)=>showDashboardScreen\(\)\)/);
  assert.match(main, /showPosScreen\(\);t\[3\]\(\)/);
  assert.match(css, /\.main\.dashboard-mode \.left\{display:none!important\}/);
  assert.match(css, /@media\(max-width:560px\)\{\.main\.dashboard-mode/);
});
