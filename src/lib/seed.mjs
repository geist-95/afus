import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUser(email, password, fullName, phone, role) {
  console.log(`\n--- Seeding User: ${email} (${role}) ---`);
  
  // 1. Try to sign up the user via Supabase Auth
  let userId;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered') || signUpError.message.includes('User already exists')) {
      console.log(`User ${email} already exists in auth.users. Fetching existing profile...`);
      // Since we can't view auth.users without admin key, we will sign in to get their user ID
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        console.error(`Could not sign in existing user ${email}:`, signInError.message);
        throw signInError;
      }
      userId = signInData.user.id;
    } else {
      console.error(`Sign up error for ${email}:`, signUpError.message);
      throw signUpError;
    }
  } else {
    userId = signUpData.user.id;
    console.log(`Successfully signed up ${email}. Created User ID: ${userId}`);
  }

  // 2. Insert or update the profile row in 'profiles'
  const profilePayload = {
    id: userId,
    email,
    full_name: fullName,
    role,
    phone_number: phone,
    preferred_language: 'en',
  };

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .upsert(profilePayload)
    .select()
    .single();

  if (profileError) {
    console.error(`Error upserting profile for ${email}:`, profileError.message);
    throw profileError;
  }

  console.log(`Successfully upserted profile for ${email}:`, profileData.id);
  return userId;
}

