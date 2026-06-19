# FashionPlatform

Node.js (Express + EJS) tabanlı moda platformu. Hostinger üzerinde barındırılır ve
Hostinger MySQL veritabanı ile yönetilir.

## Kurulum
```bash
npm install
cp .env.example .env   # DB bilgileri gelince doldurulacak
npm start              # http://localhost:3000
```

## Yapı
- `server.js` — Express uygulaması ve rotalar (`/`, `/health`)
- `views/index.ejs` — anasayfa
- `public/css/style.css` — stiller
- `data/content.js` — içerik kaynağı (DB'ye taşınacak)
- `config/db.js` — Hostinger MySQL bağlantısı (env-driven)

Çalışma kuralları ve veritabanı planı için `CLAUDE.md` dosyasına bakınız.
