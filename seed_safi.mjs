import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for SafiTerracottaHome...');

  try {
    const shopId = '620992bd-d92e-4592-b609-f2e5337d8d0a';
    const categoryId = '3c333333-3333-3333-3333-333333333333'; // Bath & Beauty

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-palestinian-nabulsi-olive-oil-soap',
        fr: 'savon-biologique-huile-olive-palestinien-nabulsi-fait-main',
        ar: 'صابون-زيت-زيتون-نابلسي-فلسطيني-صناعة-يدوية',
        _is_seeded: true
      },
      title_translations: {
        en: 'Organic Olive Oil Soap: Handmade Palestinian Nabulsi Natural Soap',
        fr: 'Savon biologique à l\'huile d\'olive : savon naturel palestinien de Nabulsi fait main',
        ar: 'صابون زيت زيتون عضوي: صابون نابلسي طبيعي فلسطيني صناعة يدوية',
        _is_seeded: true
      },
      description_translations: {
        en: 'Traditional organic handmade soap made from virgin olive oil - 130g to 150g per bar.\n\nOnly 3 natural ingredients make this soap ideal for ALL skin types, especially those with sensitive skin, eczema, acne, psoriasis, and many other skin conditions.\n\nIngredients: extra virgin olive oil, water, and mineral salts.\n\nBy purchasing this soap, you support a variety of local Palestinian businesses 🇵🇸 From local olive farmers 🫒 to talented soap makers 🧼 You are helping to boost the local economy!\n\nBENEFITS:\n- Olive oil has been proven to have anti-aging properties and is rich in antioxidants, this soap improves skin tone and texture while fighting the signs of aging\n- Can also be used on your hair instead of shampoo, on the face as a natural facial cleanser, or even as a shaving soap\n- Suitable for all ages, from babies to the elderly - In fact, it has been used as a baby soap in Palestine for many generations\n\nProduced in the ancient city of Nablus, using the same secret family recipe for over a thousand years, it is said that Nabulsi soap was the soap of choice for Queen Elizabeth I in the 14th century.\n\nThis soap is unscented but has a slight odor similar to olive oil, which is a testament to its high quality and purity.\n\nProduction Method:\n\nMineral salts are formed by mixing barilla ash powder (which grows along the banks of the Jordan River) with locally sourced lime salts and olive oil, all mixed in a large copper vat and continuously stirred at a low temperature, becoming increasingly concentrated over 40 cycles in 8 days. The liquid soap is then placed in wooden frames before being cut and stamped with the company\'s seal of authenticity. The soap is then stacked in geometric spirals up to the ceiling, allowing it to dry, which can take from 3 months to a year.\n\nWith ingredients sourced only from the Holy Land, this is truly a blessed soap.\nTry it, we guarantee you won\'t regret it.',
        fr: 'Savon traditionnel biologique fait main à partir d\'huile d\'olive vierge - 130 g à 150 g par barre.\n\nSeuls 3 ingrédients naturels rendent ce savon idéal pour TOUS les types de peau, en particulier ceux qui ont la peau sensible, l\'eczéma, l\'acné, le psoriasis et de nombreuses autres affections cutanées.\n\nIngrédients : huile d\'olive extra vierge, eau et sels minéraux.\n\nEn achetant ce savon, vous soutenez une variété d\'entreprises palestiniennes locales 🇵🇸 Des oléiculteurs locaux 🫒 aux fabricants de savon talentueux 🧼 Vous contribuez à stimuler l\'économie locale !\n\nAVANTAGES :\n- Il a été prouvé que l\'huile d\'olive a des propriétés anti-âge et est riche en antioxydants, ce savon améliore le teint et la texture de la peau, tout en combattant les signes du vieillissement\n- Peut également être utilisé sur vos cheveux à la place du shampooing, sur le visage comme nettoyant naturel pour le visage ou même comme savon à raser\n- Convient à tous les âges, des bébés aux personnes âgées - En fait, il est utilisé comme savon pour bébé en Palestine depuis de nombreuses générations\n\nProduit dans la ville antique de Naplouse, en utilisant la même recette familiale secrète depuis plus de mille ans, il est dit que le savon de Nabulsi était le savon de choix de la reine Elizabeth I au 14e siècle.\n\nCe savon n\'est pas parfumé mais dégage une légère odeur similaire à celle de l\'huile d\'olive, ce qui témoigne de sa grande qualité et de sa pureté.\n\n\nMode de fabrication :\n\nLes sels minéraux sont formés en mélangeant la poudre de cendres de barilla (qui pousse le long des rives du Jourdain) avec des sels de chaux d\'origine locale et de l\'huile d\'olive, le tout mélangé dans une grande cuve en cuivre et agité en continu à basse température, devenant de plus en plus concentré en 40 cycles sur 8 jours. Le savon liquide est ensuite placé dans des cadres en bois avant d\'être coupé et estampé du sceau d\'authenticité de l\'entreprise. Le savon est ensuite empilé en spirales géométriques jusqu\'au plafond, ce qui lui permet de sécher, qui peut durer de 3 mois à un an.\n\nAvec des ingrédients provenant uniquement de Terre Sainte, c\'est vraiment un savon béni.\nEssayez-le, nous vous garantissons que vous ne le regretterez pas.',
        ar: 'صابون تقليدي عضوي مصنوع يدويًا من زيت الزيتون البكر - من 130 جرام إلى 150 جرام للقطعة.\n\n3 مكونات طبيعية فقط تجعل هذا الصابون مثاليًا لجميع أنواع البشرة، خاصة البشرة الحساسة والأكزيما وحب الشباب والصدفية والعديد من الأمراض الجلدية الأخرى.\n\nالمكونات: زيت زيتون بكر ممتاز، ماء وأملاح معدنية.\n\nبشرائك هذا الصابون، فإنك تدعم مجموعة متنوعة من الشركات الفلسطينية المحلية 🇵🇸 من مزارعي الزيتون المحليين 🫒 إلى صانعي الصابون الموهوبين 🧼 أنت تساهم في تعزيز الاقتصاد المحلي!\n\nالفوائد:\n- ثبت أن زيت الزيتون له خصائص مضادة للشيخوخة وغني بمضادات الأكسدة، وهذا الصابون يحسن لون البشرة وملمسها، مع محاربة علامات الشيخوخة.\n- يمكن استخدامه أيضًا على شعرك بدلاً من الشامبو، وعلى الوجه كمنظف طبيعي للوجه أو حتى كصابون للحلاقة.\n- مناسب لجميع الأعمار، من الأطفال إلى كبار السن - في الواقع، تم استخدامه كصابون للأطفال في فلسطين لأجيال عديدة.\n\nيُنتج في مدينة نابلس القديمة، باستخدام نفس الوصفة العائلية السرية لأكثر من ألف عام، ويُقال إن الصابون النابلسي كان الصابون المفضل للملكة إليزابيث الأولى في القرن الرابع عشر.\n\nهذا الصابون غير معطر ولكنه ينبعث منه رائحة خفيفة تشبه زيت الزيتون، مما يدل على جودته العالية ونقائه.\n\nطريقة الصنع:\n\nتتكون الأملاح المعدنية عن طريق خلط مسحوق رماد الباريلا (الذي ينمو على ضفاف نهر الأردن) مع أملاح الجير من مصادر محلية وزيت الزيتون، ويتم خلط كل ذلك في وعاء نحاسي كبير وتقليبه باستمرار في درجة حرارة منخفضة، ليصبح أكثر تركيزًا في 40 دورة على مدار 8 أيام. ثم يتم وضع الصابون السائل في إطارات خشبية قبل تقطيعه وختمه بختم أصالة الشركة. ثم يتم تكديس الصابون في أشكال حلزونية هندسية حتى السقف، مما يسمح له بالجفاف، والذي يمكن أن يستغرق من 3 أشهر إلى سنة.\n\nبمكونات من الأراضي المقدسة فقط، إنه حقًا صابون مبارك.\nجربه، نضمن لك أنك لن تندم.',
        _is_seeded: true
      },
      base_price_mad: 90.00,
      media_gallery: [
        '/afus-products/SafiTerracottaHome/1/il_794xN.3612788294_85ep.webp',
        '/afus-products/SafiTerracottaHome/1/il_794xN.3612792592_1e7k.webp',
        '/afus-products/SafiTerracottaHome/1/il_794xN.3660399639_f6ku.webp',
        '/afus-products/SafiTerracottaHome/1/il_794xN.3688009467_t6ag.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const product2Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-palestinian-nabulsi-olive-oil-soap-ostrich',
        fr: 'savon-bio-huile-olive-naturel-palestinien-nabulsi-autruche',
        ar: 'صابون-زيت-زيتون-طبيعي-نابلسي-فلسطيني-النعامة',
        _is_seeded: true
      },
      title_translations: {
        en: 'Organic Olive Oil Soap: Handmade Palestinian Nabulsi Natural Soap - "The Ostrich"',
        fr: 'Savon bio à l\'huile d\'olive : Savon naturel palestinien de Nabulsi fait main - « L\'autruche »',
        ar: 'صابون زيت زيتون عضوي: صابون نابلسي طبيعي فلسطيني صناعة يدوية - «النعامة»',
        _is_seeded: true
      },
      description_translations: {
        en: 'A beloved classic, just like our famous Al-Jamal soap, the Ostrich continues the same ancient soap-making tradition, but this unique soap is handcrafted on the other side of the river in Jordan. Due to growing restrictions and difficulties under occupation, many renowned Palestinian artisans have had to relocate their production, but each bar of The Ostrich soap still proudly supports Palestinian businesses and communities of origin.',
        fr: 'Un classique bien-aimé, tout comme notre célèbre savon Al-Jamal, l\'autruche perpétue la même ancienne tradition de fabrication de savon, mais ce savon unique est fabriqué à la main de l\'autre côté du fleuve en Jordanie. En raison des restrictions croissantes et des difficultés rencontrées sous l\'occupation, de nombreux artisans palestiniens de renom ont dû délocaliser leur production, mais chaque barre de savon The Ostrich soutient toujours fièrement les entreprises et les communautés d\'origine palestiniennes.',
        ar: 'كلاسيكية محبوبة، تمامًا مثل صابون الجمل الشهير لدينا، تواصل "النعامة" نفس التقاليد القديمة لصناعة الصابون، ولكن هذا الصابون الفريد يُصنع يدويًا على الجانب الآخر من النهر في الأردن. نظرًا للقيود المتزايدة والصعوبات في ظل الاحتلال، اضطر العديد من الحرفيين الفلسطينيين المشهورين إلى نقل إنتاجهم، ولكن كل قطعة من صابون "النعامة" لا تزال تدعم بفخر الشركات والمجتمعات الفلسطينية الأصلية.',
        _is_seeded: true
      },
      base_price_mad: 65.00,
      media_gallery: [
        '/afus-products/SafiTerracottaHome/2/il_794xN.7465049296_8p5e.webp',
        '/afus-products/SafiTerracottaHome/2/il_794xN.7512981993_s0sg.webp',
        '/afus-products/SafiTerracottaHome/2/il_794xN.7512983221_cmwb.webp'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const products = [
      { payload: product1Payload, pIdKey: 'handmade-palestinian-nabulsi-olive-oil-soap' },
      { payload: product2Payload, pIdKey: 'handmade-palestinian-nabulsi-olive-oil-soap-ostrich' }
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

      // Insert default variant
      const defaultVariant = {
        product_id: pId,
        sku: `SOAP-${p.pIdKey.substring(0, 8)}-DEF`,
        price_override_mad: null,
        stock_quantity: 50,
        attributes: { _is_seeded: true }
      };

      const { data: vCheck } = await supabase.from('product_variants').select('id').eq('sku', defaultVariant.sku);
      if (vCheck && vCheck.length > 0) {
        await supabase.from('product_variants').update(defaultVariant).eq('id', vCheck[0].id);
        console.log(`Updated existing Variant ${defaultVariant.sku}`);
      } else {
        await supabase.from('product_variants').insert(defaultVariant);
        console.log(`Inserted Variant ${defaultVariant.sku}`);
      }
    }

    console.log('Live Database Seed for SafiTerracottaHome Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
