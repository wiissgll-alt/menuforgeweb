// Generador de páginas estáticas -sin dependencias, node generate.js-
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, 'menuforgeweb');
const DOMAIN = 'https://menuforgeweb.wiissapps.com';
const BASE_PATH = '';

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8'));
const { languages, defaultLang, rtlLangs, langNames, langShort, content } = data;

function langPath(lang) {
    return `${BASE_PATH === '' ? '' : BASE_PATH}${lang === defaultLang ? '/' : `/${lang}/`}`;
}

function asset(rel) {
    return `${BASE_PATH}${rel}`;
}

function fullUrl(lang) {
    return `${DOMAIN}${langPath(lang)}`;
}

const IMG_DIMS = {
    'dish-de-dark.png': [1080, 2145],
    'dish-pt.png': [1080, 2145],
    'home-ar-dark.png': [1080, 2250],
    'home-es.png': [1080, 2250],
    'image-catalog.png': [1080, 1760],
    'order-modal.png': [420, 750],
    'pdf-menu.png': [540, 655],
    'published-home-dark.png': [420, 900],
    'published-home.png': [1080, 2180],
    'published-menu-cn.png': [1080, 2180],
    'published-menu-dark.png': [420, 900],
    'published-menu.png': [420, 900],
    'qr-sheet.png': [1080, 2250],
    'whatsapp-order.png': [1080, 1050],
    'live-demo-qr.png': [500, 500]
};

function imgSize(file, displayWidth) {
    const dims = IMG_DIMS[file] || [1080, 2145];
    const [w, h] = dims;
    return { width: displayWidth, height: Math.round((displayWidth * h) / w) };
}

const LIVE_DEMO_URL = 'https://wiissapps.com/#restaurant:resto_1790153464516_x4dmsfv';
const LIVE_KICKER = { es: 'En directo, ahora mismo', en: 'Live, right now', fr: 'En direct, à l\'instant', it: 'In diretta, proprio ora', de: 'Live, gerade jetzt', pt: 'Ao vivo, agora mesmo', cn: '实时,就在现在', sa: 'مباشر، الآن' };
const GOOGLE_PLAY_BADGE = { es: 'es', en: 'en', fr: 'fr', it: 'it', de: 'de', pt: 'pt', cn: 'en', sa: 'ar' };

