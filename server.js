'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');

const content = require('./data/content');
const db = require('./config/db');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// View engine (EJS) + static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Homepage
// Content currently comes from data/content.js (placeholder). When the
// Hostinger DB is connected, only data/content.js changes — this route stays.
// ---------------------------------------------------------------------------
app.get('/', async (req, res, next) => {
  try {
    const [hero, categories, products] = await Promise.all([
      content.getHero(),
      content.getCategories(),
      content.getFeaturedProducts(),
    ]);
    res.render('index', {
      hero,
      categories,
      products,
      subscribed: req.query.subscribed === '1',
      year: new Date().getFullYear(),
    });
  } catch (err) {
    next(err);
  }
});

// Newsletter signup -> stored in the DB (newsletter_subscribers)
app.post('/newsletter', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (valid) {
      await content.addSubscriber(email);
    }
    res.redirect('/?subscribed=1#newsletter');
  } catch (err) {
    next(err);
  }
});

// Health endpoint — also reports DB connectivity status
app.get('/health', async (req, res) => {
  const database = await db.healthCheck();
  res.json({ status: 'ok', database });
});

// 404
app.use((req, res) => {
  res.status(404).send('404 - Sayfa bulunamadı');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('500 - Sunucu hatası');
});

app.listen(PORT, () => {
  console.log(`FashionPlatform çalışıyor: http://localhost:${PORT}`);
  if (!db.isConfigured()) {
    console.log('ℹ️  Veritabanı henüz yapılandırılmadı (placeholder veriler kullanılıyor).');
  }
});
