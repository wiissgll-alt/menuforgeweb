// Generador de páginas estáticas -sin dependencias, node generate.js- que produce una página
// HTML completa por idioma a partir de content.json. Cada idioma tiene su propia URL real
// (/, /en/, /fr/...) en vez de un único HTML con textos cambiados por JS, para que Google pueda
// indexar cada idioma por separado (hreflang) en vez de solo el contenido en español.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
// Configurado para el dominio propio en la raíz
const DOMAIN = 'https://wsapps.dpdns.org';
const BASE_PATH = '/menuforge';

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8'));
const { languages, defaultLang, rtlLangs, langNames, langShort, content } = data;

// Ruta local (sin dominio) de un idioma, ya con la estructura de raíz adaptada.
function langPath(lang) {
    return `${BASE_PATH === '' ? '' : BASE_PATH}${lang === defaultLang ? '/' : `/${lang}/`}`;
}

// Ruta local de un asset estático (css/js/imagen...), adaptado a la raíz.
function asset(rel) {
    return `${BASE_PATH}${rel}`;
}

function fullUrl(lang) {
    return `${DOMAIN}${langPath(lang)}`;
}

// Dimensiones reales de cada captura -nunca inventar un width/height uniforme para todas: cada
// imagen tiene su propia proporción y forzar una distinta la deja estirada o aplastada-.
const IMG_DIMS = {
    'dish-de-dark.png': [1080, 2145],
    'dish-pt.png': [1080, 2145],
    'home-ar-dark.png': [1080, 2250],
    'home-es.png': [1080, 2250],
    'image-catalog.png': [1080, 1760],
    'order-modal.png': [420, 750],
    'published-home-dark.png': [420, 900],
    'published-home.png': [420, 900],
    'published-menu-cn.png': [420, 820],
    'published-menu-dark.png': [420, 900],
    'published-menu.png': [420, 900],
    'qr-sheet.png': [1080, 2250],
    'whatsapp-order.png': [1080, 1050]
};

// Calcula width/height a incluir en el <img> a partir de las dimensiones REALES del archivo,
// escaladas para que quepan en displayWidth -así el navegador reserva el hueco correcto y no
// distorsiona la imagen sea cual sea su proporción original-.
function imgSize(file, displayWidth) {
    const [w, h] = IMG_DIMS[file];
    return { width: displayWidth, height: Math.round((displayWidth * h) / w) };
}

// Badge oficial de "Disponible en Google Play" -no hay versión oficial en chino simplificado,
// así que esa página cae en la inglesa, igual que hacen muchas apps reales-.
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

function renderLangSwitcher(lang) {
    const options = languages.map((l) => `<option value="${langPath(l)}" ${l === lang ? 'selected' : ''}>${escapeHtml(langShort[l])}</option>`).join('');
    return `<div class="lang-picker"><select onchange="goToLang(this)" aria-label="${escapeHtml(content[lang].nav.menuLabel)}">${options}</select></div>`;
}

function renderBadges(items) {
    return items.map((b) => `<span class="pill">${escapeHtml(b)}</span>`).join('\n                ');
}

function renderFeatures(items) {
    return items.map((f, i) => `
                <div class="feature-card fly-in-scale" style="transition-delay:${(i % 3) * 80}ms">
                    <div class="feature-icon">${f.icon}</div>
                    <h3>${escapeHtml(f.title)}</h3>
                    <p>${escapeHtml(f.desc)}</p>
                </div>`).join('');
}

function renderSteps(items) {
    return items.map((s, i) => `
                <div class="step-card fly-in" style="transition-delay:${i * 100}ms">
                    <div class="step-num">${i + 1}</div>
                    <h3>${escapeHtml(s.title)}</h3>
                    <p>${escapeHtml(s.desc)}</p>
                </div>`).join('');
}

function renderGallery(items, cols) {
    return items.map((g, i) => {
        const size = imgSize(g.img, 360);
        return `
                <div class="gallery-item fly-in" style="transition-delay:${(i % cols) * 70}ms">
                    <div class="phone-frame"><img src="${asset(`/assets/screens/${g.img}`)}" alt="${escapeHtml(g.alt)}" loading="lazy" width="${size.width}" height="${size.height}"></div>
                    <div class="gallery-caption">${escapeHtml(g.caption)}</div>
                </div>`;
    }).join('');
}

