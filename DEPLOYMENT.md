# GitHub & Vercel Deployment Rehberi

## 1. GitHub'a Push

### Adımlar:

```bash
# 1. Git repo başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk commit
git commit -m "Initial commit: DilberAI - Arabesk AI asistan"

# 4. GitHub'da yeni repo oluştur (github.com'da)
# 5. Remote ekle (REPO_URL'i kendi repo URL'inle değiştir)
git remote add origin https://github.com/KULLANICI_ADI/dilberAI.git

# 6. Push yap
git branch -M main
git push -u origin main
```

## 2. Vercel'e Deploy

### Yöntem 1: Vercel Dashboard (Önerilen)

1. **Vercel'e Git**: https://vercel.com
2. **GitHub ile Giriş Yap**
3. **"Add New Project"** tıkla
4. **GitHub repo'nu seç** (dilberAI)
5. **Project Settings**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. **Environment Variables** ekle:
   - `GEMINI_API_KEY` = `your_api_key_here`
   - `ALLOWED_ORIGINS` = `https://your-vercel-domain.vercel.app` (Vercel otomatik domain verir)
   - `RATE_LIMIT_MAX` = `100` (opsiyonel)
   - `RATE_LIMIT_WINDOW_MS` = `600000` (opsiyonel)
7. **Deploy** butonuna tıkla

### Yöntem 2: Vercel CLI

```bash
# 1. Vercel CLI kur
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production'a deploy
vercel --prod
```

## 3. Environment Variables (Vercel Dashboard)

Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value | Açıklama |
|-----|-------|----------|
| `GEMINI_API_KEY` | `your_key_here` | **ZORUNLU** - Gemini API anahtarı |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Vercel domain'in (otomatik oluşur) |
| `RATE_LIMIT_MAX` | `100` | Opsiyonel - Rate limit |
| `RATE_LIMIT_WINDOW_MS` | `600000` | Opsiyonel - 10 dakika |

## 4. Önemli Notlar

- ✅ `vercel.json` dosyası hazır
- ✅ `api/gemini.js` serverless function hazır
- ✅ Build komutu: `npm run build`
- ✅ Output directory: `dist`
- ⚠️ Vercel otomatik olarak `dist` klasörünü serve eder
- ⚠️ API route'ları `/api/gemini` olarak çalışır

## 5. Test

Deploy sonrası:
- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/gemini`
- Health: `https://your-app.vercel.app/health`

## 6. Sorun Giderme

### Build Hatası
- `npm run build` local'de çalışıyor mu kontrol et
- `dist` klasörü oluşuyor mu kontrol et

### API Çalışmıyor
- Environment variables doğru mu kontrol et
- Vercel logs'a bak: Dashboard → Deployments → Logs

### CORS Hatası
- `ALLOWED_ORIGINS` environment variable'ına Vercel domain'ini ekle

