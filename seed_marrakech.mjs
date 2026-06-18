import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for MarrakechFiligreeLamps...');

  try {
    const shopId = '6db032b8-9038-47b8-b78e-992525e28fca';
    const categoryId = '4d444444-4444-4444-4444-444444444444'; // Clothing

    const productPayload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'mens-crochet-shirt-boho-patchwork',
        fr: 'chemise-crochet-homme-patchwork-boheme',
        ar: 'قميص-كروشيه-رجالي-مرقع-بوهيمي',
        _is_seeded: true
      },
      title_translations: {
        en: 'Men\'s Crochet Shirt, Boho Patchwork Summer Top, Retro Sunburst Grandma Square Festival Outfit',
        fr: 'Chemise au crochet pour homme, haut d\'été en patchwork bohème, tenue de festival rétro Sunburst Grandma Square',
        ar: 'قميص كروشيه للرجال، بلوزة صيفية بوهيمية مرقعة، زي مهرجان مربع الجدة بأشعة الشمس الكلاسيكية',
        _is_seeded: true
      },
      description_translations: {
        en: 'This exquisite handmade crochet shirt is a masterpiece of texture and design. Featuring a unique sunburst pattern in a classic granny square structure, it perfectly blends the retro aesthetic of the 70s with a modern, sophisticated silhouette.\n\nSIZE INFORMATION - Please provide us with your measurements right after purchase. Sometimes our customers forget to give us their measurements, and to meet deadlines, we must ship a product based on the chosen size, which may not be the best fit. For non-responsive customers, we will ship based on the standard measurements listed on our website.\n\nCUSTOMIZATION - Note that everything at Smyrna Collective is individually handmade by our creators. We can therefore customize any sizes, models, and colors you like!\n\nCARE - All items must be hand washed in cold or warm water or machine washed at a maximum of 40 degrees on the Wool program and not tumble dried. Do not iron directly; use steam only. Dry cleaning is not recommended.\n\nRETURNS\nBecause each of our pieces is handcrafted with the utmost care, we only accept returns if:\nThe item arrives damaged\nThe wrong item was sent\nThere is a manufacturing defect\n\nUnfortunately, we cannot accept returns for:\n❌ Personal preference or "I didn\'t like it"\n❌ Sizing issues when measurements or the size chart were clearly provided and approved\n❌ Minor color differences caused by screen or lighting variations\n❌ Custom-made items',
        fr: 'Cette exquise chemise au crochet faite main est un chef-d\'oeuvre de texture et de design. Doté d\'un motif soleil unique dans une structure carrée classique de grand-mère, il mélange parfaitement l\'esthétique rétro des années 70 avec une silhouette moderne et sophistiquée.\n\nINFORMATIONS SUR LES TAILLES - Veuillez nous indiquer vos mesures juste après votre achat. Parfois, nos clients oublient de nous donner leurs mensurations et pour respecter le délai d\'Etsy, nous devons expédier un produit en fonction de la taille choisie, ce qui peut ne pas être la meilleure taille. Pour les clients qui ne répondent pas, nous l\'expédierons en fonction des mesures standard indiquées sur notre site Web.\n\nPERSONNALISATION - Notez que tout chez Smyrna Collective est fait main individuellement par nos créateurs. Nous pouvons donc personnaliser toutes les tailles, tous les modèles et toutes les couleurs que vous aimez !\n\nENTRETIEN - Tous les articles doivent être lavés à l\'eau froide ou chaude à la main ou lavés en machine à 40 degrés maximum dans le programme Laine et ne pas sécher. Ne doit pas être repassé directement, uniquement de la vapeur doit être utilisée. Le nettoyage à sec n\'est pas recommandé\n\nRETOURS\nChacune de nos pièces étant fabriquée à la main avec le plus grand soin, nous n\'acceptons les retours que dans les cas suivants :\nL\'article arrive endommagé\nLe mauvais article a été envoyé\nIl y a un défaut de fabrication\n\nMalheureusement, nous ne pouvons pas accepter les retours pour :\n❌ Préférence personnelle ou « Je n\'ai pas aimé »\n❌ Problèmes liés à la taille lorsque les mesures ou le tableau des tailles ont été clairement fournis et approuvés\n❌ Différences de couleur mineures causées par des variations d\'écran ou d\'éclairage\n❌ Articles sur mesure',
        ar: 'هذا القميص الكروشيه الرائع المصنوع يدويًا هو تحفة فنية من حيث الملمس والتصميم. يتميز بنمط أشعة الشمس الفريد في هيكل مربع الجدة الكلاسيكي، ويمزج بشكل مثالي بين الجمالية القديمة للسبعينيات وصورة ظلية حديثة ومتطورة.\n\nمعلومات المقاس - يرجى تزويدنا بقياساتك مباشرة بعد الشراء. أحيانًا ينسى عملاؤنا إعطائنا قياساتهم، وللوفاء بالمواعيد النهائية، يجب علينا شحن منتج بناءً على الحجم المختار، والذي قد لا يكون الأنسب. بالنسبة للعملاء الذين لا يستجيبون، سنقوم بالشحن بناءً على القياسات القياسية المدرجة على موقعنا.\n\nالتخصيص - لاحظ أن كل شيء في Smyrna Collective مصنوع يدويًا بشكل فردي بواسطة مبدعينا. لذلك يمكننا تخصيص جميع الأحجام والموديلات والألوان التي تريدها!\n\nالعناية - يجب غسل جميع العناصر يدويًا بالماء البارد أو الدافئ أو غسلها في الغسالة بحد أقصى 40 درجة في برنامج الصوف وعدم تجفيفها في الغسالة. لا تقم بالكي مباشرة؛ استخدم البخار فقط. لا ينصح بالتنظيف الجاف.\n\nالمرتجعات\nنظرًا لأن كل قطعة من قطعنا مصنوعة يدويًا بأقصى قدر من العناية، فإننا نقبل المرتجعات فقط في الحالات التالية:\nوصول المنتج تالفًا\nإرسال منتج خاطئ\nيوجد عيب في التصنيع\n\nلسوء الحظ، لا يمكننا قبول المرتجعات بسبب:\n❌ التفضيل الشخصي أو "لم يعجبني"\n❌ مشاكل الحجم عند توفير القياسات أو جدول المقاسات والموافقة عليها بوضوح\n❌ اختلافات طفيفة في اللون بسبب اختلافات الشاشة أو الإضاءة\n❌ عناصر مخصصة',
        _is_seeded: true
      },
      base_price_mad: 790.00,
      media_gallery: [
        '/afus-products/MarrakechFiligreeLamps/1/il_794xN.7886638323_q5le.webp',
        '/afus-products/MarrakechFiligreeLamps/1/il_794xN.7886665233_ppo4.avif',
        '/afus-products/MarrakechFiligreeLamps/1/il_794xN.8089806916_en7j.webp'
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

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    for (const size of sizes) {
      const variant = {
        product_id: pId,
        sku: `MAR-SHIRT-${size}`,
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

    console.log('Live Database Seed for MarrakechFiligreeLamps Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