function renderHonest(items) {
    return items.map((h) => `<li><span class="honest-check">✓</span><span>${escapeHtml(h)}</span></li>`).join('\n                ');
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
    const fontLink = lang === 'sa'
        ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet">`
        : `<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

    return `<!DOCTYPE html>
<html lang="${c.htmlLang}" dir="${dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
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
    <meta name="twitter:title" content="${escapeHtml(c.meta.title)}">
    <meta name="twitter:description" content="${escapeHtml(c.meta.description)}">
    <meta name="theme-color" content="#4f46e5">
    <link rel="manifest" href="${asset('/manifest.json')}">
    <link rel="icon" href="${asset('/assets/icons/icon-96.webp')}">
    <link rel="apple-touch-icon" href="${asset('/assets/icons/apple-touch-icon.png')}">
    ${fontLink}
    <link rel="stylesheet" href="${asset('/css/styles.css')}">
    <script>window.__BASE__=${JSON.stringify(BASE_PATH)};</script>
    <script type="application/ld+json">${jsonLd(lang, c)}</script>
</head>
<body>
    <div class="ambient"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>

    <header class="site-header">
        <div class="container header-inner">
            <div class="brand"><img src="${asset('/assets/icons/icon-96.webp')}" alt="MenuForge" width="30" height="30">MenuForge</div>
            <div class="header-actions">
                ${renderLangSwitcher(lang)}
                <button id="theme-toggle" class="icon-btn" onclick="toggleTheme()" aria-label="${escapeHtml(c.nav.themeToggle)}" type="button"></button>
            </div>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container hero-grid">
                <div>
                    <span class="kicker fly-in visible">✨ ${escapeHtml(c.hero.kicker)}</span>
                    <h1 class="fly-in-left visible">${escapeHtml(c.hero.titleLine1)}<br><span class="accent-text">${escapeHtml(c.hero.titleLine2)}</span></h1>
                    <p class="lead fly-in-left visible" style="transition-delay:80ms">${escapeHtml(c.hero.subtitle)}</p>
                    <div class="cta-row fly-in-left visible" style="transition-delay:140ms">
                        <a href="#" class="cta-badge-link" data-cta="download" title="${escapeHtml(c.hero.ctaPrimarySoon)}">
                            <img class="google-play-badge" src="${googlePlayBadgeSrc(lang)}" alt="${escapeHtml(c.hero.ctaPrimary)}" width="180" height="54">
                        </a>
                        <a href="#steps" class="btn btn-ghost">${escapeHtml(c.hero.ctaSecondary)}</a>
                    </div>
                    <div class="hero-note fly-in-left visible" style="transition-delay:180ms">${escapeHtml(c.hero.note)}</div>
                    <div class="badge-row">
                ${renderBadges(c.badges)}
                    </div>
                </div>
                <div class="hero-visual fly-in-scale visible">
                    <div class="phone-frame"><img src="${asset('/assets/screens/published-home.png')}" alt="${escapeHtml(c.webGallery.items[0].alt)}" width="${imgSize('published-home.png', 300).width}" height="${imgSize('published-home.png', 300).height}"></div>
                    <div class="float-chip float-chip-1">🌐 8 / 8</div>
                    <div class="float-chip float-chip-2">📱 WhatsApp</div>
                    <div class="float-chip float-chip-3">🔲 QR</div>
                </div>
            </div>
        </section>

        <section id="proof">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.proof.title)}</h2>
                    <p>${escapeHtml(c.proof.subtitle)}</p>
                </div>
                <div class="proof-wrap">
                    <div class="proof-card fly-in-left">
                        <div class="phone-frame"><img src="${asset('/assets/screens/published-menu-cn.png')}" alt="${escapeHtml(c.proof.captionLeft)}" width="${imgSize('published-menu-cn.png', 280).width}" height="${imgSize('published-menu-cn.png', 280).height}"></div>
                        <div class="proof-caption">🇨🇳 ${escapeHtml(c.proof.captionLeft)}</div>
                    </div>
                    <div class="proof-arrow fly-in-scale">→</div>
                    <div class="proof-card fly-in-right">
                        <div class="phone-frame"><img src="${asset('/assets/screens/whatsapp-order.png')}" alt="${escapeHtml(c.proof.captionRight)}" width="${imgSize('whatsapp-order.png', 280).width}" height="${imgSize('whatsapp-order.png', 280).height}"></div>
                        <div class="proof-caption">🇪🇸 ${escapeHtml(c.proof.captionRight)}</div>
                    </div>
                </div>
            </div>
        </section>

        <section id="features">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.features.title)}</h2>
                </div>
                <div class="features-grid">${renderFeatures(c.features.items)}
                </div>
            </div>
        </section>

        <section id="steps">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.steps.title)}</h2>
                </div>
                <div class="steps-grid">${renderSteps(c.steps.items)}
                </div>
            </div>
        </section>

        <section id="webgallery">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.webGallery.title)}</h2>
                    <p>${escapeHtml(c.webGallery.subtitle)}</p>
                </div>
                <div class="gallery-grid gallery-grid-2">${renderGallery(c.webGallery.items, 2)}
                </div>
            </div>
        </section>

        <section id="appgallery">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.appGallery.title)}</h2>
                    <p>${escapeHtml(c.appGallery.subtitle)}</p>
                </div>
                <div class="gallery-grid gallery-grid-3">${renderGallery(c.appGallery.items, 3)}
                </div>
            </div>
        </section>

        <section id="honest">
            <div class="container">
                <div class="section-head fly-in">
                    <h2>${escapeHtml(c.honest.title)}</h2>
                </div>
                <div class="honest-box fly-in-scale">
                    <ul class="honest-list">
                ${renderHonest(c.honest.items)}
                    </ul>
                </div>
            </div>
        </section>

        <section id="final-cta">
            <div class="container">
                <div class="final-cta fly-in-scale">
                    <h2>${escapeHtml(c.finalCta.title)}</h2>
                    <p>${escapeHtml(c.finalCta.subtitle)}</p>
                    <a href="#" class="cta-badge-link" data-cta="download" title="${escapeHtml(c.hero.ctaPrimarySoon)}">
                        <img class="google-play-badge" src="${googlePlayBadgeSrc(lang)}" alt="${escapeHtml(c.finalCta.button)}" width="180" height="54">
                    </a>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="brand"><img src="${asset('/assets/icons/icon-96.webp')}" alt="" width="24" height="24">MenuForge</div>
            <div class="footer-meta">
                <span>© ${new Date().getFullYear()} ${escapeHtml(c.footer.rights)}</span>
                <a class="icon-btn" href="mailto:wiissdeveloperapps@gmail.com" title="${escapeHtml(c.footer.contactLabel)}" aria-label="${escapeHtml(c.footer.contactLabel)}">
                    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
            </div>
        </div>
    </footer>

    <script src="${asset('/js/main.js')}"></script>
