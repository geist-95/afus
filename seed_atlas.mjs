import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for AtlasBoucherouiteCo...');

  try {
    const shopId = '55900fb0-2331-4e17-beb7-ea465127f62b';
    const categoryId = '4d444444-4444-4444-4444-444444444444'; // clothing

    const productPayload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-leather-huarache-moccasins',
        fr: 'mocassins-huarache-en-cuir-faits-main',
        ar: 'حذاء-موكاسان-هوراشي-جلدي'
      },
      title_translations: {
        en: 'Handmade Leather Huarache Moccasins: Turkish Yemenite Safety Shoes',
        fr: 'Mocassins Huarache en cuir faits main : chaussures de sécurité yéménites turques',
        ar: 'حذاء موكاسان هوراشي جلدي مصنوع يدويًا: أحذية يمنية تركية تقليدية'
      },
      description_translations: {
        en: 'Step into timeless elegance with our handcrafted leather footwear!\n\nIndulge your senses with the luxury of footwear that not only tells a story, but also becomes part of yours. Our women\'s shoes are not just an accessory; they are a testament to craftsmanship, history, and a commitment to your well-being.\n\nArt in every stitch: Each pair is meticulously handcrafted by skilled artisans using historical techniques passed down through generations. Our attention to detail ensures that every stitch is a work of art, creating a timeless masterpiece for your feet.\n\nPure leather, pure comfort: Experience the unparalleled comfort of full-grain leather wrapping your feet in softness. Our commitment to quality means every single inch, from the upper to the sole, is crafted with care and precision, promising a perfect fit that adapts to your unique shape.\n\nGrounding for vitality: Connect with the earth beneath your feet! Our shoes feature grounding soles, connecting you to the earth\'s natural energy. Embrace a healthier lifestyle with footwear that not only looks beautiful but also promotes a sense of balance and well-being.\n\nChemical-free, naturally: Say goodbye to harmful chemicals! Our shoes are made without glue or harsh chemicals, ensuring your footwear is as good for you as it is for the environment. Walk with confidence, knowing your steps leave a light footprint.\n\nStyle your personality: With our handmade leather shoes, you are not just buying footwear; you are investing in a statement of style and sustainability. Stand out with a pair that radiates elegance, individuality, and conscious living.\n\nGive your feet the allure of history, the luxury of pure leather, and the embrace of a healthier choice. Elevate your style, one step at a time.\n\nDiscover the art of shoemaking - Yours,',
        fr: 'Entrez dans l\'élégance intemporelle avec nos bijoux en cuir fabriqués à la main !\n\nFaites plaisir à vos sens avec le luxe de chaussures qui non seulement racontent une histoire, mais font également partie de la vôtre. Nos chaussures pour femmes ne sont pas seulement un accessoire ; elles sont un témoignage de savoir-faire, d\'histoire et un engagement envers votre bien-être.\n\nArt dans chaque point : chaque paire est méticuleusement fabriquée à la main par des artisans qualifiés en utilisant des techniques historiques transmises de génération en génération. Notre souci du détail garantit que chaque point est une œuvre d\'art, créant un chef-d\'œuvre intemporel pour vos pieds.\n\nCuir pur, confort pur : découvrez le confort inégalé du cuir pleine fleur qui enveloppe vos pieds de douceur. Notre engagement envers la qualité signifie que chaque centimètre carré, de la tige à la semelle, est fabriqué avec soin et précision, promettant un ajustement parfait qui s\'adapte à votre forme unique.\n\nLa mise à la terre pour la vitalité : connectez-vous à la terre sous vos pieds ! Nos chaussures sont dotées de semelles de mise à la terre, vous connectant à l\'énergie naturelle de la terre. Adoptez un mode de vie plus sain avec des chaussures qui non seulement sont esthétiques, mais favorisent également une sensation d\'équilibre et de bien-être.\n\nSans produits chimiques, naturellement : Dites adieu aux produits chimiques nocifs ! Nos chaussures sont fabriquées sans colle ni produits chimiques agressifs, ce qui garantit que vos chaussures sont aussi bonnes pour vous que pour l\'environnement. Marchez en toute confiance, sachant que vos pas laissent une empreinte légère.\n\nDonnez du style à votre personnalité : avec nos chaussures en cuir faites main, vous n\'achetez pas seulement des chaussures ; vous investissez dans une déclaration de style et de durabilité. Démarquez-vous avec une paire qui rayonne d\'élégance, d\'individualité et de vie consciente.\n\nOffrez à vos pieds l\'attrait de l\'histoire, le luxe du cuir pur et l\'étreinte d\'un choix plus sain. Rehaussez votre style, une étape à la fois.\n\nDécouvrez l\'art de la cordonnerie - Bien à vous,',
        ar: 'ادخل إلى عالم الأناقة الخالدة مع أحذيتنا الجلدية المصنوعة يدويًا!\n\nدلل حواسك بفخامة الأحذية التي لا تروي قصة فحسب، بل تصبح جزءًا من قصتك أيضًا. أحذيتنا النسائية ليست مجرد إكسسوار؛ إنها شهادة على الحرفية والتاريخ والالتزام بصحتك وراحتك.\n\nالفن في كل غرزة: يتم تصنيع كل زوج بدقة وعناية فائقة يدويًا على يد حرفيين مهرة باستخدام تقنيات تاريخية متوارثة عبر الأجيال. يضمن اهتمامنا بالتفاصيل أن تكون كل غرزة عملاً فنياً فريداً، مما يخلق تحفة فنية خالدة لقدميك.\n\nجلد خالص، راحة تامة: جرب الراحة التي لا مثيل لها للجلد الطبيعي الذي يغلف قدميك بنعومة. التزامنا بالجودة يعني أن كل جزء من الحذاء، من الجزء العلوي إلى النعل، مصنوع بعناية ودقة، مما يضمن ملاءمة مثالية تتكيف مع شكل قدمك الفريد.\n\nالاتصال بالأرض من أجل الحيوية: تواصل مع الأرض تحت قدميك! تتميز أحذيتنا بنعال مخصصة للاتصال بالأرض، مما يربطك بالطاقة الطبيعية للأرض. تمتع بأسلوب حياة صحي مع أحذية لا تبدو جميلة فحسب، بل تعزز أيضًا الشعور بالتوازن والراحة.\n\nخالية من المواد الكيميائية بشكل طبيعي: قل وداعًا للمواد الكيميائية الضارة! تُصنع أحذيتنا بدون غراء أو مواد كيميائية قاسية، مما يضمن أن أحذيتك مفيدة لك وللبيئة على حد سواء. امشِ بكل ثقة، مع العلم أن خطواتك تترك أثراً خفيفاً.\n\nعبر عن شخصيتك بأناقة: مع أحذيتنا الجلدية المصنوعة يدويًا، أنت لا تشتري حذاءً فحسب، بل تستثمر في التعبير عن الأناقة والاستدامة. تميز بزوج من الأحذية يشع بالرقي والتفرد والعيش الواعي.\n\nامنح قدميك جاذبية التاريخ، وفخامة الجلد الخالص، واختياراً أكثر صحة. ارتقِ بأسلوبك، خطوة بخطوة.\n\nاكتشف فن صناعة الأحذية - خالص مودتنا،'
      },
      base_price_mad: 1266.00,
      media_gallery: [
        '/afus-products/AtlasBoucherouiteCo/1/il_794xN.5733875312_p6dy.avif',
        '/afus-products/AtlasBoucherouiteCo/1/il_794xN.5733875566_fwwo.webp',
        '/afus-products/AtlasBoucherouiteCo/1/il_794xN.5781951839_hbzw.webp',
        '/afus-products/AtlasBoucherouiteCo/1/il_794xN.5781951845_mszu.jpg'
      ],
      stock_quantity: 8,
      is_active: true
    };

    let pId;

    const { data: check, error: checkErr } = await supabase.from('products').select('id').eq('slug_translations->>en', productPayload.slug_translations.en);
    if (checkErr) throw checkErr;

    if (check && check.length > 0) {
      pId = check[0].id;
      const { error: updErr } = await supabase.from('products').update(productPayload).eq('id', pId);
      if (updErr) throw updErr;
      console.log('Updated existing Product:', pId);
    } else {
      const { data: newP, error: insErr } = await supabase.from('products').insert(productPayload).select('id').single();
      if (insErr) throw insErr;
      pId = newP.id;
      console.log('Inserted Product:', pId);
    }

    // Insert variants
    const sizes = ['38', '39', '40', '41'];
    const colors = [
      { id: 'NB', en: 'Black-Blue', fr: 'Noir-bleu', ar: 'أسود-أزرق' },
      { id: 'NW', en: 'Black-White', fr: 'Noir-blanc', ar: 'أسود-أبيض' }
    ];

    const variants = [];
    for (const size of sizes) {
      for (const color of colors) {
        variants.push({
          product_id: pId,
          sku: `HUA-${size}-${color.id}`,
          price_override_mad: null,
          stock_quantity: 1,
          attributes: {
            en: { size, color: color.en },
            fr: { taille: size, couleur: color.fr },
            ar: { المقاس: size, اللون: color.ar }
          }
        });
      }
    }

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

    console.log('Live Database Seed Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
