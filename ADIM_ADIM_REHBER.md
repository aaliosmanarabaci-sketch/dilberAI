# 🚀 GitHub & Vercel Deployment - Adım Adım Rehber

## 📋 Mevcut Durum

✅ Kodlar hazır  
✅ Git repo başlatıldı  
✅ Commit yapıldı  
✅ GitHub repo oluşturuldu: https://github.com/aaliosmanarabaci-sketch/dilberAI  
⏳ Push yapılacak  
⏳ Vercel'e deploy edilecek  

---

## ADIM 1: GitHub'a Push (5 dakika)

### Ne yapacağız?
Kodlarını GitHub'a yükleyeceğiz.

### Nasıl yapacağız?

**Seçenek A: GitHub Desktop (EN KOLAY) ⭐**

1. GitHub Desktop indir: https://desktop.github.com/
2. GitHub hesabınla giriş yap
3. "File" → "Add Local Repository"
4. `/Users/aliosmanarabaci/Desktop/dilberAI` klasörünü seç
5. "Publish repository" butonuna tıkla
6. ✅ Tamamlandı!

**Seçenek B: Terminal (Biraz daha teknik)**

1. GitHub'da Personal Access Token oluştur:
   - https://github.com/settings/tokens
   - "Generate new token (classic)"
   - `repo` seçeneğini işaretle
   - Token'ı kopyala

2. Terminal'de:
   ```bash
   cd /Users/aliosmanarabaci/Desktop/dilberAI
   git push -u origin main
   ```
   - Username: `aaliosmanarabaci-sketch`
   - Password: Token'ı yapıştır

---

## ADIM 2: Vercel'e Deploy (10 dakika)

### Ne yapacağız?
Uygulamayı internette yayınlayacağız.

### Nasıl yapacağız?

1. **Vercel'e git**: https://vercel.com
2. **GitHub ile giriş yap**
3. **"Add New Project"** butonuna tıkla
4. **`dilberAI` repo'sunu seç** → "Import"
5. **Project Settings** (otomatik algılanır, kontrol et):
   - Framework Preset: `Other` veya `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Environment Variables** ekle:
   - "Add" butonuna tıkla
   - Key: `GEMINI_API_KEY`
   - Value: Gemini API key'in
   - "Add" butonuna tıkla
7. **"Deploy"** butonuna tıkla
8. ⏳ 1-2 dakika bekle (build oluyor)
9. ✅ Tamamlandı! URL'ini al (örn: `dilberai-xxx.vercel.app`)

---

## ADIM 3: CORS Ayarları (2 dakika)

### Ne yapacağız?
Vercel domain'ini CORS'a ekleyeceğiz.

### Nasıl yapacağız?

1. Vercel dashboard'da **Settings** → **Environment Variables**
2. **"Add"** butonuna tıkla
3. Key: `ALLOWED_ORIGINS`
4. Value: Vercel'in verdiği URL (örn: `https://dilberai-xxx.vercel.app`)
5. **"Add"** butonuna tıkla
6. **"Redeploy"** yap (Deployments → ... → Redeploy)

---

## ✅ Bitti!

Artık uygulaman canlı:
- 🌐 Frontend: `https://dilberai-xxx.vercel.app`
- 🔌 API: `https://dilberai-xxx.vercel.app/api/gemini`

---

## ❓ Sorun mu var?

### Push yapamıyorum
→ GitHub Desktop kullan (en kolay)

### Build hatası
→ Vercel logs'a bak: Deployments → Logs

### API çalışmıyor
→ Environment variables doğru mu kontrol et

---

## 📝 Özet

1. ✅ GitHub'a push yap (GitHub Desktop önerilir)
2. ✅ Vercel'e deploy et
3. ✅ CORS ayarlarını yap
4. ✅ Test et

Hangi adımdasın? Yardımcı olabilirim!

