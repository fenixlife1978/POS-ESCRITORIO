import { createClient } from '@libsql/client';

function client() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN en Vercel.');
  return createClient({ url, authToken });
}
function authorized(req: any) {
  const expected = process.env.POS_API_KEY;
  if (!expected) return false;
  const supplied = String(req.headers['x-pos-api-key'] || '');
  if (supplied.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return diff === 0;
}
export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  const host = String(req.headers.host || '');
  if (origin === 'null') {
    /* Electron file:// desktop build; writes still require POS_API_KEY. */
    res.setHeader('Access-Control-Allow-Origin', 'null');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-POS-API-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  } else if (origin) {
    try {
      const u = new URL(origin);
      if (u.host !== host) return res.status(403).json({ error: 'Origen no permitido.' });
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-POS-API-Key');
      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    } catch { return res.status(403).json({ error: 'Origen inválido.' }); }
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'PUT'].includes(req.method)) return res.status(405).json({ error: 'Método no permitido.' });
  if (!authorized(req)) return res.status(401).json({ error: 'Configure POS_API_KEY en Vercel e introdúzcala en la configuración de conexión del POS.' });
  let db;
  try {
    db = client();
    await db.execute('CREATE TABLE IF NOT EXISTS pos_app_state (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
    if (req.method === 'GET') {
      const columns = await db.execute('PRAGMA table_info(pos_app_state)');
      if (!columns.rows.some((c: any) => String(c.name) === 'revision')) await db.execute('ALTER TABLE pos_app_state ADD COLUMN revision INTEGER NOT NULL DEFAULT 1');
      const r = await db.execute('SELECT payload, updated_at, revision FROM pos_app_state WHERE id=1');
      return res.status(200).json({ state: r.rows[0] ? JSON.parse(String(r.rows[0].payload)) : null, updatedAt: r.rows[0]?.updated_at || null, revision: Number(r.rows[0]?.revision || 0) });
    }
    const payload = req.body?.state;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return res.status(400).json({ error: 'Estado inválido.' });
    const serialized = JSON.stringify(payload);
    if (Buffer.byteLength(serialized, 'utf8') > 2_500_000) return res.status(413).json({ error: 'Estado demasiado grande. Los documentos deben guardarse como adjuntos separados.' });
    const columns = await db.execute('PRAGMA table_info(pos_app_state)');
    if (!columns.rows.some((c: any) => String(c.name) === 'revision')) await db.execute('ALTER TABLE pos_app_state ADD COLUMN revision INTEGER NOT NULL DEFAULT 1');
    const current = await db.execute('SELECT revision FROM pos_app_state WHERE id=1');
    const currentRevision = Number(current.rows[0]?.revision || 0);
    const expectedRevision = Number(req.body?.expectedRevision);
    if (!Number.isFinite(expectedRevision) || expectedRevision !== currentRevision) {
      return res.status(409).json({ error: 'La base de datos cambió desde la última lectura. Se recargará el POS para evitar sobrescribir operaciones de otro equipo.', revision: currentRevision });
    }
    if (currentRevision === 0) {
      await db.execute({ sql: 'INSERT INTO pos_app_state(id,payload,revision,updated_at) VALUES(1,?,1,CURRENT_TIMESTAMP)', args: [serialized] });
    } else {
      const update = await db.execute({ sql: 'UPDATE pos_app_state SET payload=?,revision=revision+1,updated_at=CURRENT_TIMESTAMP WHERE id=1 AND revision=?', args: [serialized, expectedRevision] });
      if (Number(update.rowsAffected || 0) !== 1) return res.status(409).json({ error: 'Conflicto de escritura: otra sesión modificó la base de datos.', revision: currentRevision });
    }
    return res.status(200).json({ ok: true, updatedAt: new Date().toISOString(), revision: currentRevision + 1 });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Error de base de datos Turso.' });
  } finally { db?.close(); }
}
