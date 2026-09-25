/* CEEO ORIGINALS — V3 catalogue.
   Products, prices, images & copy taken from the live store (ceeo.in) on 24 Sep 2026.
   Images are served from the store's own Shopify CDN. Handles match the live store so
   the Shopify conversion maps 1:1. Prices in paise (₹6,850 = 685000).
   VERIFY before launch: sizes/colours marked "assumed" (not listed on the collection pages). */
(() => {
  const CDN = 'https://ceeo.in/cdn/shop/files/';
  const img = (f, w = 900) => `${CDN}${f}${f.includes('?') ? '&' : '?'}width=${w}`;
  const LXL = { L: true, XL: true, XXL: true };
  const CARE_PAINT = 'Mild detergent · hand wash · dry in shade · medium-hot iron, reverse-iron on the hand-painted side.';
  const CARE_THREAD = 'Mild detergent · hand wash · dry in shade · reverse-iron, never iron directly on the hand-work.';

  window.CEEO_DATA = {
    currency: '₹',
    freeShippingThreshold: 299900,
    whatsapp: '918928431344',
    instagram: 'https://www.instagram.com/ceeo.originals/',
    popular: ['Hand painting', 'Dresses', 'Linen', 'Co-ord', 'Kantha'],
    hero: {
      main: img('file_000000005d7482069865de50dece5bcd_2.jpg?v=1785992666', 1400),
      mainAlt: 'Vinea 2.0 turquoise linen-cotton dress with hand-painted leaves and hand thread-work',
      side: img('file_00000000fd0072069866f41efadd176b_2_ea48af8e-6d0a-4ee2-8100-fb725aeb9c5c.jpg?v=1785992161', 700),
      sideAlt: 'City Canvas white midi dress with a hand-painted city skyline',
      handle: 'vinea-2-0-single-piece-dress-hand-thread-work-hand-painting'
    },
    fabrics: {
      linen: img('Linen_New.jpg?v=1761287997', 900),
      cotton: img('Cotton_new.jpg?v=1761288231', 900),
      silk: img('Silk_new.jpg?v=1761288276', 900)
    },
    sizeChart: img('Size_Chart.jpg?v=1768540932', 1200),
    collections: [
      { handle: 'hand-painted', title: 'Hand-painted', image: img('file_000000008a188208b0462969b3b70c9e_2.jpg?v=1785992316'), description: 'Every motif brushed on by hand — leaves, tulips, skylines and florals on linen-cotton.' },
      { handle: 'dresses', title: 'Dresses', image: img('CeeoOriginals59595_aefa66ae-3aa9-4d7f-bbe3-4da363e21586.jpg?v=1771049421'), description: 'Midi, single-piece and long dresses in breathable linen-cotton.' },
      { handle: 'tunics-tops', title: 'Tops & tunics', image: img('Lita_turmeric_yellow_4.jpg?v=1764693710'), description: 'Tunics, kurtis, shirts and ponchos with hand thread-work and painting.' },
      { handle: 'co-ords', title: 'Co-ord sets', image: img('file_00000000a6ec720785d2816e09c7bb5d_2.png?v=1785991836'), description: 'Two-piece sets, easy to wear together or apart.' },
      { handle: 'upcoming', title: 'Forthcoming ensemble', image: img('CeeoOriginals59462.jpg?v=1770637929'), description: 'The next CEEO collection — first look.' }
    ],
    products: [
      /* ---------- Hand-painted (newest) ---------- */
      { handle: 'vinea-2-0-single-piece-dress-hand-thread-work-hand-painting', title: 'Vinea 2.0', type: 'Single piece dress', category: 'Dresses', price: 900000,
        technique: ['Hand painting', 'Hand thread-work'], fabricName: 'Linen-cotton', composition: 'Linen 60%, Cotton 40%', motif: 'Hand-painted leaves', occasion: 'Formal / casual',
        collections: ['hand-painted', 'dresses', 'new'], colors: [{ name: 'Turquoise blue', hex: '#3E9BA6' }], sizes: LXL,
        images: [img('file_000000005d7482069865de50dece5bcd_2.jpg?v=1785992666'), img('file_00000000bf588207834910349538cbf1_3.jpg?v=1785992666'), img('file_0000000077a48207895e1b832d84bfe8_2.jpg?v=1785992666')],
        short: 'Sleeveless linen-cotton midi with a classic shirt collar, hand-painted leaves and fine hand thread-work.', details: 'Sleeveless midi, classic shirt collar, V neckline. Hand-painted leaves finished with fine hand thread-work.', fabric: CARE_PAINT },
      { handle: 'city-canvas-midi-dress-hand-painted', title: 'City Canvas', type: 'Midi dress', category: 'Dresses', price: 750000,
        technique: ['Hand painting'], fabricName: 'Linen-cotton', composition: 'Linen 60%, Cotton 40%', motif: 'Hand-painted city skyline', occasion: 'Semi-formal / casual',
        collections: ['hand-painted', 'dresses', 'new'], colors: [{ name: 'White / grey', hex: '#E9E7E2' }], sizes: LXL,
        images: [img('file_00000000fd0072069866f41efadd176b_2_ea48af8e-6d0a-4ee2-8100-fb725aeb9c5c.jpg?v=1785992161'), img('file_00000000698071fb81dc724d61af7cd2_2_3bbd442e-19ce-48f8-831a-16e5208e39a2.jpg?v=1785992161'), img('file_00000000852c8206b005f1a2d0ee7ed3_2_a1e87ea0-f903-42ee-9c78-e2b052ad6111.jpg?v=1785992161')],
        short: 'A sleeveless A-line midi in linen-cotton with a hand-painted city skyline — clean and modern.', details: 'Sleeveless A-line midi, U tapered neck. City skyline painted by hand across the dress.', fabric: CARE_PAINT },
      { handle: 'bloom-women-s-co-ord-set-hand-thread-work-hand-painting-copy', title: 'Dusky Tulips', type: 'Midi dress', category: 'Dresses', price: 697500,
        technique: ['Hand painting', 'Hand thread-work'], fabricName: 'Linen-cotton', composition: 'Linen 60%, Cotton 40%', motif: 'Custom floral hand painting', occasion: 'Casual',
        collections: ['hand-painted', 'dresses', 'new'], colors: [{ name: 'Onion red', hex: '#A9564E' }], sizes: LXL,
        images: [img('file_000000008a188208b0462969b3b70c9e_2.jpg?v=1785992316'), img('file_00000000efb481f48fde3efe2506e02d_2.jpg?v=1785992316'), img('file_00000000e92c81f4aa78343312f4e4ce_2.jpg?v=1785992316')],
        short: 'A-line linen-cotton midi with shirt collar and ¾ sleeves, handcrafted thread-work and floral hand painting.', details: 'A-line midi, shirt collar, ¾ sleeves. Tulips painted by hand and outlined with thread-work.', fabric: CARE_PAINT },
      { handle: 'bloom-women-s-co-ord-set-hand-thread-work-hand-painting', title: 'Bloom', type: 'Co-ord set', category: 'Co-ord sets', price: 697500,
        technique: ['Hand painting', 'Kantha'], fabricName: 'Linen-cotton', composition: 'Linen 60%, Cotton 40%', motif: 'Hand-painted florals, Kantha stitch', occasion: 'Casual',
        collections: ['hand-painted', 'co-ords', 'new'], colors: [{ name: 'White / grey', hex: '#E9E7E2' }], sizes: { 'Free size': true },
        images: [img('file_00000000a6ec720785d2816e09c7bb5d_2.png?v=1785991836'), img('file_00000000ba1882089b514aa396172a62_2.jpg?v=1785991834'), img('file_00000000bca87207bc24f08863432e7c_2_c8262af6-97a8-4423-9e04-ef85a1577fda.png?v=1785992094')],
        short: 'Hand-painted, Kantha-stitched off-shoulder top with relaxed grey barrel pants.', details: 'Two-piece set: off-shoulder top with hand painting and Kantha stitch; relaxed grey barrel pants.', fabric: CARE_PAINT },
      { handle: 'adalyn-single-piece-dress-ladder-lace-kantha-stitch-embroidery', title: 'Adalyn', type: 'Single piece dress', category: 'Dresses', price: 685000,
        technique: ['Kantha', 'Lace'], fabricName: 'Linen-cotton', composition: 'Linen 60%, Cotton 40%', motif: 'Ladder lace & hand Kantha stitch', occasion: 'Semi-formal',
        collections: ['dresses', 'new'], colors: [{ name: 'Fuchsia pink', hex: '#C2407A' }], sizes: LXL,
        images: [img('file_00000000bb5481fb988fd03a2d4f6e6a_2_fdd1d2d2-c9c7-4d46-9750-42627c3b3868.jpg?v=1785993119'), img('file_0000000029d08230a26987770a3f83da_2_145084fd-c799-414b-adf0-4382829901b3.jpg?v=1785993119'), img('file_00000000192481fb8fbb12cd3bd59c06_2_8c652d83-c7ef-4d69-a7ee-48b1ad8011de.jpg?v=1785993119')],
        short: 'Fuchsia single-piece dress in breathable linen-cotton, with ladder lace and hand-stitched Kantha.', details: 'Single-piece dress, U neck. Ladder lace accents and hand Kantha stitch embroidery.', fabric: 'Mild detergent · hand wash · dry in shade · medium-hot iron.' },
      { handle: 'solara-poncho-tunics-hand-thread-work-hand-painting', title: 'Solara', type: 'Poncho tunic', category: 'Tops & tunics', price: 180000,
        technique: ['Hand painting', 'Hand thread-work'], fabricName: 'Pure cotton', composition: 'Cotton 100%', motif: 'Painted neckline with embroidery', occasion: 'Casual',
        collections: ['hand-painted', 'tunics-tops', 'new'], colors: [{ name: 'Blue', hex: '#3E5E9C' }, { name: 'Red', hex: '#B5452E' }], sizes: { L: true, XL: true },
        images: [img('SOLARA_1-Picsart-AiImageEnhancer.png?v=1775451944'), img('SOLARA_2-Picsart-AiImageEnhancer.png?v=1775451944'), img('SOLARARED4.png?v=1775451944')],
        short: 'Pure cotton single-piece poncho with an embroidered, hand-painted neckline.', details: 'Single-piece poncho, V neckline with embroidery and painting.', fabric: 'Hand wash or gentle home machine wash · mild detergent · dry in shade · reverse-iron, not directly on hand-work.' },
      /* ---------- Tops & tunics ---------- */
      { handle: 'lita-hand-loom-cotton-with-hand-painting-on-yoke', title: 'Lita', type: 'Tunic', category: 'Tops & tunics', price: 425000,
        technique: ['Hand painting'], fabricName: 'Handloom cotton', motif: 'Hand painting on the yoke',
        collections: ['hand-painted', 'tunics-tops'], colors: [{ name: 'Turmeric yellow', hex: '#D9A33A' }], sizes: LXL, assumed: true,
        images: [img('Lita_turmeric_yellow_4.jpg?v=1764693710'), img('Lita_turmeric_yellow_1.jpg?v=1764693710')],
        short: 'Handloom cotton tunic in turmeric yellow, hand-painted across the yoke.', details: 'Handloom cotton tunic with hand painting on the yoke.', fabric: CARE_PAINT },
      { handle: 'sakura-women-tunic-hand-painting', title: 'Sakura', type: 'Tunic', category: 'Tops & tunics', price: 369200,
        technique: ['Hand painting'], motif: 'Hand-painted blossoms',
        collections: ['hand-painted', 'tunics-tops'], colors: [{ name: 'Pink', hex: '#E3A1AE' }], sizes: LXL, assumed: true,
        images: [img('SAKURA_PINK_2.jpg?v=1764693674'), img('SAKURA_PINK_1.jpg?v=1764693674')],
        short: 'Soft pink tunic with hand-painted sakura blossoms.', details: 'Women’s tunic with hand painting.', fabric: CARE_PAINT },
      { handle: 'fern-women-tunics-hand-embroidery', title: 'Fern', type: 'Unique cut tunic', category: 'Tops & tunics', price: 400000,
        technique: ['Hand painting'], motif: 'Hand-painted fern',
        collections: ['hand-painted', 'tunics-tops'], colors: [{ name: 'White', hex: '#F2F0EA' }], sizes: LXL, assumed: true,
        images: [img('Fern_White_2.jpg?v=1764693689'), img('Fern_White_1.jpg?v=1764693689')],
        short: 'White unique-cut tunic with hand-painted fern fronds.', details: 'Unique-cut tunic with hand painting.', fabric: CARE_PAINT },
      { handle: 'urban-breeze-woman-tunic', title: 'Urban Breeze', type: 'Hoody-style tunic', category: 'Tops & tunics', price: 625000,
        technique: ['Hand painting', 'Hand thread-work'], motif: 'Thread-work with painting',
        collections: ['hand-painted', 'tunics-tops', 'dresses'], colors: [{ name: 'Pista green', hex: '#B7C99A' }], sizes: LXL, assumed: true,
        images: [img('Urban_Breeze_6.jpg?v=1764693733'), img('Urban_Breeze_1.jpg?v=1764693733')],
        short: 'Pista green hoody-style tunic with hand thread-work and painting.', details: 'Hoody-style tunic, hand thread-work with painting.', fabric: CARE_THREAD },
      { handle: 'symara-woman-tunic', title: 'Symara', type: 'Tunic', category: 'Tops & tunics', price: 343200,
        technique: ['Hand thread-work'], motif: 'Hand thread-work',
        collections: ['tunics-tops'], colors: [{ name: 'Pista green', hex: '#B7C99A' }], sizes: LXL, assumed: true,
        images: [img('Symara6.jpg?v=1764693757'), img('Symara1.jpg?v=1764693757')],
        short: 'Pista green tunic finished with hand thread-work.', details: 'Women’s tunic with hand thread-work.', fabric: CARE_THREAD },
      { handle: 'lotus-mist-women-kurti-with-side-pocket', title: 'Lotus Mist', type: 'Kurti', category: 'Tops & tunics', price: 380000,
        technique: ['Embroidery'], motif: 'Machine embroidery appliqué',
        collections: ['tunics-tops'], colors: [{ name: 'Surf blue', hex: '#8FB3CF' }], sizes: LXL, assumed: true,
        images: [img('LOTUS_MIST_SURF_BLUE_3.jpg?v=1764693640'), img('LOTUS_MIST_SURF_BLUE_6.jpg?v=1764693640')],
        short: 'Surf blue kurti with lotus appliqué and a side pocket.', details: 'Kurti with machine-embroidered appliqué and side pocket.', fabric: CARE_THREAD },
      { handle: 'anika-women-shirt-with-lace-trimmings', title: 'Anika', type: 'Shirt', category: 'Tops & tunics', price: 348400,
        technique: ['Lace'], motif: 'Lace trimmings',
        collections: ['tunics-tops'], colors: [{ name: 'Surf blue', hex: '#8FB3CF' }], sizes: LXL, assumed: true,
        images: [img('Anika_surf_blue_6.jpg?v=1764780710'), img('Anika_surf_blue_1.jpg?v=1764693587')],
        short: 'Surf blue shirt with delicate lace trimmings.', details: 'Women’s shirt with lace trimmings.', fabric: 'Mild detergent · hand wash · dry in shade.' },
      { handle: 'mosaic-single-piece-top-1', title: 'Mosaic', type: 'Single piece top', category: 'Tops & tunics', price: 500000,
        technique: ['Print'], motif: 'In-house print',
        collections: ['tunics-tops', 'upcoming'], colors: [], sizes: LXL, assumed: true,
        images: [img('CeeoOriginals59552.jpg?v=1770636546'), img('CeeoOriginals59553.jpg?v=1770636546')],
        short: 'Single-piece top from the forthcoming ensemble.', details: 'Single-piece top. Print designed in-house.', fabric: 'Mild detergent · hand wash · dry in shade.' },
      /* ---------- Co-ords ---------- */
      { handle: 'zenith-women-co-ord-set-hand-embroidery-hand-painting', title: 'Zenith', type: 'Co-ord set', category: 'Co-ord sets', price: 650000,
        technique: ['Hand thread-work'], motif: 'Hand thread-work',
        collections: ['co-ords', 'upcoming'], colors: [], sizes: LXL, assumed: true,
        images: [img('CeeoOriginals59462.jpg?v=1770637929'), img('CeeoOriginals59463.jpg?v=1770637932')],
        short: 'Women’s co-ord set with hand thread-work, from the forthcoming ensemble.', details: 'Two-piece co-ord set with hand thread-work.', fabric: CARE_THREAD },
      { handle: 'azure-women-co-ord-set', title: 'Azure', type: 'Co-ord set', category: 'Co-ord sets', price: 610000,
        technique: ['Embroidery'], motif: 'Hand embroidery',
        collections: ['co-ords', 'tunics-tops'], colors: [{ name: 'Navy blue', hex: '#1F2A55' }], sizes: LXL, assumed: true,
        images: [img('Azure_1.jpg?v=1764693777'), img('Azure_3.jpg?v=1764693777')],
        short: 'Navy blue co-ord set with hand embroidery.', details: 'Two-piece co-ord set, hand embroidered.', fabric: CARE_THREAD },
      /* ---------- Dresses ---------- */
      { handle: 'vinga-single-piece-dress', title: 'Vinea', type: 'Single piece dress', category: 'Dresses', price: 600000,
        technique: ['Hand thread-work'], motif: 'Hand thread-work',
        collections: ['dresses', 'upcoming'], colors: [], sizes: LXL, assumed: true,
        images: [img('CeeoOriginals59423.jpg?v=1770636745'), img('CeeoOriginals59435.jpg?v=1770636745')],
        short: 'Single-piece dress with hand thread-work.', details: 'Single-piece dress with hand thread-work.', fabric: CARE_THREAD },
      { handle: 'floris-single-piece-long-dress', title: 'Floris', type: 'Long dress', category: 'Dresses', price: 622500,
        technique: ['Print'], motif: 'Florals',
        collections: ['dresses', 'upcoming'], colors: [], sizes: LXL, assumed: true,
        images: [img('CeeoOriginals59595_aefa66ae-3aa9-4d7f-bbe3-4da363e21586.jpg?v=1771049421'), img('CeeoOriginals59584_4ae019d8-1cad-4c77-b92f-7e8a329ca5fa.jpg?v=1771049421')],
        short: 'Single-piece long dress from the forthcoming ensemble.', details: 'Single-piece long dress.', fabric: 'Mild detergent · hand wash · dry in shade.' },
      { handle: 'sonata-muse-woman-kurti-mini-dress', title: 'Sonata Muse', type: 'Midi dress', category: 'Dresses', price: 540000,
        technique: ['Hand thread-work'], motif: 'Hand thread-work',
        collections: ['dresses'], colors: [{ name: 'White', hex: '#F2F0EA' }], sizes: LXL, assumed: true,
        images: [img('sonata_muse_white_1.jpg?v=1765130019'), img('sonata_muse_white_2.png?v=1765130154')],
        short: 'White midi dress with hand thread-work.', details: 'Women’s midi dress with hand thread-work.', fabric: CARE_THREAD },
      { handle: 'blush-royale-woman-midi-dress', title: 'Blush Royale', type: 'Midi dress', category: 'Dresses', price: 452500,
        technique: ['Hand thread-work'], motif: 'Hand thread-work',
        collections: ['dresses'], colors: [{ name: 'Pink', hex: '#E3A1AE' }], sizes: LXL, assumed: true,
        images: [img('Blush_royale_pink_1.jpg?v=1764693789'), img('Blush_royale_pink_4.jpg?v=1764693789')],
        short: 'Pink midi dress with hand thread-work.', details: 'Women’s midi dress with hand thread-work.', fabric: CARE_THREAD },
      { handle: 'bagicha-midi-dress-digital-printed', title: 'Bagicha', type: 'Midi dress', category: 'Dresses', price: 550000,
        technique: ['Print'], motif: 'Garden print (digital)',
        collections: ['dresses', 'upcoming'], colors: [], sizes: LXL, assumed: true,
        images: [img('CeeoOriginals59517.jpg?v=1770636941'), img('CeeoOriginals59524.jpg?v=1770636941')],
        short: 'Digitally printed midi dress — a garden in bloom, designed in-house.', details: 'Midi dress, digital print designed in-house.', fabric: 'Mild detergent · hand wash · dry in shade.' },
      { handle: 'urban-muse-midi-dress-digital-printed', title: 'Urban Muse', type: 'Midi dress', category: 'Dresses', price: 500000,
        technique: ['Print'], motif: 'Digital print',
        collections: ['dresses', 'upcoming'], colors: [], sizes: LXL, assumed: true,
        images: [img('CeeoOriginals59486.jpg?v=1770637671'), img('CeeoOriginals59495.jpg?v=1770637672')],
        short: 'Digitally printed midi dress from the forthcoming ensemble.', details: 'Midi dress, digital print designed in-house.', fabric: 'Mild detergent · hand wash · dry in shade.' }
    ],
    testimonials: [
      { name: 'Sonali Kulkarni', role: 'Actress', quote: 'The print and the combination with unique cuts caught my eyes.', photo: img('Sonali.jpg?v=1773397555', 200) },
      { name: 'Carina', quote: 'I really respect the wide variety of design and the brand’s resilience to cater to different clients.', photo: img('ed6961dd-1b71-4c5c-b4f1-949573035dbc.jpg?v=1764999564', 200) },
      { name: 'Evelynn', quote: 'The unique design and materials were a standout and the reason for me buying their clothing.', photo: img('ab3f4c59-276d-4297-b4c7-12ff112a651d.jpg?v=1764999577', 200) },
      { name: 'Akshita Gala', quote: 'The material and the overall cuts and designs caught my eye.', photo: img('943ba7e6-1d77-4418-b7f4-e57d5bf1620d.jpg?v=1764999524', 200) }
    ],
    studio: {
      base: [ { id: 'natural', name: 'Off-white', hex: '#EFE9DC' }, { id: 'turquoise', name: 'Turquoise', hex: '#3E9BA6' }, { id: 'onion', name: 'Onion red', hex: '#A9564E' }, { id: 'pista', name: 'Pista green', hex: '#B7C99A' }, { id: 'turmeric', name: 'Turmeric', hex: '#D9A33A' }, { id: 'fuchsia', name: 'Fuchsia', hex: '#C2407A' } ],
      paint: [ { id: 'indigo', name: 'Indigo', hex: '#1C2A62' }, { id: 'madder', name: 'Madder red', hex: '#B5452E' }, { id: 'turmeric', name: 'Turmeric', hex: '#D99A2B' }, { id: 'leaf', name: 'Leaf green', hex: '#3F5B3A' }, { id: 'white', name: 'Chalk white', hex: '#F6F1E6' } ],
      /* Indicative "from" prices, anchored on current CEEO price points — confirm with client */
      basePrice: { kurta: 425000, dress: 685000, coord: 697500 },
      fabricAdd: { cotton: 0, linen: 50000 },
      placementAdd: { allover: 150000, border: 0, yoke: 0 }
    }
  };
  /* newest first on "new" rail */
})();
