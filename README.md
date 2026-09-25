# CEEO Originals — V5 "Bold" (static HTML / CSS / JS)

V5 = commercial Shopify-OS2-style layer (assets/css/v5.css + assets/js/v5.js) on top of V4/V3.
Oswald condensed uppercase headlines, monochrome UI, gray studio hero with the real INDIA 25% offer,
curved scrolling promo ribbon, full-bleed category tiles (grayscale → colour on hover), featured slider,
black craft split, promo banner, custom studio, values, reviews, Instagram, black newsletter band.

(Previous direction below kept for reference.)

# V4 "Editorial"

V4 = premium editorial layer (assets/css/v4.css + assets/js/v4.js) on top of the V3 system.
Full-bleed photographic hero triptych, marquee, New-in slider, hover-index edit, sticky stacked craft cards,
collection mosaic, indigo ethos statement, testimonial slider, full-bleed Instagram, giant footer wordmark.
Type: Instrument Serif (display) + Instrument Sans (UI). White / cool-gray / ink, indigo + madder accents.

Direction: hand-painted handloom cotton & linen. Natural-dye palette (indigo, madder, turmeric, leaf),
brush-edged frames and buttons, stitched details, handwritten studio notes, block-print motif system,
live custom-design studio. Approve here → convert to Shopify theme.

Open `index.html` directly, or serve for best results (fonts preload over http):
    python3 -m http.server 8000   →  http://localhost:8000

## Files
- index.html · shop.html · product.html?p=<handle> · cart.html · wishlist.html
- assets/css/style.css   — single stylesheet (tokens at top)
- assets/js/data.js      — catalogue: products, collections, size guide, free-ship threshold
- assets/js/app.js       — all behaviour (cart, quick add, search, filters, PDP, wishlist…)
- Product, collection, fabric, testimonial & Instagram images → LIVE from ceeo.in Shopify CDN (22 real products, real prices/handles/copy)
- assets/img/            — generated art only for the "weaver to wardrobe" process steps + artisan panel (swap for studio photos when available)
- assets/fonts/          — Fraunces (display) + Instrument Sans (UI) + Kalam (studio notes), OFL, self-hosted
- build.py               — regenerates the 5 pages from shared header/footer partials

## Edit
- Products / prices / sizes / colours → data.js (prices in paise: ₹4,990 = 499000)
- Header, footer, homepage copy → build.py, then `python3 build.py`
- Colours / fonts / widths → :root in style.css

## Prototype limits (connect before launch)
- Cart + wishlist = localStorage (this browser only)
- Checkout button → shows notice; connect Shopify Storefront API / payment gateway
- Newsletter → validates only; connect Klaviyo / Mailchimp in app.js ("Connect to…")
- Search = client-side over data.js
- Custom studio: pricing/timelines in data.js → studio are PLACEHOLDERS; enquiry form → connect email / WhatsApp Business

## Real-store data (scraped 24 Sep 2026 from ceeo.in)
- 22 products across Dresses, Tops & tunics, Co-ord sets, Hand-painted, Forthcoming ensemble (handles = live Shopify handles)
- Not included (no images on listing pages): Zaria, Ziva, Miraya — add to data.js if wanted
- Sizes marked `assumed: true` in data.js = not verified from product page (defaulted to L/XL/XXL)
- Customisation + enquiry form → opens WhatsApp +91 89284 31344 with the design pre-filled
- Needs internet to show product images (served from ceeo.in CDN)
# ceeo
