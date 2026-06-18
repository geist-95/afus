import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for MoorishWroughtIron...');

  try {
    const shopId = '7044b8d2-5276-4177-81cc-698c367a152d';
    const categoryId = '6f666666-6666-6666-6666-666666666666'; // Home Living / Tapis

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-moroccan-wool-rug-ivory-black',
        fr: 'tapis-marocain-en-laine-fait-main-ivoire-noir',
        ar: 'سجادة-مغربية-صوف-صناعة-يدوية-عاجي-وأسود',
        _is_seeded: true
      },
      title_translations: {
        en: 'Handmade Moroccan Wool Rug - Ivory and Black Beni Ourain - High Pile Berber Rug with Diamond Pattern for Living Room | Afrikesh',
        fr: 'Tapis marocain en laine fait main - Tapis Beni Ourain ivoire et noir - Tapis berbère à poil long avec motif losange pour salon | Afrikesh',
        ar: 'سجادة صوف مغربية صناعة يدوية - سجادة بني أوراين عاجية وسوداء - سجادة أمازيغية كثيفة الوبر بنمط ماسي لغرفة المعيشة',
        _is_seeded: true
      },
      description_translations: {
        en: 'This Beni Ourain is woven from deep ivory natural wool, featuring a generous, fluffy high pile that softens footsteps and beautifully catches the light throughout the day. Bold black diamond patterns distinctly traverse the field, overlapping to form large geometric shapes that give this rug its calm yet assertive presence.\n\nLarge overlapping diamonds are traced in dark charcoal lines across the open ivory background, displaying bold geometry and clean spacing. In Amazigh weaving, the diamond motif is inspired by the towering peaks of the Atlas Mountains—a shape that has defined the visual landscape of Berber communities for centuries and remains central to their craftsmanship.\n\nWhy you’ll love it:\n\n100% natural wool.\nAuthentic Beni Ourain, hand-knotted with a deep, fluffy high pile.\nNatural ivory field with large overlapping black diamond lines throughout.\nCustom dimensions available, woven to order in 3 to 5 weeks.\nInternational shipping in 4 to 7 business days.\nDDP delivery included (no hidden customs fees).\n\nHandcrafted on a traditional loom in our workshop in Morocco. No machines, no synthetic materials. Each knot is tied by hand, and every row is woven thread by thread. Natural wool only gets more beautiful over time, softening as it is lived on.\n\nThe clean black and ivory palette naturally complements minimalist interiors, Japandi spaces, and warm neutral rooms where the texture speaks for itself.\n\nSlight variations in color and texture are a natural part of artisanal work. Please feel free to contact us with any questions—we’d be happy to help.\n\nPreparation of command: 10 days\nMaterial: Wool',
        fr: 'Ce Beni Ourain est tissé en laine naturelle ivoire profonde, avec un poil haut, généreux et moelleux qui adoucit le pas et capte la lumière différemment au fil de la journée. De grandes lignes de losanges noires traversent clairement le champ, se superposant pour former de larges formes géométriques qui donnent à ce tapis sa présence calme et affirmée.\n\nDe grands losanges superposés sont tracés en lignes charbon foncé sur le champ ivoire ouvert, avec une géométrie audacieuse et un espacement net. Dans le tissage amazigh, le losange s’inspire des sommets montagneux de l’Atlas, une forme qui définit le paysage visuel des communautés berbères depuis des siècles et qui demeure au cœur de leur artisanat.\n\nPourquoi vous allez l’aimer :\n\n100 % laine naturelle.\nBeni Ourain authentique, noué à la main avec un poil haut, profond et moelleux.\nChamp ivoire naturel avec de grandes lignes de losanges noires superposées d’un bout à l’autre.\nDimensions personnalisées disponibles, tissé sur commande en 3 à 5 semaines.\nExpédition internationale en 4 à 7 jours ouvrés.\nLivraison DDP incluse, sans frais de douane supplémentaires.\n\nFabriqué à la main sur un métier traditionnel dans notre atelier au Maroc. Aucune machine, aucune matière synthétique. Chaque nœud est noué à la main, chaque rang tissé fil par fil. La laine naturelle s’embellit avec le temps, devenant plus douce à mesure qu’elle est vécue.\n\nLa palette épurée noir et ivoire s’intègre naturellement aux intérieurs minimalistes, aux espaces Japandi et aux pièces aux tons neutres chaleureux, où la texture parle d’elle-même.\n\nDe légères variations de couleur et de texture font naturellement partie du travail artisanal. N’hésitez pas à nous contacter pour toute question, nous serons ravis de vous aider.\n\nPreparation of command : 10 days\nMatérial : Laine',
        ar: 'هذه السجادة من نوع بني أوراين منسوجة من الصوف الطبيعي بلون عاجي عميق، وتتميز بوبر طويل وغزير وناعم يخفف من وقع الخطوات ويعكس الضوء بشكل مختلف على مدار اليوم. تتقاطع خطوط ماسية سوداء كبيرة بوضوح في خلفية السجادة، وتتداخل لتشكل أشكالًا هندسية واسعة تمنحها حضورًا هادئًا وقويًا.\n\nتم رسم ماسات كبيرة متداخلة بخطوط فحمية داكنة على الخلفية العاجية الواسعة، مع هندسة جريئة ومسافات متناسقة. في النسيج الأمازيغي، يستوحى شكل الماسة من قمم جبال الأطلس، وهو شكل يحدد المشهد البصري للمجتمعات الأمازيغية منذ قرون ويبقى في صميم حرفتهم.\n\nلماذا ستحبها:\n\nصوف طبيعي 100%.\nسجادة بني أوراين أصلية، معقودة يدويًا بوبر طويل وعميق وناعم.\nخلفية عاجية طبيعية مع خطوط ماسية سوداء كبيرة متداخلة من البداية إلى النهاية.\nأبعاد مخصصة متاحة، تُنسج عند الطلب في غضون 3 إلى 5 أسابيع.\nشحن دولي في غضون 4 إلى 7 أيام عمل.\nيشمل التوصيل رسوم الجمارك (DDP)، دون أي تكاليف إضافية.\n\nمُصنعة يدويًا على نول تقليدي في ورشتنا في المغرب. لا تُستخدم أي آلات أو مواد صناعية. يتم عقد كل عقدة يدويًا، ونسج كل صف خيطًا بخيط. الصوف الطبيعي يزداد جمالاً مع مرور الوقت، ويصبح أكثر نعومة مع الاستخدام.\n\nتتناسب لوحة الألوان البسيطة بالأسود والعاجي بشكل طبيعي مع الديكورات الداخلية البسيطة، المساحات بأسلوب "Japandi"، والغرف ذات الألوان المحايدة الدافئة، حيث يتحدث الملمس عن نفسه.\n\nالتغيرات الطفيفة في اللون والملمس هي جزء طبيعي من العمل الحرفي. لا تتردد في الاتصال بنا لأي استفسار، سنكون سعداء بمساعدتك.\n\nمدة التحضير: 10 أيام\nالمادة: صوف',
        _is_seeded: true
      },
      base_price_mad: 470.00,
      media_gallery: [
        '/afus-products/MoorishWroughtIron/1/il_794xN.7989752490_t8ug.avif',
        '/afus-products/MoorishWroughtIron/1/il_794xN.7989752494_i185.avif',
        '/afus-products/MoorishWroughtIron/1/il_794xN.7989752502_lq8a.webp',
        '/afus-products/MoorishWroughtIron/1/il_794xN.8037691637_1b7r.avif',
        '/afus-products/MoorishWroughtIron/1/il_794xN.8037691639_nh3f.avif',
        '/afus-products/MoorishWroughtIron/1/il_75x75.8037691627_byp6.webp'
      ],
      stock_quantity: 10,
      is_active: true
    };

    const product2Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-moroccan-wool-rug-geometric-brown-white',
        fr: 'tapis-en-laine-marocain-sur-mesure-geometrique-brun-blanc',
        ar: 'سجادة-صوف-مغربية-تصميم-هندسي-بني-وأبيض',
        _is_seeded: true
      },
      title_translations: {
        en: 'MOROCCAN Wool RUG, Custom Beni Ouarain Rug, Brown and White Geometric Pattern, Contemporary Berber Rug, Artisanal Comfort',
        fr: 'TAPIS EN Laine MAROCAIN, Tapis Beni Ouarain sur mesure, Motif géométrique brun et blanc, Tapis berbère contemporain, Confort artisanal',
        ar: 'سجادة صوف مغربية، سجادة بني أوراين حسب الطلب، نمط هندسي بني وأبيض، سجادة أمازيغية معاصرة، راحة حرفية',
        _is_seeded: true
      },
      description_translations: {
        en: 'Here is a white and rust-brown Beni Ourain Berber rug, hand-knotted in our workshop in Morocco. A clean white background hosts a grid of large rust-brown squares arranged in even columns across the entire surface. Each square is separated by small black dots that punctuate the white field. A dark green vertical band borders the two long sides, while bands of black squares mark the top and bottom of the rug, forming a structured frame. The colors balance naturally in an earthy and harmonious palette.\n\nThe square grid is inspired by the agricultural plots and terraced lands of the Moroccan landscape, cultivated by Berber communities for generations. The rust-brown evokes the terracotta walls and soils of the Atlas Mountains. The black dots are a discreet signature of the weaver, like seeds sown in the earth. The green border recalls the cedar forests and olive groves of the Atlas. Hand-knotted white fringes finish both ends.\n\nWhy you’ll love it:\n\nAuthentic Beni Ourain rug, hand-knotted by Berber artisans in Morocco.\nHigh pile, 100% natural wool, no synthetics or mechanical finishing.\nWhite background with rust-brown square grid, black dots, green border, and black bands.\nCustom sizes available, woven to order in 3 to 5 weeks.\nWorldwide shipping in 4 to 7 business days.\nDDP delivery included (no extra customs fees).\n\nEntirely handmade on a traditional loom. No industrial processes, no shortcuts. Every knot is placed with precision. Natural wool softens over time and gains character.\n\nPairs perfectly with warm woods, linen, and nature-inspired interiors.\nSlight shade variations are natural with hand-dyed wool. We remain available for any questions.\n\nPreparation of command: 10 days\nMaterial: Wool',
        fr: 'Voici un tapis berbère Beni Ourain blanc et brun rouille, noué à la main dans notre atelier au Maroc. Un fond blanc épuré accueille une grille de grands carrés brun rouille disposés en colonnes régulières sur toute la surface. Chaque carré est séparé par de petits points noirs qui ponctuent le champ blanc. Une bande verticale vert foncé borde les deux longueurs, tandis que des bandes de carrés noirs marquent le haut et le bas du tapis, formant un cadre structuré. Les couleurs s’équilibrent naturellement, dans une palette terreuse et harmonieuse.\n\nLa grille de carrés s’inspire des parcelles agricoles et des terres en terrasses du paysage marocain, cultivées par les communautés berbères depuis des générations. Le brun rouille évoque les murs en terre cuite et les sols de l’Atlas. Les points noirs sont une signature discrète du tisserand, comme des graines semées dans la terre. La bordure verte rappelle les forêts de cèdres et les oliveraies des montagnes de l’Atlas. Des franges blanches nouées à la main terminent les deux extrémités.\n\nPourquoi vous allez l’aimer :\n\nAuthentique tapis Beni Ourain, noué à la main par des artisans berbères au Maroc\nPoil long, 100 % laine naturelle, sans matières synthétiques ni finition mécanique\nFond blanc avec grille de carrés brun rouille, points noirs, bordure verte et bandes noires\nTailles sur mesure disponibles, tissées à la commande en 3 à 5 semaines\nExpédition dans le monde entier en 4 à 7 jours ouvrés\nLivraison DDP incluse (aucun frais de douane supplémentaire)\n\nEntièrement réalisé à la main sur un métier traditionnel. Aucun procédé industriel, aucun raccourci. Chaque nœud est posé avec précision. La laine naturelle s’assouplit avec le temps et gagne en caractère.\n\nS’accorde parfaitement avec du bois chaleureux, du lin et des intérieurs inspirés par la nature.\nDe légères variations de teinte sont naturelles avec la laine teinte à la main. Nous restons disponibles pour toute question.\n\nPreparation of command : 10 days\nMatérial : Laine',
        ar: 'إليك سجادة أمازيغية من نوع بني أوراين باللونين الأبيض والبني الصدئ، معقودة يدويًا في ورشتنا في المغرب. تستضيف خلفية بيضاء نقية شبكة من المربعات البنية الصدئة الكبيرة مرتبة في أعمدة متساوية عبر السطح بأكمله. يتم فصل كل مربع بنقاط سوداء صغيرة تزين الحقل الأبيض. يحد شريط عمودي أخضر داكن الجانبين الطويلين، بينما تميز شرائط من المربعات السوداء أعلى وأسفل السجادة، مما يشكل إطارًا منظمًا. تتوازن الألوان بشكل طبيعي في لوحة ألوان ترابية ومتناغمة.\n\nالشبكة المربعة مستوحاة من الأراضي الزراعية والمدرجات في المشهد المغربي، والتي زرعتها المجتمعات الأمازيغية لأجيال. يثير اللون البني الصدئ جدران الطين وتربة جبال الأطلس. النقاط السوداء هي توقيع سري للناسج، مثل البذور المزروعة في الأرض. يذكرنا الإطار الأخضر بغابات الأرز وبساتين الزيتون في الأطلس. تنهي الشراشيب البيضاء المعقودة يدويًا كلا الطرفين.\n\nلماذا ستحبها:\n\nسجادة بني أوراين أصلية، معقودة يدويًا بواسطة حرفيين أمازيغ في المغرب.\nوبر طويل، 100% صوف طبيعي، بدون مواد صناعية أو تشطيب آلي.\nخلفية بيضاء مع شبكة مربعات بنية صدئة، نقاط سوداء، إطار أخضر وشرائط سوداء.\nأحجام مخصصة متاحة، تُنسج عند الطلب في غضون 3 إلى 5 أسابيع.\nشحن عالمي في غضون 4 إلى 7 أيام عمل.\nيشمل التوصيل رسوم الجمارك (DDP)، دون أي تكاليف إضافية.\n\nمصنوعة بالكامل يدويًا على نول تقليدي. لا توجد عمليات صناعية، ولا طرق مختصرة. توضع كل عقدة بدقة. يصبح الصوف الطبيعي أكثر نعومة بمرور الوقت ويكتسب طابعًا خاصًا.\n\nتتناسب بشكل مثالي مع الأخشاب الدافئة والكتان والديكورات الداخلية المستوحاة من الطبيعة.\nالتغيرات الطفيفة في الدرجة اللونية طبيعية مع الصوف المصبوغ يدويًا. نبقى متاحين لأي استفسار.\n\nمدة التحضير: 10 أيام\nالمادة: صوف',
        _is_seeded: true
      },
      base_price_mad: 477.00,
      media_gallery: [
        '/afus-products/MoorishWroughtIron/2/il_794xN.6944112862_d9ns.avif',
        '/afus-products/MoorishWroughtIron/2/il_794xN.6944113114_a170.webp',
        '/afus-products/MoorishWroughtIron/2/il_794xN.6992079013_m6l3.webp',
        '/afus-products/MoorishWroughtIron/2/il_794xN.6992079253_dxrw.avif',
        '/afus-products/MoorishWroughtIron/2/il_794xN.7818521740_9txo.avif'
      ],
      stock_quantity: 10,
      is_active: true
    };

    const products = [
      { payload: product1Payload, sizes: ['90x120cm', '130x180cm'], pIdKey: 'handmade-moroccan-wool-rug-ivory-black' },
      { payload: product2Payload, sizes: ['90x120cm', '130x180cm', '200x260cm'], pIdKey: 'handmade-moroccan-wool-rug-geometric-brown-white' }
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
      const variants = p.sizes.map((size, index) => ({
        product_id: pId,
        sku: `RUG-${p.pIdKey.substring(0, 8)}-${size}`,
        // Increase price per size step as a realistic example, 0 for first, 100 for second, etc.
        price_override_mad: p.payload.base_price_mad + (index * 150),
        stock_quantity: 2,
        attributes: {
          en: { size },
          fr: { taille: size },
          ar: { المقاس: size },
          _is_seeded: true
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

    console.log('Live Database Seed for MoorishWroughtIron Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
