/* Configuración de base de datos y almacenamiento. Fragmento ensamblado dentro del IIFE de main.js por scripts/build-main.mjs. */
async function databaseSettingsDlg(){
  const isDesktop = !!window.posDesktop;
  const salesCount = S.sales ? S.sales.length : 0;
  const prodCount = S.products ? S.products.length : 0;
  const cshCount = S.casheaMovimientos ? S.casheaMovimientos.length : 0;
  const krdxCount = S.kardex ? S.kardex.length : 0;

  const el = h('<div class="form" style="gap:14px">' +
    '<div style="background:#0F172A;border:1px solid #1E293B;border-radius:8px;padding:14px;display:flex;flex-direction:column;gap:8px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between">' +
        '<b style="color:#38BDF8;font-size:15px;display:inline-flex;align-items:center;gap:6px">' +
          '<svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' +
          'Base de Datos Local SQLite (100% Offline)' +
        '</b>' +
        '<span style="background:#065F46;color:#6EE7B7;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px">CONECTADO LOCAL</span>' +
      '</div>' +
      '<div class="hint" style="margin:0;color:#94A3B8;line-height:1.5">' +
        'Este software opera <b>exclusivamente con SQLite local</b> (<code>elpiston.sqlite</code>). No depende de Turso, Vercel ni conexiones a internet. Todas las ventas, clientes, compras, inventario, libro fiscal SENIAT y pagos CASHEA residen permanentemente en este equipo.' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-top:4px">' +
        '<div style="background:#1E293B;padding:8px 10px;border-radius:6px"><span style="font-size:10px;color:#94A3B8;display:block">MOTOR SQL</span><b style="color:#F1F5F9;font-size:12px">' + (isDesktop ? 'SQLite3 Nativo (Electron)' : 'SQLite3 WebAssembly (sql.js)') + '</b></div>' +
        '<div style="background:#1E293B;padding:8px 10px;border-radius:6px"><span style="font-size:10px;color:#94A3B8;display:block">ARCHIVO / IDB</span><b style="color:#F1F5F9;font-size:12px">elpiston.sqlite</b></div>' +
        '<div style="background:#1E293B;padding:8px 10px;border-radius:6px"><span style="font-size:10px;color:#94A3B8;display:block">VENTAS REGISTRADAS</span><b style="color:#38BDF8;font-size:13px">' + salesCount + '</b></div>' +
        '<div style="background:#1E293B;padding:8px 10px;border-radius:6px"><span style="font-size:10px;color:#94A3B8;display:block">OPERACIONES CASHEA</span><b style="color:#A78BFA;font-size:13px">' + cshCount + '</b></div>' +
      '</div>' +
    '</div>' +

    '<div style="background:#131C2E;border:1px solid #1E293B;border-radius:8px;padding:12px">' +
      '<b style="color:#F8FAFC;font-size:13px;display:block;margin-bottom:8px">Copias de Seguridad y Restauración de SQLite</b>' +
      '<div class="row" style="flex-wrap:wrap;gap:8px">' +
        '<button class="btn primary" id="dbExportSqlite" type="button" style="display:inline-flex;align-items:center;gap:6px">' +
          '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
          'Descargar copia (.sqlite)' +
        '</button>' +
        '<button class="btn" id="dbImportSqliteBtn" type="button" style="display:inline-flex;align-items:center;gap:6px">' +
          '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
          'Restaurar copia (.sqlite)' +
        '</button>' +
        '<input type="file" id="dbImportSqliteFile" accept=".sqlite,.db" hidden>' +
        '<button class="btn" id="dbExportJson" type="button" title="Respaldo completo de datos en formato JSON">Respaldo JSON</button>' +
        '<button class="btn" id="dbResetAll" type="button" style="color:#F87171;border-color:#7F1D1D" title="Reiniciar a datos iniciales de fábrica">Reiniciar base</button>' +
      '</div>' +
      '<div id="dbMsg" class="hint" style="margin-top:10px;min-height:18px"></div>' +
    '</div>' +
  '</div>');

  const note = $('#dbMsg', el);

  $('#dbExportSqlite', el).addEventListener('click', () => {
    try {
      const bytes = posSqliteDriver.exportSqlite();
      if (!bytes) {
        /* Export JSON snapshot if raw sqlite bytes not loaded in memory */
        const blob = new Blob([JSON.stringify(stateSnapshot(), null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'elpiston-estado-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        note.textContent = 'Respaldo de datos exportado correctamente.';
        return;
      }
      const blob = new Blob([bytes], { type: 'application/x-sqlite3' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'elpiston-backup-' + new Date().toISOString().slice(0, 10) + '.sqlite';
      a.click();
      note.textContent = 'Archivo elpiston.sqlite descargado exitosamente.';
    } catch (e) {
      note.textContent = 'Error al exportar SQLite: ' + e.message;
    }
  });

  const fileInput = $('#dbImportSqliteFile', el);
  $('#dbImportSqliteBtn', el).addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    note.textContent = 'Importando base de datos SQLite…';
    try {
      const buf = await file.arrayBuffer();
      await posSqliteDriver.importSqlite(buf);
      note.textContent = 'Base de datos SQLite restaurada correctamente. Recargando…';
      setTimeout(() => location.reload(), 800);
    } catch (e) {
      note.textContent = 'Error restaurando SQLite: ' + e.message;
    }
  });

  $('#dbExportJson', el).addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify(stateSnapshot(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'elpiston-snapshot-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      note.textContent = 'Respaldo JSON descargado con éxito.';
    } catch (e) {
      note.textContent = 'Error al exportar: ' + e.message;
    }
  });

  $('#dbResetAll', el).addEventListener('click', () => {
    resetAll();
  });

  openWin({
    title: 'Base de Datos Local SQLite',
    w: 620,
    body: el,
    foot: [{ label: 'Cerrar', primary: true }]
  });
}
