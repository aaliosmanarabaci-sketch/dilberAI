import React, { useState } from "react";
import dilberImage from "../assets/dilberay.jpg";
import "./styles.css";

const prompts = {
  zorunda: `
    Sen DilberAI'sın. Türk halk müziği sanatçısı Dilber Ay'ın dijital ruhunu taşıyorsun. 
    Görevin: Kullanıcının sana sorduğu "Bunu yapmak zorunda mıyım?" temalı sorulara cevap vermek.
    Cevapların hukuken ve mantıken doğru olacak, üslubun Dilber Ay gibi dobra ve sert olacak.
    Sonuçta mutlaka "KARAR: ZORUNDASIN" veya "KARAR: ZORUNDA DEĞİLSİN" yaz.
  `,
  racon: `
    Sen DilberAI'sın. Kullanıcı bir durum anlatacak.
    Karşı tarafa gönderilecek, sert ve giderli kısa bir mesaj taslağı yaz.
    Sanki Dilber Ay yazmış gibi sokak ağzı kullan.
    Sadece mesajı döndür, ön açıklama ekleme.
  `,
  yildizname: `
    Sen DilberAI'sın. Kullanıcı "Falıma bak" dediğinde ona rastgele, komik, arabesk bir "Günün Falı" söyle.
    Karamsar ama mizahi ol, sonunu bir Dilber Ay şarkı sözüyle bağla.
  `,
};

const heroCopy = {
  zorunda: {
    title: "Söyle gardaş, zorunda mısın?",
    accent: "Hukuken, ahlaken, keyfi...",
    desc: "Sor, Dilber Abla hem kanun hem gönül terazisiyle karar versin.",
  },
  racon: {
    title: "Kim üzdü seni? Racon keselim.",
    accent: "En ağır mesaj için ablan burada.",
    desc: "Durumu yaz, ağzının payını alsın.",
  },
  yildizname: {
    title: "Niyet ettin, Dilber Abla'ya...",
    accent: "Bugünkü kısmetini söyleyeyim.",
    desc: "Fal butonuna bas, arabesk kehanet gelsin.",
  },
};

const suggestions = {
  zorunda: [
    "Eski sevgilimin düğününe gitmek zorunda mıyım?",
    "Vergi ödemek zorunda mıyım?",
    "Patronun istediği mesaiyi yapmak zorunda mıyım?",
  ],
  racon: [
    "Patron zam vermedi, emeğimi çiğniyor.",
    "Arkadaşım borcunu ödemedi.",
    "Sevgilim beni en yakın arkadaşımla aldattı.",
  ],
  yildizname: [],
};

const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23101015'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='middle' text-anchor='middle' fill='%23dc2626' font-size='52' font-family='sans-serif'%3E DA %3C/text%3E%3C/svg%3E";
};

