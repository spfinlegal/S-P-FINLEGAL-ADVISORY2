/* Shared styling, canvas logo, and mobile UX engine for S & P Finlegal Advisory */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Generate crisp vector/canvas logo for retina display
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Background circle
    ctx.fillStyle = '#06172C';
    ctx.beginPath();
    ctx.arc(150, 150, 150, 0, Math.PI * 2);
    ctx.fill();
    
    // Gold outer border ring
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(150, 150, 145, 0, Math.PI * 2);
    ctx.stroke();

    // Central Monogram
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 95px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('S & P', 150, 135);

    // Subtitle
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.fillText('FINLEGAL', 150, 190);
    
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillText('- ADVISORY -', 150, 220);

    const dataUrl = canvas.toDataURL('image/png');
    
    // Set all logo images
    document.querySelectorAll('.brand-logo-img').forEach(el => {
        el.src = dataUrl;
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

    // 3. Inject Luxury Mobile Quick Action Bar (Docked to bottom on phones)
    if (!document.querySelector('.mobile-action-bar')) {
        const isBlogSub = location.pathname.includes('/blog/') && !location.pathname.endsWith('/blog/') && !location.pathname.endsWith('/blog/index.html');
        const prefix = isBlogSub ? '../' : '';
        const curPath = location.pathname;

        const bar = document.createElement('nav');
        bar.className = 'mobile-action-bar';
        bar.setAttribute('aria-label', 'Mobile Quick Actions');
        bar.innerHTML = `
            <a href="${prefix}services.html" class="mobile-action-btn ${curPath.includes('services') ? 'active' : ''}">
                <i class="fa-solid fa-briefcase"></i>
                <span>Services</span>
            </a>
            <a href="https://wa.me/919657712123?text=Hello%20S%20%26%20P%20Finlegal%20Advisory" target="_blank" rel="noopener noreferrer" class="mobile-action-btn pill-btn-wa">
                <i class="fa-brands fa-whatsapp text-lg"></i>
                <span>WhatsApp</span>
            </a>
            <a href="tel:+919657712123" class="mobile-action-btn pill-btn-call">
                <i class="fa-solid fa-phone text-sm"></i>
                <span>Call Us</span>
            </a>
            <a href="${prefix}contact.html" class="mobile-action-btn ${curPath.includes('contact') ? 'active' : ''}">
                <i class="fa-solid fa-location-dot"></i>
                <span>Office</span>
            </a>
        `;
        document.body.appendChild(bar);
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
