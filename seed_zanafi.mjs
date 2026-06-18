import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for ZanafiFlatweaves...');

  try {
    const shopId = '5a7bd582-d54d-4f8b-9eaa-15d5255ce1cd';
    const categoryId = '4d444444-4444-4444-4444-444444444444'; // Clothing / Shoes

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-velvet-shoes-us9-eu39',
        fr: 'chaussures-en-velours-faites-main-us9-eu39',
        ar: 'حذاء-مخملي-صناعة-يدوية-قياس-39',
        _is_seeded: true
      },
      title_translations: {
        en: 'Handmade Velvet Shoes US-9 (EU-39), Unique Moccasins, Genuine Leather Sole, Embroidered Women\'s Gift Shoes',
        fr: 'Chaussures en velours faites main Us-9 (Eu-39), mocassins uniques, chaussures faites main, semelle en cuir véritable, chaussures cadeaux, chaussures brodées pour femme',
        ar: 'حذاء مخملي صناعة يدوية قياس US-9 (EU-39)، موكاسين فريد، نعل جلد طبيعي، حذاء مطرز هدية للنساء',
        _is_seeded: true
      },
      description_translations: {
        en: 'Handmade bohemian moccasins, vintage velvet shoes, carpet shoes, unique shoes, ethnic wool shoes, embroidered shoes, gift for women.\n\nOur products are completely handmade and natural. It is a beautiful product for lovers of vintage and bohemian style, you can buy it as a gift or for yourself without a doubt. Do not worry if you didn\'t find the right size, you will certainly find the model and size that suits you by visiting our store :)\n\nSize: 39-EUR / 9-US\nSole and interior material: Genuine leather\nUpper material: Velvet\n\nFast worldwide shipping via UPS.',
        fr: 'Mocassins bohèmes faits main, chaussures en velours vintage, chaussures en tapis, chaussures uniques, chaussures ethniques en laine, chaussures de broderie, cadeau pour femme\n\nNos produits sont entièrement faits main et naturels. C\'est un beau produit pour les amateurs de style vintage et bohème, vous pouvez l\'acheter pour offrir ou pour vous-même sans aucun doute. Ne vous inquiétez pas si je n\'ai pas trouvé la bonne référence, vous trouverez certainement le modèle et la référence qui vous conviennent en visitant notre boutique :)\n\nNombre : 39-EUR) - 9-US)\nMatériau de la semelle et de l\'intérieur : cuir véritable\nMatériau supérieur : velours\n\nExpédition rapide dans le monde entier via UPS.',
        ar: 'أحذية موكاسين بوهيمية مصنوعة يدويًا، أحذية مخملية عتيقة، أحذية سجاد، أحذية فريدة، أحذية صوفية عرقية، أحذية مطرزة، هدية للنساء.\n\nمنتجاتنا مصنوعة يدويًا وطبيعية بالكامل. إنه منتج جميل لمحبي النمط العتيق والبوهيمي، يمكنك شراؤه كهدية أو لنفسك دون أدنى شك. لا تقلق إذا لم تجد المقاس المناسب، فمن المؤكد أنك ستجد الموديل والمقاس الذي يناسبك من خلال زيارة متجرنا :)\n\nالقياس: 39-أوروبي / 9-أمريكي\nمادة النعل والداخل: جلد طبيعي\nالمادة العلوية: مخمل\n\nشحن سريع لجميع أنحاء العالم عبر UPS.',
        _is_seeded: true
      },
      base_price_mad: 800.00,
      media_gallery: [
        '/afus-products/ZanafiFlatweaves/1/il_794xN.5414290136_3yis.avif',
        '/afus-products/ZanafiFlatweaves/1/il_794xN.5414290174_cday.webp',
        '/afus-products/ZanafiFlatweaves/1/il_794xN.5414290180_9kzo.webp',
        '/afus-products/ZanafiFlatweaves/1/il_794xN.5414290270_sk76.webp',
        '/afus-products/ZanafiFlatweaves/1/il_794xN.5462423831_xm3d.webp'
      ],
      stock_quantity: 1,
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

    // Insert variant
    const variant = {
      product_id: pId,
      sku: `ZAN-SHOES-39EU-9US`,
      price_override_mad: null,
      stock_quantity: 1,
      attributes: {
        en: { size: 'EU 39 / US 9' },
        fr: { taille: 'EU 39 / US 9' },
        ar: { المقاس: 'EU 39 / US 9' },
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

    console.log('Live Database Seed for ZanafiFlatweaves Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
