import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for MedinaBaboucheMules...');

  try {
    const shopId = 'a8dd4390-6117-4019-82e4-790f2cd64410';
    const categoryId = '6f666666-6666-6666-6666-666666666666'; // Home Living

    const product1Payload = {
      shop_id: shopId,
      category_id: categoryId,
      slug_translations: {
        en: 'ancient-tree-extra-virgin-olive-oil-750ml',
        fr: 'huile-olive-extra-vierge-vieil-arbre-750ml',
        ar: 'زيت-زيتون-بكر-ممتاز-شجرة-معمرة-750مل',
        _is_seeded: true
      },
      title_translations: {
        en: 'Ancient Tree Extra Virgin Olive Oil (750 ml)',
        fr: 'Huile d\'olive extra vierge de vieil arbre (750 ml)',
        ar: 'زيت زيتون بكر ممتاز من شجرة معمرة (750 مل)',
        _is_seeded: true
      },
      description_translations: {
        en: 'Ancient Tree extra virgin olive oil is cold-pressed from olives picked from trees in the Mediterranean basin. For centuries, Mediterranean civilizations have valued olive oil as a symbol of purity, strength, and peace.\n\nToday, olive oil is recognized as a healthy source of nutrition and recommended for all diets, at all ages.\n\nQuality olive oil is obtained from healthy whole olives that must be crushed without delay to avoid the fermentation process that starts quickly, which would lead to a deterioration in quality.\n\nOur olive oil has been produced according to the traditional cold-pressing method.\n\nAll olives are hand-picked! By choosing hand-picked olive oil, we ensure we support farmers and their families and maintain their traditional farming practices.\n\nFrom the gourmet chef to the amateur cook, our "Ancient Tree" extra virgin olive oil will satisfy you.',
        fr: 'L\'huile d\'olive extra vierge Ancient Tree est pressée à froid à partir d\'olives cueillies sur des arbres du bassin méditerranéen. Pendant des siècles, les civilisations méditerranéennes ont apprécié l\'huile d\'olive comme symbole de pureté, de force et de paix.\n\nAujourd\'hui, l\'huile d\'olive est reconnue comme une source saine de nutrition et recommandée pour tous les régimes alimentaires, à tous les âges.\n\nL\'huile d\'olive de qualité est obtenue à partir d\'olives entières saines qui doivent être écrasées sans délai pour éviter le processus de fermentation qui commence rapidement, ce qui entraînerait une détérioration de la qualité.\n\nNotre olive a été produite selon la méthode traditionnelle de pression à froid.\n\nToutes les olives sont cueillies à la main ! En choisissant une huile d\'olive cueillie à la main, nous veillons à soutenir les agriculteurs et leurs familles et à maintenir leurs pratiques agricoles traditionnelles.\n\nDu chef gastronomique au cuisinier amateur, notre huile d\'olive extra vierge « Vieil arbre » saura vous satisfaire.',
        ar: 'يتم عصر زيت الزيتون البكر الممتاز "Ancient Tree" على البارد من الزيتون المقطوف من أشجار حوض البحر الأبيض المتوسط. لقرون عديدة، قدرت حضارات البحر الأبيض المتوسط زيت الزيتون كرمز للنقاء والقوة والسلام.\n\nاليوم، يُعترف بزيت الزيتون كمصدر صحي للتغذية ويوصى به لجميع الأنظمة الغذائية، وفي جميع الأعمار.\n\nيتم الحصول على زيت الزيتون عالي الجودة من زيتون كامل وصحي يجب عصره دون تأخير لتجنب عملية التخمير التي تبدأ بسرعة، والتي قد تؤدي إلى تدهور في الجودة.\n\nتم إنتاج زيت الزيتون الخاص بنا وفقًا لطريقة العصر البارد التقليدية.\n\nيتم قطف جميع الزيتون يدويًا! باختيار زيت الزيتون المقطوف يدويًا، نضمن دعم المزارعين وعائلاتهم والحفاظ على ممارساتهم الزراعية التقليدية.\n\nمن الطاهي الذواقة إلى الطباخ الهاوي، سيرضيك زيت الزيتون البكر الممتاز "شجرة معمرة".',
        _is_seeded: true
      },
      base_price_mad: 250.00,
      media_gallery: [
        '/afus-products/MedinaBaboucheMules/1/il_794xN.7211059994_lmsi-1.avif',
        '/afus-products/MedinaBaboucheMules/1/il_794xN.7211059994_lmsi.avif',
        '/afus-products/MedinaBaboucheMules/1/il_794xN.7259030647_97i9.avif',
        '/afus-products/MedinaBaboucheMules/1/il_794xN.7543366763_8kj8.avif'
      ],
      stock_quantity: 50,
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
      sku: `MED-OLIVE-750ML`,
      price_override_mad: null,
      stock_quantity: 50,
      attributes: {
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

    console.log('Live Database Seed for MedinaBaboucheMules Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
