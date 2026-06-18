import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for TamegrouteSaharaGlaze...');

  try {
    const shopId = 'baf0e920-9a1f-44b1-85f9-15c43965cc69';
    const categoryId = '2b222222-2222-2222-2222-222222222222'; // Art & Collectibles

    // PRODUCT 1
    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'amazigh-woman-art-print-zellige-caftan',
        fr: 'impression-art-femme-amazighe-marocaine-zellige',
        ar: 'مطبوعة-فنية-امرأة-أمازيغية-مغربية-زليج',
        _is_seeded: true
      },
      title_translations: {
        en: 'Moroccan Amazigh Woman Art Print, Zellige Mosaic Background, Traditional Caftan Decor',
        fr: 'Impression d\'art femme amazighe marocaine, fond mosaïque zelliges, décor caftan traditionnel',
        ar: 'مطبوعة فنية لامرأة أمازيغية مغربية، خلفية فسيفساء الزليج، ديكور قفطان تقليدي',
        _is_seeded: true
      },
      description_translations: {
        en: 'Faceless portrait of a tattooed Moroccan Amazigh woman, she wears traditional clothes: a caftan, a scarf called Sebniya, an Amazigh necklace, and a bracelet.\nThe background is Moroccan zellige, a mosaic style made from individually hand-chiseled tiles. It is found in Moroccan architecture in mosques, historical monuments, and riads.',
        fr: 'Portrait sans visage d\'une femme amazighe marocaine tatouée, elle porte des vêtements traditionnels : un caftan, un foulard appelé Sebniya, un collier amazigh et un bracelet.\nL\'arrière-plan est du zellige marocain, un style de mosaïque fabriqué à partir de carreaux ciselés individuellement à la main. On le trouve dans l\'architecture marocaine dans les mosquées, les monuments historiques et les riads.',
        ar: 'صورة بدون وجه لامرأة أمازيغية مغربية موشومة، ترتدي ملابس تقليدية: قفطان، ووشاح يسمى "سبنية"، وعقد أمازيغي وسوار.\nالخلفية عبارة عن زليج مغربي، وهو نمط فسيفساء مصنوع من بلاط منحوت يدويًا بشكل فردي. يوجد في العمارة المغربية في المساجد والمعالم التاريخية والرياض.',
        _is_seeded: true
      },
      base_price_mad: 90.00,
      media_gallery: [
        '/afus-products/TamegrouteSaharaGlaze/1/il_794xN.8111336138_jsjk.webp',
        '/afus-products/TamegrouteSaharaGlaze/1/il_794xN.8111339510_slcr.webp',
        '/afus-products/TamegrouteSaharaGlaze/1/il_794xN.8159239501_7439.webp',
        '/afus-products/TamegrouteSaharaGlaze/1/il_794xN.8159258419_hgxy.webp',
        '/afus-products/TamegrouteSaharaGlaze/1/il_794xN.8165808233_9qva.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId1;
    const { data: check1, error: checkErr1 } = await supabase.from('products').select('id').eq('slug_translations->>en', product1Payload.slug_translations.en);
    if (checkErr1) throw checkErr1;

    if (check1 && check1.length > 0) {
      pId1 = check1[0].id;
      await supabase.from('products').update(product1Payload).eq('id', pId1);
      console.log(`Updated existing Product 1: ${pId1}`);
    } else {
      const { data: newP1 } = await supabase.from('products').insert(product1Payload).select('id').single();
      pId1 = newP1.id;
      console.log(`Inserted Product 1: ${pId1}`);
    }

    const sizes = [
      { size: '13 x 18 cm', price: null }, // Base price 90
      { size: '20 x 25 cm', price: 110 },
      { size: '28 x 35 cm', price: 130 },
      { size: '30 x 40 cm', price: 150 },
      { size: '40 x 50 cm', price: 170 },
      { size: '50 x 75 cm', price: 190 },
      { size: '60 x 90 cm', price: 210 }
    ];

    for (const s of sizes) {
      const skuSuffix = s.size.replace(/ /g, '').toUpperCase();
      const variant = {
        product_id: pId1,
        sku: `TAM-ART-${skuSuffix}`,
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
      } else {
        await supabase.from('product_variants').insert(variant);
      }
    }


    // PRODUCT 2
    const product2Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'custom-moroccan-aluminum-professional-sign',
        fr: 'plaque-professionnelle-marocaine-personnalisee-aluminium',
        ar: 'لوحة-مهنية-مغربية-مخصصة-ألومنيوم',
        _is_seeded: true,
        _is_personalizable: true
      },
      title_translations: {
        en: 'Custom Moroccan Aluminum Professional Sign | Hand-painted Naive Art',
        fr: 'Plaque professionnelle marocaine personnalisée en aluminium | Art naïf peint à la main',
        ar: 'لوحة مهنية مغربية مخصصة من الألومنيوم | فن ساذج مرسوم يدويًا',
        _is_seeded: true,
        _is_personalizable: true
      },
      description_translations: {
        en: 'Bring the colors and charm of Morocco to your space with this hand-painted aluminum sign, inspired by traditional naive art from Marrakech. Each piece is completely hand-painted, making it a unique and meaningful work of art.\n\nMADE TO ORDER - FULLY CUSTOMIZABLE\n\nYou can customize your plaque with:\n- Any profession (doctor, engineer, teacher, DJ, etc.)\n- Any text (Arabic / English / French)\n- Male or female illustration\n- Background color of your choice\n- Additional objects or scene details\n\nIdeal as a gift, office decoration, coffee shop display, home wall art, or cultural souvenir.\n\nMATERIALS\n- Aluminum plate (solid, light, rust-resistant)\n- Acrylic paint\n- Hand-drawn illustrations\n- Protective varnish (glossy or matte)\n\nENABLE PERSONALIZATION :\n1. In the personalization box, write:\n- Profession\n- Text (Arabic/French/English)\n- Background color\n- Male or female\n- Additional details\n2. I can send you a sketch before painting if you wish (optional).',
        fr: 'Apportez les couleurs et le charme du Maroc dans votre espace avec cette enseigne en aluminium peinte à la main, inspirée de l\'art naïf traditionnel de Marrakech. Chaque pièce est entièrement peinte à la main, ce qui en fait une œuvre d\'art unique et significative.\n\nSUR COMMANDE – ENTIÈREMENT PERSONNALISABLE\n\nVous pouvez personnaliser votre plaque avec :\n- Toute profession (médecin, ingénieur, enseignant, DJ, etc.)\n- Tout texte (arabe / anglais / français)\n- Illustration masculine ou féminine\n- Couleur de fond au choix\n- Objets supplémentaires ou détails de la scène\n\nIdéal comme cadeau, décoration de bureau, présentation de café, oeuvre d\'art murale pour la maison ou souvenir culturel.\n\nMATÉRIAUX\n- Plaque en aluminium (solide, légère, résistante à la rouille)\n- Peinture acrylique\n- Illustrations dessinées à la main\n- Vernis protecteur (brillant ou mat)\n\nENABLE PERSONALIZATION : Personnalisation\n1. Dans la zone de personnalisation, écrivez :\n- Profession\n- Texte (arabe/français/anglais)\n- Couleur d\'arrière-plan\n- Homme ou femme\n- Des détails supplémentaires\n2. Je peux vous envoyer un croquis avant de peindre si vous le souhaitez (facultatif).',
        ar: 'أضف ألوان وسحر المغرب إلى مساحتك مع هذه اللوحة المصنوعة من الألومنيوم والمرسومة يدويًا، والمستوحاة من الفن الساذج التقليدي في مراكش. كل قطعة مرسومة يدويًا بالكامل، مما يجعلها عملًا فنيًا فريدًا وذا مغزى.\n\nحسب الطلب - قابلة للتخصيص بالكامل\n\nيمكنك تخصيص لوحتك بـ:\n- أي مهنة (طبيب، مهندس، مدرس، دي جي، إلخ)\n- أي نص (عربي / إنجليزي / فرنسي)\n- رسم للذكور أو الإناث\n- لون الخلفية الذي تختاره\n- أشياء إضافية أو تفاصيل المشهد\n\nمثالية كهدية، أو ديكور للمكتب، أو عرض في مقهى، أو لوحة فنية جدارية للمنزل، أو تذكار ثقافي.\n\nالمواد\n- لوحة ألومنيوم (صلبة وخفيفة ومقاومة للصدأ)\n- طلاء أكريليك\n- رسوم توضيحية مرسومة يدويًا\n- ورنيش واقي (لامع أو غير لامع)\n\nتفعيل التخصيص:\n1. في مربع التخصيص، اكتب:\n- المهنة\n- النص (عربي/فرنسي/إنجليزي)\n- لون الخلفية\n- ذكر أم أنثى\n- تفاصيل إضافية\n2. يمكنني أن أرسل لك رسمًا تخطيطيًا قبل الرسم إذا كنت ترغب في ذلك (اختياري).',
        _is_seeded: true,
        _is_personalizable: true
      },
      base_price_mad: 90.00,
      media_gallery: [
        '/afus-products/TamegrouteSaharaGlaze/2/il_794xN.7460062892_rv5f.webp',
        '/afus-products/TamegrouteSaharaGlaze/2/il_794xN.7507991869_mktz.webp',
        '/afus-products/TamegrouteSaharaGlaze/2/il_794xN.7507992277_2n3u.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId2;
    const { data: check2, error: checkErr2 } = await supabase.from('products').select('id').eq('slug_translations->>en', product2Payload.slug_translations.en);
    if (checkErr2) throw checkErr2;

    if (check2 && check2.length > 0) {
      pId2 = check2[0].id;
      await supabase.from('products').update(product2Payload).eq('id', pId2);
      console.log(`Updated existing Product 2: ${pId2}`);
    } else {
      const { data: newP2 } = await supabase.from('products').insert(product2Payload).select('id').single();
      pId2 = newP2.id;
      console.log(`Inserted Product 2: ${pId2}`);
    }

    const variant2 = {
      product_id: pId2,
      sku: `TAM-SIGN-15X20`,
      price_override_mad: null,
      stock_quantity: 50,
      attributes: {
        en: { size: 'Width: 15cm / Height: 20cm' },
        fr: { taille: 'Largeur: 15 cm / Hauteur: 20 cm' },
        ar: { المقاس: 'العرض: 15 سم / الارتفاع: 20 سم' },
        _is_seeded: true,
        _is_personalizable: true
      }
    };

    const { data: vCheck2 } = await supabase.from('product_variants').select('id').eq('sku', variant2.sku);
    if (vCheck2 && vCheck2.length > 0) {
      await supabase.from('product_variants').update(variant2).eq('id', vCheck2[0].id);
    } else {
      await supabase.from('product_variants').insert(variant2);
    }

    console.log('Live Database Seed for TamegrouteSaharaGlaze Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
