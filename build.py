#!/usr/bin/env python3
"""Builds the static pages from shared partials (header, footer, overlays).
Run: python3 build.py  → writes *.html in this folder. Edit partials here, not the output."""
import pathlib

ROOT = pathlib.Path(__file__).parent

ICONS = {
    'search': '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    'account': '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/>',
    'heart': '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
    'bag': '<path d="M5 8h14l-1 12.5H6L5 8Z"/><path d="M9 10.5V6.8a3 3 0 0 1 6 0v3.7"/>',
    'menu': '<path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h11"/>',
    'close': '<path d="M6 6l12 12M18 6 6 18"/>',
    'arrow': '<path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5"/>',
    'chevron': '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'minus': '<path d="M5 12h14"/>',
    'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    'filter': '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    'truck': '<path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/>',
    'return': '<path d="M8.5 5.5 4.5 9.5l4 4"/><path d="M4.5 9.5H15a5 5 0 0 1 0 10h-4"/>',
    'lock': '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    'chat': '<path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z"/>',
    'ruler': '<path d="M3 15.5 15.5 3 21 8.5 8.5 21z"/><path d="m7 11.5 2 2M10 8.5l2 2M13 5.5l2 2"/>',
    'instagram': '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
    'facebook': '<path d="M14.5 8.5h2.5V5h-2.5A3.5 3.5 0 0 0 11 8.5V11H8.5v3.5H11V21h3.5v-6.5H17l.5-3.5h-3V8.5Z"/>',
    'pinterest': '<circle cx="12" cy="12" r="8.5"/><path d="M11 9.5c.5-1.8 3.9-1.8 4.4.4.5 2.4-1.3 4.6-3 4.1-1.2-.4-1.2-1.6-.9-2.7M10.8 13.2 9 20.5"/>',
    'linkedin': '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 10.5v6M8 7.6v.1M11.5 16.5v-6M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3.5"/>',
    'whatsapp': '<path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.6Z"/><path d="M9 9.2c.3 2.2 2.4 4.4 4.8 5 .5.1 1.3-.6 1.4-1.1l-1.6-.9-.8.8c-1-.4-2-1.4-2.4-2.4l.8-.8-.9-1.6c-.6.1-1.3.6-1.3 1Z"/>',
}

MOTIFS = {
    'm-lotus': '<path d="M20 5c5 8 5.5 16 0 23-5.5-7-5-15 0-23Z"/><path d="M20 28C12 27 6.5 21 5.5 12.5 13 14 18 19 20 28Z"/><path d="M20 28c8-1 13.5-7 14.5-15.5C27 14 22 19 20 28Z"/><path d="M9 31c7 4.5 15 4.5 22 0-7 2.2-15 2.2-22 0Z"/>',
    'm-leaf': '<path d="M20 3c10 8 10.5 23 0 34C9.5 26 10 11 20 3Z"/><path d="M20 9v25" stroke="var(--vein, #F4EEE2)" stroke-width="1.2" fill="none"/>',
    'm-dots': '<circle cx="20" cy="20" r="4.2"/><circle cx="20" cy="10" r="2.5"/><circle cx="20" cy="30" r="2.5"/><circle cx="10" cy="20" r="2.5"/><circle cx="30" cy="20" r="2.5"/><circle cx="13" cy="13" r="1.5"/><circle cx="27" cy="13" r="1.5"/><circle cx="13" cy="27" r="1.5"/><circle cx="27" cy="27" r="1.5"/>',
    'm-vine': '<path d="M20 38C12 30 28 22 20 14S24 4 21 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 30c-7 1-11-2-12-6 6-1 10 1 12 6Z"/><path d="M21 20c7 1 11-2 12-6-6-1-10 1-12 6Z"/><path d="M20 10c-5-1-8-4-8-8 5 0 8 3 8 8Z"/>',
    'm-paisley': '<path d="M21 36C9 35 5 23 11 14 16 6 28 5 32 12c3.5 7-2 13.5-8 11-4-1.8-3.5-7 .5-7.5-4.5-3-10.5.5-9.5 7 1 6 8 9 13 5.5C27 33 24.5 36 21 36Z"/>',
    'm-blot': '<path d="M103 8c25 2 52 10 70 31 17 20 23 49 16 74-6 23-24 41-45 54-23 14-51 25-77 18C43 178 21 158 12 134 3 110 4 81 16 58 28 35 50 18 73 11c10-3 20-4 30-3Z"/>',
}

def icon(name):
    return f'<svg class="icon icon--{name}" aria-hidden="true" focusable="false"><use href="#i-{name}"/></svg>'

SPRITE = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
          ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>' for k, v in ICONS.items()) +
          ''.join(f'<symbol id="i-{k}" viewBox="0 0 {"200 200" if k == "m-blot" else "40 40"}" fill="currentColor">{v}</symbol>' for k, v in MOTIFS.items()) +
          '</defs></svg>')

def motif(name, cls='motif'):
    return f'<svg class="{cls}" aria-hidden="true" focusable="false"><use href="#i-m-{name}"/></svg>'

ARROW_R = '<svg viewBox="0 0 56 34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 24C14 30 34 30 50 10"/><path d="M42 9l8 1-1 8"/></svg>'
ARROW_L = '<svg viewBox="0 0 56 34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M54 10C42 4 22 6 6 24"/><path d="M6 15l0 9 9 0"/></svg>'
SQUIG = '<svg viewBox="0 0 42 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 12c6-8 10 6 16-2s10 6 16-2 5 2 6 2"/></svg>'

def motif_row(n=14):
    kinds = ['lotus', 'dots', 'leaf', 'paisley', 'dots', 'vine']
    return '<div class="motif-row" aria-hidden="true">' + ''.join(f'<svg><use href="#i-m-{kinds[i % len(kinds)]}"/></svg>' for i in range(n)) + '</div>'

