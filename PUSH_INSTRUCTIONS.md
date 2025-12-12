# GitHub'a Push Yapma Talimatları

## Yöntem 1: Terminal'den (Önerilen)

### Adım 1: GitHub Personal Access Token Oluştur

1. GitHub'a git: https://github.com/settings/tokens
2. "Generate new token" → "Generate new token (classic)"
3. Token adı: `dilberAI-push`
4. Expiration: 90 days (veya istediğin süre)
5. Scopes: `repo` seçeneğini işaretle
6. "Generate token" butonuna tıkla
7. **ÖNEMLİ**: Token'ı kopyala (bir daha gösterilmeyecek!)

### Adım 2: Push Yap

Terminal'de şu komutu çalıştır:

```bash
cd /Users/aliosmanarabaci/Desktop/dilberAI

# Remote'u HTTPS'e çevir
git remote set-url origin https://github.com/aaliosmanarabaci-sketch/dilberAI.git

# Push yap (username ve password isteyecek)
git push -u origin main
```

**Username**: `aaliosmanarabaci-sketch`  
**Password**: Yukarıda oluşturduğun Personal Access Token'ı yapıştır

## Yöntem 2: GitHub Desktop (Kolay)

1. GitHub Desktop uygulamasını indir: https://desktop.github.com/
2. GitHub hesabınla giriş yap
3. "File" → "Add Local Repository"
4. `/Users/aliosmanarabaci/Desktop/dilberAI` klasörünü seç
5. "Publish repository" butonuna tıkla

## Yöntem 3: GitHub CLI (En Kolay)

```bash
# GitHub CLI kur
brew install gh

# Login
gh auth login

# Push
cd /Users/aliosmanarabaci/Desktop/dilberAI
git push -u origin main
```

## Push Sonrası

Push başarılı olduktan sonra:
- Repo: https://github.com/aaliosmanarabaci-sketch/dilberAI
- Vercel'e deploy için hazır!

