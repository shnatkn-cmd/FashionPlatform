'use strict';

/**
 * Creates the schema and seeds initial data (idempotent).
 *
 * Usage:  npm run db:init
 *
 * - Runs db/schema.sql (CREATE TABLE IF NOT EXISTS ...)
 * - Seeds categories / products / hero ONLY if those tables are empty,
 *   using the same content the homepage previously showed as placeholders.
 *
 * Uses pool.query() (text protocol) because DDL statements are not allowed
 * via the prepared-statement protocol used by db.query().
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const CATEGORIES = [
  ['women', 'Kadın', 1],
  ['men', 'Erkek', 2],
  ['accessories', 'Aksesuar', 3],
  ['shoes', 'Ayakkabı', 4],
];

const PRODUCTS = [
  ['Oversize Yün Palto', 'women', 2490],
  ['Slim Fit Gömlek', 'men', 690],
  ['Deri Crossbody Çanta', 'accessories', 1890],
  ['Süet Chelsea Bot', 'shoes', 2190],
  ['İpek Midi Elbise', 'women', 1750],
  ['Keten Blazer Ceket', 'men', 1990],
  ['Altın Kaplama Kolye', 'accessories', 540],
  ['Spor Sneaker', 'shoes', 1290],
];

const HERO = [
  'YENİ SEZON',
  'Stilini Yeniden Tanımla',
  'Sezonun öne çıkan parçaları, özenle seçilmiş koleksiyonlar ve sınırlı stoklu tasarımlar.',
  'Koleksiyonu Keşfet',
  '#products',
];

async function run() {
  if (!db.isConfigured()) {
    console.error('Veritabanı yapılandırılmamış. .env içindeki DB_* değerlerini doldurun.');
    process.exit(1);
  }
  const pool = db.getPool();

  // 1) Schema
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = schema
    .split('\n')
    .filter((line) => !line.trim().startsWith('--')) // drop comment lines, keep statements
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log(`Şema hazır (${statements.length} ifade).`);

  // 2) Categories
  const [catCount] = await pool.query('SELECT COUNT(*) AS c FROM categories');
  if (catCount[0].c === 0) {
    for (const [slug, name, order] of CATEGORIES) {
      await pool.query('INSERT INTO categories (slug, name, sort_order) VALUES (?, ?, ?)', [slug, name, order]);
    }
    console.log(`Kategoriler eklendi (${CATEGORIES.length}).`);
  } else {
    console.log('Kategoriler zaten mevcut, atlandı.');
  }

  // slug -> id map
  const [catRows] = await pool.query('SELECT id, slug FROM categories');
  const idBySlug = {};
  catRows.forEach((r) => { idBySlug[r.slug] = r.id; });

  // 3) Products
  const [prodCount] = await pool.query('SELECT COUNT(*) AS c FROM products');
  if (prodCount[0].c === 0) {
    for (const [name, slug, price] of PRODUCTS) {
      await pool.query(
        'INSERT INTO products (name, category_id, price, currency, featured) VALUES (?, ?, ?, ?, 1)',
        [name, idBySlug[slug] || null, price, '₺']
      );
    }
    console.log(`Ürünler eklendi (${PRODUCTS.length}).`);
  } else {
    console.log('Ürünler zaten mevcut, atlandı.');
  }

  // 4) Hero
  const [heroCount] = await pool.query('SELECT COUNT(*) AS c FROM hero');
  if (heroCount[0].c === 0) {
    await pool.query(
      'INSERT INTO hero (eyebrow, title, subtitle, cta_label, cta_href, active) VALUES (?, ?, ?, ?, ?, 1)',
      HERO
    );
    console.log('Hero içeriği eklendi.');
  } else {
    console.log('Hero zaten mevcut, atlandı.');
  }

  console.log('✅ Veritabanı kurulumu tamamlandı.');
  process.exit(0);
}

run().catch((err) => {
  console.error('INIT HATASI:', err.code || '', err.message);
  process.exit(1);
});