NAV = [('Home', 'index.html'), ('Shop', 'shop.html', [('Shop all', 'shop.html'), ('Dresses', 'shop.html?c=dresses'), ('Tops & tunics', 'shop.html?c=tunics-tops'), ('Co-ord sets', 'shop.html?c=co-ords'), ('Hand-painted', 'shop.html?c=hand-painted'), ('Forthcoming ensemble', 'shop.html?c=upcoming')]), ('Custom', 'index.html#studio'), ('About', 'index.html#artisan'), ('Contact', 'https://ceeo.in/pages/contact-us')]
MOBILE_NAV = [('Shop all', 'shop.html'), ('Dresses', 'shop.html?c=dresses'), ('Tops & tunics', 'shop.html?c=tunics-tops'), ('Co-ord sets', 'shop.html?c=co-ords'), ('Hand-painted', 'shop.html?c=hand-painted'), ('Forthcoming ensemble', 'shop.html?c=upcoming'), ('Design your own', 'index.html#studio'), ('Our craft', 'index.html#artisan')]

def header(active):
    def navitem(item):
        label, href = item[0], item[1]
        cur = ' is-active' if label == active else ''
        if len(item) > 2:
            subs = ''.join(f'<li><a class="nav__sublink" href="{h}">{t}</a></li>' for t, h in item[2])
            return f'<li class="nav__item nav__item--has-children"><details class="nav__details" data-hover-details><summary class="nav__link{cur}">{label} {icon("chevron")}</summary><div class="nav__dropdown"><ul role="list">{subs}</ul></div></details></li>'
        return f'<li class="nav__item"><a class="nav__link{cur}" href="{href}">{label}</a></li>'
    links = ''.join(navitem(i) for i in NAV)
    mlinks = ''.join(f'<li><a class="menu-drawer__link" href="{href}">{label}</a></li>' for label, href in MOBILE_NAV)
    return f'''
<div class="announcement" role="region" aria-label="Announcement" style="--ann-bg:#111;--ann-fg:#fff">
  <div class="topbar5 page-width">
    <ul class="topbar5__social" role="list">
      <li><a href="https://www.facebook.com/Thestitch2021/" target="_blank" rel="noopener" aria-label="Facebook">{icon('facebook')}</a></li>
      <li><a href="https://www.instagram.com/ceeo.originals/" target="_blank" rel="noopener" aria-label="Instagram">{icon('instagram')}</a></li>
      <li><a href="https://wa.me/918928431344" target="_blank" rel="noopener" aria-label="WhatsApp">{icon('whatsapp')}</a></li>
    </ul>
    <button type="button" class="topbar5__arrow" data-ann-prev aria-label="Previous announcement">{icon('chevron')}</button>
  <div class="announcement__track" data-rotator="5">
    <p class="announcement__item is-active">Use code <strong>INDIA</strong> · 25% off everything</p>
    <p class="announcement__item">Hand-painted &amp; hand-stitched on linen-cotton · Customisation on WhatsApp</p>
  </div>
    <button type="button" class="topbar5__arrow topbar5__arrow--next" data-ann-next aria-label="Next announcement">{icon('chevron')}</button>
    <span class="topbar5__spacer" aria-hidden="true"></span>
  </div>
</div>
<div class="section-header">
<sticky-header class="site-header" data-sticky="true">
  <header class="header page-width">
    <div class="header__left">
      <button type="button" class="icon-btn header__burger" data-drawer-open="MenuDrawer" aria-controls="MenuDrawer" aria-expanded="false" aria-label="Menu">{icon('menu')}</button>
      <a href="index.html" class="header__logo" aria-label="CEEO Originals home"><img class="header__logo-img" src="assets/img/logo-192.png" alt="CEEO Originals" width="192" height="192"></a>
    </div>
    <nav class="header__nav" aria-label="Primary"><ul class="nav" role="list">{links}</ul></nav>
    <div class="header__icons">
            <button type="button" class="icon-btn" data-search-open aria-haspopup="dialog" aria-label="Search">{icon('search')}</button>
      <a href="#" class="icon-btn header__account" aria-label="Account">{icon('account')}</a>
      <a href="wishlist.html" class="icon-btn header__wishlist" aria-label="Wishlist">{icon('heart')}<span class="count-bubble" data-wishlist-count hidden></span></a>
      <a href="cart.html" class="icon-btn header__cart" data-cart-open aria-haspopup="dialog" aria-label="Bag" data-cart-link>{icon('bag')}<span class="count-bubble" data-cart-count hidden>0</span></a>
    </div>
  </header>
</sticky-header>
</div>

<drawer-panel id="MenuDrawer" class="drawer drawer--left" hidden>
  <div class="drawer__overlay" data-drawer-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu" tabindex="-1">
    <div class="drawer__head">
      <img class="drawer__logo" src="assets/img/logo-192.png" alt="CEEO Originals" width="192" height="192" loading="lazy">
      <button type="button" class="icon-btn" data-drawer-close aria-label="Close">{icon('close')}</button>
    </div>
    <nav class="drawer__body menu-drawer" aria-label="Mobile">
      <ul role="list" class="menu-drawer__list">{mlinks}</ul>
      <a class="menu-drawer__feature" href="index.html#studio">
        <img src="assets/img/process-3.jpg" alt="" loading="lazy" width="900" height="1100">
        <span class="link-arrow">Design your own piece {icon('arrow')}</span>
      </a>
    </nav>
    <div class="drawer__foot menu-drawer__foot">
      <a href="#" class="menu-drawer__util">{icon('account')}Log in</a>
      {socials()}
    </div>
  </div>
</drawer-panel>
'''

def socials():
    return f'''<ul class="social" role="list">
  <li><a href="https://www.instagram.com/ceeo.originals/" class="icon-btn" target="_blank" rel="noopener" aria-label="Instagram">{icon('instagram')}</a></li>
  <li><a href="https://www.facebook.com/Thestitch2021/" class="icon-btn" target="_blank" rel="noopener" aria-label="Facebook">{icon('facebook')}</a></li>
  <li><a href="https://www.linkedin.com/company/ceeo-originals-lifestyles/" class="icon-btn" target="_blank" rel="noopener" aria-label="LinkedIn">{icon('linkedin')}</a></li>
  <li><a href="https://wa.me/918928431344" class="icon-btn" target="_blank" rel="noopener" aria-label="WhatsApp">{icon('whatsapp')}</a></li>
</ul>'''

