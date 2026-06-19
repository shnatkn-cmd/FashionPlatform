'use strict';

/**
 * Homepage content source.
 *
 * For now this is static placeholder data so the homepage works without a
 * database. ===> THIS IS THE SEAM TO MIGRATE TO THE HOSTINGER DATABASE. <===
 *
 * Once the DB is configured, replace the return values of these functions with
 * queries via ../config/db.js, e.g.:
 *
 *   const db = require('../config/db');
 *   async function getFeaturedProducts() {
 *     return db.query('SELECT id, name, category, price, image FROM products WHERE featured = 1 ORDER BY created_at DESC LIMIT 8');
 *   }
 *
 * Keeping the function signatures (async) the same means server.js will not
 * need to change when we switch to real data.
 */

async function getCategories() {
  return [
    { slug: 'women', name: 'Kadın' },
    { slug: 'men', name: 'Erkek' },
    { slug: 'accessories', name: 'Aksesuar' },
    { slug: 'shoes', name: 'Ayakkabı' },
  ];
}

async function getFeaturedProducts() {
  return [
    { id: 1, name: 'Oversize Yün Palto', category: 'Kadın', price: 2490, currency: '₺' },
    { id: 2, name: 'Slim Fit Gömlek', category: 'Erkek', price: 690, currency: '₺' },
    { id: 3, name: 'Deri Crossbody Çanta', category: 'Aksesuar', price: 1890, currency: '₺' },
    { id: 4, name: 'Süet Chelsea Bot', category: 'Ayakkabı', price: 2190, currency: '₺' },
    { id: 5, name: 'İpek Midi Elbise', category: 'Kadın', price: 1750, currency: '₺' },
    { id: 6, name: 'Keten Blazer Ceket', category: 'Erkek', price: 1990, currency: '₺' },
    { id: 7, name: 'Altın Kaplama Kolye', category: 'Aksesuar', price: 540, currency: '₺' },
    { id: 8, name: 'Spor Sneaker', category: 'Ayakkabı', price: 1290, currency: '₺' },
  ];
}

async function getHero() {
  return {
    eyebrow: 'YENİ SEZON',
    title: 'Stilini Yeniden Tanımla',
    subtitle: 'Sezonun öne çıkan parçaları, özenle seçilmiş koleksiyonlar ve sınırlı stoklu tasarımlar.',
    ctaLabel: 'Koleksiyonu Keşfet',
    ctaHref: '#products',
  };
}

module.exports = { getCategories, getFeaturedProducts, getHero };