export default function DilberAI() {
  const [activeTab, setActiveTab] = useState("zorunda");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState(2);

  const hero = heroCopy[activeTab];

  const switchTab = (tab) => {
    setActiveTab(tab);
    setQuery("");
    setResponse("");
    setError("");
    setCopied(false);
    setLoading(false);
    setTone(2);
  };

  const getUserText = () => {
    if (activeTab === "yildizname") {
      return "Bana bir fal bak abla, durumum ne olacak?";
    }
    if (activeTab === "racon") {
      return `Şu duruma bir racon mesajı yaz: "${query}". Sertlik seviyesi: ${tone} (1 yumuşak, 3 çok sert).`;
    }
    return `Kullanıcı sorusu: "${query}". Bu soruya Dilber Ay gibi cevap ver.`;
  };

  const handleAsk = async () => {
    if (activeTab !== "yildizname" && !query.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    setCopied(false);

    const apiUrl = "/api/gemini";
    const payload = {
      contents: [{ parts: [{ text: getUserText() }] }],
      systemInstruction: { parts: [{ text: prompts[activeTab] }] },
    };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: { message: await res.text() } };
        }

        let errorMessage = "";
        if (res.status === 503) {
          errorMessage = "Gemini API şu an aşırı yüklü. Otomatik olarak tekrar deniyorum, biraz bekle gardaş...";
        } else if (res.status === 429) {
          // Rate limit hatası - retry-after header'ını kontrol et
          const retryAfter = res.headers.get("Retry-After") || res.headers.get("X-RateLimit-Reset");
          const rateLimitRemaining = res.headers.get("X-RateLimit-Remaining");
          
          if (retryAfter) {
            const seconds = parseInt(retryAfter);
            const minutes = Math.ceil(seconds / 60);
            errorMessage = `Çok fazla istek gönderdin. ${minutes} dakika sonra tekrar deneyebilirsin.`;
          } else if (rateLimitRemaining === "0") {
            errorMessage = "Günlük istek limitine ulaştın. Biraz bekleyip tekrar dene gardaş.";
          } else {
            errorMessage = "Çok fazla istek gönderdin, biraz bekleyip tekrar dene.";
          }
        } else if (res.status === 405) {
          errorMessage = "Proxy servisi çalışmıyor. `npm start` ile server'ı açtığından emin ol.";
        } else {
          errorMessage = `Sunucu hatası (${res.status}): ${errorData?.error?.message || JSON.stringify(errorData).slice(0, 160)}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Boş yanıt döndü, birazdan tekrar dene.");
      setResponse(text.trim());
    } catch (err) {
      setError(err.message || "Bir hata oldu, kadersiziz bugün.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  const clearAll = () => {
    setQuery("");
    setResponse("");
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!response) return;
    if (!navigator?.clipboard?.writeText) {
      alert("Kopyalama desteklenmiyor, metni elle seçebilirsin.");
      return;
    }
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Panoya yazılamadı, izinleri kontrol et.");
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-blobs">
        <span className="blob-red"></span>
        <span className="blob-purple"></span>
      </div>

      <header className="app-header">
        <div className="logo-block">
          <div className="logo-avatar">
            <img src={dilberImage} alt="Dilber Ay" onError={handleImageError} />
          </div>
          <div>
            <div className="logo-title">
              <span className="highlight">DİLBER</span>AI
            </div>
            <div className="hero-badge">
              <span aria-hidden="true">✨</span> Arabesk AI asistan
            </div>
          </div>
        </div>

        <nav className="tabs" aria-label="Modlar">
          <button
            className={`tab-button tab-zorunda ${activeTab === "zorunda" ? "active" : ""}`}
            onClick={() => switchTab("zorunda")}
            aria-pressed={activeTab === "zorunda"}
          >
            Zorunda mıyım?
          </button>
          <button
            className={`tab-button tab-racon ${activeTab === "racon" ? "active" : ""}`}
            onClick={() => switchTab("racon")}
            aria-pressed={activeTab === "racon"}
          >
            Racon Kes
          </button>
          <button
            className={`tab-button tab-yildiz ${activeTab === "yildizname" ? "active" : ""}`}
            onClick={() => switchTab("yildizname")}
            aria-pressed={activeTab === "yildizname"}
          >
            Yıldızname
          </button>
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div>
            <div className="hero-badge">
              <span aria-hidden="true">🎙</span> Dilber Abla yayında
            </div>
            <h2>
              {hero.title} <br />
              <span className="highlight">{hero.accent}</span>
            </h2>
            <p>{hero.desc}</p>
          </div>

          {activeTab !== "racon" && (
            <div className="hero-portrait">
              <img src={dilberImage} alt="Dilber Ay portre" onError={handleImageError} />
            </div>
          )}
        </section>

        {response && (
          <div className="card" role="status" aria-live="polite">
            <div className="status-bar">
              <h3>{activeTab === "racon" ? "Gidecek mesaj" : "Dilber Abla diyor ki"}</h3>
              <span className="chip">
                {activeTab === "racon" ? "Gider hazır" : activeTab === "zorunda" ? "Karar verildi" : "Kısmet yazıldı"}
              </span>
            </div>
            <div className="response-text">{response}</div>
            <div className="status-bar">
              <button className="secondary-button" onClick={clearAll}>
                Başka derdin var
              </button>
              {activeTab === "racon" && (
                <button className="secondary-button" onClick={handleCopy}>
                  {copied ? "Kopyalandı" : "Kopyala"}
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="card">
            <div className="loading" aria-live="polite">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              {activeTab === "racon" ? (
                <span>Kalemi elime aldım, yazıyorum...</span>
              ) : (
                <span>Bi dur gardaş, düşünüyorum...</span>
              )}
              <span className="eta">≈2 sn</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error" role="alert">
            <strong>!</strong>
            <div>{error}</div>
          </div>
        )}

        {!response && !loading && (
          <div className="input-card">
            {activeTab !== "yildizname" ? (
              <>
                <div className="input-row">
                  <input
                    type="text"
                    className="text-input"
                    placeholder={
                      activeTab === "racon"
                        ? "Örn: Sevgilim beni en yakın arkadaşımla aldattı..."
                        : "Örn: Trafik cezamı ödemek zorunda mıyım?"
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    aria-label="Sorun nedir?"
                  />
                  <button
                    className={`primary-button ${
                      activeTab === "racon" ? "primary-racon" : "primary-zorunda"
                    }`}
                    onClick={handleAsk}
                    disabled={loading || (activeTab !== "yildizname" && !query.trim())}
                  >
                    {activeTab === "racon" ? "Yaz Abla" : "Sor Bakalım"}
                  </button>
                </div>
                {activeTab === "racon" && (
                  <div className="range-row" aria-label="Sertlik seviyesi">
                    <span className="badge-small">Yumuşak</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="1"
                      value={tone}
                      onChange={(e) => setTone(Number(e.target.value))}
                    />
                    <span className="badge-small">Çok sert</span>
                    <span className="badge-small">Seviye {tone}</span>
                  </div>
                )}
                {suggestions[activeTab].length > 0 && (
                  <div className="pill-row" aria-label="Önerilen sorular">
                    {suggestions[activeTab].map((text) => (
                      <button key={text} className="pill" onClick={() => setQuery(text)}>
                        {text}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="hero-cta">
                <button className="primary-button primary-yildiz shimmer" onClick={handleAsk}>
                  Falıma Bak Gardaş
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="badge">
          <span aria-hidden="true">❤️</span>
          Made for Dilber Ay — Tavukları pişirmişem, hacıyı çarşıya göndermişem.
        </div>
      </footer>
    </div>
  );
}