function googlePlayBadgeSrc(lang) {
    return asset(`/assets/badges/google-play-${GOOGLE_PLAY_BADGE[lang]}.png`);
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderHreflangs(lang) {
    const links = languages.map((l) => `    <link rel="alternate" hreflang="${content[l].htmlLang}" href="${fullUrl(l)}">`).join('\n');
    return `${links}\n    <link rel="alternate" hreflang="x-default" href="${fullUrl(defaultLang)}">`;
}

// Banderas SVG en base64 inyectadas (¡100% infalibles, sin depender de descargas externas!)
const B64_FLAGS = {
    es: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23c60b1e'/%3E%3Crect width='3' height='1' y='.5' fill='%23ffc400'/%3E%3C/svg%3E",
    en: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3CclipPath id='a'%3E%3Cpath d='M0 0h60v30H0z'/%3E%3C/clipPath%3E%3Cg clip-path='url(%23a)'%3E%3Cpath d='M0 0h60v30H0z' fill='%23012169'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' stroke='%23C8102E' stroke-width='4'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/g%3E%3C/svg%3E",
    fr: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23ED2939'/%3E%3Crect width='2' height='2' fill='%23fff'/%3E%3Crect width='1' height='2' fill='%23002395'/%3E%3C/svg%3E",
    it: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23ce2b37'/%3E%3Crect width='2' height='2' fill='%23f1f2f1'/%3E%3Crect width='1' height='2' fill='%23009246'/%3E%3C/svg%3E",
    de: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23FFCE00'/%3E%3Crect width='3' height='1.333' fill='%23DD0000'/%3E%3Crect width='3' height='.667' fill='%23000'/%3E%3C/svg%3E",
    pt: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23f00'/%3E%3Crect width='1' height='2' fill='%230f0'/%3E%3C/svg%3E",
    cn: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23ee1c25'/%3E%3Ccircle cx='0.5' cy='0.5' r='0.3' fill='%23ff0'/%3E%3C/svg%3E",
    sa: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='3' height='2' fill='%23006c35'/%3E%3Crect width='1.5' height='0.2' x='0.75' y='0.9' fill='%23fff'/%3E%3C/svg%3E"
};

function renderLangSwitcher(lang) {
    let options = languages.map(l => `
        <a href="${langPath(l)}" class="lang-option ${l === lang ? 'active' : ''}">
            <img src="${B64_FLAGS[l]}" alt="${l}" width="20" height="14" loading="lazy">
            <span>${escapeHtml(langShort[l])}</span>
        </a>
    `).join('');

    return `
    <div class="custom-dropdown" id="lang-dropdown">
        <button class="dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" onclick="toggleDropdown(event)">
            <img src="${B64_FLAGS[lang]}" alt="${lang}" width="20" height="14">
            <span>${escapeHtml(langShort[lang])}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="dropdown-menu">
            ${options}
        </div>
    </div>`;
}

function renderBadges(items) {
    return items.map((b) => `<span class="pill badge-glow">${escapeHtml(b)}</span>`).join('\n');
}

function renderFeatures(items) {
    return items.map((f, i) => `
                <div class="feature-card fly-in-scale" style="transition-delay:${(i % 3) * 80}ms">
                    <div class="feature-icon-wrapper">
                        <span class="feature-icon">${f.icon}</span>
                    </div>
                    <h3>${escapeHtml(f.title)}</h3>
                    <p>${escapeHtml(f.desc)}</p>
                </div>`).join('');
}

function renderSteps(items) {
    return items.map((s, i) => `
                    <div class="timeline-item fly-in-left" style="transition-delay:${i * 120}ms">
                        <div class="timeline-badge">${i + 1}</div>
                        <div class="timeline-content">
                            <h3>${escapeHtml(s.title)}</h3>
                            <p>${escapeHtml(s.desc)}</p>
                        </div>
                    </div>`).join('');
}

function slideClass(i, cols) {
    if (cols <= 1) return 'fly-in';
    const pos = i % cols;
    if (pos === 0) return 'fly-in-left';
    if (pos === cols - 1) return 'fly-in-right';
    return 'fly-in-scale';
}

function renderGallery(items, cols, displayWidth) {
    return items.map((g, i) => {
        const size = imgSize(g.img, displayWidth || 360);
        return `
                <div class="gallery-item ${slideClass(i, cols)}" style="transition-delay:${(i % cols) * 90}ms">
                    <div class="phone-frame 3d-hover shadow-xl">
                        <img src="${asset(`/assets/screens/${g.img}`)}" alt="${escapeHtml(g.alt)}" loading="lazy" width="${size.width}" height="${size.height}">
                    </div>
                    <div class="gallery-caption">${escapeHtml(g.caption)}</div>
                </div>`;
    }).join('');
}

function renderHonest(items) {
    return items.map((h) => `<li class="fly-in-left"><div class="honest-check">✓</div><span class="honest-text">${escapeHtml(h)}</span></li>`).join('\n');
}

function jsonLd(lang, c) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MenuForge',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Android',
        url: fullUrl(lang),
        description: c.meta.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        inLanguage: c.htmlLang
    });
}

