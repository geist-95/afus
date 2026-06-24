import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We need the service role key to bypass RLS for inserting categories
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const legacyCategoryMapping = {
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

const reverseCategoryMapping = Object.fromEntries(
  Object.entries(legacyCategoryMapping).map(([k, v]) => [v, k])
);

const staticCategories = [
  { id: 'cat_jewelry', slug: 'jewelry', name: { en: 'Jewelry', fr: 'Bijoux', ar: 'مجوهرات', tz: 'ⵜⵉⵣⴱⴳⴰⵏ' } },
  { id: 'cat_clothing', slug: 'clothing', name: { en: 'Clothing', fr: 'Vêtements', ar: 'ملابس', tz: 'ⵉⵀⴷⵓⵎⵏ' } },
  { id: 'cat_home_living', slug: 'home-living', name: { en: 'Home & Living', fr: 'Maison & Vie', ar: 'المنزل والمعيشة', tz: 'ⵜⴰⴷⴷⴰⵔⵜ' } },
  { id: 'cat_art_collectibles', slug: 'art-collectibles', name: { en: 'Art & Collectibles', fr: 'Art & Objets de Collection', ar: 'الفن والمقتنيات', tz: 'ⵜⴰⵥⵓⵕⵉ' } },
  { id: 'cat_craft_supplies', slug: 'craft-supplies', name: { en: 'Craft Supplies & Tools', fr: 'Fournitures d\'Artisanat', ar: 'مستلزمات الحرف والأدوات', tz: 'ⵜⵉⵙⵖⴰⵏ ⵏ ⵜⵥⵓⵕⵉ' } },
  { id: 'cat_accessories', slug: 'accessories', name: { en: 'Accessories', fr: 'Accessoires', ar: 'إكسسوارات', tz: 'ⵉⵙⵎⴰⵎⵓⵜⵏ' } },
  { id: 'cat_bags_purses', slug: 'bags-purses', name: { en: 'Bags & Purses', fr: 'Sacs & Porte-Monnaie', ar: 'الحقائب والمحافظ', tz: 'ⵉⵇⵕⴰⴱⵏ' } },
  { id: 'cat_bath_beauty', slug: 'bath-beauty', name: { en: 'Bath & Beauty', fr: 'Bain & Beauté', ar: 'الاستحمام والتجميل', tz: 'ⴰⴼⴰⵍⴽⴰⵢ' } },
  { id: 'cat_weddings', slug: 'weddings', name: { en: 'Weddings', fr: 'Mariages', ar: 'حفلات الزفاف', tz: 'ⵜⵉⵎⵖⵔⵉⵡⵉⵏ' } },
  { id: 'cat_toys_games', slug: 'toys-games', name: { en: 'Toys & Games', fr: 'Jouets & Jeux', ar: 'الألعاب والدمى', tz: 'ⵉⵓⵔⴰⵔⵏ' } },
  { id: 'cat_kids_baby', slug: 'kids-baby', name: { en: 'Kids & Baby', fr: 'Enfants & Bébés', ar: 'الأطفال والرضع', tz: 'ⵉⵎⵥⵥⵢⴰⵏⵏ ⴷ ⵉⵣⴳⵣⴰⵡⵏ' } },
  { id: 'cat_paper_party', slug: 'paper-party', name: { en: 'Paper & Party Supplies', fr: 'Papier & Fournitures de Fête', ar: 'الورق ومستلزمات الحفلات', tz: 'ⵜⴰⵏⴼⵓⵍⵜ ⴷ ⵜⵉⴼⴼⵓⴳⵍⵉⵡⵉⵏ' } },
  { id: 'cat_electronics', slug: 'electronics', name: { en: 'Electronics & Accessories', fr: 'Électronique & Accessoires', ar: 'الإلكترونيات وملحقاتها', tz: 'ⵜⵉⵍⵉⴽⵜⵕⵓⵏⵉⵏ' } },
  { id: 'cat_pet_supplies', slug: 'pet-supplies', name: { en: 'Pet Supplies', fr: 'Fournitures pour Animaux', ar: 'مستلزمات الحيوانات الأليفة', tz: 'ⵉⵎⵓⴷⴰⵔ ⵏ ⵜⴰⴷⴷⴰⵔⵜ' } },
  { id: 'cat_shoes', slug: 'shoes', name: { en: 'Shoes', fr: 'Chaussures', ar: 'الأحذية', tz: 'ⵉⴷⵓⴽⴰⵏ' } },
  { id: 'cat_books_media', slug: 'books-media', name: { en: 'Books, Movies & Music', fr: 'Livres, Films & Musique', ar: 'الكتب والأفلام والموسيقى', tz: 'ⵉⴷⵍⵉⵙⵏ, ⵉⵙⵓⵔⴰ, ⴷ ⵓⵥⴰⵡⴰⵏ' } },
  { id: 'cat_gifts', slug: 'gifts', name: { en: 'Gifts', fr: 'Cadeaux', ar: 'الهدايا', tz: 'ⵜⵉⵙⵎⵖⵓⵔⵉⵏ' } }
];

async function seedCategories() {
  console.log('Seeding missing categories...');
  
  const records = staticCategories.map(cat => ({
    id: reverseCategoryMapping[cat.id],
    slug: cat.slug,
    name_translations: cat.name
  }));

  const { data, error } = await supabase
    .from('categories')
    .upsert(records, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting categories:', error);
  } else {
    console.log('Categories seeded successfully!');
  }
}

seedCategories();
