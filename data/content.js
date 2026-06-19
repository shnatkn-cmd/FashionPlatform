'use strict';

/**
 * Homepage content source — now backed by the Hostinger MySQL database.
 *
 * Each function queries the DB when it is configured. If the DB is not
 * configured, unreachable, or a table is empty, it falls back to the static
 * data below so the homepage never breaks. Run `npm run db:init` to create
 * the tables and seed them with this same content.
 */

const db = require('../config/db');

// ---- Static fallbacks (used only when the DB is unavailable/empty) ----
const FALLBACK_CATEGORIES = [
  { slug: 'women', name: 'Kadın' },
  { slug: 'men', name: 'Erkek' },
  { slug: 'accessories', name: 'Aksesuar' },
  { slug: 'shoes', name: 'Ayakkabı' },
];

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Oversize Yün Palto', category: 'Kadın', price: 2490, currency: '₺' },
  { id: 2, name: 'Slim Fit Gömlek', category: 'Erkek', price: 690, currency: '₺' },
  { id: 3, name: 'Deri Crossbody Çanta', category: 'Aksesuar', price: 1890, currency: '₺' },
  { id: 4, name: 'Süet Chelsea Bot', category: 'Ayakkabı', price: 2190, currency: '₺' },
];

const FALLBACK_HERO = {
  eyebrow: 'YENİ SEZON',
  title: 'Stilini Yeniden Tanımla',
  subtitle: 'Sezonun öne çıkan parçaları, özenle seçilmiş koleksiyonlar ve sınırlı stoklu tasarımlar.',
  ctaLabel: 'Koleksiyonu Keşfet',
  ctaHref: '#products',
};

async function getCategories() {
  if (!db.isConfigured()) return FALLBACK_CATEGORIES;
  try {
    const rows = await db.query('SELECT slug, name FROM categories ORDER BY sort_order, name');
    return rows.length ? rows : FALLBACK_CATEGORIES;
  } catch (err) {
    console.error('getCategories DB hatası:', err.message);
    return FALLBACK_CATEGORIES;
  }
}

async function getFeaturedProducts() {
  if (!db.isConfigured()) return FALLBACK_PRODUCTS;
  try {
    const rows = await db.query(
      `SELECT p.id, p.name, COALESCE(c.name, '') AS category, p.price, p.currency
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.featured = 1
        ORDER BY p.created_at DESC, p.id
        LIMIT 8`
    );
    // DECIMAL comes back as a string from MySQL — convert to a number.
    return rows.length
      ? rows.map((r) => ({ ...r, price: Number(r.price) }))
      : FALLBACK_PRODUCTS;
  } catch (err) {
    console.error('getFeaturedProducts DB hatası:', err.message);
    return FALLBACK_PRODUCTS;
  }
}

async function getHero() {
  if (!db.isConfigured()) return FALLBACK_HERO;
  try {
    const rows = await db.query(
      `SELECT eyebrow, title, subtitle,
              cta_label AS ctaLabel, cta_href AS ctaHref
         FROM hero
        WHERE active = 1
        ORDER BY id DESC
        LIMIT 1`
    );
    return rows[0] || FALLBACK_HERO;
  } catch (err) {
    console.error('getHero DB hatası:', err.message);
    return FALLBACK_HERO;
  }
}

/**
 * Save a newsletter subscriber. Returns true if stored (or already existed).
 * INSERT IGNORE keeps duplicate emails from throwing on the UNIQUE index.
 */
async function addSubscriber(email) {
  if (!db.isConfigured()) return false;
  await db.query('INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)', [email]);
  return true;
}

module.exports = { getCategories, getFeaturedProducts, getHero, addSubscriber };
