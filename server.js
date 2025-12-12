const path = require("path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || "0.0.0.0";
const distPath = path.join(__dirname, "dist");

// CORS ayarları
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

// Güvenlik headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Rate limiting - API abuse önleme
// Environment variable ile yapılandırılabilir (RATE_LIMIT_WINDOW_MS ve RATE_LIMIT_MAX)
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000; // 10 dakika (varsayılan)
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 100; // 10 dakikada 100 istek (varsayılan)

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  message: { 
    error: "Çok fazla istek gönderdin, lütfen biraz bekleyip tekrar dene.",
    retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 60000) // Dakika cinsinden
  },
  standardHeaders: true, // X-RateLimit-* headers ekler
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Başarılı istekleri de say
  skipFailedRequests: false, // Başarısız istekleri de say
});

app.use(express.json({ limit: "10mb" })); // Body size limiti
app.use("/api/", apiLimiter);

// Dist klasörü kontrolü
if (!fs.existsSync(distPath)) {
  console.warn(`⚠️  UYARI: ${distPath} klasörü bulunamadı. Production build için 'npm run build' çalıştırın.`);
}

// Static dosyalar (dist varsa)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.post("/api/gemini", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Sunucuda GEMINI_API_KEY tanımlı değil." });
  }

  const payload = req.body || {};
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // Retry mekanizması: 503 ve 429 hatalarında otomatik tekrar dene
  const maxRetries = 3;
  const baseDelay = 1000; // 1 saniye

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const apiRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await apiRes.json();

      // Başarılı yanıt
      if (apiRes.ok) {
        return res.json(data);
      }

      // 503 (overloaded) veya 429 (rate limit) hatası ve daha fazla deneme hakkı varsa
      if ((apiRes.status === 503 || apiRes.status === 429) && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s
        console.log(`API overloaded (${apiRes.status}), ${delay}ms sonra tekrar deneniyor... (deneme ${attempt + 1}/${maxRetries + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue; // Tekrar dene
      }

      // Diğer hatalar veya retry limiti doldu
      return res.status(apiRes.status).json(data);
    } catch (err) {
      // Son denemede bile hata alırsak, hata döndür
      if (attempt === maxRetries) {
        console.error("Proxy error:", err);
        return res.status(500).json({ error: "İstek proxy üzerinden gönderilemedi." });
      }
      // Ağ hatası varsa da retry yap
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Ağ hatası, ${delay}ms sonra tekrar deneniyor... (deneme ${attempt + 1}/${maxRetries + 1})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
});

// SPA fallback to dist (sadece dist varsa)
if (fs.existsSync(distPath)) {
  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Frontend build bulunamadı. 'npm run build' çalıştırın." });
    }
  });
} else {
  // Development modunda dist yoksa bilgilendirme
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return; // API route'ları için devam et
    }
    res.status(503).json({
      error: "Frontend henüz build edilmemiş.",
      message: "Production için 'npm run build' çalıştırın. Development için 'npm run dev' kullanın.",
    });
  });
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Vercel serverless function için export
module.exports = app;

// Local development için server başlat
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`DilberAI server running at http://${HOST}:${PORT}`);
    console.log(`Health check: http://${HOST}:${PORT}/health`);
    
    // Production uyarısı
    if (process.env.ALLOWED_ORIGINS === "*" || !process.env.ALLOWED_ORIGINS) {
      console.warn("⚠️  UYARI: ALLOWED_ORIGINS '*' olarak ayarlı. Production'da sadece kendi domain'ini kullan!");
    }
  });
}
