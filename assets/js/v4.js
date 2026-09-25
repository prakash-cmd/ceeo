/* CEEO ORIGINALS — V4 interactions: new-in slider, edit index, testimonials, collection counts */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DATA = window.CEEO_DATA;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* New-in slider: arrows, counter, progress */
  $$('[data-slider]').forEach((wrap) => {
    const key = wrap.dataset.slider;
    const ui = $(`[data-slider-ui="${key}"]`);
    const track = $('.slider4__track', wrap);
    const bar = $('[data-slider-bar]', wrap.parentElement);
    if (!ui || !track) return;
    const items = () => [...track.children];
    const step = () => (items()[0]?.getBoundingClientRect().width || 300) + parseFloat(getComputedStyle(track).columnGap || 16);
    const update = () => {
      const n = items().length; if (!n) return;
      const max = wrap.scrollWidth - wrap.clientWidth;
      const p = max > 0 ? wrap.scrollLeft / max : 0;
      const idx = Math.min(n, Math.round(wrap.scrollLeft / step()) + 1);
      $('[data-slider-index]', ui).textContent = pad(idx);
      $('[data-slider-total]', ui).textContent = pad(n);
      if (bar) { const vis = Math.min(1, wrap.clientWidth / wrap.scrollWidth); bar.style.width = `${vis * 100}%`; bar.style.transform = `translateX(${p * (1 / vis - 1) * 100}%)`; }
      $('[data-slider-prev]', ui).disabled = wrap.scrollLeft < 4;
      $('[data-slider-next]', ui).disabled = wrap.scrollLeft > max - 4;
    };
    $('[data-slider-prev]', ui).addEventListener('click', () => wrap.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    $('[data-slider-next]', ui).addEventListener('click', () => wrap.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    wrap.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    new MutationObserver(update).observe(track, { childList: true });
    update();
  });

  /* Edit index: hover / focus / scroll swaps the sticky image */
  $$('[data-edit4]').forEach((sec) => {
    const imgs = $$('[data-edit-img]', sec); const items = $$('[data-edit-item]', sec);
    const show = (i) => {
      imgs.forEach((im) => im.classList.toggle('is-active', im.dataset.editImg === String(i)));
      items.forEach((it) => it.classList.toggle('is-active', it.dataset.editItem === String(i)));
    };
    items.forEach((it) => { ['mouseenter', 'focus'].forEach((ev) => it.addEventListener(ev, () => show(it.dataset.editItem))); });
    if (!window.matchMedia('(hover: hover)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) show(en.target.dataset.editItem); }), { rootMargin: '-45% 0px -45% 0px' });
      items.forEach((it) => io.observe(it));
    }
  });

  /* Testimonials slider (real CEEO customer quotes from data.js) */
  $$('[data-quotes]').forEach((sec) => {
    const list = DATA.testimonials || []; if (!list.length) return;
    const stage = $('[data-quote-stage]', sec); const dots = $('[data-quote-dots]', sec);
    stage.innerHTML = list.map((t, i) => `<figure class="quote4__slide${i === 0 ? ' is-active' : ''}" id="quote-${i}" role="tabpanel" aria-hidden="${i !== 0}">
      <blockquote class="quote4__text"><p>“${esc(t.quote)}”</p></blockquote>
      <figcaption class="quote4__who"><img src="${t.photo}" alt="" width="56" height="56" loading="lazy"><span><span class="quote4__name">${esc(t.name)}</span><br><span class="quote4__role">${esc(t.role || 'CEEO customer')}</span></span></figcaption>
    </figure>`).join('');
    dots.innerHTML = list.map((t, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-controls="quote-${i}" aria-label="Testimonial ${i + 1} of ${list.length}: ${esc(t.name)}"></button>`).join('');
    let cur = 0; let timer;
    const go = (i) => {
      cur = (i + list.length) % list.length;
      $$('.quote4__slide', stage).forEach((s, k) => { s.classList.toggle('is-active', k === cur); s.setAttribute('aria-hidden', String(k !== cur)); });
      $$('button', dots).forEach((b, k) => b.setAttribute('aria-selected', String(k === cur)));
    };
    const auto = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => go(cur + 1), 7000); };
    $('[data-quote-prev]', sec).addEventListener('click', () => { go(cur - 1); auto(); });
    $('[data-quote-next]', sec).addEventListener('click', () => { go(cur + 1); auto(); });
    dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { go($$('button', dots).indexOf(b)); auto(); } });
    sec.addEventListener('mouseenter', () => clearInterval(timer)); sec.addEventListener('mouseleave', auto);
    sec.addEventListener('focusin', () => clearInterval(timer));
    auto();
  });

  /* Collection tile counts from real catalogue */
  $$('[data-coll-count]').forEach((el) => {
    const n = DATA.products.filter((p) => p.collections.includes(el.dataset.collCount)).length;
    el.textContent = `${n} ${n === 1 ? 'piece' : 'pieces'}`;
  });
})();