async function runSeed() {
  console.log('Starting live database seed...');

  try {
    // Step 1: Seed Users and Profiles
    const seller1Id = await seedUser('seller1@afus.ma', 'password123', 'Atlas Artisanat Owner', '+212661234567', 'seller');
    const seller2Id = await seedUser('seller2@afus.ma', 'password123', 'Maison du Cuir Fez Owner', '+212678901234', 'seller');
    const buyer1Id = await seedUser('buyer1@afus.ma', 'password123', 'Amine Bensouda', '+212661112233', 'buyer');

    // Step 2: Seed Shops
    console.log('\n--- Seeding Shops ---');
    const shop1Payload = {
      owner_id: seller1Id,
      name: 'Atlas Artisanat',
      slug: 'atlas-artisanat',
      logo_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80&h=80&fit=crop',
      banner_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&fit=crop',
      description_translations: {
        en: 'authentic hand-crafted moroccan carpets and brass decor direct from marrakech.',
        fr: 'tapis marocains artisanaux authentiques et décorations en laiton en direct de marrakech.',
        ar: 'سجاد مغربي تقليدي وديكورات نحاسية أصلية مباشرة من مراكش.'
      },
      store_policy_translations: {
        en: 'delivery via amana COD. returns accepted within 7 days. return shipping paid by buyer.',
        fr: 'livraison via amana paiement à la livraison. retours acceptés sous 7 jours. frais de retour à la charge de l\'acheteur.',
        ar: 'الشحن عبر أمانة الدفع عند الاستلام. يُقبل الإرجاع خلال 7 أيام. المشتري يتكفل بمصاريف الشحن.'
      },
      faq_translations: [
        {
          q: { en: 'how long does shipping take?', fr: 'combien de temps prend la livraison?', ar: 'كم يستغرق الشحن؟' },
          a: { en: 'amana delivery typically takes 2-3 business days inside morocco.', fr: 'la livraison amana prend généralement 2 à 3 jours ouvrables au maroc.', ar: 'يستغرق شحن أمانة عادةً من يومين إلى 3 أيام عمل داخل المغرب.' }
        }
      ],
      merchant_city: 'Marrakech',
      pickup_address_street: '32 derb snan, bab doukkala, marrakech',
      ice_number: '123456789012345',
      is_verified: true,
      is_vacation_mode: false,
      average_rating: 4.8,
      completed_orders_count: 142
    };

    const shop2Payload = {
      owner_id: seller2Id,
      name: 'Maison du Cuir Fez',
      slug: 'maison-du-cuir-fez',
      logo_url: 'https://images.unsplash.com/photo-1473187983305-f6150a1e8f96?w=80&h=80&fit=crop',
      banner_url: 'https://images.unsplash.com/photo-1524295988766-414ebc361e25?w=800&fit=crop',
      description_translations: {
        en: 'premium leather goods made with traditional vegetable tanning in fez.',
        fr: 'maroquinerie haut de gamme tannée de manière végétale traditionnelle à fès.',
        ar: 'منتجات جلدية فاخرة مصنوعة بالدباغة النباتية التقليدية بفاس.'
      },
      store_policy_translations: {
        en: 'flat rates. cash on delivery only. inspection upon delivery allowed.',
        fr: 'tarifs fixes. paiement à la livraison. vérification autorisée à la livraison.',
        ar: 'أسعار ثابتة. الدفع عند الاستلام. يُسمح بفحص المنتج عند التسليم.'
      },
      faq_translations: [
        {
          q: { en: 'is the leather genuine?', fr: 'est-ce du vrai cuir?', ar: 'هل الجلد طبيعي؟' },
          a: { en: '100% genuine goat and camel leather from Chouara tannery.', fr: '100% cuir de chèvre et de chameau authentique de la tannerie chouara.', ar: 'جلد ماعز وجمال طبيعي 100٪ من مدبغة الشوارة.' }
        }
      ],
      merchant_city: 'Fes',
      pickup_address_street: '15 derb el mitar, fez el bali',
      ice_number: '987654321098765',
      is_verified: true,
      is_vacation_mode: false,
      average_rating: 4.9,
      completed_orders_count: 89
    };

    // Upsert shops (match by slug)
    // First query if shop exists to get ID, or insert new
    let shop1Id, shop2Id;

    const { data: s1Check } = await supabase.from('shops').select('id').eq('slug', 'atlas-artisanat');
    if (s1Check && s1Check.length > 0) {
      shop1Id = s1Check[0].id;
      await supabase.from('shops').update(shop1Payload).eq('id', shop1Id);
      console.log('Updated existing Atlas Artisanat shop:', shop1Id);
    } else {
      const { data: s1New, error: s1Err } = await supabase.from('shops').insert(shop1Payload).select('id').single();
      if (s1Err) throw s1Err;
      shop1Id = s1New.id;
      console.log('Inserted Atlas Artisanat shop:', shop1Id);
    }

    const { data: s2Check } = await supabase.from('shops').select('id').eq('slug', 'maison-du-cuir-fez');
    if (s2Check && s2Check.length > 0) {
      shop2Id = s2Check[0].id;
      await supabase.from('shops').update(shop2Payload).eq('id', shop2Id);
      console.log('Updated existing Maison du Cuir Fez shop:', shop2Id);
    } else {
      const { data: s2New, error: s2Err } = await supabase.from('shops').insert(shop2Payload).select('id').single();
      if (s2Err) throw s2Err;
      shop2Id = s2New.id;
      console.log('Inserted Maison du Cuir Fez shop:', shop2Id);
    }

    // Step 3: Seed Products
    console.log('\n--- Seeding Products ---');
    const p1Payload = {
      shop_id: shop1Id,
      category_id: '6f666666-6666-6666-6666-666666666666', // home-living
      slug_translations: {
        en: 'handwoven-wool-tazar-rug',
        fr: 'tapis-tazar-en-laine-tisse-main',
        ar: 'سجاد-تازار-صوف-منسوج-يدويا'
      },
      title_translations: {
        en: 'handwoven wool tazar rug - authentic marrakech Berber art',
        fr: 'tapis tazar en laine tissé main - art berbère authentique de marrakech',
        ar: 'سجاد تازار صوف منسوج يدوياً - فن بربري أصيل من مراكش'
      },
      description_translations: {
        en: 'this exquisite wool rug is hand-woven by local berber women in the high atlas mountains. features traditional geometric patterns using organic dyes.',
        fr: 'ce magnifique tapis en laine est tissé à la main par des femmes berbères locales dans le haut atlas. présente des motifs géométriques traditionnels utilisant des colorants organiques.',
        ar: 'هذه السجادة الصوفية الرائعة منسوجة يدوياً بواسطة نساء بربريات محليات في جبال الأطلس الكبير. تتميز بنقوش هندسية تقليدية باستخدام أصباغ عضوية.'
      },
      base_price_mad: 1250.00,
      media_gallery: [
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop',
        'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&fit=crop'
      ],
      stock_quantity: 3,
      is_active: true
    };

    const p2Payload = {
      shop_id: shop2Id,
      category_id: '5e555555-5555-5555-5555-555555555555', // bags
      slug_translations: {
        en: 'classic-fez-leather-satchel',
        fr: 'sacoche-classique-en-cuir-de-fes',
        ar: 'حقيبة-جلدية-كلاسيكية-من-فاس'
      },
      title_translations: {
        en: 'classic fez leather satchel - vegetable tanned camel leather',
        fr: 'sacoche classique en cuir de fès - cuir de chameau tanné végétal',
        ar: 'حقيبة جلدية كلاسيكية من فاس - جلد جمال مدبوغ نباتياً'
      },
      description_translations: {
        en: 'durable satchel with brass buckles and adjustable shoulder strap. fits 13 inch laptops. smells like authentic premium moroccan leather.',
        fr: 'sacoche durable avec boucles en laiton et bandoulière réglable. convient aux ordinateurs de 13 pouces. sent le cuir marocain authentique.',
        ar: 'حقيبة متينة بإبزيم نحاسي وحزام كتف قابل للتعديل. تتسع للابتوب 13 بوصة. تفوح برائحة الجلد المغربي الفاخر الأصيل.'
      },
      base_price_mad: 450.00,
      media_gallery: [
        'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&fit=crop'
      ],
      stock_quantity: 12,
      is_active: true
    };

    const p3Payload = {
      shop_id: shop1Id,
      category_id: '1a111111-1111-1111-1111-111111111111', // jewelry
      slug_translations: {
        en: 'filigree-brass-lantern',
        fr: 'lanterne-en-laiton-filigrane',
        ar: 'فانوس-نحاسي-مخرم'
      },
      title_translations: {
        en: 'filigree brass lantern - intricate shadows lamp',
        fr: 'lanterne en laiton filigrane - lampe à ombres complexes',
        ar: 'فانوس نحاسي مخرم - مصباح ظلال معقدة'
      },
      description_translations: {
        en: 'cast beautiful shadows across your room with this hand-carved copper lantern. includes pre-wired bulb fixture.',
        fr: 'projetez de magnifiques ombres dans votre pièce avec cette lanterne en cuivre sculptée à la main. comprend un luminaire pré-câblé.',
        ar: 'اصنع ظلالاً جميلة في غرفتك مع هذا الفانوس النحاسي المحفور يدوياً. يشمل مقبس لمبة مجهز.'
      },
      base_price_mad: 320.00,
      media_gallery: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&fit=crop'
      ],
      stock_quantity: 5,
      is_active: true
    };

    let p1Id, p2Id, p3Id;

    const { data: p1Check } = await supabase.from('products').select('id').eq('slug_translations->>en', 'handwoven-wool-tazar-rug');
    if (p1Check && p1Check.length > 0) {
      p1Id = p1Check[0].id;
      await supabase.from('products').update(p1Payload).eq('id', p1Id);
      console.log('Updated existing Product 1:', p1Id);
    } else {
      const { data: p1New, error: p1Err } = await supabase.from('products').insert(p1Payload).select('id').single();
      if (p1Err) throw p1Err;
      p1Id = p1New.id;
      console.log('Inserted Product 1:', p1Id);
    }

    const { data: p2Check } = await supabase.from('products').select('id').eq('slug_translations->>en', 'classic-fez-leather-satchel');
    if (p2Check && p2Check.length > 0) {
      p2Id = p2Check[0].id;
      await supabase.from('products').update(p2Payload).eq('id', p2Id);
      console.log('Updated existing Product 2:', p2Id);
    } else {
      const { data: p2New, error: p2Err } = await supabase.from('products').insert(p2Payload).select('id').single();
      if (p2Err) throw p2Err;
      p2Id = p2New.id;
      console.log('Inserted Product 2:', p2Id);
    }

    const { data: p3Check } = await supabase.from('products').select('id').eq('slug_translations->>en', 'filigree-brass-lantern');
    if (p3Check && p3Check.length > 0) {
      p3Id = p3Check[0].id;
      await supabase.from('products').update(p3Payload).eq('id', p3Id);
      console.log('Updated existing Product 3:', p3Id);
    } else {
      const { data: p3New, error: p3Err } = await supabase.from('products').insert(p3Payload).select('id').single();
      if (p3Err) throw p3Err;
      p3Id = p3New.id;
      console.log('Inserted Product 3:', p3Id);
    }

    // Step 4: Seed Product Variants
    console.log('\n--- Seeding Product Variants ---');
    const v1Payloads = [
      { product_id: p1Id, sku: 'TAZ-RUG-S', price_override_mad: 1000.00, stock_quantity: 1, attributes: { en: { size: 'small (1mx1.5m)' }, fr: { taille: 'petit (1mx1.5m)' }, ar: { الحجم: 'صغير (1م×1.5م)' } } },
      { product_id: p1Id, sku: 'TAZ-RUG-M', price_override_mad: 1250.00, stock_quantity: 2, attributes: { en: { size: 'medium (1.5mx2.5m)' }, fr: { taille: 'moyen (1.5mx2.5m)' }, ar: { الحجم: 'متوسط (1.5م×2.5م)' } } }
    ];

    const v2Payloads = [
      { product_id: p2Id, sku: 'FEZ-SAT-BR', price_override_mad: 450.00, stock_quantity: 8, attributes: { en: { color: 'natural brown' }, fr: { couleur: 'marron naturel' }, ar: { اللون: 'بني طبيعي' } } },
      { product_id: p2Id, sku: 'FEZ-SAT-BL', price_override_mad: 480.00, stock_quantity: 4, attributes: { en: { color: 'onyx black' }, fr: { couleur: 'noir onyx' }, ar: { اللون: 'أسود أونيكس' } } }
    ];

    const allVariants = [...v1Payloads, ...v2Payloads];
    for (const v of allVariants) {
      const { data: vCheck } = await supabase.from('product_variants').select('id').eq('sku', v.sku);
      if (vCheck && vCheck.length > 0) {
        await supabase.from('product_variants').update(v).eq('id', vCheck[0].id);
        console.log(`Updated existing Variant ${v.sku}`);
      } else {
        await supabase.from('product_variants').insert(v);
        console.log(`Inserted Variant ${v.sku}`);
      }
    }

    console.log('\n======================================');
    console.log('Live Database Seed Completed Successfully!');
    console.log('======================================');

  } catch (err) {
    console.error('\nSeed script encountered error:', err);
  }
}

runSeed();
