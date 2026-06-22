import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const legacyCategoryMapping: Record<string, string> = {
  '1a111111-1111-1111-1111-111111111111': 'cat_jewelry',
  '2b222222-2222-2222-2222-222222222222': 'cat_art_collectibles',
  '3c333333-3333-3333-3333-333333333333': 'cat_bath_beauty',
  '4d444444-4444-4444-4444-444444444444': 'cat_clothing',
  '5e555555-5555-5555-5555-555555555555': 'cat_bags_purses',
  '6f666666-6666-6666-6666-666666666666': 'cat_home_living',
  '7a777777-7777-7777-7777-777777777777': 'cat_craft_supplies',
  '8b888888-8888-8888-8888-888888888888': 'cat_accessories',
  '9c999999-9999-9999-9999-999999999999': 'cat_weddings',
  '0a000000-0000-0000-0000-000000000000': 'cat_toys_games',
  '1b111111-1111-1111-1111-111111111112': 'cat_kids_baby',
  '2c222222-2222-2222-2222-222222222223': 'cat_paper_party',
  '3d333333-3333-3333-3333-333333333334': 'cat_electronics',
  '4e444444-4444-4444-4444-444444444445': 'cat_pet_supplies',
  '5f555555-5555-5555-5555-555555555556': 'cat_shoes',
  '6a666666-6666-6666-6666-666666666667': 'cat_books_media',
  '7b777777-7777-7777-7777-777777777778': 'cat_gifts',
};

const reverseCategoryMapping: Record<string, string> = Object.fromEntries(
  Object.entries(legacyCategoryMapping).map(([k, v]) => [v, k])
);

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { shop_id, category_id, title, price, imageUrl } = await req.json();

    if (!shop_id || !category_id || !title || !price || !imageUrl) {
      return NextResponse.json({ error: 'Missing required product parameters' }, { status: 400 });
    }

    const titleTranslations = {
      en: title,
      fr: title,
      ar: title,
    };

    const descriptionTranslations = {
      en: 'Your first craft listing on afus.',
      fr: 'Votre première création sur afus.',
      ar: 'أول قطعة من إبداعك على أفوس.',
    };

    const slugTranslations = {
      en: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      fr: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ar: 'منتج-جديد',
    };

    let resolvedCategoryId = category_id;
    if (reverseCategoryMapping[category_id]) {
      resolvedCategoryId = reverseCategoryMapping[category_id];
    }

    const { data, error } = await supabase.from('products').insert({
      shop_id,
      category_id: resolvedCategoryId,
      title_translations: titleTranslations,
      description_translations: descriptionTranslations,
      slug_translations: slugTranslations,
      base_price_mad: parseFloat(price) || 0,
      media_gallery: [imageUrl],
      stock_quantity: 99,
      is_active: true,
    }).select().single();

    if (error) {
      console.error('Server-side onboarding product insertion error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err: any) {
    console.error('Onboarding product route error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
