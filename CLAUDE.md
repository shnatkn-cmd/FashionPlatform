# CLAUDE.md — FashionPlatform

Bu dosya Claude Code için kalıcı çalışma kurallarını içerir. Her oturumda oku ve uygula.

## Proje
- **Repo:** https://github.com/shnatkn-cmd/FashionPlatform (`origin`, branch: `main`)
- **Yerel klasör:** `c:/FashionPlatform`
- **Hosting:** Hostinger (Node.js)
- **Stack:** Node.js + Express + EJS, veritabanı: Hostinger **MySQL** (mysql2)
- Projeyi artık bu repo üzerinden takip ediyoruz. Tüm değişiklikler GitHub'a yansıtılır.

## ZORUNLU İŞ AKIŞI (her oturumda)

### 1. Oturum başında — GitHub güncelliğini test et
Çalışmaya başlamadan önce her zaman uzak repo ile senkron olup olmadığını kontrol et:
```bash
cd c:/FashionPlatform
git fetch origin
git status        # "up to date" mi yoksa "behind" mi?
git log --oneline -5 origin/main
```
- Eğer yerel `behind` ise: `git pull --ff-only origin main` ile güncelle.
- Çakışma/diverjans varsa kullanıcıya bildir, körlemesine merge/force yapma.

### 2. Her güncelleme sonrası — push et
Anlamlı bir değişiklik (özellik, düzeltme, içerik) tamamlandığında commit + push yap:
```bash
cd c:/FashionPlatform
git add -A
git commit -m "<kısa açıklayıcı mesaj>"
git push origin main
```
- Commit mesajları kısa ve açıklayıcı olsun.
- **Asla** `.env` veya gerçek veritabanı kimlik bilgilerini commit etme (`.gitignore` ile korunuyor).
- `--force` / `--no-verify` kullanma (kullanıcı açıkça istemedikçe).

## Veritabanı (Hostinger MySQL) — BAĞLI ✅
- **Durum:** Bağlantı kuruldu ve anasayfa veritabanından besleniyor.
- **Sunucu:** `srv1764.hstgr.io` (IP: `82.197.82.108`), port `3306`. Veritabanı/kullanıcı: `u851420727_Fashion`.
- **Kimlik bilgileri `.env` dosyasında** (git-ignored). Gerçek şifreyi **asla** commit etme, CLAUDE.md/README'ye yazma.
- Yeni bir makineden bağlanırken: Hostinger panelinde **Remote MySQL** altına o makinenin genel IP'sini eklemek gerekebilir.
- Bağlantı kodu: `config/db.js` (lazy pool, env-driven, utf8mb4). DB erişilemezse uygulama placeholder verilerle çalışmaya devam eder (çökmez).
- **Şema + seed:** `db/schema.sql` ve `db/init.js`. Kurmak/yenilemek için: `npm run db:init` (idempotent — tablo varsa atlar, tablo boşsa seed eder).
  - Tablolar: `categories`, `products` (category_id FK), `hero`, `newsletter_subscribers`.
- **İçerik kaynağı:** `data/content.js` artık DB'den okuyor (`getCategories`, `getFeaturedProducts`, `getHero`, `addSubscriber`). Yeni dinamik içerik eklerken aynı dosyaya DB sorgusu olarak ekle.
- `/health` endpoint'i DB bağlantı durumunu döner.
- **Hedef:** "Her şey bu veritabanı ile yönetilecek." İleride eklenecek tüm dinamik içerik (ürün detay sayfaları, kategoriler, siparişler, kullanıcılar vb.) bu DB üzerinden yönetilecek.

## Proje yapısı
```
server.js            Express uygulaması + rotalar (/, /health)
config/db.js         Hostinger MySQL bağlantısı (env-driven, lazy)
data/content.js      İçerik kaynağı — DB'ye taşınacak SEAM (şu an placeholder)
views/index.ejs      Anasayfa şablonu
public/css/style.css  Stil (editorial/minimal fashion teması)
.env.example         Ortam değişkeni şablonu (.env git-ignored)
```

## Çalıştırma
```bash
npm install
npm start        # http://localhost:3000
npm run dev      # node --watch ile geliştirme
```

## Notlar
- Dil: arayüz metinleri Türkçe.
- Kod yorumları ve commit mesajları kısa ve net tutulur.