def newsletter_form(fid, variant):
    return f'''<form class="newsletter-form newsletter-form--{variant}" data-newsletter novalidate>
  <div class="newsletter-form__field">
    <label for="{fid}" class="visually-hidden">Email address</label>
    <input id="{fid}" type="email" name="email" autocomplete="email" required placeholder="Email address" aria-describedby="{fid}-err">
    <button type="submit" class="newsletter-form__btn">Join the list {icon('arrow')}</button>
  </div>
  <p id="{fid}-err" class="newsletter-form__error" role="alert" hidden></p>
  <p class="newsletter-form__msg" role="status" hidden>{icon('check')} You're on the list. First looks arrive in your inbox.</p>
</form>'''

def footer():
    col = lambda h, items: f'<nav class="footer__col" aria-label="{h}"><h3 class="footer__heading">{h}</h3><ul role="list" class="footer__links">' + ''.join(f'<li><a href="{u}">{t}</a></li>' for t, u in items) + '</ul></nav>'
    return f'''
<footer class="footer" aria-labelledby="FooterHeading">
  <h2 id="FooterHeading" class="visually-hidden">Footer</h2>
  <div class="footer__border" aria-hidden="true">{''.join(f'<svg><use href="#i-m-{k}"/></svg>' for k in ['lotus','dots','leaf','paisley','dots','vine']*5)}</div>
  <div class="page-width footer__grid">
    <div class="footer__brand">
      <a href="index.html" class="footer__logo" aria-label="CEEO Originals home"><img src="assets/img/logo-192.png" alt="CEEO Originals" width="192" height="192" loading="lazy"></a>
      <p class="footer__about">Prêt that blends traditional Indian textiles with clean, contemporary cuts — hand-painted and hand-stitched, in small batches, with artisans first.</p>
      {socials()}
    </div>
    {col('Shop', [('Dresses', 'shop.html?c=dresses'), ('Tops & tunics', 'shop.html?c=tunics-tops'), ('Co-ord sets', 'shop.html?c=co-ords'), ('Hand-painted', 'shop.html?c=hand-painted'), ('Forthcoming ensemble', 'shop.html?c=upcoming')])}
    {col('Help', [('Contact us', 'https://ceeo.in/pages/contact-us'), ('Personalisation', 'index.html#studio'), ('Collaboration', 'https://ceeo.in/pages/contact-us'), ('Size chart', 'product.html?p=city-canvas-midi-dress-hand-painted#size'), ('Return policy', 'https://ceeo.in/policies/refund-policy')])}
    {col('Company', [('About us', 'index.html#artisan'), ('Our craft', 'index.html#process'), ('WhatsApp', 'https://wa.me/918928431344')])}
    <div class="footer__col footer__col--news">
      <h3 class="footer__heading">Newsletter</h3>
      <p class="footer__small">New collections and private offers, first.</p>
      {newsletter_form('FooterEmail', 'dark')}
    </div>
  </div>
  <div class="page-width footer__bottom">
    <p class="footer__copy">© <span data-year>2026</span> CEEO Originals</p>
    <ul class="payments" role="list" aria-label="Payment methods">
      <li><span class="pay-badge">UPI</span></li><li><span class="pay-badge">Cards</span></li><li><span class="pay-badge">Net banking</span></li>
    </ul>
    <ul class="footer__policies" role="list"><li><a href="https://ceeo.in/policies/privacy-policy">Privacy</a></li><li><a href="https://ceeo.in/policies/terms-of-service">Terms</a></li><li><a href="https://ceeo.in/policies/refund-policy">Refund policy</a></li></ul>
  </div>
  <p class="footer__giant" aria-hidden="true">CEEO Originals</p>
</footer>
'''

OVERLAYS = f'''
<search-overlay id="SearchOverlay" class="search-overlay" hidden>
  <div class="search-overlay__backdrop" data-search-close></div>
  <div class="search-overlay__panel" role="dialog" aria-modal="true" aria-label="Search" tabindex="-1">
    <div class="page-width">
      <form action="shop.html" method="get" role="search" class="search-overlay__form">
        <label for="SearchInput" class="visually-hidden">What are you looking for?</label>
        {icon('search')}
        <input type="search" id="SearchInput" name="q" class="search-overlay__input" placeholder="What are you looking for?" autocomplete="off" spellcheck="false" aria-controls="PredictiveResults">
        <button type="button" class="icon-btn" data-search-close aria-label="Close search">{icon('close')}</button>
      </form>
      <div class="search-overlay__body">
        <div class="search-overlay__popular" data-search-popular>
          <p class="label">Popular</p>
          <ul class="chips" role="list" data-popular-list></ul>
        </div>
        <div id="PredictiveResults" class="predictive" aria-live="polite" data-predictive-results></div>
      </div>
    </div>
  </div>
</search-overlay>

<cart-drawer id="CartDrawer" class="drawer drawer--right cart-drawer" hidden>
  <div class="drawer__overlay" data-drawer-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="CartDrawerTitle" tabindex="-1">
    <div class="drawer__head">
      <h2 id="CartDrawerTitle" class="h4">Your bag <span class="cart-drawer__count" data-drawer-count>(0)</span></h2>
      <button type="button" class="icon-btn" data-drawer-close aria-label="Close bag">{icon('close')}</button>
    </div>
    <div class="cart-drawer__content" data-drawer-content></div>
  </div>
</cart-drawer>

<modal-dialog id="QuickAdd" class="modal modal--quick" hidden>
  <div class="modal__overlay" data-modal-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-label="Quick add" tabindex="-1">
    <button type="button" class="modal__close icon-btn" data-modal-close aria-label="Close">{icon('close')}</button>
    <div class="modal__content" data-modal-content></div>
  </div>
</modal-dialog>

<modal-dialog id="Enquiry" class="modal" hidden>
  <div class="modal__overlay" data-modal-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="EnquiryTitle" tabindex="-1">
    <button type="button" class="modal__close icon-btn" data-modal-close aria-label="Close">{icon('close')}</button>
    <form class="enquiry" data-enquiry novalidate>
      <h2 id="EnquiryTitle" class="h3">Request your custom piece</h2>
      <p class="enquiry__summary" data-enquiry-summary></p>
      <div class="field-row">
        <label class="field"><span>Name *</span><input class="input" name="name" autocomplete="name" required></label>
        <label class="field"><span>WhatsApp / phone *</span><input class="input" name="phone" type="tel" autocomplete="tel" required></label>
      </div>
      <div class="field-row">
        <label class="field"><span>Email</span><input class="input" name="email" type="email" autocomplete="email"></label>
        <label class="field"><span>Size</span><select class="input" name="size"><option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option><option>XXL</option><option>Custom measurements</option></select></label>
      </div>
      <label class="field"><span>Anything else? (occasion, length, sleeve…)</span><textarea class="input" name="notes" rows="3"></textarea></label>
      <p class="newsletter-form__error" role="alert" data-enquiry-error hidden></p>
      <button type="submit" class="btn btn--primary btn--arrow">Send request {icon('arrow')}</button>
      <p class="demo-note">Prototype: connect this form to email / WhatsApp Business / Shopify before launch.</p>
    </form>
    <div class="enquiry__ok" data-enquiry-ok hidden>
      <p class="hand" style="font-size:1.4rem">thank you!</p>
      <h2 class="h3">Your design request is in.</h2>
      <p>We'll share a hand-drawn sketch for your approval within 2 working days.</p>
      <button type="button" class="btn btn--outline" data-modal-close>Back to the site</button>
    </div>
  </div>
</modal-dialog>

<div class="toast" id="Toast" role="status" aria-live="polite" aria-atomic="true" hidden>{icon('check')}<span class="toast__text"></span></div>
'''