function renderPage(lang) {
    const c = content[lang];
    const dir = rtlLangs.includes(lang) ? 'rtl' : 'ltr';
    const url = fullUrl(lang);

    return `<!DOCTYPE html>
<html lang="${c.htmlLang}" dir="${dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
    <title>${escapeHtml(c.meta.title)}</title>
    <meta name="description" content="${escapeHtml(c.meta.description)}">
    <link rel="canonical" href="${url}">
${renderHreflangs(lang)}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(c.meta.title)}">
    <meta property="og:description" content="${escapeHtml(c.meta.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${DOMAIN}${asset('/assets/screens/published-home.png')}">
    <meta property="og:locale" content="${c.htmlLang}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#ea580c">
    <link rel="manifest" href="${asset('/manifest.json')}">
    <link rel="icon" href="${asset('/assets/icons/icon-96.webp')}">
    <link rel="apple-touch-icon" href="${asset('/assets/icons/apple-touch-icon.png')}">
    <link rel="stylesheet" href="${asset('/css/styles.css')}">
    <script>window.__BASE__=${JSON.stringify(BASE_PATH)};</script>
    <script type="application/ld+json">${jsonLd(lang, c)}</script>
</head>
<body>
    <div class="blob blob-top-left"></div>
    <div class="blob blob-center-right"></div>
    
    <header class="site-header glass">
        <div class="container header-inner">
            <div class="brand fly-in"><img src="${asset('/assets/icons/icon-96.webp')}" alt="MenuForge" width="36" height="36"><span class="shimmer-text">MenuForge</span></div>
            <div class="header-actions fly-in" style="transition-delay: 100ms">
                ${renderLangSwitcher(lang)}
                <button id="theme-toggle" class="icon-btn" onclick="toggleTheme()" aria-label="${escapeHtml(c.nav.themeToggle)}" type="button">
                    <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
                    <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
            </div>
        </div>
    </header>

    <div class="cookie-notice glass" id="cookie-notice">
        <div class="container cookie-notice-inner">
            <p>${escapeHtml(c.cookieNotice.msg)}</p>
            <button class="btn btn-primary btn-sm cookie-notice-accept" type="button">${escapeHtml(c.cookieNotice.accept)}</button>
        </div>
    </div>

    <main>
        <section class="hero">
            <div class="container hero-grid">
                <div class="hero-content">
                    <span class="kicker badge-glow fly-in">✨ ${escapeHtml(c.hero.kicker)}</span>
                    <h1 class="fly-in-left">${escapeHtml(c.hero.titleLine1)}<br><span class="shimmer-text">${escapeHtml(c.hero.titleLine2)}</span></h1>
                    <p class="lead fly-in-left" style="transition-delay:100ms">${escapeHtml(c.hero.subtitle)}</p>
                    <div class="cta-row fly-in-left" style="transition-delay:200ms">
                        <a href="#" class="cta-badge-link scale-hover" data-cta="download" title="${escapeHtml(c.hero.ctaPrimarySoon)}">
                            <img class="google-play-badge" src="${googlePlayBadgeSrc(lang)}" alt="${escapeHtml(c.hero.ctaPrimary)}" width="180" height="54">
                        </a>
                        <a href="#steps" class="btn btn-ghost scale-hover">${escapeHtml(c.hero.ctaSecondary)}</a>
                    </div>
                    <div class="hero-note fly-in-left" style="transition-delay:300ms">✓ ${escapeHtml(c.hero.note)}</div>
                    <div class="badge-row fly-in-left" style="transition-delay:400ms">
                        ${renderBadges(c.badges)}
                    </div>
                </div>
                <div class="hero-visual-wrapper fly-in-scale">
                    <div class="hero-visual">
                        <div class="phone-wrapper phone-frame-glow">
                            <div class="phone-frame">
                                <img src="${asset('/assets/screens/published-home.png')}" alt="MenuForge Demo" width="${imgSize('published-home.png', 320).width}" height="${imgSize('published-home.png', 320).height}">
                            </div>
                            <div class="float-chip float-chip-1 glass-dark">🌐 8 / 8</div>
                            <div class="float-chip float-chip-2 glass-dark">📱 WhatsApp</div>
                            <div class="float-chip float-chip-3 glass-dark">🔲 QR Code</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="relative">
            <div class="container">
                <div class="section-head fly-in">
                    <h2 class="shimmer-text">${escapeHtml(c.features.title)}</h2>
                </div>
                <div class="features-grid">
                    ${renderFeatures(c.features.items)}
                </div>
            </div>
        </section>

        <section id="proof" class="glass-section">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.proof.title)}</h2>
                    <p class="lead">${escapeHtml(c.proof.subtitle)}</p>
                </div>
                <div class="proof-wrap">
                    <div class="proof-card fly-in-left glass">
                        <div class="phone-frame shadow-xl"><img src="${asset('/assets/screens/published-menu-cn.png')}" alt="${escapeHtml(c.proof.captionLeft)}" loading="lazy" width="${imgSize('published-menu-cn.png', 280).width}" height="${imgSize('published-menu-cn.png', 280).height}"></div>
                        <div class="proof-caption">🇨🇳 ${escapeHtml(c.proof.captionLeft)}</div>
                    </div>
                    <div class="proof-arrow fly-in-scale shimmer-text">
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <div class="proof-card fly-in-right glass">
                        <div class="phone-frame shadow-xl"><img src="${asset('/assets/screens/whatsapp-order.png')}" alt="${escapeHtml(c.proof.captionRight)}" loading="lazy" width="${imgSize('whatsapp-order.png', 280).width}" height="${imgSize('whatsapp-order.png', 280).height}"></div>
                        <div class="proof-caption">🇪🇸 ${escapeHtml(c.proof.captionRight)}</div>
                    </div>
                </div>
            </div>
        </section>

        <section id="steps">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.steps.title)}</h2>
                </div>
                <div class="timeline">
                    <div class="timeline-line gradient-bg" aria-hidden="true"></div>
                    ${renderSteps(c.steps.items)}
                </div>
            </div>
        </section>

        <section id="livedemo" class="relative">
            <div class="container">
                <div class="livedemo-box fly-in-scale glass highlight-border">
                    <div class="livedemo-text">
                        <span class="kicker pulse-dot">🔴 ${escapeHtml(LIVE_KICKER[lang])}</span>
                        <h2>${escapeHtml(c.liveDemo.title)}</h2>
                        <p>${escapeHtml(c.liveDemo.subtitle)}</p>
                        <a class="btn btn-primary glow-btn" href="${LIVE_DEMO_URL}" target="_blank" rel="noopener">🍽️ ${escapeHtml(c.liveDemo.linkLabel)}</a>
                    </div>
                    <div class="livedemo-qr glass">
                        <img src="${asset('/assets/screens/live-demo-qr.png')}" alt="${escapeHtml(c.liveDemo.linkLabel)}" width="180" height="180" loading="lazy">
                        <span class="livedemo-qr-caption">${escapeHtml(c.liveDemo.qrCaption)}</span>
                    </div>
                </div>
            </div>
        </section>

        <section id="webgallery">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.webGallery.title)}</h2>
                    <p class="lead">${escapeHtml(c.webGallery.subtitle)}</p>
                </div>
                <div class="gallery-grid gallery-grid-2">${renderGallery(c.webGallery.items, 2, 460)}</div>
            </div>
        </section>

        <section id="honest" class="glass-section">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.honest.title)}</h2>
                </div>
                <div class="honest-box fly-in-scale glass">
                    <ul class="honest-list">
                        ${renderHonest(c.honest.items)}
                    </ul>
                </div>
            </div>
        </section>

        <section id="final-cta">
            <div class="container">
                <div class="final-cta fly-in-scale glass highlight-border text-center">
                    <h2 class="shimmer-text">${escapeHtml(c.finalCta.title)}</h2>
                    <p class="lead mb-8" style="margin-left:auto; margin-right:auto;">${escapeHtml(c.finalCta.subtitle)}</p>
                    <a href="#" class="cta-badge-link scale-hover inline-block" data-cta="download">
                        <img class="google-play-badge" src="${googlePlayBadgeSrc(lang)}" alt="${escapeHtml(c.finalCta.button)}" width="200" height="60" style="margin:0 auto;">
                    </a>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="brand"><img src="${asset('/assets/icons/icon-96.webp')}" alt="" width="28" height="28">MenuForge</div>
            <div class="footer-meta">
                <span>© ${new Date().getFullYear()} ${escapeHtml(c.footer.rights)}</span>
                <a class="icon-btn scale-hover" href="mailto:wiissdeveloperapps@gmail.com" title="${escapeHtml(c.footer.contactLabel)}" aria-label="${escapeHtml(c.footer.contactLabel)}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
            </div>
        </div>
    </footer>
    <script src="${asset('/js/main.js')}"></script>
</body>
</html>`;
}

