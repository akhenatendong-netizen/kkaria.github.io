const APP_CONFIG = {
    pages: {
        home: 'home.html',
        search: 'search.html',
        orders: 'orders.html',
        favorites: 'favorites.html',
        profile: 'profile.html',
        restaurantDetail: 'restaurant-detail.html',
        dealDetail: 'deal-detail.html'
    }
};

function navigateTo(page) {
    const target = APP_CONFIG.pages[page];
    if (target) {
        window.location.href = target;
    }
}

function currentPageKey() {
    const file = (window.location.pathname.split('/').pop() || 'home.html').toLowerCase();
    if (file.includes('home')) return 'home';
    if (file.includes('search')) return 'search';
    if (file.includes('orders')) return 'orders';
    if (file.includes('favorites')) return 'favorites';
    if (file.includes('profile')) return 'profile';
    return '';
}

function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = [
        'position:absolute',
        'left:50%',
        'bottom:96px',
        'transform:translateX(-50%)',
        'background:rgba(15,23,42,.88)',
        'color:#fff',
        'font-size:12px',
        'font-weight:700',
        'border-radius:999px',
        'padding:10px 14px',
        'z-index:999',
        'box-shadow:0 8px 24px rgba(15,23,42,.25)'
    ].join(';');

    const app = document.querySelector('.app') || document.body;
    app.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all .2s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(8px)';
    }, duration - 180);

    setTimeout(() => toast.remove(), duration + 40);
}

function activateTabBar() {
    const map = ['home', 'search', 'orders', 'favorites', 'profile'];
    const key = currentPageKey();
    document.querySelectorAll('.tab-item').forEach((el, idx) => {
        el.classList.toggle('active', map[idx] === key);
    });
}

function bindDataActions() {
    document.querySelectorAll('[data-nav]').forEach((el) => {
        el.addEventListener('click', () => navigateTo(el.dataset.nav));
    });

    document.querySelectorAll('[data-back]').forEach((el) => {
        el.addEventListener('click', () => window.history.back());
    });

    document.querySelectorAll('[data-toast]').forEach((el) => {
        el.addEventListener('click', (e) => {
            if (el.tagName === 'BUTTON') {
                e.stopPropagation();
            }
            showToast(el.dataset.toast || 'Done');
        });
    });

    document.querySelectorAll('.favorite-btn').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = el.querySelector('i');
            const active = el.classList.toggle('active');
            if (icon) {
                icon.classList.toggle('fa-regular', !active);
                icon.classList.toggle('fa-solid', active);
            }
            showToast(active ? 'Saved' : 'Removed', 1400);
        });
    });

    document.querySelectorAll('.chip, .segment-btn').forEach((el) => {
        el.addEventListener('click', () => {
            const parent = el.parentElement;
            if (!parent) return;
            parent.querySelectorAll('.chip, .segment-btn').forEach((sibling) => sibling.classList.remove('active'));
            el.classList.add('active');
        });
    });
}

function bindTabNav() {
    const map = ['home', 'search', 'orders', 'favorites', 'profile'];
    document.querySelectorAll('.tab-item').forEach((el, idx) => {
        el.addEventListener('click', () => {
            const key = map[idx];
            if (key) navigateTo(key);
        });
    });
}

window.navigateTo = navigateTo;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
    activateTabBar();
    bindTabNav();
    bindDataActions();
});