def page(title, desc, active, body, body_class, extra_head=''):
    return f'''<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#FFFFFF">
  <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <link rel="apple-touch-icon" href="assets/img/logo-192.png">
  <meta property="og:image" content="assets/img/logo.png">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="website">
  <link rel="preload" href="assets/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/instrument-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/oswald-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/v4.css">
  <link rel="stylesheet" href="assets/css/v5.css">
  <script>document.documentElement.className = 'js';</script>
  {extra_head}
  <script src="assets/js/data.js" defer></script>
  <script src="assets/js/app.js" defer></script>
  <script src="assets/js/v4.js" defer></script>
  <script src="assets/js/v5.js" defer></script>
</head>
<body class="{body_class}">
{SPRITE}
<a class="skip-link" href="#MainContent">Skip to content</a>
{header(active)}
<main id="MainContent" class="main" tabindex="-1">
{body}
</main>
{footer()}
{OVERLAYS}
</body>
</html>
'''

# ---------------- HOME ----------------
def section_head(h_id, title, sub='', link=None):
    l = f'<a href="{link[1]}" class="link-arrow section-head__link">{link[0]} {icon("arrow")}</a>' if link else ''
    s = f'<p class="section-head__sub">{sub}</p>' if sub else ''
    return f'<div class="section-head section-head--split"><div><h2 id="{h_id}" class="h2">{title}</h2>{s}</div>{l}</div>'

C = 'https://ceeo.in/cdn/shop/files/'
CATS5 = [
    ('dresses', 'Dresses', C + 'file_000000005d7482069865de50dece5bcd_2.jpg?v=1785992666&width=1200'),
    ('tunics-tops', 'Tops & tunics', C + 'Lita_turmeric_yellow_4.jpg?v=1764693710&width=1200'),
    ('co-ords', 'Co-ord sets', C + 'file_00000000a6ec720785d2816e09c7bb5d_2.png?v=1785991836&width=1200'),
]
RIBBON = 'HAND-PAINTED ON LINEN-COTTON ● USE CODE INDIA FOR 25% OFF ● ALTERATIONS ON YOUR MEASUREMENTS ● SMALL BATCHES, NEVER MASS-MADE ● '
IG5 = [('file_00000000698071fb81dc724d61af7cd2_2_3bbd442e-19ce-48f8-831a-16e5208e39a2.jpg?v=1785992161', 'City Canvas'), ('Lita_turmeric_yellow_1.jpg?v=1764693710', 'Lita'),
      ('file_00000000efb481f48fde3efe2506e02d_2.jpg?v=1785992316', 'Dusky Tulips'), ('SAKURA_PINK_1.jpg?v=1764693674', 'Sakura'),
      ('file_00000000bf588207834910349538cbf1_3.jpg?v=1785992666', 'Vinea 2.0'), ('Fern_White_1.jpg?v=1764693689', 'Fern')]

