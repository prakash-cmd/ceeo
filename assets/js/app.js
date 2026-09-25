/* CEEO ORIGINALS — V2 static site · app.js
   Vanilla JS, no dependencies. Sections:
   1 helpers · 2 store (cart + wishlist, localStorage) · 3 overlays · 4 header/nav/motion
   5 product card · 6 quick add + variant picker · 7 cart drawer/page · 8 search
   9 shop (filters/sort) · 10 PDP · 11 misc (newsletter, tiles, wishlist page)
   NOTE: cart/wishlist are client-side for this prototype. Swap store.* for your
   backend or Shopify Storefront API (cartCreate / cartLinesAdd) when going live. */
(() => {
  'use strict';
  const DATA = window.CEEO_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byHandle = (h) => DATA.products.find((p) => p.handle === h);

  /* ============ 1. Helpers ============ */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (paise) => DATA.currency + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const icon = (name) => `<svg class="icon icon--${name}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
  const debounce = (fn, w = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), w); }; };
  const plural = (n, one, other) => `${n} ${n === 1 ? one : other}`;

  let toastTimer;
  function toast(msg) {
    const el = $('#Toast'); if (!el) return;
    $('.toast__text', el).textContent = msg;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.classList.remove('is-visible'); setTimeout(() => { el.hidden = true; }, 350); }, 2400);
  }

  /* ============ 2. Store ============ */
  const read = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch (e) { return f; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } };
  const CART_KEY = 'ceeo:v2:cart';
  const WL_KEY = 'ceeo:v2:wishlist';

  const store = {
    cart() { return read(CART_KEY, []); },
    saveCart(lines) { write(CART_KEY, lines); document.dispatchEvent(new CustomEvent('cart:change')); },
    add(handle, size, color, qty = 1) {
      const lines = this.cart();
      const key = `${handle}|${size}|${color}`;
      const line = lines.find((l) => l.key === key);
      if (line) line.qty += qty; else lines.unshift({ key, handle, size, color, qty });
      this.saveCart(lines);
    },
    setQty(key, qty) {
      let lines = this.cart();
      if (qty <= 0) lines = lines.filter((l) => l.key !== key);
      else { const l = lines.find((x) => x.key === key); if (l) l.qty = Math.min(qty, 10); }
      this.saveCart(lines);
    },
    totals() {
      const lines = this.cart().map((l) => ({ ...l, product: byHandle(l.handle) })).filter((l) => l.product);
      const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
      const count = lines.reduce((s, l) => s + l.qty, 0);
      return { lines, subtotal, count, remaining: Math.max(0, DATA.freeShippingThreshold - subtotal) };
    },
    wishlist() { return read(WL_KEY, []); },
    toggleWish(handle) {
      const list = this.wishlist();
      const i = list.indexOf(handle);
      if (i > -1) list.splice(i, 1); else list.unshift(handle);
      write(WL_KEY, list);
      document.dispatchEvent(new CustomEvent('wishlist:change'));
      return i === -1;
    }
  };

  /* ============ 3. Overlays (drawer / modal / search) ============ */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"]), summary';
  const layers = [];
  const lock = () => document.body.classList.add('is-locked');
  const unlock = () => { if (!layers.length) document.body.classList.remove('is-locked'); };

  class Overlay extends HTMLElement {
    connectedCallback() {
      this.panel = this.querySelector('[role="dialog"]');
      this.addEventListener('click', (e) => { if (e.target.closest('[data-drawer-close], [data-modal-close], [data-search-close]')) this.close(); });
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
        if (e.key === 'Tab') {
          const items = $$(FOCUSABLE, this.panel).filter((el) => el.offsetParent !== null);
          if (!items.length) return;
          const first = items[0]; const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
    get isOpen() { return this.classList.contains('is-open'); }
    open(trigger) {
      if (this.isOpen) return;
      this.trigger = trigger || document.activeElement;
      this.hidden = false; layers.push(this); lock();
      requestAnimationFrame(() => requestAnimationFrame(() => this.classList.add('is-open')));
      $$(`[aria-controls="${this.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
      setTimeout(() => this.focusFirst(), 60);
      document.dispatchEvent(new CustomEvent('overlay:open'));
    }
    focusFirst() { (this.querySelector('input[type="search"]') || this.panel).focus({ preventScroll: true }); }
    close() {
      if (!this.isOpen) return;
      this.classList.remove('is-open');
      layers.splice(layers.indexOf(this), 1);
      $$(`[aria-controls="${this.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
      setTimeout(() => { if (!this.isOpen) this.hidden = true; unlock(); }, reduceMotion ? 0 : 360);
      if (this.trigger && document.contains(this.trigger)) this.trigger.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent('overlay:close'));
    }
  }
  customElements.define('drawer-panel', class extends Overlay {});
  customElements.define('modal-dialog', class extends Overlay {});

  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-drawer-open]');
    if (d) { const el = document.getElementById(d.dataset.drawerOpen); if (el) { e.preventDefault(); el.open(d); } }
    const sg = e.target.closest('[data-open-size-guide]');
    if (sg) { const m = $('#SizeGuide'); if (m) { e.preventDefault(); m.open(sg); } }
  });

  /* ============ 4. Header, nav, motion ============ */
  customElements.define('sticky-header', class extends HTMLElement {
    connectedCallback() {
      const sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
      document.body.prepend(sentinel);
      new IntersectionObserver(([en]) => this.classList.toggle('is-scrolled', !en.isIntersecting), { rootMargin: '40px 0px 0px 0px' }).observe(sentinel);
      let lastH = 0;
      new ResizeObserver(() => {
        const h = this.offsetHeight;
        if (h && h !== lastH) {
          lastH = h;
          document.documentElement.style.setProperty('--header-h', `${h}px`);
        }
      }).observe(this);
    }
  });

  $$('[data-rotator]').forEach((track) => {
    const items = $$('.announcement__item', track);
    if (items.length < 2 || reduceMotion) return;
    let i = 0; let paused = false;
    ['mouseenter', 'focusin'].forEach((ev) => track.addEventListener(ev, () => { paused = true; }));
    ['mouseleave', 'focusout'].forEach((ev) => track.addEventListener(ev, () => { paused = false; }));
    setInterval(() => { if (paused) return; items[i].classList.remove('is-active'); i = (i + 1) % items.length; items[i].classList.add('is-active'); }, 5000);
  });

  $$('[data-hero]').forEach((hero) => {
    const img = $('img', hero);
    const ready = () => hero.classList.add('is-ready');
    if (!img || img.complete) requestAnimationFrame(ready);
    else { img.addEventListener('load', ready, { once: true }); img.addEventListener('error', ready, { once: true }); setTimeout(ready, 1200); }
  });

  customElements.define('floating-cta', class extends HTMLElement {
    connectedCallback() {
      const hero = $('[data-hero]'); const footer = $('.footer');
      if (!hero) return;
      this.hidden = false;
      const st = { past: false, foot: false, ov: false };
      const upd = () => this.classList.toggle('is-visible', st.past && !st.foot && !st.ov);
      new IntersectionObserver(([en]) => { st.past = !en.isIntersecting && en.boundingClientRect.top < 0; upd(); }).observe(hero);
      if (footer) new IntersectionObserver(([en]) => { st.foot = en.isIntersecting; upd(); }, { rootMargin: '0px 0px 120px 0px' }).observe(footer);
      document.addEventListener('overlay:open', () => { st.ov = true; upd(); });
      document.addEventListener('overlay:close', () => { st.ov = layers.length > 0; upd(); });
    }
  });

  const revealIO = ('IntersectionObserver' in window && !reduceMotion)
    ? new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); revealIO.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' })
    : null;
  const observeReveal = (root = document) => $$('.reveal-img:not(.is-visible)', root).forEach((el) => (revealIO ? revealIO.observe(el) : el.classList.add('is-visible')));

  customElements.define('quantity-input', class extends HTMLElement {
    connectedCallback() {
      this.input = $('input', this);
      this.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        const min = Number(this.input.min || 0); const max = Number(this.input.max || 10);
        const cur = Number(this.input.value || 0);
        const next = b.name === 'plus' ? Math.min(max, cur + 1) : Math.max(min, cur - 1);
        if (next === cur) return;
        this.input.value = next;
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  });

  /* ============ 5. Product card ============ */
  function priceHTML(p, cls = '') {
    const sale = p.compareAt && p.compareAt > p.price;
    const diff = sale ? p.compareAt - p.price : 0;
    return `<div class="price${sale ? ' price--sale' : ''}${cls ? ` ${cls}` : ''}" data-price>
      <span class="visually-hidden">${sale ? 'Sale price' : 'Price'}</span><span class="price__current">${money(p.price)}</span>
      ${sale ? `<span class="visually-hidden">Regular price</span><s class="price__compare">${money(p.compareAt)}</s><span class="price__saved">Save ${money(diff)}</span>` : ''}
    </div>`;
  }
  function ratingHTML(p) {
    if (!p.rating) return '';
    return `<div class="rating"><span class="rating__stars" style="--pct:${(p.rating / 5) * 100}%" aria-hidden="true">★★★★★</span><span class="visually-hidden">Rated ${p.rating} out of 5</span><span class="rating__count">(${p.reviews})</span></div>`;
  }
  const available = (p) => Object.values(p.sizes).some(Boolean);
  const wished = (h) => store.wishlist().includes(h);
  function wishBtn(p, cls = 'card__wishlist') {
    const on = wished(p.handle);
    return `<button type="button" class="wishlist-btn ${cls}" data-wishlist-toggle data-product-handle="${p.handle}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Save'} ${esc(p.title)} ${on ? 'from' : 'to'} wishlist">${icon('heart')}</button>`;
  }
  function cardHTML(p, { category = true, rating = false, eager = false, tag = 'h3' } = {}) {
    const url = `product.html?p=${p.handle}`;
    const sale = p.compareAt && p.compareAt > p.price;
    const discountPct = sale ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
    const colors = p.colors && p.colors.length > 1
      ? `<div class="card__colors" title="${esc(p.colors.map(c => c.name).join(', '))}">
          <span class="swatch-dots" aria-hidden="true">${p.colors.map((c) => `<span class="swatch-dot" style="--swatch:${c.hex}"></span>`).join('')}</span>
          <span class="card__colors-count">${p.colors.length} shades</span>
        </div>` : '';

    const availSizes = Object.entries(p.sizes || {}).filter(([_, v]) => v).map(([k]) => k);
    const sizePillsHTML = availSizes.length ? `
      <div class="card__sizes-bar">
        <span class="card__sizes-label">Instant Add:</span>
        <div class="card__sizes-list">
          ${availSizes.slice(0, 4).map(s => `
            <button type="button" class="card__size-btn" data-direct-size="${esc(s)}" data-product-handle="${p.handle}" title="Add size ${esc(s)} directly to bag">${esc(s)}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    const craftLabel = tagOf(p);

    return `<article class="card card--creative card--has-hover${available(p) ? '' : ' card--sold-out'}" data-handle="${p.handle}">
      <div class="card__media">
        <a href="${url}" class="card__media-link" tabindex="-1" aria-hidden="true">
          <img class="card__img card__img--primary" src="${p.images[0]}" alt="${esc(p.title)}" width="900" height="1125" loading="${eager ? 'eager' : 'lazy'}">
          ${p.images[1] ? `<img class="card__img card__img--secondary" src="${p.images[1]}" alt="" width="900" height="1125" loading="lazy">` : ''}
        </a>
        
        <div class="card__badges">
          ${!available(p) ? '<span class="card__badge card__badge--sold">Sold out</span>' : ''}
          ${sale ? `<span class="card__badge card__badge--sale"><span class="badge-dot"></span>-${discountPct}%</span>` : ''}
        </div>

        ${p.images.length > 1 ? `
          <div class="card__gallery-indicator" aria-hidden="true">
            <span class="gallery-dot is-active"></span>
            <span class="gallery-dot"></span>
          </div>
        ` : ''}

        ${wishBtn(p)}

        ${available(p) ? `
          <div class="card__dock">
            ${sizePillsHTML}
            <button type="button" class="card__quick-btn" data-quick-add="${p.handle}" aria-haspopup="dialog">
              ${icon('bag')}
              <span>Quick View</span>
            </button>
          </div>
        ` : ''}
      </div>

      <div class="card__info">
        <div class="card__eyebrow-row">
          ${category ? `<span class="card__category">${esc(p.type || p.category)}</span>` : ''}
          ${p.motif ? `<span class="card__motif">· ${esc(p.motif)}</span>` : ''}
        </div>
        <${tag} class="card__title">
          <a href="${url}" class="card__link">${esc(p.title)}</a>
        </${tag}>
        <div class="card__meta">
          ${priceHTML(p)}
          ${colors}
        </div>
        ${rating ? ratingHTML(p) : ''}
      </div>
    </article>`;
  }
  function tagOf(p) { return [(p.technique || [])[0], p.fabricName].filter(Boolean).join(' · '); }
  const li = (html) => `<li class="product-grid__item">${html}</li>`;

  function renderProductLists() {
    const current = new URLSearchParams(location.search).get('p');
    $$('[data-products]').forEach((ul) => {
      const key = ul.dataset.products;
      const limit = Number(ul.dataset.limit || 8);
      let list = key === 'recs'
        ? DATA.products.filter((p) => p.handle !== current)
        : DATA.products.filter((p) => p.collections.includes(key));
      if (key === 'recs') {
        const cur = byHandle(current);
        if (cur) list.sort((a, b) => (b.category === cur.category) - (a.category === cur.category));
      }
      ul.innerHTML = list.slice(0, limit).map((p, i) => li(cardHTML(p, { category: ul.dataset.category === 'true', rating: ul.dataset.rating === 'true', eager: i < 2 && key === 'new' }))).join('');
    });
  }

  function syncWishButtons() {
    const list = store.wishlist();
    $$('[data-wishlist-toggle]').forEach((b) => {
      const on = list.includes(b.dataset.productHandle);
      b.setAttribute('aria-pressed', String(on));
      const p = byHandle(b.dataset.productHandle);
      if (p) b.setAttribute('aria-label', `${on ? 'Remove' : 'Save'} ${p.title} ${on ? 'from' : 'to'} wishlist`);
    });
    $$('[data-wishlist-count]').forEach((el) => { el.textContent = list.length; el.hidden = list.length === 0; });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-wishlist-toggle]'); if (!b) return;
    e.preventDefault();
    const added = store.toggleWish(b.dataset.productHandle);
    b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
    toast(added ? 'Saved to wishlist' : 'Removed from wishlist');
  });
  /* Direct 1-click size adding from card hover deck */
  document.addEventListener('click', (e) => {
    const sb = e.target.closest('[data-direct-size]');
    if (!sb) return;
    e.preventDefault();
    e.stopPropagation();
    const handle = sb.dataset.productHandle;
    const size = sb.dataset.directSize;
    const p = byHandle(handle);
    if (!p) return;
    const color = (p.colors && p.colors[0]?.name) || '';
    sb.classList.add('is-adding');
    store.add(handle, size, color, 1);
    toast(`Added ${p.title} (${size}) to bag`);
    const cartDrawer = $('#CartDrawer');
    if (cartDrawer && typeof cartDrawer.open === 'function') {
      cartDrawer.open(sb);
    }
    setTimeout(() => {
      sb.classList.remove('is-adding');
    }, 450);
  });
  document.addEventListener('wishlist:change', () => { syncWishButtons(); renderWishlistPage(); });
  window.addEventListener('storage', (e) => { if (e.key === WL_KEY) syncWishButtons(); if (e.key === CART_KEY) document.dispatchEvent(new CustomEvent('cart:change')); });

  /* ============ 6. Variant picker (shared by quick add + PDP) ============ */
  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free size'];
  const sizesOf = (p) => SIZES.filter((s) => s in p.sizes);
  function pickerHTML(p, ctx, { sizeGuide = false } = {}) {
    const firstSize = sizesOf(p).find((s) => p.sizes[s]);
    const colorSet = p.colors.length > 0 ? `
      <fieldset class="option" data-opt="color">
        <legend class="option__legend"><span class="option__name">Colour</span><span class="option__value" data-selected-value>${esc(p.colors[0].name)}</span></legend>
        <div class="option__values option__values--color">
          ${p.colors.map((c, i) => `<input type="radio" class="option__input visually-hidden" id="${ctx}-c-${i}" name="${ctx}-color" value="${esc(c.name)}"${i === 0 ? ' checked' : ''}>
          <label for="${ctx}-c-${i}" class="option__pill option__pill--swatch" style="--swatch:${c.hex}"><span class="option__swatch" aria-hidden="true"></span><span class="option__label visually-hidden">${esc(c.name)}</span></label>`).join('')}
        </div>
      </fieldset>` : '';
    return `<div class="product-form" data-picker="${ctx}" data-handle="${p.handle}">
      ${colorSet}
      <fieldset class="option" data-opt="size">
        <legend class="option__legend"><span class="option__name">Size</span><span class="option__value" data-selected-value>${firstSize || ''}</span>
          ${sizeGuide ? `<button type="button" class="link-underline option__guide" data-open-size-guide aria-haspopup="dialog">${icon('ruler')}Size guide</button>` : ''}
        </legend>
        <div class="option__values">
          ${sizesOf(p).map((s, i) => `<input type="radio" class="option__input visually-hidden" id="${ctx}-s-${i}" name="${ctx}-size" value="${s}"${s === firstSize ? ' checked' : ''}${p.sizes[s] ? '' : ' disabled'}>
          <label for="${ctx}-s-${i}" class="option__pill${p.sizes[s] ? '' : ' is-unavailable'}"><span class="option__label">${s}</span>${p.sizes[s] ? '' : '<span class="visually-hidden">, sold out</span>'}</label>`).join('')}
        </div>
      </fieldset>
      <div class="product-form__row">
        <quantity-input class="qty">
          <button type="button" class="qty__btn" name="minus" aria-label="Decrease quantity">${icon('minus')}</button>
          <input class="qty__input" type="number" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity" data-qty>
          <button type="button" class="qty__btn" name="plus" aria-label="Increase quantity">${icon('plus')}</button>
        </quantity-input>
        <button type="button" class="btn btn--primary btn--block product-form__submit" data-add-button${firstSize ? '' : ' disabled'}>
          <span data-add-label>${firstSize ? 'Add to bag' : 'Sold out'}</span><span class="btn__spinner" aria-hidden="true"></span>
        </button>
      </div>
      <p class="product-form__error" role="alert" hidden></p>
    </div>`;
  }
  document.addEventListener('change', (e) => {
    const input = e.target.closest('[data-picker] .option__input'); if (!input) return;
    const fs = input.closest('.option');
    const out = $('[data-selected-value]', fs); if (out) out.textContent = input.value;
    const picker = input.closest('[data-picker]');
    if (fs.dataset.opt === 'color' && picker.dataset.picker === 'pdp') {
      const p = byHandle(picker.dataset.handle);
      const idx = p.colors.findIndex((c) => c.name === input.value);
      const gallery = $('media-gallery'); if (gallery) gallery.show(Math.min(idx, p.images.length - 1));
    }
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-picker] [data-add-button]'); if (!btn) return;
    const picker = btn.closest('[data-picker]');
    addFromPicker(picker, btn);
  });
  function addFromPicker(picker, btn) {
    const p = byHandle(picker.dataset.handle);
    const size = $('input[name$="-size"]:checked', picker)?.value;
    const color = $('input[name$="-color"]:checked', picker)?.value || '';
    const qty = Number($('[data-qty]', picker)?.value || 1);
    const err = $('.product-form__error', picker);
    if (!size) { err.textContent = 'Select a size to continue.'; err.hidden = false; return; }
    err.hidden = true;
    btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
    setTimeout(() => { /* simulates network latency so the loading state is visible */
      store.add(p.handle, size, color, qty);
      btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy');
      const qm = $('#QuickAdd'); if (qm && qm.isOpen) qm.close();
      toast('Added to your bag');
      $('#CartDrawer').open(btn);
    }, 350);
  }

  /* Quick add */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-quick-add]'); if (!t) return;
    e.preventDefault();
    const p = byHandle(t.dataset.quickAdd); const m = $('#QuickAdd'); if (!p || !m) return;
    $('[data-modal-content]', m).innerHTML = `<div class="quick" data-quick-root>
      <div class="quick__media"><img class="quick__img" src="${p.images[0]}" alt="${esc(p.title)}" width="900" height="1125"></div>
      <div class="quick__info">
        <h2 class="quick__title h4">${esc(p.title)}</h2>
        ${priceHTML(p)}
        ${pickerHTML(p, 'quick')}
        <a href="product.html?p=${p.handle}" class="link-arrow quick__details">View full details ${icon('arrow')}</a>
      </div></div>`;
    m.open(t);
  });

  /* ============ 7. Cart drawer + page ============ */
  function lineHTML(l, compact) {
    const p = l.product;
    return `<li class="cart-line${compact ? ' cart-line--compact' : ''}" data-line="${esc(l.key)}">
      <a href="product.html?p=${p.handle}" class="cart-line__media" tabindex="-1" aria-hidden="true"><img src="${p.images[0]}" alt="" width="900" height="1125" loading="lazy"></a>
      <div class="cart-line__info">
        <a href="product.html?p=${p.handle}" class="cart-line__title">${esc(p.title)}</a>
        <p class="cart-line__variant">${esc([l.color, l.size].filter(Boolean).join(' / '))}</p>
        <div class="cart-line__row">
          <quantity-input class="qty qty--sm">
            <button type="button" class="qty__btn" name="minus" aria-label="Decrease quantity for ${esc(p.title)}">${icon('minus')}</button>
            <input class="qty__input" type="number" value="${l.qty}" min="0" max="10" inputmode="numeric" data-line-qty="${esc(l.key)}" aria-label="Quantity for ${esc(p.title)}">
            <button type="button" class="qty__btn" name="plus" aria-label="Increase quantity for ${esc(p.title)}">${icon('plus')}</button>
          </quantity-input>
          <div class="cart-line__price"><span>${money(p.price * l.qty)}</span></div>
        </div>
        <button type="button" class="cart-line__remove link-underline" data-remove="${esc(l.key)}" aria-label="Remove ${esc(p.title)}">Remove</button>
      </div></li>`;
  }
  function shipHTML(t) {
    const pct = Math.min(100, Math.round((t.subtotal / DATA.freeShippingThreshold) * 100));
    return `<div class="ship-bar${t.remaining === 0 ? ' is-complete' : ''}">
      <p class="ship-bar__text">${t.remaining > 0 ? `You're <strong>${money(t.remaining)}</strong> away from complimentary shipping.` : `${icon('check')} You've unlocked complimentary shipping.`}</p>
      <div class="ship-bar__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progress to complimentary shipping"><span style="width:${pct}%"></span></div>
    </div>`;
  }
  function recsHTML(t) {
    const inCart = new Set(t.lines.map((l) => l.handle));
    const cats = new Set(t.lines.map((l) => l.product.category));
    const recs = DATA.products.filter((p) => !inCart.has(p.handle) && available(p))
      .sort((a, b) => (cats.has(a.category) - cats.has(b.category)) || (b.rating - a.rating)).slice(0, 2);
    if (!recs.length) return '';
    return `<div class="cart-recs"><p class="label cart-recs__title">You may also like</p><ul class="cart-recs__list" role="list">
      ${recs.map((p) => `<li class="cart-rec"><a href="product.html?p=${p.handle}" class="cart-rec__media" tabindex="-1" aria-hidden="true"><img src="${p.images[0]}" alt="" width="900" height="1125" loading="lazy"></a>
        <div class="cart-rec__info"><a href="product.html?p=${p.handle}" class="cart-rec__title">${esc(p.title)}</a>${priceHTML(p)}
        <button type="button" class="link-underline" data-quick-add="${p.handle}" aria-haspopup="dialog">Choose size<span class="visually-hidden">: ${esc(p.title)}</span></button></div></li>`).join('')}
    </ul></div>`;
  }
  const emptyHTML = (big) => `<div class="${big ? 'cart-empty cart-empty--page' : 'drawer__body cart-empty'}"><p class="cart-empty__title ${big ? 'h3' : 'h4'}">Your bag is empty.</p><p class="cart-empty__text">New arrivals are waiting.</p><a href="shop.html?c=new" class="btn btn--primary">Shop new arrivals</a></div>`;

  function renderCart() {
    const t = store.totals();
    $$('[data-cart-count]').forEach((el) => { el.textContent = t.count; el.hidden = t.count === 0; el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); });
    $$('[data-cart-link]').forEach((el) => el.setAttribute('aria-label', `Bag, ${plural(t.count, 'item', 'items')}`));
    const dc = $('[data-drawer-count]'); if (dc) dc.textContent = `(${t.count})`;

    const drawer = $('[data-drawer-content]');
    if (drawer) {
      const focusedKey = document.activeElement?.dataset?.lineQty;
      drawer.innerHTML = !t.count ? emptyHTML(false) : `
        ${shipHTML(t)}
        <div class="drawer__body"><ul class="cart-items" role="list">${t.lines.map((l) => lineHTML(l, true)).join('')}</ul>${recsHTML(t)}</div>
        <div class="drawer__foot cart-drawer__foot">
          <div class="cart-drawer__total"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          <p class="cart-drawer__note">Taxes and shipping calculated at checkout.</p>
          <button type="button" class="btn btn--primary btn--block" data-checkout>${icon('lock')}Checkout</button>
          <a href="cart.html" class="link-underline cart-drawer__view">View bag</a>
        </div>`;
      if (focusedKey) $(`[data-line-qty="${CSS.escape(focusedKey)}"]`, drawer)?.focus();
    }

    const page = $('[data-cart-page-content]');
    if (page) {
      page.innerHTML = !t.count ? emptyHTML(true) : `<div class="cart-page__grid">
        <div class="cart-page__items"><ul class="cart-items" role="list">${t.lines.map((l) => lineHTML(l, false)).join('')}</ul>
          <details class="accordion cart-page__note"><summary class="accordion__summary">Add an order note${icon('plus')}</summary>
          <div class="accordion__body"><label for="CartNote" class="visually-hidden">Order note</label><textarea id="CartNote" rows="3" class="input" data-cart-note>${esc(read('ceeo:v2:note', ''))}</textarea></div></details>
        </div>
        <aside class="cart-summary" aria-labelledby="SummaryTitle">
          <h2 id="SummaryTitle" class="h4">Order summary</h2>
          <p class="cart-summary__ship">${t.remaining > 0 ? `You're <strong>&nbsp;${money(t.remaining)}&nbsp;</strong> away from complimentary shipping.` : `${icon('check')} You've unlocked complimentary shipping.`}</p>
          <dl class="cart-summary__rows">
            <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>${t.remaining === 0 ? 'Complimentary' : 'Calculated at checkout'}</dd></div>
            <div class="cart-summary__total"><dt>Estimated total</dt><dd>${money(t.subtotal)} INR</dd></div>
          </dl>
          <p class="cart-summary__tax">Inclusive of all taxes. Shipping calculated at checkout.</p>
          <button type="button" class="btn btn--primary btn--block" data-checkout>${icon('lock')}Proceed to checkout</button>
          <ul class="cart-summary__trust" role="list"><li>${icon('lock')}Secure checkout</li><li>${icon('return')}Easy returns within 7 days</li><li>${icon('chat')}Customer support, 7 days</li></ul>
        </aside></div>`;
    }
  }
  customElements.define('cart-drawer', class extends Overlay {});
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-cart-open]');
    if (o && !document.body.classList.contains('page-cart')) { e.preventDefault(); $('#CartDrawer').open(o); }
    const rm = e.target.closest('[data-remove]'); if (rm) { e.preventDefault(); store.setQty(rm.dataset.remove, 0); }
    if (e.target.closest('[data-checkout]')) toast('Connect checkout (Shopify / payment gateway) to continue.');
  });
  document.addEventListener('change', debounce((e) => {
    const q = e.target.closest('[data-line-qty]'); if (q) store.setQty(q.dataset.lineQty, Number(q.value));
  }, 250));
  document.addEventListener('input', debounce((e) => { if (e.target.matches('[data-cart-note]')) write('ceeo:v2:note', e.target.value); }, 400));
  document.addEventListener('cart:change', renderCart);

  /* ============ 8. Search ============ */
  customElements.define('search-overlay', class extends Overlay {
    connectedCallback() {
      super.connectedCallback();
      this.input = $('#SearchInput', this);
      this.results = $('[data-predictive-results]', this);
      this.popular = $('[data-search-popular]', this);
      $('[data-popular-list]', this).innerHTML = DATA.popular.map((t) => `<li><button type="button" class="chip" data-term="${esc(t)}">${esc(t)}</button></li>`).join('');
      this.addEventListener('click', (e) => { const c = e.target.closest('[data-term]'); if (c) { this.input.value = c.dataset.term; this.search(c.dataset.term); this.input.focus(); } });
      this.input.addEventListener('input', debounce(() => this.search(this.input.value.trim()), 160));
      document.addEventListener('click', (e) => { const o = e.target.closest('[data-search-open]'); if (o) { e.preventDefault(); this.open(o); } });
    }
    focusFirst() { this.input.focus({ preventScroll: true }); this.input.select(); }
    search(term) {
      if (!term) { this.results.innerHTML = ''; this.popular.hidden = false; return; }
      const q = term.toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      const hay = (p) => [p.title, p.category, p.type, p.short, p.fabricName, p.composition, p.motif, ...(p.technique || []), ...p.colors.map((c) => c.name), ...p.collections.map((h) => DATA.collections.find((c) => c.handle === h)?.title || '')].join(' ').toLowerCase();
      const products = DATA.products.filter((p) => words.every((w) => hay(p).includes(w.replace(/s$/, ''))));
      const collections = DATA.collections.filter((c) => c.title.toLowerCase().includes(q) || q.includes(c.title.toLowerCase().split(' ')[0]));
      const cats = [...new Set(DATA.products.map((p) => p.category))].filter((c) => c.toLowerCase().includes(q.replace(/s$/, '')));
      this.popular.hidden = true;
      if (!products.length && !collections.length && !cats.length) {
        this.results.innerHTML = `<p class="predictive__empty">No results for “${esc(term)}”. Try Dresses, Festive or a colour like Blue.</p>`; return;
      }
      const hl = (s) => esc(s).replace(new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi'), '<mark>$1</mark>');
      this.results.innerHTML = `<div class="predictive__grid">
        <div class="predictive__col">
          ${cats.length ? `<p class="label">Suggestions</p><ul role="list" class="predictive__list">${cats.map((c) => `<li><a class="predictive__term" href="shop.html?cat=${encodeURIComponent(c)}">${hl(c)}</a></li>`).join('')}</ul>` : ''}
          ${collections.length ? `<p class="label">Collections</p><ul role="list" class="predictive__list">${collections.map((c) => `<li><a class="predictive__term" href="shop.html?c=${c.handle}">${hl(c.title)}</a></li>`).join('')}</ul>` : ''}
        </div>
        ${products.length ? `<div class="predictive__col predictive__col--products"><p class="label">Products</p><ul role="list" class="predictive__products">
          ${products.slice(0, 4).map((p) => `<li><a class="predictive__product" href="product.html?p=${p.handle}"><img src="${p.images[0]}" alt="" width="900" height="1125" loading="lazy"><span class="predictive__name">${hl(p.title)}</span>${priceHTML(p)}</a></li>`).join('')}
        </ul></div>` : ''}
      </div>
      <a href="shop.html?q=${encodeURIComponent(term)}" class="link-arrow predictive__all">See all ${plural(products.length, 'result', 'results')} for “${esc(term)}” ${icon('arrow')}</a>`;
    }
  });

  /* ============ 9. Shop page ============ */
  function initShop() {
    const root = $('[data-shop]'); if (!root) return;
    const params = new URLSearchParams(location.search);
    const prices = DATA.products.map((p) => p.price);
    const maxPrice = Math.ceil(Math.max(...prices) / 50000) * 500; /* rupees, rounded up to ₹500 */
    const state = {
      c: params.get('c') || '', q: params.get('q') || '', sort: params.get('sort') || 'featured',
      cat: params.getAll('cat'), tech: params.getAll('tech'), fab: params.getAll('fab'), size: params.getAll('size'), color: params.getAll('color'),
      max: Number(params.get('max')) || maxPrice, avail: params.get('avail') === '1'
    };
    const cats = [...new Set(DATA.products.map((p) => p.category))];
    const techs = [...new Set(DATA.products.flatMap((p) => p.technique || []))];
    const fabs = [...new Set(DATA.products.map((p) => p.fabricName).filter(Boolean))];
    const allSizes = SIZES.filter((s) => DATA.products.some((p) => s in p.sizes));
    const listFacet = (label, name, values) => `<details class="facet" open><summary class="facet__summary">${label}${icon('chevron')}</summary><div class="facet__body"><ul role="list" class="facet__list">
        ${values.map((c) => `<li><label class="facet__opt"><input type="checkbox" name="${name}" value="${esc(c)}"${state[name].includes(c) ? ' checked' : ''}><span class="facet__box" aria-hidden="true">${icon('check')}</span><span>${esc(c)}</span><span class="facet__count" data-count-for="${name}:${esc(c)}"></span></label></li>`).join('')}
      </ul></div></details>`;
    const colors = [...new Map(DATA.products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];

    $('[data-coll-tabs]').innerHTML = [{ handle: '', title: 'All' }, ...DATA.collections].map((c) =>
      `<a class="chip" href="shop.html${c.handle ? `?c=${c.handle}` : ''}" data-tab="${c.handle}" aria-current="${state.c === c.handle}">${esc(c.title)}</a>`).join('');

    const facets = $('[data-facets]');
    facets.innerHTML = `
      ${listFacet('Category', 'cat', cats)}
      ${listFacet('Craft', 'tech', techs)}
      ${listFacet('Fabric', 'fab', fabs)}
      <details class="facet" open><summary class="facet__summary">Size${icon('chevron')}</summary><div class="facet__body"><div class="facet__chips">
        ${allSizes.map((s) => `<button type="button" class="facet__size" data-size="${s}" aria-pressed="${state.size.includes(s)}">${s}</button>`).join('')}
      </div></div></details>
      <details class="facet" open><summary class="facet__summary">Colour${icon('chevron')}</summary><div class="facet__body"><ul role="list" class="facet__list facet__list--swatch">
        ${colors.map((c) => `<li><label class="facet__opt"><input type="checkbox" name="color" value="${esc(c.name)}"${state.color.includes(c.name) ? ' checked' : ''}><span class="facet__swatch" style="--swatch:${c.hex}" aria-hidden="true"></span><span>${esc(c.name)}</span></label></li>`).join('')}
      </ul></div></details>
      <details class="facet" open><summary class="facet__summary">Price${icon('chevron')}</summary><div class="facet__body">
        <label for="MaxPrice" class="visually-hidden">Maximum price</label>
        <input id="MaxPrice" class="facet__range" type="range" min="2000" max="${maxPrice}" step="250" value="${state.max}" data-max-price>
        <div class="facet__range-out"><span>₹2,000</span><span>Up to <strong data-max-out>${money(state.max * 100)}</strong></span></div>
      </div></details>
      <details class="facet" open><summary class="facet__summary">Availability${icon('chevron')}</summary><div class="facet__body">
        <label class="facet__opt"><input type="checkbox" name="avail" value="1"${state.avail ? ' checked' : ''}><span class="facet__box" aria-hidden="true">${icon('check')}</span><span>In stock only</span></label>
      </div></details>`;
    $('[data-sort]').value = state.sort;

    const matches = (p, skip) => {
      if (state.c && !p.collections.includes(state.c)) return false;
      if (state.q) { const h = `${p.title} ${p.category} ${p.type} ${p.fabricName || ''} ${p.composition || ''} ${p.motif || ''} ${(p.technique || []).join(' ')} ${p.colors.map((c) => c.name).join(' ')} ${p.short}`.toLowerCase(); if (!state.q.toLowerCase().split(/\s+/).every((w) => h.includes(w.replace(/s$/, '')))) return false; }
      if (skip !== 'cat' && state.cat.length && !state.cat.includes(p.category)) return false;
      if (skip !== 'tech' && state.tech.length && !(p.technique || []).some((t) => state.tech.includes(t))) return false;
      if (skip !== 'fab' && state.fab.length && !state.fab.includes(p.fabricName)) return false;
      if (state.size.length && !state.size.some((s) => p.sizes[s])) return false;
      if (state.color.length && !p.colors.some((c) => state.color.includes(c.name))) return false;
      if (p.price / 100 > state.max) return false;
      if (state.avail && !available(p)) return false;
      return true;
    };
    const sorters = {
      featured: () => 0,
      new: (a, b) => b.collections.includes('new') - a.collections.includes('new'),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      painted: (a, b) => (b.technique || []).includes('Hand painting') - (a.technique || []).includes('Hand painting')
    };

    function apply(push = true) {
      const coll = DATA.collections.find((c) => c.handle === state.c);
      const title = state.q ? `Results for “${state.q}”` : coll ? coll.title : 'Shop all';
      $('[data-coll-title]').textContent = title;
      $('[data-coll-crumb]').textContent = coll ? coll.title : 'Shop';
      $('[data-coll-desc]').innerHTML = `<p>${esc(coll ? coll.description : state.q ? 'Pieces matching your search.' : 'Every CEEO piece, in one place.')}</p>`;
      document.title = `${title} — CEEO Originals`;

      const list = DATA.products.filter((p) => matches(p)).sort(sorters[state.sort] || sorters.featured);
      const grid = $('[data-shop-grid]');
      grid.classList.add('is-loading');
      grid.innerHTML = list.map((p, i) => li(cardHTML(p, { rating: true, eager: i < 4, tag: 'h2' }))).join('');
      grid.classList.remove('is-loading');
      $('[data-shop-empty]').hidden = list.length > 0;
      $('[data-count]').textContent = plural(list.length, 'piece', 'pieces');
      $('[data-show-results]').textContent = `Show ${plural(list.length, 'result', 'results')}`;
      cats.forEach((c) => { const el = $(`[data-count-for="cat:${CSS.escape(c)}"]`); if (el) el.textContent = `(${DATA.products.filter((p) => p.category === c && matches(p, 'cat')).length})`; });
      techs.forEach((c) => { const el = $(`[data-count-for="tech:${CSS.escape(c)}"]`); if (el) el.textContent = `(${DATA.products.filter((p) => (p.technique || []).includes(c) && matches(p, 'tech')).length})`; });
      fabs.forEach((c) => { const el = $(`[data-count-for="fab:${CSS.escape(c)}"]`); if (el) el.textContent = `(${DATA.products.filter((p) => p.fabricName === c && matches(p, 'fab')).length})`; });

      const chips = [
        ...state.cat.map((v) => ['cat', v, v]), ...state.tech.map((v) => ['tech', v, v]), ...state.fab.map((v) => ['fab', v, v]), ...state.size.map((v) => ['size', v, `Size ${v}`]), ...state.color.map((v) => ['color', v, v]),
        ...(state.max < maxPrice ? [['max', '', `Up to ${money(state.max * 100)}`]] : []), ...(state.avail ? [['avail', '', 'In stock']] : []),
        ...(state.q ? [['q', '', `“${state.q}”`]] : [])
      ];
      const af = $('[data-active-filters]');
      af.hidden = !chips.length;
      af.innerHTML = chips.map(([k, v, label]) => `<li><button type="button" class="chip chip--remove" data-remove-filter="${k}" data-value="${esc(v)}">${esc(label)} ${icon('close')}<span class="visually-hidden">Remove filter</span></button></li>`).join('') +
        (chips.length ? '<li><button type="button" class="link-underline" data-clear-filters>Clear all</button></li>' : '');
      const n = chips.filter((c) => c[0] !== 'q').length;
      const fc = $('[data-filter-count]'); fc.textContent = n; fc.hidden = n === 0;

      if (push) {
        const u = new URLSearchParams();
        if (state.c) u.set('c', state.c); if (state.q) u.set('q', state.q); if (state.sort !== 'featured') u.set('sort', state.sort);
        state.cat.forEach((v) => u.append('cat', v)); state.tech.forEach((v) => u.append('tech', v)); state.fab.forEach((v) => u.append('fab', v)); state.size.forEach((v) => u.append('size', v)); state.color.forEach((v) => u.append('color', v));
        if (state.max < maxPrice) u.set('max', state.max); if (state.avail) u.set('avail', '1');
        history.replaceState({}, '', `shop.html${u.toString() ? `?${u}` : ''}`);
      }
      syncWishButtons();
    }

    facets.addEventListener('change', (e) => {
      const t = e.target;
      if (['cat', 'color', 'tech', 'fab'].includes(t.name)) state[t.name] = $$(`input[name="${t.name}"]:checked`, facets).map((i) => i.value);
      if (t.name === 'avail') state.avail = t.checked;
      apply();
    });
    facets.addEventListener('input', debounce((e) => {
      if (!e.target.matches('[data-max-price]')) return;
      state.max = Number(e.target.value); $('[data-max-out]').textContent = money(state.max * 100); apply();
    }, 120));
    facets.addEventListener('click', (e) => {
      const b = e.target.closest('[data-size]'); if (!b) return;
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      state.size = $$('[data-size][aria-pressed="true"]', facets).map((x) => x.dataset.size);
      apply();
    });
    $('[data-sort]').addEventListener('change', (e) => { state.sort = e.target.value; apply(); });
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-clear-filters]')) {
        Object.assign(state, { cat: [], tech: [], fab: [], size: [], color: [], max: maxPrice, avail: false, q: '' });
        $$('input[type="checkbox"]', facets).forEach((i) => { i.checked = false; });
        $$('[data-size]', facets).forEach((b) => b.setAttribute('aria-pressed', 'false'));
        $('[data-max-price]').value = maxPrice; $('[data-max-out]').textContent = money(maxPrice * 100);
        apply(); return;
      }
      const rf = e.target.closest('[data-remove-filter]'); if (!rf) return;
      const k = rf.dataset.removeFilter; const v = rf.dataset.value;
      if (['cat', 'color', 'tech', 'fab'].includes(k)) { state[k] = state[k].filter((x) => x !== v); const i = $(`input[name="${k}"][value="${CSS.escape(v)}"]`, facets); if (i) i.checked = false; }
      if (k === 'size') { state.size = state.size.filter((x) => x !== v); $(`[data-size="${v}"]`, facets).setAttribute('aria-pressed', 'false'); }
      if (k === 'max') { state.max = maxPrice; $('[data-max-price]').value = maxPrice; $('[data-max-out]').textContent = money(maxPrice * 100); }
      if (k === 'avail') { state.avail = false; $('input[name="avail"]', facets).checked = false; }
      if (k === 'q') state.q = '';
      apply();
    });
    apply(false);
  }

  /* ============ 10. Product page ============ */
  customElements.define('media-gallery', class extends HTMLElement {
    connectedCallback() {
      this.track = $('.gallery__track', this); this.counter = $('[data-gallery-index]', this);
      if (this.counter) this.track.addEventListener('scroll', debounce(() => { this.counter.textContent = Math.round(this.track.scrollLeft / this.track.clientWidth) + 1; }, 60), { passive: true });
    }
    show(i) {
      const item = this.track.children[i]; if (!item) return;
      if (getComputedStyle(this.track).overflowX !== 'visible') this.track.scrollTo({ left: item.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
      else item.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  });

  function initPDP() {
    const root = $('[data-pdp]'); if (!root) return;
    const handle = new URLSearchParams(location.search).get('p') || DATA.products[0].handle;
    const p = byHandle(handle);
    if (!p) { root.innerHTML = `<div class="pdp-empty"><h1 class="display display--md">This piece has moved on.</h1><a class="btn btn--primary" href="shop.html">Shop all</a></div>`; return; }
    document.title = `${p.title} — CEEO Originals`;
    $('meta[name="description"]').setAttribute('content', p.short);
    const coll = DATA.collections.find((c) => p.collections.includes(c.handle));
    const acc = (h, body, open) => `<details class="accordion"${open ? ' open' : ''}><summary class="accordion__summary">${h}${icon('plus')}</summary><div class="accordion__body rte"><p>${body}</p></div></details>`;
    root.innerHTML = `
      <div class="pdp__gallery"><media-gallery class="gallery">
        <ul class="gallery__track" role="list" tabindex="0" aria-label="${esc(p.title)} images">
          ${p.images.map((src, i) => `<li class="gallery__item${i === 0 ? ' gallery__item--lead' : ''}"><img src="${src}" alt="${esc(p.title)}, view ${i + 1}" width="900" height="1125" loading="${i === 0 ? 'eager' : 'lazy'}"></li>`).join('')}
        </ul>
        ${p.images.length > 1 ? `<p class="gallery__counter" aria-hidden="true"><span data-gallery-index>1</span> / ${p.images.length}</p>` : ''}
      </media-gallery></div>
      <div class="pdp__info"><div class="pdp__sticky">
        <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a>${coll ? `<span aria-hidden="true">/</span><a href="shop.html?c=${coll.handle}">${esc(coll.title)}</a>` : ''}</nav>
        <h1 class="pdp__title">${esc(p.title)}</h1>
        ${ratingHTML(p)}
        <div class="pdp__price" data-price-wrap>${priceHTML(p, 'price--lg')}<p class="pdp__tax">Inclusive of all taxes</p></div>
        <p class="pdp__short">${esc(p.short)}</p>
        <div class="craft-card">
          <p class="hand" style="font-size:1.1rem">the hand behind it</p>
          <dl>${p.composition || p.fabricName ? `<dt>fabric</dt><dd>${esc(p.composition || p.fabricName)}</dd>` : ''}<dt>craft</dt><dd>${esc((p.technique || []).join(' + '))}</dd>${p.motif ? `<dt>detail</dt><dd>${esc(p.motif)}</dd>` : ''}${p.occasion ? `<dt>occasion</dt><dd>${esc(p.occasion)}</dd>` : ''}</dl>
          <p>${(p.technique || []).some((t) => t !== 'Print') ? 'Hand-worked individually, so every piece carries small variations — the mark of the hand.' : 'Print designed through our in-house R&amp;D process.'} Colour shade may vary slightly from images.</p>
          <a class="custom-link link-underline" href="https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(`Hi CEEO, I'd like to customise ${p.title} (${p.type}).`)}" target="_blank" rel="noopener">Need customisation or alterations? Chat on WhatsApp</a>
        </div>
        <p class="pdp__sg"><span>Need help choosing your size?</span><button type="button" class="link-underline" data-open-size-guide aria-haspopup="dialog">Size guide</button></p>
        <div class="pdp__buy" data-main-buy>
          ${pickerHTML(p, 'pdp')}
          <button type="button" class="btn btn--outline btn--block" data-buy-now${available(p) ? '' : ' disabled'}>Buy it now</button>
          <div class="pdp__wish">${wishBtn(p, 'wishlist-btn--inline')}<span>Save to wishlist</span></div>
        </div>
        <ul class="pdp__trust" role="list"><li>${icon('truck')}Complimentary shipping above ₹2,999</li><li>${icon('return')}Easy returns within 7 days</li><li>${icon('lock')}Secure checkout</li></ul>
        ${acc('Details', esc(p.details), true)}
        ${acc('Fabric &amp; care', esc(p.fabric))}
        ${acc('Shipping', 'Complimentary shipping on orders above ₹2,999. Orders dispatch within 2–4 business days.')}
        ${acc('Returns', 'Easy returns within 7 days of delivery on unworn pieces with tags attached.')}
      </div></div>`;

    const chart = $('[data-size-chart]'); if (chart) chart.src = DATA.sizeChart;
    if (location.hash === '#size') setTimeout(() => $('#SizeGuide').open(), 300);

    root.addEventListener('click', (e) => {
      if (!e.target.closest('[data-buy-now]')) return;
      const picker = $('[data-picker="pdp"]');
      addFromPicker(picker, $('[data-add-button]', picker));
    });

    /* JSON-LD */
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.short, image: p.images.map((i) => new URL(i, location.href).href), brand: { '@type': 'Brand', name: 'CEEO Originals' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
      offers: { '@type': 'Offer', priceCurrency: 'INR', price: (p.price / 100).toFixed(2), availability: available(p) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
    document.head.appendChild(ld);

    const sticky = $('sticky-atc');
    if (sticky) {
      $('[data-sticky-title]', sticky).textContent = p.title;
      $('[data-sticky-price]', sticky).textContent = money(p.price);
      const btn = $('[data-sticky-add]', sticky);
      btn.disabled = !available(p); if (!available(p)) btn.textContent = 'Sold out';
      sticky.hidden = false;
      new IntersectionObserver(([en]) => sticky.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0)).observe($('[data-main-buy]'));
      btn.addEventListener('click', () => { const picker = $('[data-picker="pdp"]'); addFromPicker(picker, $('[data-add-button]', picker)); });
    }
  }
  customElements.define('sticky-atc', class extends HTMLElement {});

  /* ============ 11. Misc ============ */
  function renderTiles() {
    const ul = $('[data-tiles]'); if (!ul) return;
    ul.innerHTML = DATA.collections.map((c, i) => `<li class="tile${i === 0 ? ' tile--feature' : ''}"><a href="shop.html?c=${c.handle}" class="tile__link">
      <div class="tile__media"><img src="${c.image}" alt="" width="900" height="1200" loading="lazy"></div>
      <span class="tile__label"><span class="tile__name">${esc(c.title)}</span><span class="tile__arrow" aria-hidden="true">${icon('arrow')}</span></span></a></li>`).join('');
  }
  function renderWishlistPage() {
    const ul = $('[data-wishlist-grid]'); if (!ul) return;
    const list = store.wishlist().map(byHandle).filter(Boolean);
    ul.innerHTML = list.length ? list.map((p) => li(cardHTML(p, { rating: true, tag: 'h2' }))).join('')
      : '<li class="wishlist-empty"><p>Nothing saved yet. Tap the heart on any piece to keep it here.</p><a class="btn btn--primary" href="shop.html">Shop all</a></li>';
  }
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-newsletter]'); if (!f) return;
    e.preventDefault();
    const input = $('input[type="email"]', f); const err = $('.newsletter-form__error', f);
    if (!input.validity.valid) { err.textContent = 'Enter a valid email address, like name@example.com.'; err.hidden = false; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
    err.hidden = true; input.removeAttribute('aria-invalid');
    /* Connect to Klaviyo / Mailchimp / Shopify customer API here. */
    $('.newsletter-form__field', f).hidden = true; $('.newsletter-form__msg', f).hidden = false;
  });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });


  /* ============ 12. Custom design studio ============ */
  const GARMENTS = {
    kurta: [[.36,.12],[.44,.1],[.5,.14],[.56,.1],[.64,.12],[.8,.2],[.86,.44],[.78,.46],[.72,.3],[.7,.52],[.76,.92],[.24,.92],[.3,.52],[.28,.3],[.22,.46],[.14,.44],[.2,.2]],
    dress: [[.38,.12],[.45,.1],[.5,.15],[.55,.1],[.62,.12],[.7,.18],[.66,.36],[.64,.42],[.84,.93],[.16,.93],[.36,.42],[.34,.36],[.3,.18]],
    coord: [[.36,.12],[.44,.1],[.5,.13],[.56,.1],[.64,.12],[.78,.2],[.8,.36],[.72,.37],[.68,.28],[.68,.46],[.7,.93],[.53,.93],[.5,.55],[.47,.93],[.3,.93],[.32,.46],[.32,.28],[.28,.37],[.2,.36],[.22,.2]]
  };
  const LABELS = { kurta: 'Tunic', dress: 'Midi dress', coord: 'Co-ord', cotton: 'Pure cotton', linen: 'Linen-cotton', lotus: 'Lotus', leaf: 'Leaf', dots: 'Dabu dots', vine: 'Vine', paisley: 'Paisley', allover: 'All-over', border: 'Hem border', yoke: 'Yoke only' };
  const REF = { kurta: 'lita-hand-loom-cotton-with-hand-painting-on-yoke', dress: 'vinea-2-0-single-piece-dress-hand-thread-work-hand-painting', coord: 'bloom-women-s-co-ord-set-hand-thread-work-hand-painting' };
  function initStudio() {
    const root = $('[data-studio]'); if (!root) return;
    const S = DATA.studio; const form = $('[data-studio-form]', root); const svg = $('#StudioPreview');
    const swatches = (name, list, checked) => list.map((c) => `<label class="choice choice--dye"><input type="radio" name="${name}" value="${c.id}"${c.id === checked ? ' checked' : ''}><span style="--sw:${c.hex}">${esc(c.name)}</span></label>`).join('');
    $('[data-choices="base"]', root).innerHTML = swatches('base', S.base, 'natural');
    $('[data-choices="paint"]', root).innerHTML = swatches('paint', S.paint, 'indigo');
    const W = 300; const H = 380;
    const state = () => Object.fromEntries(new FormData(form).entries());
    function draw() {
      const st = state();
      const base = S.base.find((c) => c.id === st.base); const paint = S.paint.find((c) => c.id === st.paint);
      const pts = GARMENTS[st.garment].map(([x, y]) => `${(x * W).toFixed(1)},${(y * H).toFixed(1)}`).join(' ');
      const place = st.placement === 'border' ? { y: H * .78, h: H * .16 } : st.placement === 'yoke' ? { y: H * .08, h: H * .2 } : { y: 0, h: H };
      const size = st.fabric === 'linen' ? 26 : 20; const gap = st.fabric === 'linen' ? 50 : 40;
      const slub = st.fabric === 'linen' ? '.35' : '.16';
      svg.innerHTML = `<title id="StudioPreviewTitle">Preview: ${esc(paint.name)} ${esc(LABELS[st.motif])} on ${esc(base.name.toLowerCase())} ${esc(LABELS[st.fabric].toLowerCase())} ${esc(LABELS[st.garment].toLowerCase())}</title>
        <defs>
          <filter id="brush" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>
          <filter id="cloth"><feTurbulence type="fractalNoise" baseFrequency="${st.fabric === 'linen' ? '.9 .06' : '1.4 .9'}" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .16  0 0 0 0 .1  0 0 0 ${slub} 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
          <filter id="floorBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
          <linearGradient id="brassHook" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E9D699"/><stop offset="50%" stop-color="#C59B27"/><stop offset="100%" stop-color="#805F12"/></linearGradient>
          <linearGradient id="woodHanger" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4E3629"/><stop offset="30%" stop-color="#734F37"/><stop offset="70%" stop-color="#875E43"/><stop offset="100%" stop-color="#4E3629"/></linearGradient>
          <pattern id="motifPat" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">
            <use href="#i-m-${st.motif}" x="${(gap - size) / 2}" y="${(gap - size) / 2}" width="${size}" height="${size}" style="color:${paint.hex};--vein:${base.hex}"/>
            <use href="#i-m-${st.motif}" x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" style="color:${paint.hex};--vein:${base.hex}"/>
            <use href="#i-m-${st.motif}" x="${gap - size / 2}" y="${-size / 2}" width="${size}" height="${size}" style="color:${paint.hex};--vein:${base.hex}"/>
            <use href="#i-m-${st.motif}" x="${-size / 2}" y="${gap - size / 2}" width="${size}" height="${size}" style="color:${paint.hex};--vein:${base.hex}"/>
            <use href="#i-m-${st.motif}" x="${gap - size / 2}" y="${gap - size / 2}" width="${size}" height="${size}" style="color:${paint.hex};--vein:${base.hex}"/>
          </pattern>
          <clipPath id="garClip"><polygon points="${pts}"/></clipPath>
          <linearGradient id="folds" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".48" stop-color="#000" stop-opacity=".07"/><stop offset=".62" stop-color="#fff" stop-opacity=".08"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
        </defs>
        <ellipse cx="150" cy="368" rx="88" ry="9" fill="#1C1814" opacity=".12" filter="url(#floorBlur)"/>
        <path d="M150 14 C141 14 137 23 146 29 C150 31 150 35 150 39" fill="none" stroke="url(#brassHook)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="150" cy="12" r="3" fill="url(#brassHook)"/>
        <path d="M78 52 C108 44 138 38 150 38 C162 38 192 44 222 52 C226 53 224 57 220 57 C190 50 162 44 150 44 C138 44 110 50 80 57 C76 57 74 53 78 52 Z" fill="url(#woodHanger)"/>
        <rect x="146.5" y="38" width="7" height="6" rx="1.5" fill="url(#brassHook)"/>
        <polygon points="${pts}" fill="#1A1410" opacity=".08" transform="translate(0 8)" filter="url(#floorBlur)"/>
        <polygon points="${pts}" fill="#1A1410" opacity=".12" transform="translate(4 8)" filter="url(#brush)"/>
        <g clip-path="url(#garClip)">
          <rect width="${W}" height="${H}" class="garment" fill="${base.hex}"/>
          <rect width="${W}" height="${H}" fill="${base.hex}" filter="url(#cloth)"/>
          <g filter="url(#brush)"><rect x="0" y="${place.y}" width="${W}" height="${place.h}" fill="url(#motifPat)"/></g>
          ${st.placement === 'border' ? `<rect x="0" y="${H * .78 - 3}" width="${W}" height="2.5" fill="${paint.hex}" filter="url(#brush)"/>` : ''}
          ${st.placement === 'yoke' ? `<path d="M0 ${H * .28} Q150 ${H * .31} 300 ${H * .28}" stroke="${paint.hex}" stroke-width="2.5" fill="none" filter="url(#brush)"/>` : ''}
          <rect width="${W}" height="${H}" fill="url(#folds)"/>
        </g>
        <polygon points="${pts}" fill="none" stroke="rgba(30,27,22,.2)" stroke-width="1.2"/>`;
      $('[data-studio-caption]', root).textContent = `${paint.name} ${LABELS[st.motif]} on ${base.name} ${LABELS[st.fabric]}`;
      const ref = byHandle(REF[st.garment]);
      if (ref) { const a = $('[data-studio-ref]', root); a.href = `product.html?p=${ref.handle}`; const im = $('[data-studio-ref-img]', root); if (im.getAttribute('src') !== ref.images[0]) { im.src = ref.images[0]; im.alt = `${ref.title}, a real CEEO ${ref.type.toLowerCase()}`; } $('[data-studio-ref-name]', root).textContent = `${ref.title} · ${money(ref.price)}`; }
      ['garment', 'fabric', 'motif', 'placement'].forEach((k) => { $(`[data-out="${k}"]`, root).textContent = LABELS[st[k]]; });
      $('[data-out="base"]', root).textContent = base.name; $('[data-out="paint"]', root).textContent = paint.name;
      const price = S.basePrice[st.garment] + S.fabricAdd[st.fabric] + S.placementAdd[st.placement];
      $('[data-studio-price]', root).textContent = money(price);
      root.dataset.summary = `${LABELS[st.garment]} in ${LABELS[st.fabric].toLowerCase()} · ${base.name} base · ${LABELS[st.motif]} motif in ${paint.name.toLowerCase()} · ${LABELS[st.placement].toLowerCase()} · est. from ${money(price)}`;
    }
    const inspo = $('[data-studio-inspo]', root);
    if (inspo) inspo.innerHTML = DATA.products.filter((p) => p.collections.includes('hand-painted')).slice(0, 6).map((p) => `<li><a class="inspo" href="https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(`Hi CEEO, I love ${p.title} — can I get it customised in different colours?`)}" target="_blank" rel="noopener">
      <img src="${p.images[1] || p.images[0]}" alt="${esc(p.title)} — ${esc(p.motif || '')}" width="300" height="375" loading="lazy"><span class="inspo__name">${esc(p.title)}</span><span class="inspo__motif">${esc(p.motif || '')}</span></a></li>`).join('');
    form.addEventListener('change', draw);
    draw();
    $('[data-studio-request]', root).addEventListener('click', (e) => {
      const m = $('#Enquiry');
      $('[data-enquiry-summary]', m).textContent = root.dataset.summary;
      $('[data-enquiry]', m).hidden = false; $('[data-enquiry-ok]', m).hidden = true;
      m.open(e.currentTarget);
    });
  }
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-enquiry]'); if (!f) return;
    e.preventDefault();
    const err = $('[data-enquiry-error]', f);
    const missing = $$('[required]', f).filter((i) => !i.value.trim());
    if (missing.length) { err.textContent = `Add your ${missing.map((i) => i.name === 'phone' ? 'WhatsApp / phone number' : i.name).join(' and ')} so we can send your sketch.`; err.hidden = false; missing[0].focus(); return; }
    err.hidden = true;
    const fd = new FormData(f);
    const summary = $('[data-enquiry-summary]', f.parentElement).textContent;
    const msg = `Hi CEEO, I'd like a custom piece:\n${summary}\n\nName: ${fd.get('name')}\nSize: ${fd.get('size')}${fd.get('email') ? `\nEmail: ${fd.get('email')}` : ''}${fd.get('notes') ? `\nNotes: ${fd.get('notes')}` : ''}`;
    window.open(`https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    f.hidden = true; const ok = $('[data-enquiry-ok]', f.parentElement); ok.hidden = false; $('button', ok).focus();
  });

  /* ============ 13. Process brush stroke (scroll-linked, the page's one scroll moment) ============ */
  function initProcess() {
    const sec = $('[data-process]'); if (!sec) return;
    const path = $('[data-stroke]', sec); if (!path) return;
    const len = path.getTotalLength(); sec.style.setProperty('--len', len);
    if (reduceMotion) { sec.style.setProperty('--p', 1); return; }
    let ticking = false;
    const update = () => {
      const r = sec.getBoundingClientRect(); const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * .4)));
      sec.style.setProperty('--p', p.toFixed(3)); ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function initHero() {
    const h = DATA.hero; if (!h) return;
    const m = $('[data-hero-main]'); if (m) { m.src = h.main; m.alt = h.mainAlt; }
    const sd = $('[data-hero-side]'); if (sd) { sd.src = h.side; sd.alt = h.sideAlt; }
    const l = $('[data-hero-link]'); if (l) l.href = `product.html?p=${h.handle}`;
  }
  function renderTestimonials() {
    const ul = $('[data-testimonials]'); if (!ul) return;
    ul.innerHTML = DATA.testimonials.map((t) => `<li class="review"><figure>
      <blockquote class="review__quote"><p>“${esc(t.quote)}”</p></blockquote>
      <figcaption class="review__meta"><img class="review__avatar" src="${t.photo}" alt="" width="56" height="56" loading="lazy"><span><span class="review__name">${esc(t.name)}</span>${t.role ? `<span class="review__role">${esc(t.role)}</span>` : ''}</span></figcaption>
    </figure></li>`).join('');
  }
  /* ============ Boot ============ */
  initHero();
  renderTestimonials();
  renderProductLists();
  renderTiles();
  initShop();
  initPDP();
  renderWishlistPage();
  renderCart();
  initStudio();
  initProcess();
  syncWishButtons();
  observeReveal();
})();
