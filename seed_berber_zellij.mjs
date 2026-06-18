import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Starting seed for BerberKilimArtisans and ZellijMosaicBistros...');

  try {
    const berberId = 'f8069888-2853-436d-b361-02e7c46b8eb1';
    const zellijId = 'e3dfde37-5432-47ea-87f8-c7e265f7a683';
    const categoryId = '1a111111-1111-1111-1111-111111111111'; // Bijoux/Bagues (Jewelry)

    // =========================================================
    // Berber 1: Bague personnalisée arabe argent 925 ou or
    // =========================================================
    const p1Payload = {
      shop_id: berberId,
      category_id: categoryId,
      slug_translations: {
        en: 'custom-arabic-ring-925-silver-or-gold',
        fr: 'bague-personnalisee-arabe-argent-925-ou-or',
        ar: 'خاتم-عربي-مخصص-فضة-925-أو-ذهب',
        _is_seeded: true,
        _is_personalizable: true
      },
      title_translations: {
        en: 'Custom Arabic Ring in 925 Silver or Gold, Minimalist Engraved Band',
        fr: 'Bague personnalisée arabe argent 925 ou or, bague gravée intérieur extérieur – Bague arabe minimaliste',
        ar: 'خاتم عربي مخصص من الفضة 925 أو الذهب، خاتم محفور من الداخل والخارج',
        _is_seeded: true,
        _is_personalizable: true
      },
      description_translations: {
        en: 'Elegant personalized ring with Arabic engraving. Minimalist and refined, available in 925 silver or 18k gold plating. Personalize with your chosen word or name (inside, outside, or both).\n\nENABLE PERSONALIZATION ( for name )',
        fr: '✨ Bague personnalisée avec gravure en arabe – un bijou chargé de sens\n\nCette bague élégante et intemporelle est personnalisée avec une gravure en arabe, réalisée avec soin pour sublimer un mot, un prénom ou une expression qui vous est chère.\n\n💛 Personnalisation\n• Gravure en arabe (intérieur, extérieur ou les deux)\n• Mot, prénom ou très courte phrase\n\nENABLE PERSONALIZATION ( for name )',
        ar: '✨ خاتم مخصص بنقش عربي - مجوهرات ذات معنى\n\nهذا الخاتم الأنيق والخالد مخصص بنقش عربي، ومصنوع بعناية لتعزيز كلمة أو اسم أول أو تعبير عزيز عليك.\n\n💛 التخصيص\n• نقش عربي (من الداخل أو الخارج أو كليهما)\n• كلمة أو اسم أو جملة قصيرة جداً\n\nتفعيل التخصيص (للاسم)',
        _is_seeded: true,
        _is_personalizable: true
      },
      base_price_mad: 349.00,
      media_gallery: [
        '/afus-products/BerberKilimArtisans/1/il_794xN.7630937140_ezw5.avif',
        '/afus-products/BerberKilimArtisans/1/il_794xN.7631063812_gtda.avif',
        '/afus-products/BerberKilimArtisans/1/il_794xN.7678888445_btb0.avif',
        '/afus-products/BerberKilimArtisans/1/il_794xN.7678964215_exjs.avif'
      ],
      stock_quantity: 50,
      is_active: true
    };

    let pId1;
    const { data: newP1 } = await supabase.from('products').insert(p1Payload).select('id').single();
    pId1 = newP1.id;
    console.log(`Inserted P1: ${pId1}`);

    const finishes1 = ['Or', 'Silver'];
    const sizes1 = ['47', '48', '49', '50', '51', '52'];

    for (const f of finishes1) {
      for (const s of sizes1) {
        await supabase.from('product_variants').insert({
          product_id: pId1,
          sku: `BER-RING1-${f.toUpperCase()}-${s}`,
          price_override_mad: null,
          stock_quantity: 50,
          attributes: {
            en: { finish: f, size: s },
            fr: { finition: f, taille: s },
            ar: { النهاية: f, المقاس: s },
            _is_seeded: true,
            _is_personalizable: true
          }
        });
      }
    }

    // =========================================================
    // Berber 2: Bague prénom arabe personnalisée en or
    // =========================================================
    const p2Payload = {
      shop_id: berberId,
      category_id: categoryId,
      slug_translations: {
        en: 'custom-arabic-name-ring-gold',
        fr: 'bague-prenom-arabe-personnalisee-or',
        ar: 'خاتم-اسم-عربي-مخصص-ذهب',
        _is_seeded: true,
        _is_personalizable: true
      },
      title_translations: {
        en: 'Custom Arabic Name Ring in Gold: Personalized Sterling Silver Jewelry',
        fr: 'Bague prénom arabe personnalisée en or : bijoux personnalisés en argent sterling',
        ar: 'خاتم اسم عربي مخصص من الذهب: مجوهرات مخصصة من الفضة الإسترليني',
        _is_seeded: true,
        _is_personalizable: true
      },
      description_translations: {
        en: 'Golden Arabic Name Ring • Personalized Arabic Name Ring • Minimalist Arabic Silver Ring\n\nMaterial: Solid 925 Sterling Silver base.\nFinish options: 18k Gold, 18k Rose Gold, Sterling Silver.\n\nENABLE PERSONALIZATION ( for name )',
        fr: 'Bague prénom arabe dorée • Bague prénom arabe personnalisée • Bague personnalisée • Bague arabe fine en argent\n\nDÉTAILS\n• Fait main avec amour ♡\n• Matériau : base en argent sterling massif 925 carats\n• Options de finition : or 18 carats, or rose 18 carats, argent sterling\n\nENABLE PERSONALIZATION ( for name )',
        ar: 'خاتم اسم عربي ذهبي • خاتم اسم عربي مخصص • خاتم عربي رقيق من الفضة\n\nالتفاصيل\n• مصنوع يدوياً بحب ♡\n• المادة: قاعدة من الفضة الإسترليني عيار 925 صلبة\n• خيارات الإنهاء: ذهب عيار 18، ذهب وردي عيار 18، فضة إسترليني\n\nتفعيل التخصيص (للاسم)',
        _is_seeded: true,
        _is_personalizable: true
      },
      base_price_mad: 210.00,
      media_gallery: [
        '/afus-products/BerberKilimArtisans/2/il_794xN.2226270604_42gw.webp',
        '/afus-products/BerberKilimArtisans/2/IMG_0663_sh1xfj.mp4',
        '/afus-products/BerberKilimArtisans/2/il_794xN.2271891523_mebc.webp',
        '/afus-products/BerberKilimArtisans/2/il_794xN.2288359037_ey7u.avif'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const { data: newP2 } = await supabase.from('products').insert(p2Payload).select('id').single();
    const pId2 = newP2.id;
    console.log(`Inserted P2: ${pId2}`);

    const finishes2 = ['Or', 'Argent'];
    for (const f of finishes2) {
      for (const s of sizes1) {
        await supabase.from('product_variants').insert({
          product_id: pId2,
          sku: `BER-RING2-${f.toUpperCase()}-${s}`,
          price_override_mad: null,
          stock_quantity: 50,
          attributes: {
            en: { finish: f, size: s },
            fr: { finition: f, taille: s },
            ar: { النهاية: f, المقاس: s },
            _is_seeded: true,
            _is_personalizable: true
          }
        });
      }
    }

    // =========================================================
    // Zellij 3: Bague prénom arabe personnalisée en or
    // =========================================================
    const p3Payload = {
      ...p2Payload,
      shop_id: zellijId,
      base_price_mad: 300.00,
      media_gallery: [
        '/afus-products/ZellijMosaicBistros/3/il_794xN.6962028064_s94m.avif',
        '/afus-products/ZellijMosaicBistros/3/WhatsApp_Video_2025-06-22_at_21.44.10_tn8tbn.mp4',
        '/afus-products/ZellijMosaicBistros/3/il_794xN.7009996659_fhdj.avif',
        '/afus-products/ZellijMosaicBistros/3/il_794xN.7009998259_2dbx.avif'
      ]
    };
    
    const { data: newP3 } = await supabase.from('products').insert(p3Payload).select('id').single();
    const pId3 = newP3.id;
    console.log(`Inserted P3: ${pId3}`);

    const sizes3 = ['8 US', '9 US', '10 US', '11 US'];
    for (const f of finishes2) {
      for (const s of sizes3) {
        await supabase.from('product_variants').insert({
          product_id: pId3,
          sku: `ZEL-RING3-${f.toUpperCase()}-${s.replace(' ', '')}`,
          price_override_mad: null,
          stock_quantity: 50,
          attributes: {
            en: { finish: f, size: s },
            fr: { finition: f, taille: s },
            ar: { النهاية: f, المقاس: s },
            _is_seeded: true,
            _is_personalizable: true
          }
        });
      }
    }

    // =========================================================
    // Zellij 4: Bague touareg en argent sterling faite main
    // =========================================================
    const p4Payload = {
      shop_id: zellijId,
      category_id: categoryId,
      slug_translations: {
        en: 'handmade-tuareg-sterling-silver-ring-yaz-z',
        fr: 'bague-touareg-argent-sterling-faite-main-yaz',
        ar: 'خاتم-طوارق-مصنوع-يدويا-من-الفضة-الإسترليني',
        _is_seeded: true,
        _is_personalizable: true
      },
      title_translations: {
        en: 'Handmade Tuareg Sterling Silver Ring: Berber Tribal Jewelry Yaz Z',
        fr: 'Bague touareg en argent sterling faite main : bijoux tribaux berbères Yaz Z',
        ar: 'خاتم طوارق من الفضة الإسترليني مصنوع يدويًا: مجوهرات قبائل البربر ياز',
        _is_seeded: true,
        _is_personalizable: true
      },
      description_translations: {
        en: 'Handmade by Tuareg Berber artisans.\nThis unique Tuareg sterling silver ring with Amazigh Yaz symbol comes from Southern Morocco. Perfect gift for lovers of African and Berber tribal jewelry.\n\nENABLE PERSONALIZATION ( for name )',
        fr: 'Fabriqué à la main par des artisans berbères touaregs.\nCette bague unique en argent sterling touareg avec symbole amazigh yaz provient du sud du Maroc et met en valeur un savoir-faire exquis. Cadeau parfait pour amateurs de bijoux africains, berbères et tribaux.\n\nENABLE PERSONALIZATION ( for name )',
        ar: 'مصنوع يدوياً بواسطة حرفيين بربر طوارق.\nيأتي هذا الخاتم الفريد من الفضة الإسترليني بتصميم الطوارق مع رمز ياز الأمازيغي من جنوب المغرب ويسلط الضوء على الحرفية الرائعة.\n\nتفعيل التخصيص (للاسم)',
        _is_seeded: true,
        _is_personalizable: true
      },
      base_price_mad: 550.00,
      media_gallery: [
        '/afus-products/ZellijMosaicBistros/4/il_794xN.6962028064_s94m.avif',
        '/afus-products/ZellijMosaicBistros/4/WhatsApp_Video_2025-06-22_at_21.44.10_tn8tbn.mp4',
        '/afus-products/ZellijMosaicBistros/4/il_794xN.7009996659_fhdj.avif',
        '/afus-products/ZellijMosaicBistros/4/il_794xN.7009998259_2dbx.avif'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const { data: newP4 } = await supabase.from('products').insert(p4Payload).select('id').single();
    const pId4 = newP4.id;
    console.log(`Inserted P4: ${pId4}`);

    const sizes4 = ['7.5 US', '8 US', '9 US', '10 US', '11 US'];
    for (const s of sizes4) {
      await supabase.from('product_variants').insert({
        product_id: pId4,
        sku: `ZEL-RING4-${s.replace(/[\.\ ]/g, '')}`,
        price_override_mad: null,
        stock_quantity: 50,
        attributes: {
          en: { size: s },
          fr: { taille: s },
          ar: { المقاس: s },
          _is_seeded: true,
          _is_personalizable: true
        }
      });
    }

    // =========================================================
    // Zellij 5: 14K Gold Arabic Name Bracelet
    // =========================================================
    const p5Payload = {
      shop_id: zellijId,
      category_id: categoryId,
      slug_translations: {
        en: '14k-gold-arabic-name-bracelet',
        fr: 'bracelet-prenom-arabe-or-14k',
        ar: 'سوار-اسم-عربي-ذهب-عيار-14',
        _is_seeded: true,
        _is_personalizable: true
      },
      title_translations: {
        en: '14K Gold Arabic Name Bracelet, Dainty Arabic Bracelet, Minimalist Jewelry',
        fr: 'Bracelet prénom arabe en or 14 carats, bracelet délicat, bijoux minimalistes',
        ar: 'سوار اسم عربي من الذهب عيار 14، سوار دقيق، مجوهرات بسيطة',
        _is_seeded: true,
        _is_personalizable: true
      },
      description_translations: {
        en: 'Dainty Arabic name bracelet in 14k gold. A beautiful minimalist jewelry piece, perfect as a personalized gift.\n\nENABLE PERSONALIZATION (Please leave us your personalization info, e.g. ياسمين)',
        fr: 'Bracelet prénom arabe délicat en or 14 carats. Un magnifique bijou minimaliste, parfait comme cadeau personnalisé.\n\nENABLE PERSONALIZATION (Merci de nous laisser vos informations de personnalisation : Ex : ياسمين)',
        ar: 'سوار اسم عربي دقيق من الذهب عيار 14. قطعة مجوهرات بسيطة وجميلة، مثالية كهدية مخصصة.\n\nتفعيل التخصيص (يرجى ترك معلومات التخصيص الخاصة بك، مثال: ياسمين)',
        _is_seeded: true,
        _is_personalizable: true
      },
      base_price_mad: 550.00,
      media_gallery: [
        '/afus-products/ZellijMosaicBistros/5/il_794xN.6174890987_mfmu.webp',
        '/afus-products/ZellijMosaicBistros/5/Arabic_Name_Bracelet_Goldmira_fghekb.mp4',
        '/afus-products/ZellijMosaicBistros/5/il_75x75.6126787064_46gd.avif',
        '/afus-products/ZellijMosaicBistros/5/il_794xN.6174891465_64ck.avif'
      ],
      stock_quantity: 50,
      is_active: true
    };

    const { data: newP5 } = await supabase.from('products').insert(p5Payload).select('id').single();
    const pId5 = newP5.id;
    console.log(`Inserted P5: ${pId5}`);

    const finishes5 = ['Or 14 carats', 'Or blanc 14 carats', 'Or rose 14k'];
    const lengths5 = ['Rallonge 4 pouces', '5 pouces', '6 pouces'];

    for (const f of finishes5) {
      for (const l of lengths5) {
        await supabase.from('product_variants').insert({
          product_id: pId5,
          sku: `ZEL-BRACELET5-${f.substring(0,2).toUpperCase()}-${l.substring(0,1).toUpperCase()}`,
          price_override_mad: null,
          stock_quantity: 50,
          attributes: {
            en: { finish: f, length: l },
            fr: { finition: f, longueur: l },
            ar: { النهاية: f, الطول: l },
            _is_seeded: true,
            _is_personalizable: true
          }
        });
      }
    }

    console.log('Live Database Seed Completed Successfully!');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
