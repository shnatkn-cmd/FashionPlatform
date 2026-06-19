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

## Veritabanı (Hostinger MySQL)
- Kimlik bilgileri kullanıcı tarafından **sonradan** verilecek. Geldiğinde:
  1. `.env.example` → `.env` kopyala, `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` doldur.
  2. `npm install` (mysql2 zaten bağımlılık).
  3. `npm start` → `/health` endpoint'i DB bağlantısını doğrular.
- Bağlantı kodu: `config/db.js` (lazy pool, env-driven). DB yapılandırılmadan da uygulama çalışır.
- **Hedef:** "Her şey bu veritabanı ile yönetilecek." Anasayfadaki ve ileride eklenecek tüm dinamik içerik DB'ye taşınacak.
- **Migrasyon noktası (seam):** `data/content.js`. Şu an placeholder veri döndürüyor; DB gelince fonksiyon imzalarını (async) koruyarak içlerini `db.query(...)` ile değiştir — `server.js` değişmeden çalışmaya devam eder.
- DB geldikten sonra: anasayfada veritabanına geçirilmesi gereken içerikleri (kategoriler, öne çıkan ürünler, hero, bülten kayıtları vb.) tespit edip tabloları oluştur ve implement et.

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
