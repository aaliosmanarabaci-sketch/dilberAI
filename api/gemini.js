// Vercel serverless function for Gemini API
const rateLimit = require("express-rate-limit");

// Rate limiting için memory store (serverless için)
const rateLimitStore = new Map();

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  store: {
    incr: (key, cb) => {
      const now = Date.now();
      const record = rateLimitStore.get(key) || { count: 0, resetTime: now + (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 600000) };
      
      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 600000);
      } else {
        record.count++;
      }
      
      rateLimitStore.set(key, record);
      cb(null, { totalHits: record.count, resetTime: record.resetTime });
    },
    decrement: () => {},
    resetKey: (key) => {
      rateLimitStore.delete(key);
    },
    resetAll: () => {
      rateLimitStore.clear();
    }
  },
  message: { 
    error: "Çok fazla istek gönderdin, lütfen biraz bekleyip tekrar dene.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = async (req, res) => {
  // CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];
  
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const clientId = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown";
  const rateLimitResult = await new Promise((resolve) => {
    apiLimiter(req, res, () => resolve(true));
  });

  if (!rateLimitResult) {
    return; // Rate limit middleware already sent response
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Sunucuda GEMINI_API_KEY tanımlı değil." });
  }

  const payload = req.body || {};
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // Retry mekanizması
  const maxRetries = 3;
  const baseDelay = 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const apiRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await apiRes.json();

      if (apiRes.ok) {
        return res.status(200).json(data);
      }

      if ((apiRes.status === 503 || apiRes.status === 429) && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return res.status(apiRes.status).json(data);
    } catch (err) {
      if (attempt === maxRetries) {
        console.error("Proxy error:", err);
        return res.status(500).json({ error: "İstek proxy üzerinden gönderilemedi." });
      }
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

