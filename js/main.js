(function () {
    'use strict';

    // ---------- Theme ----------
    var THEME_KEY = 'menuforgeweb_theme';
    var root = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') root.setAttribute('data-theme', 'dark');
        else if (theme === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
    }

    function currentStoredTheme() {
        try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    }

    function isDarkNow() {
        var stored = currentStoredTheme();
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    applyTheme(currentStoredTheme());

    function updateThemeIcon() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.innerHTML = isDarkNow()
            ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
    }

    window.toggleTheme = function () {
        var next = isDarkNow() ? 'light' : 'dark';
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        applyTheme(next);
        updateThemeIcon();
    };

    // ---------- Language switch ----------
    window.goToLang = function (select) {
        var target = select.value;
        if (target) window.location.href = target;
    };

    // ---------- Scroll reveal ----------
    function initReveal() {
        var items = document.querySelectorAll('.fly-in, .fly-in-left, .fly-in-right, .fly-in-scale');
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        items.forEach(function (el) { observer.observe(el); });
    }

    // ---------- CTA link from config.json (editable without touching code) ----------
    function initCta() {
        var buttons = document.querySelectorAll('[data-cta="download"]');
        if (!buttons.length) return;
        var base = window.__BASE__ || '';
        fetch(base + '/config.json', { cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (cfg) {
                var url = cfg && cfg.playStoreUrl ? cfg.playStoreUrl.trim() : '';
                buttons.forEach(function (btn) {
                    if (url) {
                        btn.setAttribute('href', url);
                        btn.classList.remove('is-disabled');
                        btn.removeAttribute('aria-disabled');
                    } else {
                        btn.setAttribute('href', '#');
                        btn.classList.add('is-disabled');
                        btn.setAttribute('aria-disabled', 'true');
                        btn.addEventListener('click', function (e) { e.preventDefault(); });
                        var soon = btn.getAttribute('data-soon-label');
                        if (soon) btn.querySelector('[data-cta-label]').textContent = soon;
                    }
                });
            })
            .catch(function () {});
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateThemeIcon();
        initReveal();
        initCta();
    });
})();
