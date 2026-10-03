(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('header');

  // 1. Scroll-reveal: mark elements (never the hero first view)
  var targets = [];
  function mark(el, i, cls) {
    if (!el || el.classList.contains('reveal') || el.closest('#hero')) return;
    if (cls) el.classList.add(cls);
    // Anything already on screen at load stays put: no hide-then-show flash, no wasted work
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    el.classList.add('reveal');
    el.style.setProperty('--d', Math.min(i, 3) * 50 + 'ms');
    targets.push(el);
  }
  document.querySelectorAll('main > section:not(#hero)').forEach(function (sec) {
    // headings / intro blocks
    sec.querySelectorAll(':scope > div > div:first-child, :scope > div > h1, :scope > div > h2').forEach(function (el, i) { mark(el, i); });
    // card grids: stagger children
    sec.querySelectorAll('.grid').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { mark(c, i); c.classList.add('lift'); });
    });
    // other direct blocks (callouts, CTAs)
    sec.querySelectorAll(':scope > div > a, :scope > div > p, :scope > div > span').forEach(function (el, i) { mark(el, i); });
  });
  // guide pages: article blocks
  document.querySelectorAll('main article > div > *, main article > header, main article > .space-y-6 > *, main article .space-y-8 > *').forEach(function (el, i) {
    if (el.tagName === 'ARTICLE') return;
    mark(el, 0);
  });
  // blog index cards (articles directly in a grid)
  document.querySelectorAll('main section.grid > article').forEach(function (el, i) { mark(el, i % 3); el.classList.add('lift'); });

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  // 2. Reading progress bar on guide pages
  var isGuide = document.querySelector('main article h1') && location.pathname.indexOf('/blog/') !== -1 && !/\/blog\/(index\.html)?$/.test(location.pathname);
  var bar;
  if (isGuide) { bar = document.createElement('div'); bar.id = 'read-progress'; document.body.appendChild(bar); }

  // 3. Back to top
  var top = document.createElement('button');
  top.id = 'to-top'; top.setAttribute('aria-label', 'Back to top'); top.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  document.body.appendChild(top);

  // 4. Scroll handler
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 10);
    top.classList.toggle('show', y > 600);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
})();