</body>
</html>
`;
}

function writeFile(rel, content_) {
    const full = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content_, 'utf8');
    console.log('wrote', rel);
}

languages.forEach((lang) => {
    const rel = lang === defaultLang ? 'index.html' : `${lang}/index.html`;
    writeFile(rel, renderPage(lang));
});

// sitemap.xml
const urls = languages.map((l) => `  <url>\n    <loc>${fullUrl(l)}</loc>\n${languages.map((l2) => `    <xhtml:link rel="alternate" hreflang="${content[l2].htmlLang}" href="${fullUrl(l2)}"/>`).join('\n')}\n  </url>`).join('\n');
writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);

writeFile('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}${asset('/sitemap.xml')}\n`);

writeFile('manifest.json', JSON.stringify({
    name: 'MenuForge',
    short_name: 'MenuForge',
    start_url: `${BASE_PATH === '' ? '/' : BASE_PATH + '/'}`,
    scope: `${BASE_PATH === '' ? '/' : BASE_PATH + '/'}`,
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#4f46e5',
    icons: [48, 72, 96, 128, 192, 256, 512].map((s) => ({ src: asset(`/assets/icons/icon-${s}.webp`), type: 'image/webp', sizes: `${s}x${s}`, purpose: 'any maskable' }))
}, null, 2) + '\n');

console.log('\nListo. Dominio:', DOMAIN, '- BASE_PATH limpio para la raíz.');