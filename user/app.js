const APP_CONFIG = {
    pages: {
        login: 'login.html',
        home: 'home.html',
        search: 'search.html',
        orders: 'orders.html',
        favorites: 'favorites.html',
        profile: 'profile.html',
        coupons: 'coupons.html',
        rewards: 'rewards.html',
        notifications: 'notifications.html',
        settings: 'settings.html',
        restaurantDetail: 'restaurant-detail.html',
        dealDetail: 'deal-detail.html',
        orderConfirmation: 'order-confirmation.html',
        orderDetail: 'order-detail.html',
        writeReview: 'write-review.html'
    }
};

function navigateTo(page) {
    if (!page) return;
    if (page.includes('.html') || page.includes('?') || page.includes('/')) {
        window.location.href = page;
        return;
    }
    const target = APP_CONFIG.pages[page];
    if (target) {
        window.location.href = target;
    }
}

function currentPageKey() {
    const file = (window.location.pathname.split('/').pop() || 'home.html').toLowerCase();
    if (file.includes('home')) return 'home';
    if (file.includes('search')) return 'search';
    if (file.includes('orders') || file.includes('order-confirmation') || file.includes('order-detail') || file.includes('write-review')) return 'orders';
    if (file.includes('favorites')) return 'favorites';
    if (
        file.includes('profile') ||
        file.includes('coupon') ||
        file.includes('reward') ||
        file.includes('notification') ||
        file.includes('setting')
    ) return 'profile';
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
        'white-space:nowrap',
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
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateTo(el.dataset.nav);
        });
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

    document.querySelectorAll('[data-copy]').forEach((el) => {
        el.addEventListener('click', async (e) => {
            e.stopPropagation();
            const value = el.dataset.copy || '';
            try {
                if (navigator.clipboard && value) {
                    await navigator.clipboard.writeText(value);
                    showToast(el.dataset.toast || 'Copied');
                } else {
                    showToast('Copy unavailable');
                }
            } catch (err) {
                showToast('Copy failed');
            }
        });
    });

    document.querySelectorAll('[data-toggle-target]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = document.querySelector(el.dataset.toggleTarget);
            if (!target) return;
            const active = target.classList.toggle('active');
            el.classList.toggle('active', active);
            if (el.dataset.toast) {
                showToast(el.dataset.toast);
            }
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

    document.querySelectorAll('a[href="javascript:void(0)"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('More details coming soon');
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

function bindMicroInteractions() {
    const pressableSelector = [
        'button',
        '.tab-item',
        '.menu-line',
        '.deal-card',
        '.order-item',
        '.list-item',
        '.merchant-card',
        '.search-trigger',
        '.back-icon',
        '.city-trigger',
        '.search-mini',
        '.hero-tool-icon'
    ].join(', ');

    document.querySelectorAll(pressableSelector).forEach((el) => {
        el.classList.add('pressable', 'with-ripple');
        if (!el.dataset.tapBound) {
            el.dataset.tapBound = '1';
            el.addEventListener('click', () => {
                el.classList.remove('tap-pop');
                void el.offsetWidth;
                el.classList.add('tap-pop');
                setTimeout(() => el.classList.remove('tap-pop'), 220);
            });
            el.addEventListener('pointerdown', (e) => {
                const rect = el.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple-wave';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                el.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        }
    });

    const fadeEls = document.querySelectorAll('.fade-in');
    fadeEls.forEach((el, idx) => {
        el.style.animationDelay = `${Math.min(idx * 40, 360)}ms`;
    });
}

window.navigateTo = navigateTo;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
    activateTabBar();
    bindTabNav();
    bindDataActions();
    bindMicroInteractions();
});
