/* CEEO ORIGINALS — V5 interactions: curved ribbon, top-bar arrows, nav dropdown, reviews */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DATA = window.CEEO_DATA;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Curved ribbon: text drifts along the arc; pauses off-screen or on hover */
  $$('[data-ribbon]').forEach((rib) => {
    const tp = $('[data-ribbon-text]', rib); if (!tp || reduce) return;
    let off = 0; let visible = true; let isHovered = false; let last = performance.now();
    const len = () => tp.getComputedTextLength ? tp.getComputedTextLength() / 4 : 1600;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(rib);
    rib.addEventListener('mouseenter', () => { isHovered = true; });
    rib.addEventListener('mouseleave', () => { isHovered = false; });
    const tick = (t) => {
      const dt = Math.min(64, t - last); last = t;
      if (visible && !isHovered) {
        off -= dt * 0.045;
        const L = len();
        if (-off > L) off += L;
        tp.setAttribute('startOffset', off.toFixed(1));
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* Top-bar announcement arrows */
  const track = $('.announcement__track');
  if (track) {
    const items = $$('.announcement__item', track);
    const step = (d) => {
      const i = items.findIndex((x) => x.classList.contains('is-active'));
      items[i].classList.remove('is-active');
      items[(i + d + items.length) % items.length].classList.add('is-active');
    };
    $('[data-ann-prev]')?.addEventListener('click', () => step(-1));
    $('[data-ann-next]')?.addEventListener('click', () => step(1));
  }

  /* Desktop nav dropdown: open on hover, close on outside click / Esc */
  const hover = window.matchMedia('(hover: hover) and (min-width: 1100px)');
  $$('[data-hover-details]').forEach((d) => {
    const li = d.closest('.nav__item'); let t;
    li.addEventListener('mouseenter', () => { if (hover.matches) { clearTimeout(t); d.open = true; } });
    li.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(() => { d.open = false; }, 140); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { d.open = false; $('summary', d).focus(); } });
  });
  document.addEventListener('click', (e) => $$('[data-hover-details][open]').forEach((d) => { if (!d.contains(e.target)) d.open = false; }));

  /* Reviews (real CEEO testimonials) */
  const rv = $('[data-reviews5]');
  if (rv) rv.innerHTML = (DATA.testimonials || []).map((t) => `<li class="rev5">
    <blockquote class="rev5__quote"><p>“${esc(t.quote)}”</p></blockquote>
    <div class="rev5__who"><img src="${t.photo}" alt="" width="44" height="44" loading="lazy"><div><p class="rev5__name">${esc(t.name)}</p><p class="rev5__role">${esc(t.role || 'Verified customer')}</p></div></div>
  </li>`).join('');

  /* Universal interactive coupon copy handler (Hero coupon & Ribbon pill) */
  const copyCoupon = (code, triggerEl) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch (err) {}

    triggerEl.classList.add('is-copied');
    const tooltip = triggerEl.querySelector('.ribbon5-pill-tooltip');
    const origTooltip = tooltip ? tooltip.textContent : '';
    if (tooltip) tooltip.textContent = 'COPIED! ✓';

    const toast = $('#Toast');
    if (toast) {
      const msg = $('.toast__text', toast);
      if (msg) msg.textContent = `Code ${code} copied — 25% discount applied!`;
      toast.hidden = false;
      clearTimeout(toast._t);
      toast._t = setTimeout(() => { toast.hidden = true; }, 3200);
    }

    setTimeout(() => {
      triggerEl.classList.remove('is-copied');
      if (tooltip) tooltip.textContent = origTooltip;
    }, 2400);
  };

  $$('[data-copy-code]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = el.getAttribute('data-copy-code') || 'INDIA';
      copyCoupon(code, el);
    });
  });

  const cp = $('#heroCoupon');
  if (cp) {
    cp.addEventListener('click', () => copyCoupon('INDIA', cp));
  }

  /* Ribbon dynamic cursor tracking sheen */
  const ribbonBar = $('.ribbon5-bar');
  if (ribbonBar && !reduce) {
    ribbonBar.addEventListener('mousemove', (e) => {
      const rect = ribbonBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      ribbonBar.style.setProperty('--sheen-x', `${x}px`);
    });
  }

  /* 3D tilt micro-interaction on hero product cards */
  if (!reduce && window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    $$('.hero5__img').forEach((card) => {
      let rect = null;
      let raf = null;
      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
        rect = null;
      });
    });
  }
})();