home = f'''
<section class="hero5" data-hero aria-labelledby="HeroTitle">
  <div class="page-width hero5__grid">
    <div class="hero5__copy">
      <div class="hero5__badge">
        <span class="hero5__badge-dot"></span>
        <span class="hero5__badge-text">Festive Atelier Celebration</span>
        <span class="hero5__badge-sparkle">✦</span>
      </div>
      <h1 id="HeroTitle" class="hero5__title">
        <span class="hero5__title-eyebrow">The Hand-Painted Edit</span>
        <span class="hero5__big">25% OFF</span>
        <span class="hero5__sub">Storewide Festive Offer</span>
      </h1>
      <div class="hero5__coupon" id="heroCoupon" title="Click to copy code INDIA">
        <span class="hero5__coupon-label">Use Code</span>
        <span class="hero5__coupon-code">INDIA</span>
        <button type="button" class="hero5__coupon-btn" aria-label="Copy coupon code INDIA">
          <svg class="icon icon--copy" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span class="hero5__coupon-copytext">Copy</span>
        </button>
      </div>
      <div class="hero5__actions">
        <a href="shop.html" class="hero5__btn-primary">
          <span>Shop The Collection</span>
          <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="https://wa.me/918928431344?text=Hi%20CEEO%20Originals%2C%20I%20would%20like%20to%20customise%20a%20hand-painted%20design" target="_blank" rel="noopener" class="hero5__btn-wa">
          <svg class="icon icon--whatsapp" aria-hidden="true"><use href="#i-whatsapp"/></svg>
          <span>Customise on WhatsApp</span>
        </a>
      </div>
      <div class="hero5__perks">
        <span class="hero5__perk">
          <svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Pure Linen &amp; Cotton
        </span>
        <span class="hero5__perk-dot">•</span>
        <span class="hero5__perk">
          <svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          100% Hand-Painted
        </span>
        <span class="hero5__perk-dot">•</span>
        <span class="hero5__perk">
          <svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Made-to-Measure
        </span>
      </div>
    </div>
    <div class="hero5__media">
      <div class="hero5__studio-note" aria-hidden="true">
        <span>Jaipur Atelier · Natural Dyes</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4 C8 14, 16 18, 20 20 M20 20 L13 20 M20 20 L20 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <a class="hero5__img hero5__img--main" href="product.html?p=vinea-2-0-single-piece-dress-hand-thread-work-hand-painting">
        <img src="{C}file_000000005d7482069865de50dece5bcd_2.jpg?v=1785992666&amp;width=1400" alt="Vinea 2.0 — turquoise linen-cotton dress with hand-painted leaves" width="1200" height="1500" fetchpriority="high">
        <div class="hero5__card-info">
          <div class="hero5__card-meta">
            <span class="hero5__card-tag">Hand-Painted Linen</span>
            <span class="hero5__card-name">Vinea 2.0</span>
          </div>
          <div class="hero5__card-pricing">
            <span class="hero5__price-sale">₹6,750</span>
            <span class="hero5__price-orig">₹9,000</span>
          </div>
        </div>
      </a>
      <a class="hero5__img hero5__img--side" href="product.html?p=city-canvas-midi-dress-hand-painted">
        <img src="{C}file_00000000fd0072069866f41efadd176b_2_ea48af8e-6d0a-4ee2-8100-fb725aeb9c5c.jpg?v=1785992161&amp;width=900" alt="City Canvas — midi dress with a hand-painted city skyline" width="900" height="1125">
        <div class="hero5__card-info">
          <div class="hero5__card-meta">
            <span class="hero5__card-tag">Artisanal Midi</span>
            <span class="hero5__card-name">City Canvas</span>
          </div>
          <div class="hero5__card-pricing">
            <span class="hero5__price-sale">₹5,625</span>
            <span class="hero5__price-orig">₹7,500</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</section>

<div class="ribbon5-bar" role="region" aria-label="Brand Highlights">
  <div class="ribbon5-sheen" aria-hidden="true"></div>
  <div class="ribbon5-track">
    <div class="ribbon5-items">
      <span class="ribbon5-item">Hand-Painted On Linen-Cotton</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item ribbon5-item--offer">Use Code <strong class="ribbon5-pill" data-copy-code="INDIA" title="Click to copy coupon INDIA">INDIA<span class="ribbon5-pill-tooltip">Click to copy</span></strong> · 25% Off Storewide</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Alterations On Your Measurements</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Small Batches, Never Mass-Made</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Direct From Indian Weavers</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Complimentary Delivery Across India</span>
      <span class="ribbon5-sparkle">✦</span>
    </div>
    <div class="ribbon5-items" aria-hidden="true">
      <span class="ribbon5-item">Hand-Painted On Linen-Cotton</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item ribbon5-item--offer">Use Code <strong class="ribbon5-pill" data-copy-code="INDIA" title="Click to copy coupon INDIA">INDIA<span class="ribbon5-pill-tooltip">Click to copy</span></strong> · 25% Off Storewide</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Alterations On Your Measurements</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Small Batches, Never Mass-Made</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Direct From Indian Weavers</span>
      <span class="ribbon5-sparkle">✦</span>
      <span class="ribbon5-item">Complimentary Delivery Across India</span>
      <span class="ribbon5-sparkle">✦</span>
    </div>
  </div>
</div>

<section class="intro5" aria-labelledby="H-intro">
  <div class="page-width intro5__wrap">
    <h2 id="H-intro" class="h5x">Painted by hand. Made for you.</h2>
    <p>CEEO designs outfits so the modern woman feels confident, comfortable and definitive. We source linen-cotton directly from weavers, then our artisans paint and stitch every piece by hand — in small batches, with fair pay. Prêt that blends traditional Indian textiles with a clean, contemporary cut.</p>
    <a href="#artisan" class="btn5 btn5--sm">Read more</a>
  </div>
</section>

<section class="cats5" aria-label="Shop by category">
  <ul class="cats5__grid" role="list">
    {''.join(f"""<li><a class="cat5" href="shop.html?c={h}"><img src="{src}" alt="" width="1200" height="1500" loading="lazy"><span class="cat5__name">{t}</span><span class="cat5__count" data-coll-count="{h}"></span></a></li>""" for h, t, src in CATS5)}
  </ul>
</section>

<section class="sec5" aria-labelledby="H-feat">
  <div class="page-width head5">
    <div class="head5__titles">
      <span class="sec5__kicker">Jaipur Atelier · Natural Dyes</span>
      <h2 id="H-feat" class="h5x h5x--left">Featured collection</h2>
    </div>
    <div class="head5__controls">
      <a href="shop.html?c=hand-painted" class="head5__viewall">View all pieces {icon('arrow')}</a>
      <div class="slider4__ui" data-slider-ui="feat">
        <button type="button" class="round4" data-slider-prev aria-label="Previous products">{icon('arrow')}</button>
        <button type="button" class="round4" data-slider-next aria-label="Next products">{icon('arrow')}</button>
        <span class="slider4__count" hidden><span data-slider-index>01</span>/<span data-slider-total>08</span></span>
      </div>
    </div>
  </div>
  <div class="slider4 slider5" data-slider="feat">
    <ul class="slider4__track product-grid" role="list" tabindex="0" aria-label="Featured collection" data-products="hand-painted" data-limit="9" data-category="true"></ul>
  </div>
  <div class="page-width"><div class="slider4__bar" aria-hidden="true"><span data-slider-bar></span></div></div>
</section>

<section class="split5" aria-labelledby="H-split">
  <div class="split5__media">
    <img src="{C}file_00000000e92c81f4aa78343312f4e4ce_2.jpg?v=1785992316&amp;width=1600" alt="Close-up of hand-painted tulips outlined with thread-work" width="1400" height="1400" loading="lazy">
    <div class="split5__badge-floating">
      <span class="split5__badge-star">✦</span>
      <div class="split5__badge-text">
        <strong>The Jaipur Atelier</strong>
        <span>100% Hand-Painted On Pure Linen</span>
      </div>
    </div>
  </div>
  <div class="split5__body">
    <div class="split5__kicker-wrap">
      <span class="split5__dot"></span>
      <span class="split5__kicker">Atelier Craft &amp; Heritage</span>
    </div>
    <h2 id="H-split" class="split5__title">
      <span>Brush.</span>
      <span>Needle.</span>
      <span class="split5__title-em">Hand.</span>
    </h2>
    <p class="split5__desc">Every motif begins in our in-house Jaipur studio. Artisans paint it by brush onto fine linen-cotton, then finish each contour with hand thread-work or Kantha stitch — ensuring no two CEEO creations are ever identical.</p>
    <ul class="split5__facts" role="list">
      <li class="split5__fact-card">
        <div class="split5__fact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12C2 6.5 6.5 2 12 2z"/><path d="M12 6v12M8 10l4-4 4 4"/></svg></div>
        <strong class="split5__fact-num">60 / 40</strong>
        <span class="split5__fact-label">Linen &amp; Cotton</span>
        <span class="split5__fact-desc">Sourced directly from Indian weavers</span>
      </li>
      <li class="split5__fact-card">
        <div class="split5__fact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 3 3 3-10 10H8v-3L18 3z"/><path d="m14 7 3 3M3 21h18"/></svg></div>
        <strong class="split5__fact-num">100%</strong>
        <span class="split5__fact-label">Painted By Hand</span>
        <span class="split5__fact-desc">Artisanal brush &amp; needle finish</span>
      </li>
      <li class="split5__fact-card">
        <div class="split5__fact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 8.7 8.7 21.3a2 2 0 0 1-2.8 0L3.3 18.7a2 2 0 0 1 0-2.8L15.9 3.3a2 2 0 0 1 2.8 0l2.6 2.6a2 2 0 0 1 0 2.8z"/><path d="m7.5 14.5 2 2M10.5 11.5l2 2M13.5 8.5l2 2"/></svg></div>
        <strong class="split5__fact-num">L – XXL</strong>
        <span class="split5__fact-label">Made-To-Measure</span>
        <span class="split5__fact-desc">Altered complimentary to your size</span>
      </li>
    </ul>
    <div class="split5__actions">
      <a href="shop.html?c=hand-painted" class="btn5 btn5--split-primary">
        <span>Shop Hand-Painted</span>
        {icon('arrow')}
      </a>
      <a href="https://wa.me/918928431344?text=Hi%20CEEO%20Originals%2C%20I%20would%20like%20to%20customise%20a%20hand-painted%20design" target="_blank" rel="noopener" class="btn5 btn5--split-ghost">
        <span>Customise on WhatsApp</span>
      </a>
    </div>
  </div>
</section>

<section class="sec5 sec5--gray" aria-labelledby="H-new">
  <div class="page-width head5">
    <div class="head5__titles">
      <span class="sec5__kicker">Fresh Off The Loom</span>
      <h2 id="H-new" class="h5x h5x--left">New arrivals</h2>
    </div>
    <a href="shop.html" class="head5__viewall">View all {icon('arrow')}</a>
  </div>
  <div class="page-width"><ul class="product-grid grid5" role="list" data-products="new" data-limit="4" data-category="true"></ul></div>
</section>

<section class="promo5" aria-labelledby="H-promo">
  <img class="promo5__bg" src="{C}CeeoOriginals59462.jpg?v=1770637929&amp;width=2000" alt="" width="2000" height="1200" loading="lazy">
  <div class="page-width promo5__inner">
    <p class="kicker5 kicker5--light">Forthcoming ensemble</p>
    <h2 id="H-promo" class="h5x h5x--left h5x--xl">The next<br>collection is here.</h2>
    <a href="shop.html?c=upcoming" class="btn5 btn5--light">Shop the drop</a>
  </div>
</section>

<section id="studio" class="section studio" aria-labelledby="H-studio" style="--pt:96px;--pb:96px">
  <div class="page-width">
    <div class="studio__card" data-studio>
      
      <div class="studio__head">
        <div class="studio__badge-wrap">
          <span class="studio__badge">
            <span class="studio__badge-dot"></span>
            BESPOKE ATELIER
          </span>
          <span class="studio__badge-sub">HAND-PAINTED COMMISSION</span>
        </div>
        <h2 id="H-studio" class="h2 studio__title">Design A Piece That's Only Yours.</h2>
        <p class="studio__desc">Select your silhouette, natural textile, hand-carved motif and artisanal mineral dyes. Our Jaipur master artisans hand-paint each piece to order, altered to your measurements.</p>
        <div class="studio__perks">
          <span class="studio__perk">{icon('heart')} 100% Hand-Painted to Order</span>
          <span class="studio__perk">{icon('ruler')} Custom Altered to Your Size</span>
          <span class="studio__perk">✦ 5–7 Days Atelier Crafting</span>
        </div>
      </div>

      <div class="studio__grid">
        <div class="studio__preview-stage">
          <div class="studio__preview" aria-live="polite">
            <div class="studio__live-pill">
              <span class="studio__live-dot"></span>
              <span>LIVE ATELIER PREVIEW</span>
            </div>

            <svg id="StudioPreview" viewBox="0 0 300 380" role="img" aria-labelledby="StudioPreviewTitle"><title id="StudioPreviewTitle">Preview of your custom piece</title></svg>

            <a class="studio__ref" href="#" data-studio-ref aria-label="View archive piece sample">
              <div class="studio__ref-thumb">
                <img src="" alt="" width="300" height="375" loading="lazy" data-studio-ref-img>
              </div>
              <div class="studio__ref-info">
                <span class="studio__ref-kicker">ARCHIVE PIECE</span>
                <strong data-studio-ref-name class="studio__ref-name"></strong>
              </div>
            </a>

            <div class="studio__caption-dock">
              <span class="studio__caption-icon">🖌️</span>
              <p class="studio__preview-note" data-studio-caption></p>
            </div>
          </div>
        </div>

        <form class="studio__controls" data-studio-form onsubmit="return false">
          
          <fieldset class="studio__group">
            <legend>
              <span class="n">01</span>
              <span class="legend-text">Garment Silhouette</span>
              <output data-out="garment"></output>
            </legend>
            <div class="choice-row">
              <label class="choice"><input type="radio" name="garment" value="kurta" checked><span>Tunic</span></label>
              <label class="choice"><input type="radio" name="garment" value="dress"><span>Midi dress</span></label>
              <label class="choice"><input type="radio" name="garment" value="coord"><span>Co-ord Set</span></label>
            </div>
          </fieldset>

          <fieldset class="studio__group">
            <legend>
              <span class="n">02</span>
              <span class="legend-text">Fabric Textile</span>
              <output data-out="fabric"></output>
            </legend>
            <div class="choice-row">
              <label class="choice"><input type="radio" name="fabric" value="linen" checked><span>Linen-cotton <span class="choice-badge">+₹500</span></span></label>
              <label class="choice"><input type="radio" name="fabric" value="cotton"><span>Pure cotton</span></label>
            </div>
          </fieldset>

          <fieldset class="studio__group">
            <legend>
              <span class="n">03</span>
              <span class="legend-text">Base Colour</span>
              <output data-out="base"></output>
            </legend>
            <div class="choice-row choice-row--swatches" data-choices="base"></div>
          </fieldset>

          <fieldset class="studio__group">
            <legend>
              <span class="n">04</span>
              <span class="legend-text">Artisan Motif</span>
              <output data-out="motif"></output>
            </legend>
            <div class="choice-row choice-row--motifs">
              {''.join(f'<label class="choice choice--motif"><input type="radio" name="motif" value="{m}"{" checked" if m == "lotus" else ""}><span>{motif(m, "")} {label}</span></label>' for m, label in [('lotus', 'Lotus'), ('leaf', 'Leaf'), ('dots', 'Dabu dots'), ('vine', 'Vine'), ('paisley', 'Paisley')])}
            </div>
          </fieldset>

          <fieldset class="studio__group">
            <legend>
              <span class="n">05</span>
              <span class="legend-text">Hand-Paint Dye</span>
              <output data-out="paint"></output>
            </legend>
            <div class="choice-row choice-row--swatches" data-choices="paint"></div>
          </fieldset>

          <fieldset class="studio__group">
            <legend>
              <span class="n">06</span>
              <span class="legend-text">Motif Placement</span>
              <output data-out="placement"></output>
            </legend>
            <div class="choice-row">
              <label class="choice"><input type="radio" name="placement" value="allover" checked><span>All-over</span></label>
              <label class="choice"><input type="radio" name="placement" value="border"><span>Hem border</span></label>
              <label class="choice"><input type="radio" name="placement" value="yoke"><span>Yoke only</span></label>
            </div>
          </fieldset>

          <div class="studio__summary">
            <div class="studio__price-wrap">
              <span class="studio__price-kicker">ESTIMATED COMMISSION FROM</span>
              <div class="studio__price-main"><strong data-studio-price>₹6,850</strong></div>
              <p class="studio__price-sub">Painted to order · Custom altered to your size</p>
            </div>
            <div class="studio__action-wrap">
              <button type="button" class="btn-whatsapp-studio" data-studio-request>
                <span class="btn-whatsapp-icon">{icon('whatsapp')}</span>
                <span>Request on WhatsApp</span>
                <span class="btn-whatsapp-arrow">{icon('arrow')}</span>
              </button>
              <p class="demo-note studio__reassurance">🔒 Zero-obligation sketch &amp; sizing quote confirmed on WhatsApp</p>
            </div>
          </div>
        </form>
      </div>

      <div class="studio__inspo">
        <div class="studio__inspo-header">
          <p class="studio__inspo-kicker">ATELIER ARCHIVES</p>
          <h3 class="studio__inspo-heading">Recently Painted by Our Artisans</h3>
          <p class="studio__inspo-desc">Loved any of these real pieces? Tap to request it customised in your favourite colours &amp; sizing on WhatsApp.</p>
        </div>
        <ul class="studio__inspo-list" role="list" data-studio-inspo></ul>
      </div>

    </div>
  </div>
</section>

<section id="artisan" class="sec5 values5" aria-labelledby="H-why">
  <div class="page-width">
    <h2 id="H-why" class="h5x">Why CEEO Originals?</h2>
    <ul class="values5__grid" role="list">
      <li>{icon('heart')}<h3>Artisans first</h3><p>Fabrics sourced directly from weavers, with fair pay for every pair of hands.</p></li>
      <li>{icon('ruler')}<h3>Altered to you</h3><p>Every piece can be altered to your measurements — just WhatsApp us.</p></li>
      <li>{icon('return')}<h3>Small batches</h3><p>Produced intentionally, never mass-made — so the craft survives.</p></li>
      <li>{icon('lock')}<h3>Secure checkout</h3><p>Pay safely at checkout, with easy returns as per our policy.</p></li>
    </ul>
  </div>
</section>

<section class="sec5 sec5--gray" aria-labelledby="H-rev">
  <div class="page-width">
    <h2 id="H-rev" class="h5x">What our customers say</h2>
    <ul class="reviews5" role="list" data-reviews5></ul>
  </div>
</section>

<section class="insta5" aria-labelledby="H-ig">
  <div class="page-width head5 head5--center"><h2 id="H-ig" class="h5x">Follow @ceeo.originals</h2></div>
  <ul class="insta5__grid" role="list">
    {''.join(f"""<li><a href="https://www.instagram.com/ceeo.originals/" target="_blank" rel="noopener" class="insta5__item"><img src="{C}{f}&amp;width=600" alt="{alt} on Instagram" width="600" height="600" loading="lazy"><span class="insta5__hover">{icon('instagram')}</span><span class="visually-hidden">(opens in a new window)</span></a></li>""" for f, alt in IG5)}
  </ul>
</section>

<section id="newsletter" class="news5" aria-labelledby="H-news">
  <div class="page-width news5__wrap">
    <div><h2 id="H-news" class="h5x h5x--left">Join the CEEO list</h2><p>First looks at new drops, limited pieces and private offers.</p></div>
    {newsletter_form('NewsEmail', 'dark')}
  </div>
</section>
'''


