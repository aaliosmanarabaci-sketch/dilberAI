# GitHub & Vercel Setup Adımları

## 1. GitHub'da Repo Oluştur

1. **GitHub'a git**: https://github.com/new
2. **Repository name**: `dilberAI`
3. **Description**: `DilberAI - Türk halk müziği sanatçısı Dilber Ay'ın dijital ruhunu taşıyan arabesk AI asistanı`
4. **Public** veya **Private** seç (tercihine göre)
5. **"Create repository"** butonuna tıkla
6. **ÖNEMLİ**: "Initialize this repository with a README" seçeneğini **İŞARETLEME** (zaten README var)

## 2. GitHub'a Push

Repo oluşturduktan sonra terminal'de:

```bash
cd /Users/aliosmanarabaci/Desktop/dilberAI

# Remote zaten ekli, sadece push yap
git push -u origin main
```

Eğer remote yoksa:
```bash
git remote add origin https://github.com/aaliosmanarabaci-sketch/dilberAI.git
git push -u origin main
```

## 3. Vercel'e Deploy

### Adım 1: Vercel'e Git
- https://vercel.com → GitHub ile giriş yap

### Adım 2: Yeni Proje
- "Add New Project" butonuna tıkla
- GitHub repo'larından `dilberAI` seç
- "Import" butonuna tıkla

### Adım 3: Project Settings
- **Framework Preset**: `Other` veya `Vite` seç
- **Root Directory**: `./` (varsayılan)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (varsayılan)

### Adım 4: Environment Variables
"Environment Variables" sekmesine git ve ekle:

| Key | Value | Açıklama |
|-----|-------|----------|
| `GEMINI_API_KEY` | `your_api_key_here` | **ZORUNLU** - Gemini API anahtarı |
| `ALLOWED_ORIGINS` | `https://dilberai.vercel.app` | Vercel domain'in (deploy sonrası güncelle) |

**Not**: `ALLOWED_ORIGINS` için önce deploy yap, sonra Vercel'in verdiği domain'i ekle.

### Adım 5: Deploy
- "Deploy" butonuna tıkla
- Build tamamlanana kadar bekle (1-2 dakika)

### Adım 6: Domain'i Güncelle
Deploy tamamlandıktan sonra:
1. Vercel dashboard'da domain'i gör (örn: `dilberai-xxx.vercel.app`)
2. Settings → Environment Variables → `ALLOWED_ORIGINS` → Edit
3. Değeri güncelle: `https://dilberai-xxx.vercel.app`
4. Redeploy yap

## 4. Test

Deploy sonrası:
- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/gemini`
- Health Check: `https://your-app.vercel.app/health`

## 5. Sorun Giderme

### Push Hatası
```bash
# Eğer "repository not found" hatası alırsan
# GitHub'da repo'yu oluşturduğundan emin ol
git remote set-url origin https://github.com/aaliosmanarabaci-sketch/dilberAI.git
git push -u origin main
```

### Build Hatası (Vercel)
- Vercel logs'a bak: Deployments → Logs
- Local'de test et: `npm run build`

### API Çalışmıyor
- Environment variables doğru mu kontrol et
- `GEMINI_API_KEY` ekli mi kontrol et
- Vercel logs'a bak

