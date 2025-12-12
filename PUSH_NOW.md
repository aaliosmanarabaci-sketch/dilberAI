# 🚨 ÖNEMLİ: GitHub'a Push Yap!

Vercel deploy yapmadan önce kodları GitHub'a push etmen gerekiyor.

## Hızlı Çözüm: GitHub Desktop

1. **GitHub Desktop indir**: https://desktop.github.com/
2. **GitHub hesabınla giriş yap**
3. **File → Add Local Repository**
4. **Klasör seç**: `/Users/aliosmanarabaci/Desktop/dilberAI`
5. **"Publish repository"** butonuna tıkla
6. ✅ Tamamlandı!

## Alternatif: Terminal (Token gerekli)

1. **GitHub Token oluştur**: https://github.com/settings/tokens
   - "Generate new token (classic)"
   - `repo` seçeneğini işaretle
   - Token'ı kopyala

2. **Terminal'de**:
   ```bash
   cd /Users/aliosmanarabaci/Desktop/dilberAI
   git push -u origin main
   ```
   - Username: `aaliosmanarabaci-sketch`
   - Password: Token'ı yapıştır

## Push Sonrası

Push başarılı olduktan sonra:
1. GitHub'da kontrol et: https://github.com/aaliosmanarabaci-sketch/dilberAI
2. Vercel'de tekrar "Deploy" dene

