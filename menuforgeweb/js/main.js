
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