// INYECCIÓN "ULTRA" DE ESTILOS Y SCRIPTS
const ULTRA_CSS = `
:root {
  /* TEMA FORGE: Naranjas y Rojos vibrantes */
  --brand: #ea580c; 
  --brand-hover: #c2410c; 
  --grad-start: #f97316;
  --grad-end: #ef4444; 
  
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --text: #0f172a;
  --text-muted: #475569;
  --surface: rgba(255, 255, 255, 0.85);
  --border: rgba(0, 0, 0, 0.08);
  --glass: rgba(255, 255, 255, 0.65);
  --shadow: 0 20px 40px -15px rgba(0,0,0,0.08);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --radius: 1.5rem;
  --font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
[data-theme='dark'] {
  --brand: #f97316; 
  --brand-hover: #fb923c; 
  --grad-start: #fb923c;
  --grad-end: #f87171;
  
  --bg: #09090b;
  --bg-alt: #18181b;
  --text: #f8fafc;
  --text-muted: #a1a1aa;
  --surface: rgba(39, 39, 42, 0.6);
  --border: rgba(255, 255, 255, 0.1);
  --glass: rgba(24, 24, 27, 0.65);
  --shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; transition: background 0.3s, color 0.3s; }
.container { max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 1.5rem; }
a { text-decoration: none; color: inherit; }
img { max-width: 100%; height: auto; display: block; }

/* Utils & Glassmorphism */
.glass { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--border); }
.glass-section { background: var(--bg-alt); padding: 5rem 0; }
.glass-dark { background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
.gradient-bg { background: linear-gradient(135deg, var(--grad-start), var(--grad-end)); }
.highlight-border { position: relative; }
.highlight-border::before { content: ''; position: absolute; inset: -2px; border-radius: calc(var(--radius) + 2px); background: linear-gradient(135deg, var(--grad-start), var(--grad-end)); z-index: -1; opacity: 0.5; transition: opacity 0.3s; }

/* Animación Shimmer (Brillo que vende) */
.shimmer-text {
    background: linear-gradient(90deg, var(--grad-start) 0%, var(--grad-end) 50%, var(--grad-start) 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 4s linear infinite;
    display: inline-block;
}
@keyframes shimmer { to { background-position: 200% center; } }

/* Blobs de fondo (Efecto WOW) */
.blob { position: absolute; filter: blur(90px); z-index: -1; opacity: 0.3; border-radius: 50%; pointer-events: none; animation: float 10s ease-in-out infinite; }
.blob-top-left { top: -10%; left: -10%; width: 500px; height: 500px; background: var(--grad-start); }
.blob-center-right { top: 40%; right: -10%; width: 400px; height: 400px; background: var(--grad-end); animation-delay: -5s; }
@keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.1); } }

/* Header */
.site-header { position: fixed; top: 0; width: 100%; z-index: 100; border-bottom: 1px solid var(--border); transition: all 0.3s; }
.header-inner { display: flex; justify-content: space-between; align-items: center; height: 70px; }
.brand { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.5px; }
.brand img { border-radius: 8px; }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.icon-btn { background: transparent; border: none; color: var(--text); cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: 0.2s; display: flex; }
.icon-btn:hover { background: var(--border); }
.icon-btn svg { width: 20px; height: 20px; }
[data-theme='dark'] .sun-icon { display: block; }
[data-theme='dark'] .moon-icon { display: none; }
[data-theme='light'] .sun-icon { display: none; }
[data-theme='light'] .moon-icon { display: block; }

/* Menú desplegable de banderas (Custom Dropdown 100% Nativo) */
.custom-dropdown { position: relative; display: inline-block; }
.dropdown-toggle { display: flex; align-items: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); padding: 0.4rem 0.8rem; border-radius: 20px; cursor: pointer; color: var(--text); font-weight: 600; font-family: inherit; font-size: 0.95rem; }
.dropdown-toggle img { border-radius: 2px; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
.dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; background: var(--surface); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 12px; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.2rem; min-width: 120px; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); z-index: 200; box-shadow: var(--shadow-xl); }
.custom-dropdown.open .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
.lang-option { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0.8rem; border-radius: 8px; font-weight: 600; transition: 0.2s; font-size: 0.95rem; }
.lang-option img { border-radius: 2px; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
.lang-option:hover { background: var(--border); }
.lang-option.active { color: var(--brand); background: rgba(234, 88, 12, 0.1); }

/* Hero */
.hero { padding: 9rem 0 6rem; position: relative; }
/* ARREGLO GRID: min-width: 0 para evitar que el hijo rompa el contenedor */
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; min-width: 0; }
.hero-content, .hero-visual-wrapper { min-width: 0; width: 100%; }

.kicker { display: inline-block; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.9rem; margin-bottom: 1.5rem; border: 1px solid var(--border); background: var(--surface); }
.badge-glow { box-shadow: 0 0 20px rgba(234, 88, 12, 0.2); }
h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.1; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -1px; }
.lead { font-size: 1.25rem; color: var(--text-muted); margin-bottom: 2.5rem; max-width: 600px; }
.cta-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.8rem 1.8rem; border-radius: 12px; font-weight: 600; transition: all 0.2s; cursor: pointer; }
.btn-primary { background: var(--brand); color: white; border: none; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3); }
.btn-primary:hover { background: var(--brand-hover); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4); }
.glow-btn { position: relative; overflow: hidden; }
.glow-btn::after { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%); opacity:0; transition:0.3s; transform: scale(0.5); }
.glow-btn:hover::after { opacity:1; transform: scale(1); }
.btn-ghost { background: transparent; color: var(--text); border: 2px solid var(--border); }
.btn-ghost:hover { border-color: var(--brand); color: var(--brand); background: var(--surface); }
.scale-hover { transition: transform 0.2s; display: inline-block; }
.scale-hover:hover { transform: scale(1.05); }
.hero-note { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; }
.badge-row { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.pill { font-size: 0.85rem; padding: 0.3rem 0.8rem; border-radius: 20px; background: var(--surface); border: 1px solid var(--border); font-weight: 600; color: var(--text-muted); }

/* Phone Frame & Glow (Corregido Desbordamiento y Z-index) */
.hero-visual-wrapper { display: flex; justify-content: center; align-items: center; }
.hero-visual { animation: float-hero 6s ease-in-out infinite; width: 100%; display: flex; justify-content: center; }
@keyframes float-hero { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

/* ARREGLO CRÍTICO: max-width forzado en lugar de max-content */
.phone-wrapper { position: relative; max-width: 320px; width: 100%; margin: 0 auto; z-index: 2; }
.phone-frame { border: 8px solid #1a1a2e; border-radius: 36px; overflow: hidden; background: #000; position: relative; z-index: 3; width: 100%; }
.phone-frame img { border-radius: 28px; display: block; width: 100%; height: auto; object-fit: cover; }
.shadow-xl { box-shadow: var(--shadow-xl); }

/* El halo mágico ahora vive en su propio contexto detras del telefono */
.phone-frame-glow::before { 
    content: ''; 
    position: absolute; 
    top: -10px; left: -10px; right: -10px; bottom: -10px; 
    background: linear-gradient(135deg, var(--grad-start), var(--grad-end)); 
    filter: blur(25px); 
    z-index: 1; /* Detrás del z-index:3 del frame */
    opacity: 0.6; 
    border-radius: 40px; 
    animation: pulse-glow 4s ease-in-out infinite; 
}
@keyframes pulse-glow { 0%, 100% { opacity: 0.5; filter: blur(20px); transform: scale(1); } 50% { opacity: 0.8; filter: blur(30px); transform: scale(1.02); } }

.float-chip { position: absolute; padding: 0.6rem 1.2rem; border-radius: 20px; font-weight: 600; font-size: 0.9rem; z-index: 10; animation: float-chip-anim 6s ease-in-out infinite; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
@keyframes float-chip-anim { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
.float-chip-1 { top: 10%; right: -20%; animation-delay: 0s; }
.float-chip-2 { bottom: 25%; left: -25%; animation-delay: -2s; }
.float-chip-3 { bottom: 10%; right: -15%; animation-delay: -4s; }

/* Sections */
.section-head { text-align: center; margin-bottom: 4rem; }
.section-head h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.5px; margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }
.inline-block { display: inline-block; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
.feature-card { background: var(--surface); border: 1px solid var(--border); padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); transition: all 0.3s; display: flex; flex-direction: column; gap: 1rem; }
.feature-card:hover { transform: translateY(-5px); border-color: var(--brand); box-shadow: 0 15px 30px rgba(234, 88, 12, 0.15); }
.feature-icon-wrapper { width: 50px; height: 50px; border-radius: 12px; background: var(--bg-alt); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid var(--border); }
.feature-card h3 { font-size: 1.25rem; font-weight: 700; }
.feature-card p { color: var(--text-muted); font-size: 0.95rem; }

/* Proof (Móviles emparejados con la flecha) */
.proof-wrap { display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: nowrap; }
.proof-card { flex: 1; max-width: 320px; padding: 1.5rem; border-radius: var(--radius); display: flex; flex-direction: column; gap: 1rem; text-align: center; font-weight: 600; width: 100%; }
.proof-arrow { flex-shrink: 0; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; }
.arrow-icon { width: 40px; height: 40px; }

/* Timeline (Alineación móvil perfeccionada) */
.timeline { position: relative; max-width: 800px; margin: 0 auto; padding-left: 10px; }
.timeline-line { position: absolute; left: 34px; top: 0; bottom: 0; width: 2px; opacity: 0.3; }
.timeline-item { display: flex; gap: 2rem; margin-bottom: 3rem; position: relative; width: 100%; }
.timeline-badge { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--grad-start), var(--grad-end)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; flex-shrink: 0; z-index: 2; box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
.timeline-content { padding-top: 0.5rem; }
.timeline-content h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.timeline-content p { color: var(--text-muted); font-size: 1.1rem; }

/* Live Demo */
.livedemo-box { display: flex; align-items: center; justify-content: space-between; padding: 4rem; border-radius: var(--radius); flex-wrap: wrap; gap: 3rem; }
.pulse-dot { position: relative; }
.pulse-dot::before { content: ''; position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; background: red; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,0,0,0.7); } 70% { box-shadow: 0 0 0 10px rgba(255,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(255,0,0,0); } }
.livedemo-text h2 { font-size: 2.5rem; margin: 1rem 0; font-weight: 800; }
.livedemo-text p { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 2rem; max-width: 400px; }
.livedemo-qr { padding: 1.5rem; border-radius: var(--radius); text-align: center; }
.livedemo-qr img { border-radius: 12px; margin-bottom: 1rem; }
.livedemo-qr-caption { font-weight: 600; color: var(--text-muted); font-size: 0.9rem; }

/* Galleries (Simetría perfecta para mockups lado a lado) */
.gallery-grid { display: grid; gap: 2rem; justify-content: center; align-items: start; }
.gallery-grid-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.gallery-grid-3 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }

.gallery-item { display: flex; flex-direction: column; width: 100%; max-width: 320px; margin: 0 auto; }
.gallery-item .phone-frame { 
    height: 580px; 
    width: 100%; 
    display: flex; 
    justify-content: center; 
    background: #000; 
    border: 8px solid #1a1a2e; 
    border-radius: 36px; 
    overflow: hidden; 
}
.gallery-item .phone-frame img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    object-position: top; 
    border-radius: 28px;
}
.gallery-caption { text-align: center; margin-top: 1.5rem; font-weight: 600; color: var(--text-muted); padding: 0 1rem; }
.3d-hover:hover { transform: scale(1.02) translateY(-10px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

/* Honest */
.honest-box { max-width: 800px; margin: 0 auto; padding: 3rem; border-radius: var(--radius); }
.honest-list { list-style: none; display: flex; flex-direction: column; gap: 1.5rem; }
.honest-list li { display: flex; gap: 1rem; align-items: flex-start; font-size: 1.1rem; }
.honest-check { background: var(--brand); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; flex-shrink: 0; margin-top: 4px; box-shadow: 0 0 10px rgba(234, 88, 12, 0.4); }

/* Final CTA */
.final-cta { padding: 5rem 2rem; border-radius: var(--radius); margin-bottom: 4rem; width: 100%; }

/* Footer */
.site-footer { border-top: 1px solid var(--border); padding: 2rem 0; color: var(--text-muted); }
.footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.footer-meta { display: flex; align-items: center; gap: 1.5rem; }

/* Cookies */
.cookie-notice { position: fixed; bottom: -100%; left: 50%; transform: translateX(-50%); width: calc(100% - 2rem); max-width: 600px; padding: 1.5rem; border-radius: var(--radius); z-index: 1000; transition: bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 -10px 40px rgba(0,0,0,0.1); }
.cookie-notice.show { bottom: 1rem; }
.cookie-notice-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0; }
.cookie-notice p { font-size: 0.9rem; margin: 0; }
.btn-sm { padding: 0.5rem 1rem; font-size: 0.9rem; }

/* Animaciones de Scroll */
.fly-in { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.fly-in-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.fly-in-right { opacity: 0; transform: translateX(40px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.fly-in-scale { opacity: 0; transform: scale(0.9); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.visible { opacity: 1 !important; transform: translate(0) scale(1) !important; }

/* ========================================= */
/*  RESPONSIVE (Ajustes a prueba de balas)   */
/* ========================================= */
@media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; text-align: center; gap: 4rem; }
    .hero-content { display: flex; flex-direction: column; align-items: center; }
    .cta-row, .badge-row { justify-content: center; }
    .float-chip { display: none; }
}

@media (max-width: 768px) {
    /* La flecha de la prueba se pone en vertical */
    .proof-wrap { flex-direction: column; gap: 1rem; }
    .proof-arrow { transform: rotate(90deg); margin: 0.5rem 0; }
}

@media (max-width: 600px) {
    h1 { font-size: 2.2rem; }
    .hero { padding: 8rem 0 4rem; }
    
    /* Alineación estricta de la línea de tiempo */
    .timeline { padding-left: 5px; }
    .timeline-item { gap: 1.2rem; }
    .timeline-badge { width: 40px; height: 40px; font-size: 1rem; }
    .timeline-line { left: 24px; }
    
    .livedemo-box { padding: 2.5rem 1.5rem; justify-content: center; text-align: center; }
    .final-cta { padding: 4rem 1.5rem; }
    .honest-box { padding: 2rem 1.5rem; }
}
`;