# ---------------- SHOP ----------------
shop = f'''
<div class="coll-hero page-width">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page" data-coll-crumb>Shop</span></nav>
  <h1 class="display display--md coll-hero__title" data-coll-title>Shop all</h1>
  <div class="coll-hero__desc" data-coll-desc><p>Every CEEO piece, in one place.</p></div>
</div>
<div class="coll page-width" data-shop>
  <nav class="collection-tabs" aria-label="Collections" data-coll-tabs></nav>
  <div class="coll__toolbar" role="region" aria-label="Filter and sort">
    <button type="button" class="btn btn--outline btn--sm coll__filter-btn" data-drawer-open="FilterDrawer" aria-controls="FilterDrawer" aria-expanded="false">{icon('filter')}Filter <span class="count-pill" data-filter-count hidden>0</span></button>
    <p class="coll__count" id="ProductCount" role="status" data-count>0 pieces</p>
    <div class="coll__sort">
      <label for="SortBy" class="coll__sort-label">Sort by</label>
      <div class="select">
        <select id="SortBy" data-sort>
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
          <option value="painted">Hand-painted first</option>
        </select>{icon('chevron')}
      </div>
    </div>
  </div>
  <ul class="active-filters" role="list" aria-label="Active filters" data-active-filters hidden></ul>
  <div class="coll__layout">
    <drawer-panel id="FilterDrawer" class="drawer drawer--left filter-drawer" hidden>
      <div class="drawer__overlay" data-drawer-close></div>
      <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="FilterTitle" tabindex="-1">
        <div class="drawer__head"><h2 id="FilterTitle" class="h4">Filter</h2><button type="button" class="icon-btn" data-drawer-close aria-label="Close filters">{icon('close')}</button></div>
        <form class="drawer__body facets" data-facets onsubmit="return false"></form>
        <div class="drawer__foot filter-drawer__foot">
          <button type="button" class="btn btn--outline" data-clear-filters>Clear all</button>
          <button type="button" class="btn btn--primary" data-drawer-close data-show-results>Show results</button>
        </div>
      </div>
    </drawer-panel>
    <div class="coll__results" id="ProductGridWrap">
      <ul class="product-grid product-grid--coll" role="list" id="ProductGrid" data-shop-grid></ul>
      <div class="coll__empty" data-shop-empty hidden><p class="h4">No pieces match these filters.</p><button type="button" class="btn btn--outline" data-clear-filters>Clear all</button></div>
    </div>
  </div>
</div>
'''

