import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for BaboucheSlipperCo...');

  try {
    const shopId = '392e1396-afac-4340-9315-349de5dd048e';
    const categoryId = '2b222222-2222-2222-2222-222222222222'; // Art

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'moroccan-waiter-art-print-traditional-tea',
        fr: 'impression-art-serveur-marocain-serveuse-the',
        ar: 'مطبوعة-فنية-نادل-مغربي-شاي-تقليدي',
        _is_seeded: true
      },
      title_translations: {
        en: 'Moroccan Waiter Art Print, Traditional Tea Waitress Illustration',
        fr: 'Impression d\'art serveur marocain, illustration de la serveuse à thé traditionnelle',
        ar: 'مطبوعة فنية نادل مغربي، رسم توضيحي لنادلة الشاي التقليدية',
        _is_seeded: true
      },
      description_translations: {
        en: 'Hand-drawn illustration of a Moroccan waiter serving traditional tea and tagine.\nOriginal artwork by IBBA©\n\n✔️ Made with museum-quality archival paper (200 gsm) for exceptional print fidelity and vibrant color reproduction.\n✔️ Carefully packaged to ensure your artwork arrives safely.',
        fr: 'Illustration dessinée à la main d\'un serveur marocain servant du thé traditionnel et du tajine.\nOeuvre d\'art originale par IBBA©\n\n✔️ Fabriqué avec du papier d\'archives de qualité muséale (200 gsm) pour une fidélité d\'impression exceptionnelle et une reproduction des couleurs éclatantes.\n✔️ Emballé avec soin pour que votre oeuvre d\'art arrive en toute sécurité.',
        ar: 'رسم توضيحي مرسوم يدويًا لنادل مغربي يقدم الشاي التقليدي والطاجين.\nعمل فني أصلي بواسطة IBBA©\n\n✔️ مصنوع من ورق أرشيفي بجودة المتاحف (200 جرامًا للمتر المربع) لدقة طباعة استثنائية واستنساخ ألوان نابض بالحياة.\n✔️ معبأ بعناية لضمان وصول عملك الفني بأمان.',
        _is_seeded: true
      },
      base_price_mad: 90.00,
      media_gallery: [
        '/afus-products/BaboucheSlipperCo/1/il_794xN.7607497158_lp6b.webp',
        '/afus-products/BaboucheSlipperCo/1/il_794xN.7607497266_1c0m.avif',
        '/afus-products/BaboucheSlipperCo/1/il_794xN.7607498192_3dts.avif',
        '/afus-products/BaboucheSlipperCo/1/il_794xN.7607510258_mxkq.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId;
    const { data: check, error: checkErr } = await supabase.from('products').select('id').eq('slug_translations->>en', product1Payload.slug_translations.en);
    if (checkErr) throw checkErr;

    if (check && check.length > 0) {
      pId = check[0].id;
      const { error: updErr } = await supabase.from('products').update(product1Payload).eq('id', pId);
      if (updErr) throw updErr;
      console.log(`Updated existing Product: ${pId} (${product1Payload.slug_translations.en})`);
    } else {
      const { data: newP, error: insErr } = await supabase.from('products').insert(product1Payload).select('id').single();
      if (insErr) throw insErr;
      pId = newP.id;
      console.log(`Inserted Product: ${pId} (${product1Payload.slug_translations.en})`);
    }

    const sizes = [
      { size: '13 x 18 cm', price: null }, // Maps to base price (90)
      { size: '20 x 25 cm', price: 110 },
      { size: '28 x 35 cm', price: 130 },
      { size: '30 x 40 cm', price: 150 },
      { size: '40 x 50 cm', price: 170 },
      { size: '50 x 75 cm', price: 190 },
      { size: '60 x 90 cm', price: 210 }
    ];

    for (let i = 0; i < sizes.length; i++) {
      const s = sizes[i];
      const skuSuffix = s.size.replace(/ /g, '').toUpperCase();
      const variant = {
        product_id: pId,
        sku: `BAB-ART-${skuSuffix}`,
        price_override_mad: s.price,
        stock_quantity: 50,
        attributes: {
          en: { size: s.size },
          fr: { taille: s.size },
          ar: { المقاس: s.size },
          _is_seeded: true
        }
      };

      const { data: vCheck } = await supabase.from('product_variants').select('id').eq('sku', variant.sku);
      if (vCheck && vCheck.length > 0) {
        await supabase.from('product_variants').update(variant).eq('id', vCheck[0].id);
        console.log(`Updated existing Variant ${variant.sku}`);
      } else {
        await supabase.from('product_variants').insert(variant);
        console.log(`Inserted Variant ${variant.sku}`);
      }
    }

    console.log('Live Database Seed for BaboucheSlipperCo Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