const ULTRA_JS = `
// Toggle de Tema
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
}

// Menú desplegable de Idiomas
window.toggleDropdown = function(e) {
    e.stopPropagation();
    const drop = document.getElementById('lang-dropdown');
    if(drop) drop.classList.toggle('open');
};

document.addEventListener('DOMContentLoaded', () => {
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', () => {
        const drop = document.getElementById('lang-dropdown');
        if(drop) drop.classList.remove('open');
    });

    // Restaurar tema
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Intersection Observer para las animaciones (El toque premium)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fly-in, .fly-in-left, .fly-in-right, .fly-in-scale').forEach(el => observer.observe(el));

    // Lógica de Cookies
    const cookieNotice = document.getElementById('cookie-notice');
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            if(cookieNotice) cookieNotice.classList.add('show');
        }, 1500);
    }

    const btnAccept = document.querySelector('.cookie-notice-accept');
    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.classList.remove('show');
        });
    }

    // Header sticky con blur
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.background = 'var(--glass)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'transparent';
            header.style.boxShadow = 'none';
        }
    });
});
`;

// Helper unificado de guardado
function writeFile(rel, content_) {
    const full = path.join(OUT_DIR, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content_, 'utf8');
    console.log('wrote', path.join('menuforgeweb', rel));
}