# ---------------- PRODUCT ----------------
product = f'''
<section class="pdp page-width page-width--wide" data-pdp data-product-root aria-live="polite"></section>

<sticky-atc class="sticky-atc" hidden>
  <div class="sticky-atc__info"><span class="sticky-atc__title" data-sticky-title></span><span class="sticky-atc__price" data-sticky-price></span></div>
  <button type="button" class="btn btn--primary" data-sticky-add>Add to bag</button>
</sticky-atc>

<section class="section recs bg-white" aria-labelledby="H-recs" style="--pt:80px;--pb:96px">
  <div class="page-width">
    <div class="section-head"><h2 id="H-recs" class="h2">Complete the look</h2></div>
    <ul class="product-grid" role="list" data-products="recs" data-limit="4" data-rating="true"></ul>
  </div>
</section>

<modal-dialog id="SizeGuide" class="modal modal--size" hidden>
  <div class="modal__overlay" data-modal-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="SizeGuideTitle" tabindex="-1">
    <button type="button" class="modal__close icon-btn" data-modal-close aria-label="Close">{icon('close')}</button>
    <div class="size-guide">
      <h2 id="SizeGuideTitle" class="h3">Size guide</h2>
      <p class="size-guide__unit">CEEO size chart. Need a different fit? We alter on your measurements.</p>
      <img class="size-guide__chart" data-size-chart src="" alt="CEEO size chart with bust, waist, hip and length for each size" width="1200" height="900" loading="lazy">
      <div class="measure">
        <svg class="measure__figure" viewBox="0 0 120 220" aria-hidden="true" focusable="false">
          <path d="M60 18a13 13 0 1 1 0 .1M44 44c-8 4-12 12-12 22l4 34 8 2 4 40-6 64h14l4-52 4 52h14l-6-64 4-40 8-2 4-34c0-10-4-18-12-22-10 5-22 5-32 0Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <path d="M34 70h52M40 98h40M38 124h44" stroke="#D9C7A0" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="94" y="73" font-size="9" fill="currentColor">1</text><text x="88" y="101" font-size="9" fill="currentColor">2</text><text x="90" y="127" font-size="9" fill="currentColor">3</text>
        </svg>
        <div class="measure__text">
          <h3 class="h5">How to measure</h3>
          <ol class="measure__list">
            <li><strong>Bust</strong> — around the fullest part of your chest, tape level.</li>
            <li><strong>Waist</strong> — around your natural waist, the narrowest point.</li>
            <li><strong>Hip</strong> — around the fullest part of your hips.</li>
            <li><strong>Length</strong> — from the highest point of the shoulder down to the hem.</li>
          </ol>
          <p class="measure__note">Between sizes? Choose the larger size for a relaxed fit.</p>
        </div>
      </div>
    </div>
  </div>
</modal-dialog>
'''

