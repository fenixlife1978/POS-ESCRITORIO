import { createClient } from '@libsql/client';

function client() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN en Vercel.');
  return createClient({ url, authToken });
}
function authorized(req: any) {
  const expected = process.env.POS_API_KEY;
  const supplied = String(req.headers['x-pos-api-key'] || '');
  if (!expected || supplied.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return diff === 0;
}
export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  const host = String(req.headers.host || '');
  if (origin) {
    try {
      const u = new URL(origin);
      if (u.host !== host) return res.status(403).json({ error: 'Origen no permitido.' });
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-POS-API-Key');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    } catch { return res.status(403).json({ error: 'Origen inválido.' }); }
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) return res.status(405).json({ error: 'Método no permitido.' });
  if (!authorized(req)) return res.status(401).json({ error: 'Configure POS_API_KEY en Vercel e introdúzcala en la configuración del POS.' });
  let db;
  try {
    db = client();
    await db.execute(`CREATE TABLE IF NOT EXISTS pos_fiscal_documents (
      id TEXT PRIMARY KEY, transaction_type TEXT NOT NULL CHECK(transaction_type IN ('sale','purchase')),
      transaction_id TEXT NOT NULL, file_name TEXT NOT NULL, mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL, sha256 TEXT NOT NULL, data_url TEXT NOT NULL,
      created_at TEXT NOT NULL, notes TEXT NOT NULL DEFAULT ''
    )`);
    await db.execute('CREATE INDEX IF NOT EXISTS idx_pos_fiscal_documents_tx ON pos_fiscal_documents(transaction_type, transaction_id)');
    if (req.method === 'GET') {
      const type = String(req.query?.type || '');
      const tx = String(req.query?.transactionId || '');
      const rows = type && tx
        ? await db.execute({ sql: 'SELECT id,transaction_type AS transactionType,transaction_id AS transactionId,file_name AS fileName,mime_type AS mimeType,file_size AS fileSize,sha256,created_at AS createdAt,notes FROM pos_fiscal_documents WHERE transaction_type=? AND transaction_id=? ORDER BY created_at DESC', args: [type, tx] })
        : await db.execute('SELECT id,transaction_type AS transactionType,transaction_id AS transactionId,file_name AS fileName,mime_type AS mimeType,file_size AS fileSize,sha256,created_at AS createdAt,notes FROM pos_fiscal_documents ORDER BY created_at DESC');
      return res.status(200).json({ documents: rows.rows });
    }
    if (req.method === 'DELETE') {
      const id = String(req.query?.id || req.body?.id || '');
      if (!id) return res.status(400).json({ error: 'Falta id.' });
      await db.execute({ sql: 'DELETE FROM pos_fiscal_documents WHERE id=?', args: [id] });
      return res.status(200).json({ ok: true });
    }
    const d = req.body;
    if (!d?.id || !['sale','purchase'].includes(d.transactionType) || !d.transactionId || typeof d.dataUrl !== 'string') return res.status(400).json({ error: 'Documento incompleto.' });
    if (d.dataUrl.length > 4_000_000) return res.status(413).json({ error: 'El documento supera el límite de 3 MB.' });
    await db.execute({ sql: 'INSERT OR REPLACE INTO pos_fiscal_documents(id,transaction_type,transaction_id,file_name,mime_type,file_size,sha256,data_url,created_at,notes) VALUES(?,?,?,?,?,?,?,?,?,?)', args: [String(d.id), d.transactionType, String(d.transactionId), String(d.fileName || 'documento'), String(d.mimeType || 'application/octet-stream'), Number(d.fileSize || 0), String(d.sha256 || ''), d.dataUrl, String(d.createdAt || new Date().toISOString()), String(d.notes || '')] });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Error de base de datos Turso.' });
  } finally { db?.close(); }
}
