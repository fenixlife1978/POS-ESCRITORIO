const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

let db;
let dbConfigPath;
let databaseMode = 'sqlite';
let saveTimer;

function userDbPath() {
  return path.join(app.getPath('userData'), 'elpiston.sqlite');
}
function persistDb() {
  if (!db) return;
  const bytes = db.export();
  fs.writeFileSync(userDbPath(), Buffer.from(bytes));
}
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  try { stmt.run(params); } finally { stmt.free(); }
}
function one(sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    return stmt.step() ? stmt.getAsObject() : null;
  } finally { stmt.free(); }
}
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    return rows;
  } finally { stmt.free(); }
}
function initializeSchema() {
  db.run(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS fiscal_documents (
      id TEXT PRIMARY KEY,
      transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale','purchase')),
      transaction_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      sha256 TEXT NOT NULL,
      data_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_fiscal_documents_transaction
      ON fiscal_documents(transaction_type, transaction_id);
  `);
  persistDb();
}
async function initializeDatabase() {
  const SQL = await initSqlJs({ locateFile: (file) => require.resolve('sql.js/dist/' + file) });
  const file = userDbPath();
  if (fs.existsSync(file)) {
    try { db = new SQL.Database(new Uint8Array(fs.readFileSync(file))); }
    catch { db = new SQL.Database(); }
  } else db = new SQL.Database();
  initializeSchema();
  dbConfigPath = path.join(app.getPath('userData'), 'database-mode.json');
  try {
    const cfg = JSON.parse(fs.readFileSync(dbConfigPath, 'utf8'));
    if (cfg.mode === 'sqlite' || cfg.mode === 'turso') databaseMode = cfg.mode;
  } catch {}
}
async function chooseMode(win) {
  const choice = await dialog.showMessageBox(win, {
    type: 'question',
    title: 'Configurar base de datos — POS El Pistón',
    message: '¿Dónde desea guardar exclusivamente los datos operativos de este POS?',
    detail: 'SQLite local guarda la información en este computador y no la sincroniza con la nube. Turso utiliza la API de Vercel y requiere configurar la URL pública del sistema y las variables de entorno en Vercel.',
    buttons: ['SQLite local (solo este equipo)', 'Turso mediante Vercel', 'Decidir más tarde'],
    defaultId: 0,
    cancelId: 2,
    noLink: true
  });
  if (choice.response === 0) await setMode('sqlite');
  if (choice.response === 1) await setMode('turso');
  return databaseMode;
}
async function setMode(mode) {
  if (!['sqlite', 'turso'].includes(mode)) throw new Error('Modo de base de datos no válido.');
  databaseMode = mode;
  fs.writeFileSync(dbConfigPath, JSON.stringify({ mode, updatedAt: new Date().toISOString() }, null, 2), 'utf8');
  return { mode, databasePath: mode === 'sqlite' ? userDbPath() : null };
}
function registerIpc() {
  ipcMain.handle('posdb:get-mode', () => ({ mode: databaseMode, databasePath: databaseMode === 'sqlite' ? userDbPath() : null }));
  ipcMain.handle('posdb:set-mode', (_e, mode) => setMode(mode));
  ipcMain.handle('posdb:show-mode-picker', (e) => chooseMode(BrowserWindow.fromWebContents(e.sender)));
  ipcMain.handle('posdb:load-state', () => {
    if (databaseMode !== 'sqlite') return { mode: databaseMode, state: null };
    const row = one('SELECT payload FROM app_state WHERE id=1');
    return { mode: databaseMode, state: row ? JSON.parse(row.payload) : null };
  });
  ipcMain.handle('posdb:save-state', (_e, state) => {
    if (databaseMode !== 'sqlite') throw new Error('SQLite local no está seleccionado.');
    const payload = JSON.stringify(state);
    run('INSERT INTO app_state(id,payload,updated_at) VALUES(1,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updated_at=CURRENT_TIMESTAMP', [payload]);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persistDb, 80);
    return { ok: true };
  });
  ipcMain.handle('posdb:list-documents', (_e, filter = {}) => {
    if (databaseMode !== 'sqlite') return [];
    const type = filter.transactionType;
    if (type === 'sale' || type === 'purchase') return all('SELECT id,transaction_type AS transactionType,transaction_id AS transactionId,file_name AS fileName,mime_type AS mimeType,file_size AS fileSize,sha256,created_at AS createdAt,notes FROM fiscal_documents WHERE transaction_type=? AND transaction_id=? ORDER BY created_at DESC', [type, String(filter.transactionId || '')]);
    return all('SELECT id,transaction_type AS transactionType,transaction_id AS transactionId,file_name AS fileName,mime_type AS mimeType,file_size AS fileSize,sha256,created_at AS createdAt,notes FROM fiscal_documents ORDER BY created_at DESC');
  });
  ipcMain.handle('posdb:save-document', (_e, doc) => {
    if (databaseMode !== 'sqlite') throw new Error('SQLite local no está seleccionado.');
    if (!doc || !doc.id || !['sale','purchase'].includes(doc.transactionType) || !doc.transactionId || !doc.dataUrl) throw new Error('Documento incompleto.');
    if (String(doc.dataUrl).length > 4_300_000) throw new Error('El archivo supera el límite local de 3 MB.');
    run('INSERT OR REPLACE INTO fiscal_documents(id,transaction_type,transaction_id,file_name,mime_type,file_size,sha256,data_url,created_at,notes) VALUES(?,?,?,?,?,?,?,?,?,?)',
      [String(doc.id), doc.transactionType, String(doc.transactionId), String(doc.fileName || 'documento'), String(doc.mimeType || 'application/octet-stream'), Number(doc.fileSize || 0), String(doc.sha256 || ''), String(doc.dataUrl), String(doc.createdAt || new Date().toISOString()), String(doc.notes || '')]);
    persistDb();
    return { ok: true };
  });
  ipcMain.handle('posdb:get-document', (_e, id) => {
    if (databaseMode !== 'sqlite') return null;
    return one('SELECT id,transaction_type AS transactionType,transaction_id AS transactionId,file_name AS fileName,mime_type AS mimeType,file_size AS fileSize,sha256,data_url AS dataUrl,created_at AS createdAt,notes FROM fiscal_documents WHERE id=?', [String(id)]);
  });
  ipcMain.handle('posdb:delete-document', (_e, id) => {
    if (databaseMode !== 'sqlite') throw new Error('SQLite local no está seleccionado.');
    run('DELETE FROM fiscal_documents WHERE id=?', [String(id)]);
    persistDb();
    return { ok: true };
  });
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 900, minHeight: 600,
    title: 'POS El Pistón - Sistema de Punto de Venta e Inventario',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false, contextIsolation: true, sandbox: true
    }
  });
  win.maximize();
  Menu.setApplicationMenu(null);
  if (app.isPackaged) win.loadFile(path.join(__dirname, '../dist/index.html'));
  else {
    const distPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(distPath)) win.loadFile(distPath);
    else win.loadURL('http://localhost:3000');
  }
  return win;
}
app.whenReady().then(async () => {
  await initializeDatabase();
  registerIpc();
  const win = createWindow();
  if (!fs.existsSync(dbConfigPath)) {
    win.webContents.once('did-finish-load', () => chooseMode(win));
  }
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', () => { clearTimeout(saveTimer); persistDb(); });
