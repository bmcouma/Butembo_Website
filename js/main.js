/* ══════════════════════════════════════
   BUTEMBO PRECIOUS METALS — GLOBAL JS
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── MOBILE MENU ──
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // ── ACTIVE NAV LINK ──
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── AOS (homemade lightweight) ──
  const aosEls = document.querySelectorAll('[data-aos]');
  if (aosEls.length) {
    const delays = {};
    aosEls.forEach(el => {
      const d = el.dataset.aosDelay;
      if (d) el.style.transitionDelay = d + 'ms';
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('aos-animate');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    aosEls.forEach(el => obs.observe(el));
  }

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        let start = 0;
        const dur = 1600;
        const step = target / (dur / 16);
        const tick = () => {
          start = Math.min(start + step, target);
          el.textContent = Math.round(start).toLocaleString();
          if (start < target) requestAnimationFrame(tick);
        };
        tick();
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  // ── PARALLAX HERO ──
  const parallaxBg = document.querySelector('.hero-gradient');
  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      parallaxBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (btn) btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  // ── GOLD PRICE TICKER (simulated) ──
  const BASE = 2347.80;
  function fmtPrice(v) { return 'USD ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function updateTickers(val) {
    document.querySelectorAll('.ticker-val, #gold-price-display').forEach(el => {
      el.textContent = fmtPrice(val);
    });
  }
  let currentPrice = BASE;
  updateTickers(currentPrice);
  setInterval(() => {
    currentPrice += (Math.random() - 0.5) * 1.8;
    currentPrice = Math.max(BASE - 15, Math.min(BASE + 15, currentPrice));
    updateTickers(currentPrice);
  }, 4000);

  // ── CONTACT FORM ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const successBox = document.getElementById('form-success');
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (successBox) {
        successBox.style.display = 'block';
        contactForm.reset();
        contactForm.style.display = 'none';
      }
    });
  }

  // ── GOLD CALCULATOR ──
  const calcQty = document.getElementById('calc-qty');
  const calcKarat = document.getElementById('calc-karat');
  const calcResult = document.getElementById('calc-result');
  const calcTotal = document.getElementById('calc-total');
  const calcBreakdown = document.getElementById('calc-breakdown');

  function runCalc() {
    if (!calcQty || !calcKarat || !calcResult) return;
    const qty = parseFloat(calcQty.value);
    const karat = calcKarat.value;
    if (!qty || qty <= 0 || isNaN(qty)) { calcResult.style.display = 'none'; return; }
    const pricePerKg = 95000;
    const commission = karat === '23K' ? 3000 : 0;
    const goldCost = qty * pricePerKg;
    const commissionTotal = qty * commission;
    const total = goldCost + commissionTotal;
    const fmt = v => 'USD ' + v.toLocaleString('en-US', { minimumFractionDigits: 2 });
    calcTotal.textContent = fmt(total);
    calcBreakdown.innerHTML = `
      <div class="calc-breakdown-row"><span class="row-label">Product</span><span class="row-val">${karat === '23K' ? '23K Gold Nuggets (97% purity)' : '24K Gold Bars (99.9% purity)'}</span></div>
      <div class="calc-breakdown-row"><span class="row-label">Quantity</span><span class="row-val">${qty} kg</span></div>
      <div class="calc-breakdown-row"><span class="row-label">Gold Cost</span><span class="row-val">${fmt(goldCost)}</span></div>
      ${commission > 0 ? `<div class="calc-breakdown-row"><span class="row-label">Commission</span><span class="row-val">${fmt(commissionTotal)}</span></div>` : ''}
      <div class="calc-breakdown-row" style="border-top:1px solid rgba(201,149,42,.2);margin-top:.5rem;padding-top:.5rem;"><span class="row-label" style="color:var(--gold);font-weight:700;">Estimated Total</span><span class="row-val" style="color:var(--gold2);font-weight:700;font-size:1.05rem;">${fmt(total)}</span></div>
    `;
    calcResult.style.display = 'block';
  }

  if (calcQty) { calcQty.addEventListener('input', runCalc); }
  if (calcKarat) { calcKarat.addEventListener('change', runCalc); }

  // ── HERO PARTICLES ──
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 7; i++) {
      const p = document.createElement('span');
      const size = 60 + Math.random() * 120;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation-delay:${Math.random() * 6}s;
        animation-duration:${7 + Math.random() * 5}s;
      `;
      particleContainer.appendChild(p);
    }
  }

});
