/* Official Branding & Mobile UX Engine for S & P Finlegal Advisory */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ensure all brand logo images point to the official logo asset
    const isBlog = window.location.pathname.includes('/blog/');
    const logoSrc = isBlog ? '../assets/logo.png' : 'assets/logo.png';
    document.querySelectorAll('.brand-logo-img').forEach(el => {
        if (!el.getAttribute('src') || el.getAttribute('src') === '') {
            el.src = logoSrc;
        }
        el.onerror = () => {
            if (el.src !== logoSrc) el.src = logoSrc;
        };
    });

    // 2. Mobile Menu Toggle with Animated Hamburger Icon & Outside-Click Close
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        const icon = menuBtn.querySelector('i');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = mobileMenu.classList.contains('hidden');
            if (isClosed) {
                mobileMenu.classList.remove('hidden');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
            } else {
                mobileMenu.classList.add('hidden');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close drawer when tapping any link inside
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // 3. Inject Mobile Header Quick Actions (WhatsApp & Call) into the top header next to menu button
    if (menuBtn && !document.querySelector('.mobile-header-actions')) {
        const wrap = document.createElement('div');
        wrap.className = 'mobile-header-actions';
        wrap.setAttribute('aria-label', 'Quick Contact');
        wrap.innerHTML = `
            <a href="https://wa.me/919657712123?text=Hello%20S%20%26%20P%20Finlegal%20Advisory" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Quick Contact" class="mobile-header-btn btn-wa">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="tel:+919657712123" aria-label="Call +91 96577 12123" class="mobile-header-btn btn-call">
                <i class="fa-solid fa-phone"></i>
            </a>
        `;
        menuBtn.parentNode.insertBefore(wrap, menuBtn);
    }

    // 4. Ensure mobile menu drawer always has prominent WhatsApp & Call CTAs
    const mobileMenuEl = document.getElementById('mobile-menu');
    if (mobileMenuEl && !mobileMenuEl.querySelector('.mobile-menu-ctas')) {
        const ctaWrap = document.createElement('div');
        ctaWrap.className = 'mobile-menu-ctas pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5';
        ctaWrap.innerHTML = `
            <a href="https://wa.me/919657712123?text=Hello%20S%20%26%20P%20Finlegal%20Advisory" target="_blank" rel="noopener noreferrer" class="w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md">
                <i class="fa-brands fa-whatsapp text-lg"></i> Chat on WhatsApp
            </a>
            <a href="tel:+919657712123" class="w-full bg-navy-950 border border-gold-500/50 text-gold-400 hover:text-white text-center py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                <i class="fa-solid fa-phone text-xs"></i> Call +91 96577 12123
            </a>
        `;
        mobileMenuEl.appendChild(ctaWrap);
    }

    // 4. Add subtle swipe hint for tables on mobile
    document.querySelectorAll('article .overflow-x-auto').forEach(container => {
        if (!container.previousElementSibling || !container.previousElementSibling.classList.contains('table-scroll-hint')) {
            const hint = document.createElement('div');
            hint.className = 'table-scroll-hint sm:hidden';
            hint.innerHTML = '<i class="fa-solid fa-arrows-left-right text-[10px]"></i> <span>Swipe horizontally to view full table</span>';
            container.parentNode.insertBefore(hint, container);
        }
    });

    // 5. FAQ Accordion logic if present
    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            if (content) {
                content.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
            }
        });
    });
});
