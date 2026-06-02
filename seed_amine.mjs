import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Known category IDs from the schema seed
const CATEGORY_IDS = {
  jewelry:     '1a111111-1111-1111-1111-111111111111',
  art:         '2b222222-2222-2222-2222-222222222222',
  beauty:      '3c333333-3333-3333-3333-333333333333',
  clothing:    '4d444444-4444-4444-4444-444444444444',
  bags:        '5e555555-5555-5555-5555-555555555555',
  homeLiving:  '6f666666-6666-6666-6666-666666666666',
};

async function seed() {
  console.log('🔍 Looking up amine@yopmail.com in auth.users...');

  // 1. Find the auth user
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) { console.error('❌ listUsers error:', listErr); process.exit(1); }

  let authUser = users.find(u => u.email === 'amine@yopmail.com');
  if (!authUser) {
    console.log('👤 Auth user not found — creating via admin API...');
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: 'amine@yopmail.com',
      password: 'Amine1234!',
      email_confirm: true,
    });
    if (createErr) { console.error('❌ createUser error:', createErr); process.exit(1); }
    authUser = created.user;
    console.log(`✅ Auth user created: ${authUser.id}`);
  } else {
    console.log(`✅ Found existing auth user: ${authUser.id}`);
  }
  const userId = authUser.id;
  console.log(`✅ Found auth user: ${userId}`);

  // 2. Upsert profile
  const { error: profErr } = await supabase.from('profiles').upsert({
    id: userId,
    email: 'amine@yopmail.com',
    full_name: 'Amine Seller',
    role: 'seller',
    phone_number: '+212600000001',
    preferred_language: 'fr',
  }, { onConflict: 'id' });
  if (profErr) { console.error('❌ Profile upsert error:', profErr); process.exit(1); }
  console.log('✅ Profile upserted');

  // 3. Upsert shop
  const shopId = 'aaaa0000-0000-0000-0000-000000000001';
  const { error: shopErr } = await supabase.from('shops').upsert({
    id: shopId,
    owner_id: userId,
    name: 'Boutique Amine',
    slug: 'boutique-amine',
    description_translations: {
      en: 'A curated Moroccan artisan shop featuring handcrafted jewelry, bags, and home décor.',
      fr: 'Une boutique artisanale marocaine avec des bijoux faits main, sacs et objets de décoration.',
      ar: 'متجر حرفي مغربي يضم مجوهرات وحقائب وديكور منزلي مصنوعة يدويًا.',
    },
    store_policy_translations: {
      en: 'All sales are final. Returns accepted within 7 days for damaged items only.',
      fr: 'Toutes les ventes sont définitives. Retours acceptés sous 7 jours pour articles endommagés uniquement.',
      ar: 'جميع المبيعات نهائية. يُقبل الإرجاع خلال 7 أيام للمنتجات التالفة فقط.',
    },
    faq_translations: {
      en: [{ q: 'Do you ship nationwide?', a: 'Yes, we ship to all cities in Morocco via Amana.' }],
      fr: [{ q: 'Livrez-vous partout au Maroc?', a: 'Oui, nous livrons dans toutes les villes via Amana.' }],
      ar: [{ q: 'هل تشحنون لجميع أنحاء المغرب؟', a: 'نعم، نشحن لجميع المدن عبر أمانة.' }],
    },
    merchant_city: 'Casablanca',
    pickup_address_street: '12 Rue Hassan II, Maarif, Casablanca',
    ice_number: '123456789000001',
    is_verified: true,
  }, { onConflict: 'id' });
  if (shopErr) { console.error('❌ Shop upsert error:', shopErr); process.exit(1); }
  console.log('✅ Shop upserted:', shopId);

  // 4. Seed products
  const products = [
    {
      id: 'bbbb0001-0000-0000-0000-000000000001',
      shop_id: shopId,
      category_id: CATEGORY_IDS.jewelry,
      slug_translations: { en: 'silver-berber-bracelet', fr: 'bracelet-berbere-argent', ar: 'سوار-امازيغي-فضي' },
      title_translations: { en: 'Silver Berber Bracelet', fr: 'Bracelet Berbère en Argent', ar: 'سوار أمازيغي فضي' },
      description_translations: {
        en: 'Handcrafted sterling silver bracelet with authentic Berber engravings. Each piece is unique.',
        fr: 'Bracelet en argent massif orné de gravures berbères authentiques. Chaque pièce est unique.',
        ar: 'سوار فضي مصنوع يدويًا بنقوش أمازيغية أصيلة. كل قطعة فريدة من نوعها.',
      },
      base_price_mad: 280,
      stock_quantity: 15,
      media_gallery: [],
    },
    {
      id: 'bbbb0002-0000-0000-0000-000000000002',
      shop_id: shopId,
      category_id: CATEGORY_IDS.bags,
      slug_translations: { en: 'woven-leather-kilim-bag', fr: 'sac-kilim-cuir-tisse', ar: 'حقيبة-كيليم-جلدية-منسوجة' },
      title_translations: { en: 'Woven Leather Kilim Bag', fr: 'Sac Kilim en Cuir Tressé', ar: 'حقيبة كيليم جلدية منسوجة' },
      description_translations: {
        en: 'Traditional Moroccan kilim bag in hand-tanned leather with geometric patterns.',
        fr: 'Sac kilim marocain traditionnel en cuir tanné à la main avec des motifs géométriques.',
        ar: 'حقيبة كيليم مغربية تقليدية من الجلد المدبوغ يدويًا بنقوش هندسية.',
      },
      base_price_mad: 450,
      stock_quantity: 8,
      media_gallery: [],
    },
    {
      id: 'bbbb0003-0000-0000-0000-000000000003',
      shop_id: shopId,
      category_id: CATEGORY_IDS.homeLiving,
      slug_translations: { en: 'hand-painted-zellige-bowl', fr: 'bol-zellige-peint-main', ar: 'طاسة-زليج-مرسومة-يدويا' },
      title_translations: { en: 'Hand-Painted Zellige Bowl', fr: 'Bol Zellige Peint à la Main', ar: 'طاسة زليج مرسومة يدويًا' },
      description_translations: {
        en: 'Ceramic bowl inspired by traditional Moroccan zellige tilework. Oven and microwave safe.',
        fr: 'Bol en céramique inspiré du zellige marocain traditionnel. Compatible four et micro-ondes.',
        ar: 'طاسة سيراميك مستوحاة من فن الزليج المغربي التقليدي. مناسبة للفرن والميكروويف.',
      },
      base_price_mad: 195,
      stock_quantity: 20,
      media_gallery: [],
    },
    {
      id: 'bbbb0004-0000-0000-0000-000000000004',
      shop_id: shopId,
      category_id: CATEGORY_IDS.beauty,
      slug_translations: { en: 'argan-oil-pure-50ml', fr: 'huile-argan-pure-50ml', ar: 'زيت-أركان-نقي-50مل' },
      title_translations: { en: 'Pure Argan Oil 50ml', fr: 'Huile d\'Argan Pure 50ml', ar: 'زيت أركان نقي 50 مل' },
      description_translations: {
        en: 'Cold-pressed, 100% organic argan oil from the Souss region. Great for skin and hair.',
        fr: 'Huile d\'argan 100% bio pressée à froid de la région du Souss. Idéale pour la peau et les cheveux.',
        ar: 'زيت أركان عضوي 100٪ معصور على البارد من منطقة سوس. رائع للبشرة والشعر.',
      },
      base_price_mad: 120,
      stock_quantity: 40,
      media_gallery: [],
    },
    {
      id: 'bbbb0005-0000-0000-0000-000000000005',
      shop_id: shopId,
      category_id: CATEGORY_IDS.clothing,
      slug_translations: { en: 'embroidered-kaftan-blue', fr: 'kaftan-brode-bleu', ar: 'قفطان-مطرز-ازرق' },
      title_translations: { en: 'Embroidered Kaftan – Blue', fr: 'Kaftan Brodé – Bleu', ar: 'قفطان مطرز – أزرق' },
      description_translations: {
        en: 'Elegant hand-embroidered Moroccan kaftan in cobalt blue with gold thread detail.',
        fr: 'Élégant kaftan marocain brodé main en bleu cobalt avec des fils dorés.',
        ar: 'قفطان مغربي أنيق مطرز يدويًا باللون الأزرق الكوبالت مع تفاصيل من الخيوط الذهبية.',
      },
      base_price_mad: 890,
      stock_quantity: 5,
      media_gallery: [],
    },
    {
      id: 'bbbb0006-0000-0000-0000-000000000006',
      shop_id: shopId,
      category_id: CATEGORY_IDS.art,
      slug_translations: { en: 'watercolor-medina-print', fr: 'tableau-medina-aquarelle', ar: 'لوحة-مدينة-مائية' },
      title_translations: { en: 'Medina Watercolor Print', fr: 'Tableau Médina Aquarelle', ar: 'لوحة مدينة بالألوان المائية' },
      description_translations: {
        en: 'A4 archival watercolor print of a Moroccan medina alley. Signed and numbered edition.',
        fr: 'Impression aquarelle A4 d\'une ruelle de médina marocaine. Édition signée et numérotée.',
        ar: 'طباعة أرشيفية A4 بالألوان المائية لزقاق مدينة مغربية. إصدار موقع ومرقم.',
      },
      base_price_mad: 160,
      stock_quantity: 12,
      media_gallery: [],
    },
    {
      id: 'bbbb0007-0000-0000-0000-000000000007',
      shop_id: shopId,
      category_id: CATEGORY_IDS.jewelry,
      slug_translations: { en: 'gold-plated-hamsa-necklace', fr: 'collier-hamsa-dore', ar: 'قلادة-خمسة-مذهبة' },
      title_translations: { en: 'Gold-Plated Hamsa Necklace', fr: 'Collier Khamsa Doré', ar: 'قلادة خمسة مذهبة' },
      description_translations: {
        en: 'Delicate 18k gold-plated hamsa pendant on a fine chain. A symbol of protection and luck.',
        fr: 'Pendentif khamsa en plaqué or 18k sur une chaîne fine. Symbole de protection et de chance.',
        ar: 'قلادة خمسة مطلية بالذهب عيار 18 قيراط على سلسلة رفيعة. رمز للحماية والحظ.',
      },
      base_price_mad: 210,
      stock_quantity: 22,
      media_gallery: [],
    },
    {
      id: 'bbbb0008-0000-0000-0000-000000000008',
      shop_id: shopId,
      category_id: CATEGORY_IDS.homeLiving,
      slug_translations: { en: 'beni-ourain-wool-cushion', fr: 'coussin-laine-beni-ouarain', ar: 'وسادة-صوف-بني-وراين' },
      title_translations: { en: 'Beni Ourain Wool Cushion', fr: 'Coussin Laine Beni Ouarain', ar: 'وسادة صوف بني وراين' },
      description_translations: {
        en: '45x45 cm cushion cover woven in authentic Beni Ourain wool with geometric diamond motifs.',
        fr: 'Housse de coussin 45x45 cm tissée en laine Beni Ouarain authentique avec motifs diamants géométriques.',
        ar: 'غطاء وسادة 45×45 سم منسوج بصوف بني وراين الأصيل بنقوش ماسية هندسية.',
      },
      base_price_mad: 340,
      stock_quantity: 10,
      media_gallery: [],
    },
  ];

  const { error: prodErr } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (prodErr) { console.error('❌ Products upsert error:', prodErr); process.exit(1); }
  console.log(`✅ ${products.length} products seeded`);

  // 5. Seed a couple of variants for the bracelet and kaftan
  const variants = [
    {
      id: 'cccc0001-0000-0000-0000-000000000001',
      product_id: 'bbbb0001-0000-0000-0000-000000000001',
      sku: 'BRACE-S',
      stock_quantity: 8,
      attributes: { en: { size: 'S (16cm)' }, fr: { taille: 'S (16cm)' }, ar: { المقاس: 'S (16cm)' } },
    },
    {
      id: 'cccc0002-0000-0000-0000-000000000002',
      product_id: 'bbbb0001-0000-0000-0000-000000000001',
      sku: 'BRACE-L',
      stock_quantity: 7,
      attributes: { en: { size: 'L (19cm)' }, fr: { taille: 'L (19cm)' }, ar: { المقاس: 'L (19cm)' } },
    },
    {
      id: 'cccc0003-0000-0000-0000-000000000003',
      product_id: 'bbbb0005-0000-0000-0000-000000000005',
      sku: 'KAFTAN-S',
      stock_quantity: 2,
      attributes: { en: { size: 'S' }, fr: { taille: 'S' }, ar: { المقاس: 'S' } },
    },
    {
      id: 'cccc0004-0000-0000-0000-000000000004',
      product_id: 'bbbb0005-0000-0000-0000-000000000005',
      sku: 'KAFTAN-M',
      price_override_mad: 920,
      stock_quantity: 2,
      attributes: { en: { size: 'M' }, fr: { taille: 'M' }, ar: { المقاس: 'M' } },
    },
    {
      id: 'cccc0005-0000-0000-0000-000000000005',
      product_id: 'bbbb0005-0000-0000-0000-000000000005',
      sku: 'KAFTAN-L',
      price_override_mad: 950,
      stock_quantity: 1,
      attributes: { en: { size: 'L' }, fr: { taille: 'L' }, ar: { المقاس: 'L' } },
    },
  ];

  const { error: varErr } = await supabase.from('product_variants').upsert(variants, { onConflict: 'id' });
  if (varErr) { console.error('❌ Variants upsert error:', varErr); process.exit(1); }
  console.log(`✅ ${variants.length} product variants seeded`);

  console.log('\n🎉 Seeding complete for amine@yopmail.com!');
  console.log('   Shop: Boutique Amine (slug: boutique-amine)');
  console.log('   Products: 8 items across jewelry, bags, beauty, clothing, art, home-living');
}

seed().catch(console.error);
