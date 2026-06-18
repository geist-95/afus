import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for RoyalMarrakeshLeather...');

  try {
    const shopId = '690a45c8-b1aa-4f71-a9a5-d4cd3c97741e';
    const categoryId = '6f666666-6666-6666-6666-666666666666'; // Home & Living

    const productPayload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-moroccan-terracotta-mejmer-brazier',
        fr: 'brasero-marocain-mejmer-terre-cuite-fait-main',
        ar: 'موقد-مغربي-مجمر-تراكوتا-مصنوع-يدويا',
        _is_seeded: true
      },
      title_translations: {
        en: 'Handmade Moroccan Terracotta Mejmer Brazier',
        fr: 'Brasero marocain mejmer en terre cuite fait main',
        ar: 'موقد مجمر مغربي مصنوع يدويًا من الطين',
        _is_seeded: true
      },
      description_translations: {
        en: 'The terracotta Moroccan mejmer is a traditional artisanal brazier, shaped by hand according to ancestral know-how. Made from natural baked clay, it combines authenticity and functionality. Used for generations in Morocco, it is used for both slow cooking of dishes and warming up the atmosphere during convivial evenings.\n\nThanks to its terracotta design, it diffuses a gentle and even heat, ideal for grilling, simmering, or simply enjoying a warm fire. Its practical shape and rustic style make it a unique decorative object that brings a touch of oriental authenticity to your interior, terrace, or garden.\n\nDelivery to relay points.',
        fr: 'Le mejmer marocain en terre cuite est un brasero traditionnel artisanal, façonné à la main selon un savoir-faire ancestral. Réalisé en argile naturelle cuite au four, il allie authenticité et fonctionnalité. Utilisé depuis des générations au Maroc, il sert aussi bien à la cuisson lente des mets qu’à réchauffer l’ambiance lors des soirées conviviales.\n\nGrâce à sa conception en terre cuite, il diffuse une chaleur douce et homogène, idéale pour griller, mijoter ou simplement profiter d’un feu chaleureux. Sa forme pratique et son style rustique en font un objet décoratif unique qui apporte une touche d’authenticité orientale à votre intérieur, terrasse ou jardin.\n\nLivraison en point relais',
        ar: 'المجمر المغربي المصنوع من الطين هو موقد تقليدي حرفي، تم تشكيله يدويًا وفقًا للمعرفة الفنية المتوارثة. مصنوع من الطين الطبيعي المخبوز، يجمع بين الأصالة والوظيفة. يستخدم لأجيال في المغرب، ويستخدم للطهي البطيء للأطباق وكذلك لتدفئة الأجواء خلال الأمسيات المبهجة.\n\nبفضل تصميمه من الطين، يوزع حرارة لطيفة ومتساوية، وهو مثالي للشواء، أو الغليان، أو مجرد الاستمتاع بنار دافئة. شكله العملي وأسلوبه الريفي يجعله عنصرًا زخرفيًا فريدًا يضفي لمسة من الأصالة الشرقية على ديكورك الداخلي، أو التراس، أو الحديقة.\n\nالتوصيل إلى نقاط التتابع.',
        _is_seeded: true
      },
      base_price_mad: 99.00,
      media_gallery: [
        '/afus-products/RoyalMarrakeshLeather/1/il_794xN.7216139105_i2t1.avif',
        '/afus-products/RoyalMarrakeshLeather/1/VID_20250903_135238_398_keqqkx.mp4',
        '/afus-products/RoyalMarrakeshLeather/1/il_794xN.7216139689_qzoq.avif',
        '/afus-products/RoyalMarrakeshLeather/1/il_794xN.7216140707_nrlw.avif'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId;
    const { data: check, error: checkErr } = await supabase.from('products').select('id').eq('slug_translations->>en', productPayload.slug_translations.en);
    if (checkErr) throw checkErr;

    if (check && check.length > 0) {
      pId = check[0].id;
      await supabase.from('products').update(productPayload).eq('id', pId);
      console.log(`Updated existing Product: ${pId}`);
    } else {
      const { data: newP } = await supabase.from('products').insert(productPayload).select('id').single();
      pId = newP.id;
      console.log(`Inserted Product: ${pId}`);
    }

    const sizes = [
      { size: '22cm', price: null }, // Base price 99
      { size: '31cm', price: 149 }
    ];

    for (const s of sizes) {
      const variant = {
        product_id: pId,
        sku: `ROY-MEJMER-${s.size}`,
        price_override_mad: s.price,
        stock_quantity: 50,
        attributes: {
          en: { diameter: s.size },
          fr: { diamètre: s.size },
          ar: { القطر: s.size },
          _is_seeded: true
        }
      };

      const { data: vCheck } = await supabase.from('product_variants').select('id').eq('sku', variant.sku);
      if (vCheck && vCheck.length > 0) {
        await supabase.from('product_variants').update(variant).eq('id', vCheck[0].id);
      } else {
        await supabase.from('product_variants').insert(variant);
      }
    }

    console.log('Live Database Seed for RoyalMarrakeshLeather Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
