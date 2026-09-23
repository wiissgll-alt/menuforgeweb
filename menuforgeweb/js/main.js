
// Toggle de Tema
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
}

// Selector de idioma
function goToLang(sel) {
    window.location.href = sel.value;
}

document.addEventListener('DOMContentLoaded', () => {
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
                // Unobserve para que no se anime cada vez que subes y bajas
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fly-in, .fly-in-left, .fly-in-right, .fly-in-scale').forEach(el => observer.observe(el));

    // Lógica de Cookies
    const cookieNotice = document.getElementById('cookie-notice');
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 1500);
    }

    document.querySelector('.cookie-notice-accept')?.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieNotice.classList.remove('show');
    });

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