// 1. Escribir archivos HTML
languages.forEach((lang) => {
    const rel = lang === defaultLang ? 'index.html' : `${lang}/index.html`;
    writeFile(rel, renderPage(lang));
});

// 2. Escribir Assets "Ultra" autogenerados
writeFile('css/styles.css', ULTRA_CSS);
writeFile('js/main.js', ULTRA_JS);

// 3. Escribir XML y JSON de configuración
const urls = languages.map((l) => `  <url>\n    <loc>${fullUrl(l)}</loc>\n${languages.map((l2) => `    <xhtml:link rel="alternate" hreflang="${content[l2].htmlLang}" href="${fullUrl(l2)}"/>`).join('\n')}\n  </url>`).join('\n');
writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);

writeFile('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}${asset('/sitemap.xml')}\n`);

writeFile('manifest.json', JSON.stringify({
    name: 'MenuForge',
    short_name: 'MenuForge',
    start_url: `${BASE_PATH === '' ? '/' : BASE_PATH + '/'}`,
    scope: `${BASE_PATH === '' ? '/' : BASE_PATH + '/'}`,
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#ea580c',
    icons: [48, 72, 96, 128, 192, 256, 512].map((s) => ({ src: asset(`/assets/icons/icon-${s}.webp`), type: 'image/webp', sizes: `${s}x${s}`, purpose: 'any maskable' }))
}, null, 2) + '\n');

console.log('\n✨ Listo. Arquitectura estática completada. URL final:', DOMAIN + BASE_PATH + '/');