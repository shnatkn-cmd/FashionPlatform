'use strict';

/**
 * MySQL connection (Hostinger).
 *
 * The pool is created lazily the first time it is needed, using the
 * credentials from environment variables (see .env.example). Until the
 * Hostinger database details are provided, the app still runs — anything that
 * touches the DB will simply report that it is not configured yet.
 *
 * When the DB credentials arrive:
 *   1. Copy .env.example to .env and fill DB_HOST / DB_USER / DB_PASSWORD / DB_NAME.
 *   2. Run `npm install` (mysql2 is already a dependency).
 *   3. Start the app — isConfigured() will return true and queries will work.
 */

const mysql = require('mysql2/promise');

let pool = null;

/** True when the minimum DB credentials are present in the environment. */
function isConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

/** Returns a shared connection pool, creating it on first use. */
function getPool() {
  if (!isConfigured()) {
    throw new Error(
      'Database is not configured yet. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in .env'
    );
  }
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/** Convenience helper: run a parameterized query and return the rows. */
async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

/** Quick connectivity check used by /health and on startup. */
async function healthCheck() {
  if (!isConfigured()) {
    return { configured: false, ok: false, message: 'DB credentials not set' };
  }
  try {
    await getPool().query('SELECT 1');
    return { configured: true, ok: true, message: 'Connected' };
  } catch (err) {
    return { configured: true, ok: false, message: err.message };
  }
}

module.exports = { isConfigured, getPool, query, healthCheck };
