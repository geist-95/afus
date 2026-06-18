import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for BeniOurainBoutique...');

  try {
    const shopId = '9b143143-8517-410f-b502-3b24d837ff49';
    const categoryId = '4d444444-4444-4444-4444-444444444444'; // clothing

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'veste-brodee-velours-suzani-1',
        fr: 'veste-brodee-velours-suzani-1',
        ar: 'سترة-مخملية-سوزاني-1',
        _is_seeded: true // Label on the DB
      },
      title_translations: {
        en: 'Handmade Suzani Velvet Embroidered Jacket: Reversible Indian Coat',
        fr: 'Veste brodée en velours Suzani faite main : Manteau indien réversible',
        ar: 'سترة مخملية مطرزة سوزاني صناعة يدوية: معطف هندي ذو وجهين',
        _is_seeded: true // Label on the DB
      },
      description_translations: {
        en: 'Handmade Indian jackets with Suzani embroidery, jackets, coats, bohemian, quilted, for women\'s jacket\n\nMade in India;\n\nSize - All sizes\n\nSmall size -\nChest - 38 inches\nLength - 25 inches\nSleeves - 23 inches\n\nMedium size -\nChest - 40 inches\nLength - 25 inches\nSleeves - 23 inches\n\nLarge size -\nChest - 42 inches\nLength - 25 inches\nSleeves - 23 inches\n\nXL size -\nChest - 44 inches\nLength - 25 inches\nSleeves - 23 inches\n\nXXL size -\nChest - 46 inches\nLength - 25 inches\nSleeves - 23 inches\n\nXXXL size -\nChest - 48 inches\nLength - 25 inches\nSleeves - 23 inches\n\nFabric quality - cotton valve\n\nHandmade… For the simple reason that each item was handmade, there is always an element of human error, whether it is a missed stitch or an overlapping block print pattern. Yet, for us, beauty lies in imperfection. These are the signs that mean your cushion or quilt was not machine-made. However, we think you will be more likely to be surprised by the perfection of a handmade product. Fair trade… Fair trade at a fair price. Encouraging the growth and development of small artisan producers on honest terms\n\nPreparation of command : 6 days\nMaterial : Velvet\nSustainable features : hemp, linen.',
        fr: 'Vestes indiennes faites main avec broderie Suzani, vestes, manteaux, bohème, matelassé, pour veste pour femme\n\nFabriqué en Inde ;\n\nTaille - Toutes les tailles We\n\nPetite taille -\nPoitrine -38 pouces\nLongueur - 25 pouces\nManches -23 pouces\n\nTaille moyenne -\nPoitrine-40 pouces\nLongueur - 25 pouces\nManches -23 pouces\n\nGrande taille -\nPoitrine - 42 pouces\nLongueur - 25 pouces\nManches -23 pouces\n\nTaille XL -\nPoitrine -44 pouces\nLongueur - 25 pouces\nManches - 23 pouces\n\nTaille XXL -\nPoitrine -46 pouces\nLongueur - 25 pouces\nManches - 23 pouces\n\nTaille XXXL -\nPoitrine -48 pouces\nLongueur - 25 pouces\nManches - 23 pouces\n\nQualité du tissu - valve en coton\n\nFait main… Pour la simple raison que chaque article a été fait à la main, il y a toujours un élément d\'erreur humaine, qu\'il s\'agisse d\'un point manqué ou d\'un motif d\'impression au bloc qui se chevauche. Pourtant, pour nous, la beauté réside dans l\'imperfection. Ce sont les signes qui signifient que votre coussin ou votre couette n\'a pas été fabriqué à la machine. Cependant, nous pensons que vous serez plus susceptible d\'être surpris par la perfection d\'un produit fait main. Commerce équitable… Commerce équitable à un prix équitable. Encourager la croissance et le développement des petits producteurs artisanaux à des conditions honnêtes\n\nPreparation of command : 6 days\nMatérial : Velours\nCaractéristiques durables : chanvre, lin.',
        ar: 'سترات هندية مصنوعة يدويًا بتطريز سوزاني، سترات، معاطف، بوهيمية، مبطنة، للنساء\n\nصنع في الهند؛\n\nالمقاس - جميع المقاسات\n\nالمقاس الصغير -\nالصدر - 38 بوصة\nالطول - 25 بوصة\nالأكمام - 23 بوصة\n\nالمقاس المتوسط -\nالصدر - 40 بوصة\nالطول - 25 بوصة\nالأكمام - 23 بوصة\n\nالمقاس الكبير -\nالصدر - 42 بوصة\nالطول - 25 بوصة\nالأكمام - 23 بوصة\n\nمقاس XL -\nالصدر - 44 بوصة\nالطول - 25 بوصة\nالأكمام - 23 بوصة\n\nجودة القماش - صمام قطني\n\nصناعة يدوية... لسبب بسيط هو أن كل عنصر مصنوع يدويًا، فهناك دائمًا عنصر من الخطأ البشري، سواء كانت غرزة مفقودة أو نمط طباعة متداخل. ومع ذلك، بالنسبة لنا، يكمن الجمال في النقص.\n\nمدة التحضير: 6 أيام\nالمادة: مخمل\nميزات مستدامة: قنب، كتان.',
        _is_seeded: true // Label on the DB
      },
      base_price_mad: 390.00,
      media_gallery: [
        '/afus-products/BeniOurainBoutique/1/il_794xN.7702367302_m2r9.webp',
        '/afus-products/BeniOurainBoutique/1/il_794xN.7702408168_kvyh.avif',
        '/afus-products/BeniOurainBoutique/1/il_794xN.7750306319_i5zs.webp',
        '/afus-products/BeniOurainBoutique/1/il_794xN.7750306385_oiwq.webp'
      ],
      stock_quantity: 10,
      is_active: true
    };

    const product2Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'veste-brodee-velours-suzani-2',
        fr: 'veste-brodee-velours-suzani-2',
        ar: 'سترة-مخملية-سوزاني-2',
        _is_seeded: true // Label on the DB
      },
      title_translations: {
        en: 'Handmade Suzani Velvet Embroidered Jacket: Reversible Indian Coat',
        fr: 'Veste brodée en velours Suzani faite main : Manteau indien réversible',
        ar: 'سترة مخملية مطرزة سوزاني صناعة يدوية: معطف هندي ذو وجهين',
        _is_seeded: true // Label on the DB
      },
      description_translations: product1Payload.description_translations,
      base_price_mad: 420.00,
      media_gallery: [
        '/afus-products/BeniOurainBoutique/2/il_794xN.8003150540_tame.webp',
        '/afus-products/BeniOurainBoutique/2/il_794xN.8051073257_ce20.webp',
        '/afus-products/BeniOurainBoutique/2/il_794xN.8051073281_bx7y.webp',
        '/afus-products/BeniOurainBoutique/2/il_794xN.8051073285_rdoa.webp',
        '/afus-products/BeniOurainBoutique/2/il_794xN.8051073335_1lts.webp'
      ],
      stock_quantity: 10,
      is_active: true
    };

    const products = [
      { payload: product1Payload, sizes: ['S', 'M', 'L', 'XL'], pIdKey: 'veste-brodee-velours-suzani-1' },
      { payload: product2Payload, sizes: ['S', 'L', 'XL'], pIdKey: 'veste-brodee-velours-suzani-2' }
    ];

    for (const p of products) {
      let pId;
      const { data: check, error: checkErr } = await supabase.from('products').select('id').eq('slug_translations->>en', p.pIdKey);
      if (checkErr) throw checkErr;

      if (check && check.length > 0) {
        pId = check[0].id;
        const { error: updErr } = await supabase.from('products').update(p.payload).eq('id', pId);
        if (updErr) throw updErr;
        console.log(`Updated existing Product: ${pId} (${p.pIdKey})`);
      } else {
        const { data: newP, error: insErr } = await supabase.from('products').insert(p.payload).select('id').single();
        if (insErr) throw insErr;
        pId = newP.id;
        console.log(`Inserted Product: ${pId} (${p.pIdKey})`);
      }

      // Insert variants
      const variants = p.sizes.map(size => ({
        product_id: pId,
        sku: `SUZANI-${p.pIdKey.split('-').pop()}-${size}`,
        price_override_mad: null,
        stock_quantity: 2,
        attributes: {
          en: { size },
          fr: { taille: size },
          ar: { المقاس: size },
          _is_seeded: true // Label on the DB for variants
        }
      }));

      for (const v of variants) {
        const { data: vCheck } = await supabase.from('product_variants').select('id').eq('sku', v.sku);
        if (vCheck && vCheck.length > 0) {
          await supabase.from('product_variants').update(v).eq('id', vCheck[0].id);
          console.log(`Updated existing Variant ${v.sku}`);
        } else {
          await supabase.from('product_variants').insert(v);
          console.log(`Inserted Variant ${v.sku}`);
        }
      }
    }

    console.log('Live Database Seed for BeniOurainBoutique Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