# ---------------- CART ----------------
cart = '''
<section class="cart-page page-width" data-cart-page>
  <h1 class="display display--md cart-page__title">Your bag</h1>
  <div data-cart-page-content></div>
</section>
<section class="section bg-white" aria-labelledby="H-cart-recs" style="--pt:64px;--pb:96px">
  <div class="page-width">
    <div class="section-head"><h2 id="H-cart-recs" class="h2">You may also like</h2></div>
    <ul class="product-grid" role="list" data-products="bestsellers" data-limit="4"></ul>
  </div>
</section>
'''

wishlist = '''
<section class="page-width content-page">
  <h1 class="display display--md">Wishlist</h1>
  <p class="wishlist-note">Saved on this device.</p>
  <ul class="product-grid product-grid--coll" role="list" data-wishlist-grid></ul>
</section>
'''

pages = {
    'index.html': ('CEEO Originals — Modern Indian elegance', 'Contemporary silhouettes, refined fabrics and effortless Indian elegance. Shop new arrivals from CEEO Originals.', 'Home', home, 'page-home'),
    'shop.html': ('Shop — CEEO Originals', 'Shop dresses, kurta sets, co-ords and festive pieces from CEEO Originals.', 'Shop', shop, 'page-shop'),
    'product.html': ('Product — CEEO Originals', 'CEEO Originals product details.', '', product, 'page-product'),
    'cart.html': ('Your bag — CEEO Originals', 'Review your bag.', '', cart, 'page-cart'),
    'wishlist.html': ('Wishlist — CEEO Originals', 'Your saved pieces.', '', wishlist, 'page-wishlist'),
}
for name, (t, d, a, b, c) in pages.items():
    (ROOT / name).write_text(page(t, d, a, b, c), encoding='utf-8')
    print('wrote', name)
