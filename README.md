# DilberAI 🎙️

Türk halk müziği sanatçısı Dilber Ay'ın dijital ruhunu taşıyan arabesk AI asistanı.

## Özellikler

- **Zorunda mıyım?**: Hukuki ve ahlaki sorulara Dilber Ay üslubuyla cevap verir
- **Racon Kes**: Sert ve giderli mesajlar yazar
- **Yıldızname**: Arabesk tarzında günlük fal bakımı

## Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repo-url>
cd dilberAI
```

2. **Bağımlılıkları kurun**
```bash
npm install
```

3. **Environment variables ayarlayın**
```bash
cp .env.example .env
# .env dosyasını düzenleyip GEMINI_API_KEY ekleyin
```

4. **Build edin (Production için)**
```bash
npm run build
```

5. **Server'ı başlatın**
```bash
npm start
```

## Development

Development modunda çalıştırmak için:

```bash
# Terminal 1: Express API server
npm start

# Terminal 2: Vite dev server
npm run dev
```

Frontend: http://localhost:5174
API: http://localhost:5173

## Production Deployment

1. `.env` dosyasını oluşturup `GEMINI_API_KEY` ekleyin
2. `npm run build` ile frontend'i build edin
3. `npm start` ile server'ı başlatın
4. Port ve host ayarlarını `.env` dosyasında yapılandırın

### Environment Variables

- `GEMINI_API_KEY` (Zorunlu): Gemini API anahtarı
- `PORT` (Opsiyonel): Server portu (varsayılan: 5173)
- `HOST` (Opsiyonel): Server host (varsayılan: 0.0.0.0)
- `ALLOWED_ORIGINS` (Opsiyonel): CORS için izin verilen origin'ler (virgülle ayırın)
- `RATE_LIMIT_WINDOW_MS` (Opsiyonel): Rate limit penceresi (milisaniye, varsayılan: 600000 = 10 dakika)
- `RATE_LIMIT_MAX` (Opsiyonel): Rate limit maksimum istek sayısı (varsayılan: 100)

## Güvenlik

- Rate limiting: Her IP için 10 dakikada maksimum 100 istek (yapılandırılabilir)
- CORS koruması
- Güvenlik headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- API key server-side'da tutulur, client'a sızmaz

## Teknolojiler

- **Frontend**: React 18, Vite
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini API
- **Styling**: CSS3 (Custom)

## Lisans

MIT

---

Made for Dilber Ay — Tavukları pişirmişem, hacıyı çarşıya göndermişem. ❤️

