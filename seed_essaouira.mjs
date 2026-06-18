import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for EssaouiraThuyaCrafts...');

  try {
    const shopId = 'f3b62609-8e77-48fc-a15c-066b1bb7a5a6';
    const categoryId = '6f666666-6666-6666-6666-666666666666'; // Home Living

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-moroccan-zellige-ceramic-mug-set',
        fr: 'ensemble-tasses-ceramique-zellige-marocaines',
        ar: 'مجموعة-اكواب-سيراميك-زليج-مغربي',
        _is_seeded: true
      },
      title_translations: {
        en: 'Handmade Moroccan Zellige Ceramic Mug Set with Spoon - Artisan Coffee Tea Cup',
        fr: 'Ensemble de tasses en céramique zellige marocaines faites main avec cuillère - Tasse à thé café artisanale',
        ar: 'مجموعة أكواب سيراميك زليج مغربي صناعة يدوية مع ملعقة - كوب شاي وقهوة حرفي',
        _is_seeded: true
      },
      description_translations: {
        en: 'Beautiful Handmade Moroccan Ceramic Mug with Matching Spoon.\n\nBring a touch of vibrant elegance and authentic Moroccan craftsmanship to your coffee or tea break with this stunning mug and spoon set. Each piece is adorned with geometric patterns inspired by traditional Moroccan zellige, featuring a beautiful central Sharifian star.\n\nThis set is the ideal gift for lovers of Boho Chic decor, travel enthusiasts, or to add an exotic and colorful touch to your table.\n\n✨ WHY YOU WILL LOVE IT\n\nAuthentic Design: Inspired by the art of Moroccan zellige.\nComplete Set: The mug comes with its perfectly matched ceramic spoon.\nVersatile: Ideal for morning coffee, afternoon mint tea, or as a decorative piece.\nExcellent Gift Idea: Perfect for a birthday, housewarming, or as a unique Christmas gift.\n\n⚠️ IMPORTANT: As an artisanal product, slight variations in color, pattern, or small imperfections may exist. This is what makes the charm and authenticity of each piece!\n\n📦 SHIPPING AND PACKAGING\nYour set will be packaged with the utmost care in its matching presentation box (see photos) and protected to guarantee arrival in perfect condition. We ship quickly.',
        fr: 'Magnifique Mug en Céramique Marocain Artisanal avec sa Cuillère Assortie.\n\nApportez une touche d\'élégance vibrante et d\'artisanat marocain authentique à votre pause café ou à thé avec ce superbe ensemble de tasses et de cuillères. Chaque pièce est ornée de motifs géométriques inspirés du zellige traditionnel marocain, avec une magnifique étoile chérifienne centrale.\n\nCet ensemble est le cadeau idéal pour les amoureux de la décoration Boho Chic, les passionnés de voyage, ou pour choisir d\'ajouter une touche exotique et colorée à sa table.\n\n✨ POURQUOI VOUS ALLEZ L\'ADORER\n\nDesign Authentique : Inspiré par l\'art du zellige marocain.\nSet Complet : Le mug est livré avec sa cuillère en céramique parfaitement assortie.\nPolyvalent : Idéal pour le café du matin, le thé à la menthe l\'après-midi ou comme pièce de décoration.\nExcellente Idée Cadeau : Parfait pour un anniversaire, une crémaillère, ou comme cadeau de Noël unique.\n\n⚠️ IMPORTANTE : S\'agissant d\'un produit artisanal, de légères variations de couleur, de motif ou de petites imperfections peuvent exister. C\'est ce qui fait tout le charme et l\'authenticité de chaque pièce !\n\n📦 LIVRAISON ET EMBALLAGE\nVotre set sera emballé avec le plus grand soin dans sa boîte de présentation assortie (voir photos) et protégée pour garantir une arrivée en parfait état. Nous expédions rapidement.',
        ar: 'كوب سيراميك مغربي حرفي جميل مع ملعقته المطابقة.\n\nأضف لمسة من الأناقة النابضة بالحياة والحرفية المغربية الأصيلة إلى استراحة القهوة أو الشاي مع هذه المجموعة الرائعة من الأكواب والملاعق. تم تزيين كل قطعة بأنماط هندسية مستوحاة من الزليج المغربي التقليدي، وتتميز بنجمة شريفية مركزية جميلة.\n\nهذه المجموعة هي الهدية المثالية لمحبي الديكور البوهيمي الأنيق، أو عشاق السفر، أو لإضافة لمسة غريبة وملونة إلى طاولتك.\n\n✨ لماذا ستحبها\n\nتصميم أصيل: مستوحى من فن الزليج المغربي.\nمجموعة كاملة: يأتي الكوب مع ملعقته الخزفية المطابقة تمامًا.\nمتعدد الاستخدامات: مثالي لقهوة الصباح أو شاي النعناع بعد الظهر أو كقطعة ديكور.\nفكرة هدية ممتازة: مثالية لعيد ميلاد أو حفل الانتقال إلى منزل جديد أو كهدية عيد ميلاد فريدة.\n\n⚠️ هام: نظرًا لكونه منتجًا حرفيًا، قد توجد اختلافات طفيفة في اللون أو النمط أو عيوب صغيرة. هذا ما يصنع سحر وأصالة كل قطعة!\n\n📦 الشحن والتغليف\nسيتم تغليف مجموعتك بعناية فائقة في صندوق التقديم المطابق لها (انظر الصور) وحمايتها لضمان وصولها في حالة ممتازة. نحن نشحن بسرعة.',
        _is_seeded: true
      },
      base_price_mad: 350.00,
      media_gallery: [
        '/afus-products/EssaouiraThuyaCrafts/1/il_794xN.8050685188_kqb8.avif',
        '/afus-products/EssaouiraThuyaCrafts/1/il_794xN.8050685208_e3s6.webp',
        '/afus-products/EssaouiraThuyaCrafts/1/il_794xN.8098598819_du9m.webp',
        '/afus-products/EssaouiraThuyaCrafts/1/il_794xN.8098598823_rpqh.webp',
        '/afus-products/EssaouiraThuyaCrafts/1/il_794xN.8098598839_gvrw.avif'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const product2Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'set-6-moroccan-tea-glasses-hamsa',
        fr: 'ensemble-6-verres-the-marocains-hamsa',
        ar: 'مجموعة-6-كؤوس-شاي-مغربي-خمسة',
        _is_seeded: true
      },
      title_translations: {
        en: 'Set of 6 Moroccan Tea Glasses - Hand-painted Gold Geometric Hamsa Tumblers',
        fr: 'Ensemble de 6 verres à thé marocains - Gobelets géométriques Hamsa en or peints à la main',
        ar: 'مجموعة من 6 كؤوس شاي مغربي - أكواب هندسية "خمسة" باللون الذهبي مرسومة يدويًا',
        _is_seeded: true
      },
      description_translations: {
        en: 'Authentic Moroccan tea glasses - Set of 6 colorful and gilded tumblers\n\nBring the vibrant atmosphere and warmth of a traditional Moroccan mint tea ceremony directly into your home. This stunning set of 6 authentic Moroccan tea glasses features rich, translucent colors beautifully adorned with complex golden patterns.\n\nWhether you choose the protective Hamsa (Hand of Fatima) design, elegant geometric arabesques, or traditional Moroccan monuments, these glasses will captivate your guests.\n\nPerfect for serving hot mint tea, espresso, spirits, or even used as boho-chic candle holders (votive tealights) to cast a warm and colorful glow in your room.\n\n✨ WHY YOU WILL LOVE THEM\nComplete set: delivered in a beautiful presentation box containing 6 vibrant mismatched colors.\nVersatile use: ideal for hot or cold drinks, or as beautiful bohemian decoration.\nExquisite gift: a memorable and unique gift for a housewarming, wedding, birthday, or Eid.\n\n⚠️ CARE INSTRUCTIONS: to protect the delicate golden details, these glasses should be hand washed only with a soft sponge. Do not use in the microwave or dishwasher.\n\n📦 SHIPPING AND PACKAGING\nYour set will be carefully packaged in its original artisanal box (as shown in the photos) and securely wrapped to guarantee it arrives safely at your home. We provide fast delivery with a tracking number.',
        fr: 'Authentique verres à thé marocains - Lot de 6 gobelets colorés et dorés\n\nApportez l\'atmosphère vibrante et la chaleur d\'une cérémonie marocaine traditionnelle du thé à la menthe directement chez vous. Ce superbe ensemble de 6 verres à thé marocains authentiques présente des couleurs riches et translucides magnifiquement ornées de motifs dorés complexes.\n\nQue vous choisissiez le design protecteur Hamsa (Main de Fatima), les élégantes arabesques géométriques ou les monuments marocains traditionnels, ces verres ne manqueront pas de captiver vos invités.\n\nParfaits pour servir du thé à la menthe chaud, un expresso, des spiritueux, ou même utilisés comme bougeoirs bohème-chic (photophores votifs) pour projeter une lueur chaude et colorée dans votre pièce.\n\n✨ POURQUOI VOUS LES AIMEREZ\nEnsemble complet : livré dans une belle boîte de présentation contenant 6 couleurs vives dépareillées.\nUtilisation polyvalente : idéal pour les boissons chaudes ou froides, ou comme magnifique décoration bohème.\nCadeau exquis : un cadeau mémorable et unique pour une pendaison de crémaillère, un mariage, un anniversaire ou l\'Aïd.\n\n⚠️ CONSEILS D\'ENTRETIEN : pour protéger les délicats détails dorés, ces verres doivent être lavés à la main uniquement avec une éponge douce. Ne pas utiliser au micro-ondes ou au lave-vaisselle.\n\n📦 EXPÉDITION ET EMBALLAGE\nVotre lot sera soigneusement emballé dans sa boîte artisanale d\'origine (comme indiqué sur les photos) et solidement emballé pour garantir qu\'il arrive en toute sécurité chez vous. Nous fournissons une livraison rapide avec un numéro de suivi.',
        ar: 'كؤوس شاي مغربي أصلية - مجموعة من 6 أكواب ملونة ومذهبة\n\nأحضر الأجواء النابضة بالحياة والدفء لحفل شاي النعناع المغربي التقليدي مباشرة إلى منزلك. تتميز هذه المجموعة المذهلة المكونة من 6 كؤوس شاي مغربي أصيلة بألوان غنية وشفافة مزينة بشكل جميل بأنماط ذهبية معقدة.\n\nسواء اخترت تصميم "الخمسة" (يد فاطمة) الواقي، أو الأرابيسك الهندسي الأنيق، أو المعالم المغربية التقليدية، فمن المؤكد أن هذه النظارات ستأسر ضيوفك.\n\nمثالية لتقديم شاي النعناع الساخن أو الإسبريسو أو المشروبات الروحية أو حتى استخدامها كحوامل شموع بوهيمية أنيقة لإلقاء توهج دافئ وملون في غرفتك.\n\n✨ لماذا ستحبها\nمجموعة كاملة: يتم تسليمها في صندوق عرض جميل يحتوي على 6 ألوان زاهية غير متطابقة.\nاستخدام متعدد الاستخدامات: مثالي للمشروبات الساخنة أو الباردة، أو كديكور بوهيمي جميل.\nهدية رائعة: هدية لا تُنسى وفريدة من نوعها لحفل الانتقال إلى منزل جديد أو حفل زفاف أو عيد ميلاد أو العيد.\n\n⚠️ تعليمات العناية: لحماية التفاصيل الذهبية الدقيقة، يجب غسل هذه النظارات يدويًا فقط باستخدام إسفنجة ناعمة. لا تستخدمها في الميكروويف أو غسالة الأطباق.\n\n📦 الشحن والتغليف\nسيتم تعبئة مجموعتك بعناية في صندوقها الحرفي الأصلي (كما هو موضح في الصور) وتغليفها بشكل آمن لضمان وصولها بأمان إلى منزلك. نحن نقدم توصيلاً سريعًا مع رقم تتبع.',
        _is_seeded: true
      },
      base_price_mad: 399.00,
      media_gallery: [
        '/afus-products/EssaouiraThuyaCrafts/2/il_794xN.8050803160_svkc.avif',
        '/afus-products/EssaouiraThuyaCrafts/2/il_794xN.8050803176_eiec.avif',
        '/afus-products/EssaouiraThuyaCrafts/2/il_794xN.8050803198_3g95.jpg',
        '/afus-products/EssaouiraThuyaCrafts/2/il_794xN.8098716337_blel.jpg'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const products = [
      { payload: product1Payload, sku: 'ESS-CERAMIC-MUG-DEF' },
      { payload: product2Payload, sku: 'ESS-TEA-GLASS-DEF' }
    ];

    for (const p of products) {
      let pId;
      const { data: check, error: checkErr } = await supabase.from('products').select('id').eq('slug_translations->>en', p.payload.slug_translations.en);
      if (checkErr) throw checkErr;

      if (check && check.length > 0) {
        pId = check[0].id;
        const { error: updErr } = await supabase.from('products').update(p.payload).eq('id', pId);
        if (updErr) throw updErr;
        console.log(`Updated existing Product: ${pId} (${p.payload.slug_translations.en})`);
      } else {
        const { data: newP, error: insErr } = await supabase.from('products').insert(p.payload).select('id').single();
        if (insErr) throw insErr;
        pId = newP.id;
        console.log(`Inserted Product: ${pId} (${p.payload.slug_translations.en})`);
      }

      // Insert default variant
      const defaultVariant = {
        product_id: pId,
        sku: p.sku,
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

    console.log('Live Database Seed for EssaouiraThuyaCrafts Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
