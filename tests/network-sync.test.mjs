import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const electron = readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
const preload = readFileSync(new URL('../electron/preload.cjs', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../public/access.js', import.meta.url), 'utf8');
const pos = readFileSync(new URL('../public/main.js', import.meta.url), 'utf8');

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
  assert.match(ui, /IP DEL SERVIDOR/);
});

test('el panel explica límites de red y recomienda reserva de IP', () => {
  assert.match(ui, /reserva DHCP/);
  assert.match(ui, /no cifra el tráfico/);
  assert.match(ui, /ventas simultáneas sin conexión requieren conciliación/);
});

test('el servidor anuncia descubrimiento LAN sin exigir IP fija', () => {\n  assert.match(electron, /const dgram = require\\('dgram'\\)/);\n  assert.match(electron, /SIFER360_DISCOVER_V1/);\n  assert.match(electron, /SIFER360_SERVER_V1/);\n  assert.match(electron, /DISCOVERY_PORT = 38761/);\n  assert.match(electron, /function discoverLanServers/);\n});\n\ntest('la interfaz permite encontrar automáticamente la IP actual del servidor', () => {\n  assert.match(preload, /networkDiscover/);\n  assert.match(ui, /Buscar servidor automáticamente/);\n  assert.match(ui, /networkDiscover\\(\\)/);\n  assert.match(ui, /No hace falta configurar IP fija/);\n});\n