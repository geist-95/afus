import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for BeniOurainBoutique 3 and 4...');

  try {
    const shopId = '9b143143-8517-410f-b502-3b24d837ff49';
    const categoryId = '4d444444-4444-4444-4444-444444444444'; // Clothing

    // PRODUCT 3
    const product3Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-velvet-jacket-suzani-embroidery',
        fr: 'veste-velours-broderie-suzani-boheme',
        ar: 'سترة-مخملية-تطريز-سوزاني-بوهيمي',
        _is_seeded: true
      },
      title_translations: {
        en: 'Handmade Velvet Jacket with Suzani Embroidery, Boho Floral Coat',
        fr: 'Veste faite main en velours avec broderie Suzani, manteau à fleurs style bohème',
        ar: 'سترة مخملية مصنوعة يدويًا بتطريز سوزاني، معطف بوهيمي بالزهور',
        _is_seeded: true
      },
      description_translations: {
        en: 'Welcome !!!\n\nBoho short velvet jacket Suzani coat, hand embroidered short jacket, bohemian clothing women\'s wear.\n\nJacket made with new quilted kantha Suzani fabric which is fresh and new. This kantha fabric is hand-stitched and that is the specialty of this piece. This jacket is not reversible. Wear it with any black and white dress or jeans to add color and beauty.\n\nShow off your bold style with our velvet jacket! This dynamic piece combines an explosive design with superior comfort. Made from premium materials, it is perfect for any adventure or casual outing.',
        fr: 'Bienvenue !!!\n\nVeste courte bohème en velours manteau Suzani, veste courte brodée à la main, vêtements bohèmes vêtements femme robe de mariée bain veste Suzani en velours\n\nVeste faite avec le nouveau tissu matelassé kantha Suzani Jacket qui est frais et neuf. Ce tissu kantha est cousu à la main et c\'est la spécialité de cette pièce. Cette veste n\'est pas réversible. Portez-la avec n\'importe quelle robe noire et blanche ou avec un jean pour ajouter de la couleur et de la beauté.\n\nAffichez votre style audacieux avec notre veste en velours ! Cette pièce dynamique associe un design explosif à un confort supérieur. Fabriqué à partir de matériaux de qualité supérieure, il est parfait pour toutes les aventures ou sorties décontractées.',
        ar: 'مرحباً !!!\n\nسترة قصيرة بوهيمية من المخمل سوزاني، سترة قصيرة مطرزة يدوياً، ملابس بوهيمية للنساء.\n\nسترة مصنوعة من قماش كانثا سوزاني المبطن الجديد وهو طازج وجديد. يتم خياطة نسيج كانثا هذا يدويًا وهذا هو تخصص هذه القطعة. هذا الجاكيت غير قابل للعكس. ارتديه مع أي فستان أبيض وأسود أو جينز لإضافة اللون والجمال.\n\nأظهر أسلوبك الجريء مع سترة المخمل لدينا! تجمع هذه القطعة الديناميكية بين التصميم المذهل والراحة الفائقة. مصنوعة من مواد عالية الجودة، وهي مثالية لأي مغامرة أو نزهة غير رسمية.',
        _is_seeded: true
      },
      base_price_mad: 570.00,
      media_gallery: [
        '/afus-products/BeniOurainBoutique/3/il_794xN.7254922730_2lh4.webp',
        '/afus-products/BeniOurainBoutique/3/il_794xN.7254925100_3jp6.webp',
        '/afus-products/BeniOurainBoutique/3/il_794xN.7302868731_o1in.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId3;
    const { data: check3, error: checkErr3 } = await supabase.from('products').select('id').eq('slug_translations->>en', product3Payload.slug_translations.en);
    if (checkErr3) throw checkErr3;

    if (check3 && check3.length > 0) {
      pId3 = check3[0].id;
      await supabase.from('products').update(product3Payload).eq('id', pId3);
      console.log(`Updated existing Product 3: ${pId3}`);
    } else {
      const { data: newP3 } = await supabase.from('products').insert(product3Payload).select('id').single();
      pId3 = newP3.id;
      console.log(`Inserted Product 3: ${pId3}`);
    }

    const sizes3 = ['S', 'M', 'L', 'XL'];
    for (const size of sizes3) {
      const variant = {
        product_id: pId3,
        sku: `BENI-VELVET-${size}`,
        price_override_mad: null,
        stock_quantity: 50,
        attributes: {
          en: { size: size },
          fr: { taille: size },
          ar: { المقاس: size },
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


    // PRODUCT 4
    const product4Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'tiger-animal-print-velvet-fabric-by-meter',
        fr: 'velours-animal-tigre-imprime-tissu-par-metre',
        ar: 'قماش-مخملي-بطبعة-نمر-بالمتر',
        _is_seeded: true
      },
      title_translations: {
        en: 'Tiger Animal Print Velvet Fabric By The Meter, Interior Decor, Curtains & Crafts',
        fr: 'Velours animal tigre imprimé tout tissu par mètre décoration d\'intérieur et robe, fabrication de rideaux, couture artisanat',
        ar: 'قماش مخملي بطبعة حيوان النمر بالمتر، ديكور داخلي، ستائر وحرف يدوية',
        _is_seeded: true
      },
      description_translations: {
        en: 'Item Description\nItem - by the meter velvet fabric\nFabric Width: Up to 44 in.\nPattern - Bird, Floral, Tiger\nFabric - Lightweight 100% Velvet fabric.\n\nThe beautiful crushed flocked velvet fabric has a very elegant texture. The fabric is very strong and durable, allowing for tough upholstery jobs.\nThe fabric is sold by continuous yardage.\nUses: upholstery, drapery, headboards, pillows, crafts and much more.',
        fr: 'Description de l\'article\nArticle - par mètre de tissu velours\nLargeur du tissu : jusqu\'à 44 po.\nMotif - Oiseau, Floral, Tigre\nTissu - Tissu léger 100 % velours.\n\nLe beau tissu velours floqué écrasé peut avoir une texture très élégante. Le tissu est très solide et durable, ce qui permet des travaux de rembourrage difficiles.\nLe tissu est vendu en métrage continu.\nUtilisations : tissus d\'ameublement, tentures, têtes de lit, oreillers, travaux manuels et bien plus encore.',
        ar: 'وصف السلعة\nالسلعة - قماش مخملي بالمتر\nعرض القماش: حتى 44 بوصة.\nالنمط - طائر، زهور، نمر\nالقماش - نسيج مخملي خفيف الوزن 100٪.\n\nالنسيج المخملي المتدفق الجميل ذو ملمس أنيق للغاية. النسيج قوي جدًا ومتين، مما يسمح بمهام التنجيد الصعبة.\nيُباع القماش بساحات متصلة.\nالاستخدامات: التنجيد والستائر والألواح الأمامية والوسائد والحرف اليدوية وغير ذلك الكثير.',
        _is_seeded: true
      },
      base_price_mad: 99.00,
      media_gallery: [
        '/afus-products/BeniOurainBoutique/4/il_794xN.5682114711_pbjs.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId4;
    const { data: check4, error: checkErr4 } = await supabase.from('products').select('id').eq('slug_translations->>en', product4Payload.slug_translations.en);
    if (checkErr4) throw checkErr4;

    if (check4 && check4.length > 0) {
      pId4 = check4[0].id;
      await supabase.from('products').update(product4Payload).eq('id', pId4);
      console.log(`Updated existing Product 4: ${pId4}`);
    } else {
      const { data: newP4 } = await supabase.from('products').insert(product4Payload).select('id').single();
      pId4 = newP4.id;
      console.log(`Inserted Product 4: ${pId4}`);
    }

    const sizes4 = [
      { size: '3 mètres', price: null }, // Base 99
      { size: '5 mètres', price: 165 },
      { size: '8 mètres', price: 264 }
    ];

    for (const s of sizes4) {
      const skuSuffix = s.size.replace(/ /g, '').toUpperCase();
      const variant = {
        product_id: pId4,
        sku: `BENI-TIGER-${skuSuffix}`,
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

    console.log('Live Database Seed for BeniOurainBoutique 3 & 4 Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
