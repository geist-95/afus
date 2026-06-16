export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const taxonomy: Category[] = [
  {
    id: 'cat_jewelry', name: 'Jewelry', slug: 'jewelry', subcategories: [
      'Body Jewelry', 'Bracelets', 'Brooches', 'Pins & Clips', 'Cremation & Memorial Jewelry', 'Cuff Links & Tie Clips', 'Earrings', 'Jewelry Sets', 'Jewelry Storage', 'Necklaces', 'Rings', 'Smart Jewelry', 'Watches'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_clothing', name: 'Clothing', slug: 'clothing', subcategories: [
      "Men's Clothing", "Women's Clothing", "Boys' Clothing", "Girls' Clothing", "Gender-Neutral Adult Clothing", "Gender-Neutral Kids' Clothing"
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_home_living', name: 'Home & Living', slug: 'home-living', subcategories: [
      'Home Decor', 'Furniture', 'Kitchen & Dining', 'Bedding', 'Bathroom', 'Lighting', 'Outdoor & Gardening', 'Storage & Organization', 'Office', 'Home Improvement', 'Home Appliances', 'Cleaning Supplies', 'Food & Drink', 'Spirituality & Religion'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_art_collectibles', name: 'Art & Collectibles', slug: 'art-collectibles', subcategories: [
      'Painting', 'Photography', 'Prints', 'Sculpture', 'Mixed Media & Collage', 'Drawing & Illustration', 'Glass Art', 'Fine Art Ceramics', 'Fiber Arts', 'Dolls & Miniatures', 'Collectibles', 'Artist Trading Cards'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_craft_supplies', name: 'Craft Supplies & Tools', slug: 'craft-supplies', subcategories: [
      'Home & Hobby', 'Jewelry & Beauty', 'Paper', 'Party & Kids', 'Sculpting & Forming', 'Sewing & Fiber', 'Visual Arts'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_accessories', name: 'Accessories', slug: 'accessories', subcategories: [
      'Hats & Head Coverings', 'Hair Accessories', 'Sunglasses & Eyewear', 'Scarves & Wraps', 'Gloves & Sleeves', 'Bags', 'Keychains & Lanyards', 'Patches & Appliques', 'Pins & Clips', 'Belts & Suspenders', 'Costume Accessories', 'Face Masks'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_bags_purses', name: 'Bags & Purses', slug: 'bags-purses', subcategories: [
      'Handbags', 'Backpacks', 'Totes', 'Wallets & Money Clips', 'Messenger Bags', 'Fanny Packs', 'Luggage & Travel', 'Diaper Bags', 'Cosmetic & Toiletry Storage', 'Pouches & Coin Purses'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_bath_beauty', name: 'Bath & Beauty', slug: 'bath-beauty', subcategories: [
      'Soaps', 'Bath Accessories', 'Skin Care', 'Hair Care', 'Makeup & Cosmetics', 'Fragrances', 'Essential Oils', 'Personal Care', 'Spa & Relaxation', 'Baby & Child Care'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_weddings', name: 'Weddings', slug: 'weddings', subcategories: [
      'Invitations & Paper', 'Decorations', 'Gifts & Mementos', 'Accessories', 'Clothing', 'Jewelry', 'Shoes'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_toys_games', name: 'Toys & Games', slug: 'toys-games', subcategories: [
      'Games & Puzzles', 'Toys', 'Sports & Outdoor Recreation'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_kids_baby', name: 'Kids & Baby', slug: 'kids-baby', subcategories: [
      "Baby Clothing", "Kids' Clothing", "Toys", "Games & Puzzles", "Nursery Decor", "Kids' Furniture", "Baby Blankets", "Baby Care", "Baby Gift Sets", "Children's Books"
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_paper_party', name: 'Paper & Party Supplies', slug: 'paper-party', subcategories: [
      'Paper', 'Party Supplies'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_electronics', name: 'Electronics & Accessories', slug: 'electronics', subcategories: [
      'Cell Phone Accessories', 'Decals & Skins', 'Electronics Cases', 'Computers & Peripherals', 'Audio', 'Cameras & Equipment', 'Video Games', 'Car Parts & Accessories', 'DIY Kits', 'Gadgets'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_pet_supplies', name: 'Pet Supplies', slug: 'pet-supplies', subcategories: [
      'Pet Clothing, Accessories & Shoes', 'Pet Collars & Leashes', 'Pet Bedding', 'Pet Toys', 'Pet Feeding', 'Pet Furniture', 'Pet Health & Wellness', 'Urns & Memorials'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_shoes', name: 'Shoes', slug: 'shoes', subcategories: [
      "Women's Shoes", "Men's Shoes", "Girls' Shoes", "Boys' Shoes", "Insoles & Accessories"
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_books_media', name: 'Books, Movies & Music', slug: 'books-media', subcategories: [
      'Books', 'Music', 'Movies', 'Video Cases & Tins'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  },
  {
    id: 'cat_gifts', name: 'Gifts', slug: 'gifts', subcategories: [
      'Personalized Gifts', 'Anniversary Gifts', 'Birthday Gifts', 'Gifts for Her', 'Gifts for Him', 'Gifts Under $30', 'Housewarming Gifts'
    ].map(name => ({ id: `sub_${generateSlug(name)}`, name, slug: generateSlug(name) }))
  }
];

export interface SuggestionMatch {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  score: number;
}

export const categoryTranslations: Record<string, Record<string, string>> = {
  // Category IDs
  'cat_jewelry': { en: "Jewelry", fr: "Bijoux", ar: "مجوهرات", tz: "ⵜⵉⵣⴱⴳⴰⵏ" },
  'cat_clothing': { en: "Clothing", fr: "Vêtements", ar: "ملابس", tz: "ⵉⵀⴷⵓⵎⵏ" },
  'cat_home_living': { en: "Home & Living", fr: "Maison & Déco", ar: "المنزل والمعيشة", tz: "ⵜⴰⴷⴷⴰⵔⵜ ⴷ ⵜⵓⴷⵔⵜ" },
  'cat_art_collectibles': { en: "Art & Collectibles", fr: "Art & Collections", ar: "الفن والمقتنيات", tz: "ⵜⴰⵥⵓⵕⵉ ⴷ ⵜⵉⵎⴳⵓⵔⵉⵏ" },
  'cat_craft_supplies': { en: "Craft Supplies & Tools", fr: "Fournitures créatives & Outils", ar: "لوازم وأدوات الأشغال اليدوية", tz: "ⵉⵎⴰⵙⵙⵏ ⵏ ⵜⵎⴳⵓⵔⵉ" },
  'cat_accessories': { en: "Accessories", fr: "Accessoires", ar: "إكسسوارات", tz: "ⵜⵉⵎⵍⵙⵉⵜ" },
  'cat_bags_purses': { en: "Bags & Purses", fr: "Sacs & Sacoches", ar: "حقائب ومحافظ", tz: "ⵜⵉⵙⴰⴽⵉⵏ" },
  'cat_bath_beauty': { en: "Bath & Beauty", fr: "Bain & Beauté", ar: "الاستحمام والجمال", tz: "ⴰⴼⴰⵍⴽⴰⵢ" },
  'cat_weddings': { en: "Weddings", fr: "Mariages", ar: "حفلات الزفاف", tz: "ⵜⵉⵎⵖⵔⵉⵡⵉⵏ" },
  'cat_toys_games': { en: "Toys & Games", fr: "Jouets & Jeux", ar: "الألعاب والألعاب اليدوية", tz: "ⵉⵎⵓⵔⴰⵔ" },
  'cat_kids_baby': { en: "Kids & Baby", fr: "Enfants & Bébés", ar: "الأطفال والرضع", tz: "ⴰⵣⴳⵣⴰⵡ" },
  'cat_paper_party': { en: "Paper & Party Supplies", fr: "Papeterie & Fêtes", ar: "الورق ومستلزمات الحفلات", tz: "ⵜⵉⴼⵔⵉⵜⵉⵏ ⵏ ⵜⴼⴰⵙⴽⴰ" },
  'cat_electronics': { en: "Electronics & Accessories", fr: "Électronique & Accessoires", ar: "الإلكترونيات وملحقاتها", tz: "ⵜⵉيلⵉⴽⵜⵔⵓⵏⵉⵢⵉⵏ" },
  'cat_pet_supplies': { en: "Pet Supplies", fr: "Fournitures pour animaux", ar: "مستلزمات الحيوانات الأليفة", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'cat_shoes': { en: "Shoes", fr: "Chaussures", ar: "أحذية", tz: "ⵉⵔⴽⴰⵙⵏ" },
  'cat_books_media': { en: "Books, Movies & Music", fr: "Livres, Films & Musique", ar: "الكتب والأفلام والموسيقى", tz: "ⵜⵉⴷⵍⵉⵙⵉⵏ ⴷ ⵓⵥⴰⵡⴰⵏ" },
  'cat_gifts': { en: "Gifts", fr: "Cadeaux", ar: "هدايا", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ" },

  // Subcategory IDs
  'sub_body-jewelry': { en: "Body Jewelry", fr: "Bijoux de corps", ar: "مجوهرات الجسم", tz: "ⵜⵉⵣⴱⴳⴰⵏ ⵏ ⵓⴼⴳⴰⵏ" },
  'sub_bracelets': { en: "Bracelets", fr: "Bracelets", ar: "أساور", tz: "ⵜⵉⵎⵉⵣⵔⵉⵏ" },
  'sub_brooches': { en: "Brooches", fr: "Broches", ar: "بروشات", tz: "ⵜⵉⴱⵣⵉⵎⵉⵏ" },
  'sub_pins-clips': { en: "Pins & Clips", fr: "Épingles & Pinces", ar: "دبابيس ومشابك", tz: "ⵜⵉⴱⵣⵉⵎⵉⵏ ⵜⵉⵎⵥⵥⵢⴰⵏⵉⵏ" },
  'sub_cremation-memorial-jewelry': { en: "Cremation & Memorial Jewelry", fr: "Bijoux commémoratifs", ar: "مجوهرات تذكارية", tz: "ⵜⵉⵣⴱⴳⴰⵏ ⵏ ⵓⴽⵜⵜⴰⵢ" },
  'sub_cuff-links-tie-clips': { en: "Cuff Links & Tie Clips", fr: "Boutons de manchette & Pinces à cravate", ar: "أزرار أكمام ومشابك ربطات عنق", tz: "ⵜⵉⴱⵣⵉⵎⵉⵏ ⵏ ⵜⵎⵍⵙⵉⵜ" },
  'sub_earrings': { en: "Earrings", fr: "Boucles d'oreilles", ar: "أقراط", tz: "ⵜⵉⵎⵔⵡⴰⵃⵉⵏ" },
  'sub_jewelry-sets': { en: "Jewelry Sets", fr: "Parures de bijoux", ar: "أطقم مجوهرات", tz: "ⵜⵉⴳⵔⵓⵎⵎⵉⵡⵉⵏ ⵏ ⵜⵉⵣⴱⴳⴰⵏ" },
  'sub_jewelry-storage': { en: "Jewelry Storage", fr: "Rangement à bijoux", ar: "صناديق مجوهرات", tz: "ⴰⵙⵏⴱⴰⵔ ⵏ ⵜⵉيزⴱⴳⴰⵏ" },
  'sub_necklaces': { en: "Necklaces", fr: "Colliers", ar: "قلادات", tz: "ⵜⵉⵣⵔⴰⵔⵉⵏ" },
  'sub_rings': { en: "Rings", fr: "Bagues", ar: "خواتم", tz: "ⵜⵉଖⴰⵜⵎⵉⵏ" },
  'sub_smart-jewelry': { en: "Smart Jewelry", fr: "Bijoux connectés", ar: "مجوهرات ذكية", tz: "ⵜⵉⵣⴱⴳⴰⵏ ⵜⵉⵎⴰⵢⵏⵓⵜⵉⵏ" },
  'sub_watches': { en: "Watches", fr: "Montres", ar: "ساعات", tz: "ⵜⵉⵙⵔⴰⴳⵉⵏ" },

  'sub_men-s-clothing': { en: "Men's Clothing", fr: "Vêtements pour hommes", ar: "ملابس رجالية", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵉⵔⴳⴰⵣⵏ" },
  'sub_women-s-clothing': { en: "Women's Clothing", fr: "Vêtements pour femmes", ar: "ملابس نسائية", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵜⵎⵖⴰⵔⵉⵏ" },
  'sub_boys-clothing': { en: "Boys' Clothing", fr: "Vêtements pour garçons", ar: "ملابس أولاد", tz: "ⵜⵉⵎⵍⵙا ⵏ ⵉⵛⵉⵔⵔⴰⵏ" },
  'sub_girls-clothing': { en: "Girls' Clothing", fr: "Vêtements pour filles", ar: "ملابس بنات", tz: "ⵜⵉⵎⵍⵙا ⵏ ⵜⵛⵉⵔⵔⴰⵜⵉⵏ" },
  'sub_gender-neutral-adult-clothing': { en: "Gender-Neutral Adult Clothing", fr: "Vêtements adultes mixtes", ar: "ملابس كبار للجنسين", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⴽⵓⵍⵓⵔ" },
  'sub_gender-neutral-kids-clothing': { en: "Gender-Neutral Kids' Clothing", fr: "Vêtements enfants mixtes", ar: "ملابس أطفال للجنسين", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵉⴼⵔⵅⴰⵏ" },

  'sub_home-decor': { en: "Home Decor", fr: "Décoration de maison", ar: "ديكور منزلي", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵜⴷⴷⴰⵔⵜ" },
  'sub_furniture': { en: "Furniture", fr: "Meubles", ar: "أثاث", tz: "ⴰⵙⵍⴰⵢ" },
  'sub_kitchen-dining': { en: "Kitchen & Dining", fr: "Cuisine & Salle à manger", ar: "المطبخ وتناول الطعام", tz: "ⴰⵏⵡⴰⵍ ⴷ ⵓⵙⴷⴷⵓ" },
  'sub_bedding': { en: "Bedding", fr: "Literie", ar: "أغطية وأسرة", tz: "ⵜⵉⵙⵉⵜⵉⵏ" },
  'sub_bathroom': { en: "Bathroom", fr: "Salle de bain", ar: "حمام", tz: "ⴰⵙⵉⵔⴷ" },
  'sub_lighting': { en: "Lighting", fr: "Éclairage", ar: "إضاءة", tz: "ⴰⵙⵉⴷ" },
  'sub_outdoor-gardening': { en: "Outdoor & Gardening", fr: "Extérieur & Jardinage", ar: "الحدائق والأماكن الخارجية", tz: "ⵜⵓⵔⵜⵉⵜ" },
  'sub_storage-organization': { en: "Storage & Organization", fr: "Rangement & Organisation", ar: "التخزين والتنظيم", tz: "ⴰⵙⵏⴱⴰⵔ" },
  'sub_office': { en: "Office", fr: "Bureau", ar: "مكتب", tz: "ⵜⴰⵡⵓⵔⵉ" },
  'sub_home-improvement': { en: "Home Improvement", fr: "Rénovation", ar: "تحسين المنزل", tz: "ⵜⴰⵎⵢⵓⵔⵜ ⵏ ⵜⴷⴷⴰⵔⵜ" },
  'sub_home-appliances': { en: "Home Appliances", fr: "Électroménager", ar: "أجهزة منزلية", tz: "ⵜⵉⵎⴰⵙⵙⵉⵏ ⵏ ⵜⴷⴷارⵜ" },
  'sub_cleaning-supplies': { en: "Cleaning Supplies", fr: "Fournitures de nettoyage", ar: "مستلزمات التنظيف", tz: "ⴰⵙⵉⵣⴷⴳ" },
  'sub_food-drink': { en: "Food & Drink", fr: "Nourriture & Boisson", ar: "الأكل والشرب", tz: "ⵓⵜⵛⵉ ⴷ ⵓⵙⵡⵉ" },
  'sub_spirituality-religion': { en: "Spirituality & Religion", fr: "Spiritualité & Religion", ar: "الروحانيات والأديان", tz: "ⵜⴰⵙⴳⴰ ⵏ ⵉⵎⴰⵏ" },

  'sub_painting': { en: "Painting", fr: "Peinture", ar: "رسم زيتي / مائي", tz: "ⵜⵉⵔⵔⴰ ⵏ ⴽⵓⵍⵓⵔ" },
  'sub_photography': { en: "Photography", fr: "Photographie", ar: "تصوير فوتوغرافي", tz: "ⵜⴰⵡⵍⴰⴼⵜ" },
  'sub_prints': { en: "Prints", fr: "Estampes & Gravures", ar: "مطبوعات", tz: "ⵜⵉⵣⵉⴳⵣⵉⵏ" },
  'sub_sculpture': { en: "Sculpture", fr: "Sculpture", ar: "نحت", tz: "ⴰⵖⵓⵣ" },
  'sub_mixed-media-collage': { en: "Mixed Media & Collage", fr: "Techniques mixtes", ar: "وسائط مختلطة وكولاج", tz: "ⵜⴰⵥⵓⵕⵉ ⵉⵙⵎⵓⵏⵏ" },
  'sub_drawing-illustration': { en: "Drawing & Illustration", fr: "Dessin & Illustration", ar: "رسم وتوضيح", tz: "ⴰⵙⵡⵓⵏⵖⵓ" },
  'sub_glass-art': { en: "Glass Art", fr: "Art du verre", ar: "فن الزجاج", tz: "ⵜⴰⵥⵓⵕⵉ ⵏ ⵓⵥⵔⵓ" },
  'sub_fine-art-ceramics': { en: "Fine Art Ceramics", fr: "Céramique d'art", ar: "خزف فني", tz: "ⵜⴰⵥⵓⵕⵉ ⵏ ⵜⴰⵍⴰⵇⵜ" },
  'sub_fiber-arts': { en: "Fiber Arts", fr: "Art textile", ar: "فنون الألياف", tz: "ⵜⴰⵥⵓⵕⵉ ⵏ ⵓⵙⵉين" },
  'sub_dolls-miniatures': { en: "Dolls & Miniatures", fr: "Poupées & Miniatures", ar: "دمى ومجسمات صغيرة", tz: "ⵜⵉⴳⵏⵓⵣⵉⵏ" },
  'sub_collectibles': { en: "Collectibles", fr: "Objets de collection", ar: "مقتنيات", tz: "ⵜⵉⵎⵙⵎⵓⵏⵉⵏ" },
  'sub_artist-trading-cards': { en: "Artist Trading Cards", fr: "Cartes d'artiste", ar: "بطاقات فنية متبادلة", tz: "ⵜⵉⴼⵔⵉⵜⵉⵏ ⵏ ⵓⵏⴰⵥⵓⵕ" },

  'sub_hats-head-coverings': { en: "Hats & Head Coverings", fr: "Chapeaux & Bonnets", ar: "قبعات وأغطية رأس", tz: "ⵜⵉⵇⵓⴱⴱⴰⵄⵉⵏ" },
  'sub_hair-accessories': { en: "Hair Accessories", fr: "Accessoires pour cheveux", ar: "إكسسوارات الشعر", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⵣⵣⴰⵔ" },
  'sub_sunglasses-eyewear': { en: "Sunglasses & Eyewear", fr: "Lunettes de soleil & Lunettes", ar: "نظارات شمسية وطبية", tz: "ⵜⵉⵙⵎⵉⵔⵉⵏ" },
  'sub_scarves-wraps': { en: "Scarves & Wraps", fr: "Écharpes & Foulards", ar: "أوشحة وأغطية", tz: "ⵜⵉⵙⴱⵏⵢⴰⵍⵉⵏ" },
  'sub_gloves-sleeves': { en: "Gloves & Sleeves", fr: "Gants & Manchettes", ar: "قفازات وأكمام", tz: "ⵜⵉⴼⵉⵍⵉⵏ ⵏ ⵓⴼⵓⵙ" },
  'sub_bags': { en: "Bags", fr: "Sacs", ar: "حقائب", tz: "ⵜⵉⵙⴰⴽⵉⵏ" },
  'sub_keychains-lanyards': { en: "Keychains & Lanyards", fr: "Porte-clés & Cordons", ar: "حمالات مفاتيح وعلاقات", tz: "ⵜⵉⴼⵔⵉⵜⵉⵏ ⵏ ⵜⵙⴰⵔⵓⵜ" },
  'sub_patches-appliques': { en: "Patches & Appliques", fr: "Écussons & Appliques", ar: "رقع وتطريزات", tz: "ⵜⵉⵔⵇⴰⵄⵉⵏ" },
  'sub_belts-suspenders': { en: "Belts & Suspenders", fr: "Ceintures & Bretelles", ar: "أحزمة وحمالات", tz: "ⵜⵉⵙⴼⵉⴼⵉⵏ" },
  'sub_costume-accessories': { en: "Costume Accessories", fr: "Accessoires de déguisement", ar: "إكسسوارات أزياء تنكرية", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵓⵎⵓⵔⴰⵔ" },
  'sub_face-masks': { en: "Face Masks", fr: "Masques en tissu", ar: "كمامات قماشية", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵓⴷⵎ" },

  'sub_handbags': { en: "Handbags", fr: "Sacs à main", ar: "حقائب يد", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⴼⵓⵙ" },
  'sub_backpacks': { en: "Backpacks", fr: "Sacs à dos", ar: "حقائب ظهر", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵜⴷⵔⵓⵔⵜ" },
  'sub_totes': { en: "Totes", fr: "Sacs cabas", ar: "حقائب تسوق", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⵙⴳⴷⵣ" },
  'sub_wallets-money-clips': { en: "Wallets & Money Clips", fr: "Portefeuilles & Pinces à billets", ar: "محافظ ومشابك نقود", tz: "ⵜⵉⵎⵙⵎⵓⵏⵉⵏ ⵏ ⵜⵉⴷⵔⵉⵎⵉⵏ" },
  'sub_messenger-bags': { en: "Messenger Bags", fr: "Sacs bandoulière", ar: "حقائب ساعي البريد", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵜⵡⵓⵔⵉ" },
  'sub_fanny-packs': { en: "Fanny Packs", fr: "Sacs bananes", ar: "حقائب خصر", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⴱⵔⵉⴷ" },
  'sub_luggage-travel': { en: "Luggage & Travel", fr: "Bagages & Voyage", ar: "حقائب السفر", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⵙⵉⴳⴳⵍ" },
  'sub_diaper-bags': { en: "Diaper Bags", fr: "Sacs à langer", ar: "حقائب حفاضات أطفال", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⴱⵉⴱⵉ" },
  'sub_cosmetic-toiletry-storage': { en: "Cosmetic & Toiletry Storage", fr: "Trousses de toilette & maquillage", ar: "حقائب مستحضرات التجميل", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⴼⴰⵍⴽⴰⵢ" },
  'sub_pouches-coin-purses': { en: "Pouches & Coin Purses", fr: "Pochettes & Porte-monnaie", ar: "محافظ نقود صغيرة", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵜⵉⵔⵔⵉ" },

  'sub_soaps': { en: "Soaps", fr: "Savons", ar: "صابون", tz: "ⴰⵙⴰⴱⵓⵏ" },
  'sub_bath-accessories': { en: "Bath Accessories", fr: "Accessoires de bain", ar: "ملحقات الاستحمام", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⵙⵉⵔⴷ" },
  'sub_skin-care': { en: "Skin Care", fr: "Soin de la peau", ar: "العناية بالبشرة", tz: "ⴰⵙⵉⴼⴰⵡ ⵏ ⵓⴷⵎ" },
  'sub_hair-care': { en: "Hair Care", fr: "Soin des cheveux", ar: "العناية بالشعر", tz: "ⴰⵙⵉⴼاⵡ ⵏ ⵓⵣⵣⴰⵔ" },
  'sub_makeup-cosmetics': { en: "Makeup & Cosmetics", fr: "Maquillage", ar: "مكياج ومستحضرات تجميل", tz: "ⴰⴼⴰⵍⴽⴰⵢ ⵏ ⵓⴷⵎ" },
  'sub_fragrances': { en: "Fragrances", fr: "Parfums", ar: "عطور", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵓⴷⵎ" },
  'sub_essential-oils': { en: "Essential Oils", fr: "Huiles essentielles", ar: "زيوت أساسية وطبيعية", tz: "ⵉⵎⵉⴽⵏ ⵏ ⵓⴼⴰⵍⴽⴰⵢ" },
  'sub_personal-care': { en: "Personal Care", fr: "Hygiène personnelle", ar: "العناية الشخصية", tz: "ⴰⵙⵉⴼⴰⵡ ⵏ ⵓⴼⴳⴰⵏ" },
  'sub_spa-relaxation': { en: "Spa & Relaxation", fr: "Spa & Détente", ar: "سبا واسترخاء", tz: "ⴰⵙⴳⵓⵏⴼⵓ" },
  'sub_baby-child-care': { en: "Baby & Child Care", fr: "Soins bébé & enfant", ar: "العناية بالرضع والأطفال", tz: "ⴰⵙⵉⴼⴰⵡ ⵏ ⵓⴱⵉⴱⵉ" },

  'sub_invitations-paper': { en: "Invitations & Paper", fr: "Invitations & Faire-part", ar: "دعوات ومستندات ورقية", tz: "ⵜⵉⴼⵔⵉⵜⵉⵏ ⵏ ⵜⵎⵖⵔⴰ" },
  'sub_decorations': { en: "Decorations", fr: "Décorations de mariage", ar: "ديكورات الأعراس", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⵙⴼⴰⵙⴽⴰ" },
  'sub_gifts-mementos': { en: "Gifts & Mementos", fr: "Cadeaux invités", ar: "هدايا وتذكارات زفاف", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵜⵎⵖⵔⴰ" },

  'sub_games-puzzles': { en: "Games & Puzzles", fr: "Jeux & Puzzles", ar: "ألعاب وألغاز", tz: "ⵉⵎⵓⵔⴰⵔ ⵏ ⵜⵎⵙⵙⵓⵔⵜ" },
  'sub_toys': { en: "Toys", fr: "Jouets", ar: "ألعاب أطفال", tz: "ⵉⵎⵓⵔⴰⵔ ⵏ ⵉⵛⵉⵔⵔⴰⵏ" },
  'sub_sports-outdoor-recreation': { en: "Sports & Outdoor Recreation", fr: "Sport & Loisirs extérieurs", ar: "رياضة وأنشطة خارجية", tz: "ⵜⵓⵏⵏⵓⵏⵜ ⵏ ⴱⵕⵕⴰ" },

  'sub_baby-clothing': { en: "Baby Clothing", fr: "Vêtements bébé", ar: "ملابس رضع", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵓⴱⵉⴱⵉ" },
  'sub_kids-clothing': { en: "Kids' Clothing", fr: "Vêtements enfants", ar: "ملابس أطفال", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵜⴼⵔⵅⵉⵏ" },
  'sub_nursery-decor': { en: "Nursery Decor", fr: "Décoration de chambre bébé", ar: "ديكور غرف الرضع", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⴱⵉⴱⵉ" },
  'sub_kids-furniture': { en: "Kids' Furniture", fr: "Meubles enfants", ar: "أثاث أطفال", tz: "ⴰⵙⵍⴰⵢ ⵏ ⵉⴼⵔⵅⴰⵏ" },
  'sub_baby-blankets': { en: "Baby Blankets", fr: "Couvertures bébé", ar: "أغطية رضع", tz: "ⵜⵉⴳⵔⵜⵉⵍⵉⵏ ⵏ ⵓⴱⵉⴱⵉ" },
  'sub_baby-care': { en: "Baby Care", fr: "Soins de bébé", ar: "عناية بالطفل الرضيع", tz: "ⴰⵙⵉⴼⴰⵡ ⵏ ⵓⴱⵉⴱⵉ" },
  'sub_baby-gift-sets': { en: "Baby Gift Sets", fr: "Coffrets cadeaux bébé", ar: "أطقم هدايا المواليد", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵓⴱⵉⴱⵉ" },
  'sub_children-s-books': { en: "Children's Books", fr: "Livres pour enfants", ar: "كتب أطفال", tz: "ⵜⵉⴷⵍⵉⵙⵉⵏ ⵏ ⵉⵛⵉⵔⵔⴰⵏ" },

  'sub_paper': { en: "Paper", fr: "Papier", ar: "ورق", tz: "ⵜⵉⴼⵔⵉⵜⵉⵏ" },
  'sub_party-supplies': { en: "Party Supplies", fr: "Articles de fête", ar: "مستلزمات الحفلات وأعياد الميلاد", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵜⴼⴰⵙⴽⴰ" },

  'sub_cell-phone-accessories': { en: "Cell Phone Accessories", fr: "Accessoires pour téléphone portable", ar: "ملحقات الهاتف المحمول", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⵜⵉⵍⵉⴼⵓⵏ" },
  'sub_decals-skins': { en: "Decals & Skins", fr: "Autocollants & Stickers", ar: "ملصقات وأغطية حماية", tz: "ⵜⵉⵍⴰⵚⵉⵇⵉⵏ" },
  'sub_electronics-cases': { en: "Electronics Cases", fr: "Étuis électroniques", ar: "حقائب وعلب أجهزة إلكترونية", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵜⵉⵍⵉⴽⵜⵔⵓⵏⵉⵢⵉⵏ" },
  'sub_computers-peripherals': { en: "Computers & Peripherals", fr: "Ordinateurs & Périphériques", ar: "حواسيب وملحقاتها", tz: "ⵜⵉⵎⵙⵙⵓⵔⵉⵏ ⵏ ⵓⵙⵍⴽⵉⵎ" },
  'sub_audio': { en: "Audio", fr: "Audio & Son", ar: "صوتيات", tz: "ⵉⵎⵙⵍⵉⵢⵏ" },
  'sub_cameras-equipment': { en: "Cameras & Equipment", fr: "Appareils photo & Équipement", ar: "كاميرات ومعدات تصوير", tz: "ⵜⵉⵎⵙⵙⵓⵔⵉⵏ ⵏ ⵜⵡⵍⴰⴼⵜ" },
  'sub_video-games': { en: "Video Games", fr: "Jeux vidéo", ar: "ألعاب فيديو", tz: "ⵉⵎⵓⵔⴰⵔ ⵏ ⵓⴼⵉⴷยⵓ" },
  'sub_car-parts-accessories': { en: "Car Parts & Accessories", fr: "Pièces & Accessoires auto", ar: "قطع غيار وملحقات سيارات", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵜⴽⴰⵕⵕⵓⵚⵜ" },
  'sub_diy-kits': { en: "DIY Kits", fr: "Kits de bricolage", ar: "مجموعات اصنعها بنفسك", tz: "ⵜⵉⴳⵔⵓⵎⵎⵉⵡⵉⵏ ⵏ ⵜⵡⵓⵔⵉ" },
  'sub_gadgets': { en: "Gadgets", fr: "Gadgets", ar: "أجهزة ذكية صغيرة", tz: "ⵜⵉⵎⴰⵙⵙⵉⵏ ⵎⵥⵥⵉⵢⵏ" },

  'sub_pet-clothing-accessories-shoes': { en: "Pet Clothing, Accessories & Shoes", fr: "Vêtements, accessoires & chaussures pour animaux", ar: "ملابس وإكسسوارات وأحذية حيوانات أليفة", tz: "ⵜⵉⵎⵍⵙⴰ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_pet-collars-leashes': { en: "Pet Collars & Leashes", fr: "Colliers & Laisses", ar: "أطواق ومقاود للحيوانات الأليفة", tz: "ⵜⵉⵙⴼⵉⴼⵉⵏ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_pet-bedding': { en: "Pet Bedding", fr: "Lits pour animaux", ar: "أسرّة وأغطية حيوانات أليفة", tz: "ⵜⵉⵙⵉⵜⵉⵏ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_pet-toys': { en: "Pet Toys", fr: "Jouets pour animaux", ar: "ألعاب حيوانات أليفة", tz: "ⵉⵎⵓⵔⴰⵔ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_pet-feeding': { en: "Pet Feeding", fr: "Alimentation pour animaux", ar: "أوعية ومستلزمات إطعام حيوانات", tz: "ⵓⵜⵛⵉ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_pet-furniture': { en: "Pet Furniture", fr: "Mobilier pour animaux", ar: "أثاث مخصص للحيوانات الأليفة", tz: "ⴰⵙⵍⴰⵢ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_pet-health-wellness': { en: "Pet Health & Wellness", fr: "Santé & Bien-être des animaux", ar: "صحة وعافية الحيوانات الأليفة", tz: "ⴰⵙⵉⴼⴰⵡ ⵏ ⵉⵎⵓⴷⴰⵔ" },
  'sub_urns-memorials': { en: "Urns & Memorials", fr: "Urnes & Monuments commémoratifs", ar: "نصب تذكارية للحيوانات الأليفة", tz: "ⴰⴽⵜⵜⴰⵢ ⵏ ⵉⵎⵓⴷⴰⵔ" },

  'sub_women-s-shoes': { en: "Women's Shoes", fr: "Chaussures femmes", ar: "أحذية نسائية", tz: "ⵉⵔⴽⴰⵙⵏ ⵏ ⵜⵎⵖⴰⵔⵉⵏ" },
  'sub_men-s-shoes': { en: "Men's Shoes", fr: "Chaussures hommes", ar: "أحذية رجالية", tz: "ⵉⵔⴽⴰⵙⵏ ⵏ ⵉⵔⴳⴰⵣⵏ" },
  'sub_girls-shoes': { en: "Girls' Shoes", fr: "Chaussures filles", ar: "أحذية بنات", tz: "ⵉⵔⴽⴰⵙⵏ ⵏ ⵜⵛⵉⵔⵔⴰⵜⵉⵏ" },
  'sub_boys-shoes': { en: "Boys' Shoes", fr: "Chaussures garçons", ar: "أحذية أولاد", tz: "ⵉⵔⴽⴰⵙⵏ ⵏ ⵉⵛⵉⵔⵔⴰⵏ" },
  'sub_insoles-accessories': { en: "Insoles & Accessories", fr: "Semelles & Accessoires", ar: "نعال وملحقات أحذية", tz: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⵔⴽⴰⵙⵏ" },

  'sub_books': { en: "Books", fr: "Livres", ar: "كتب وروايات", tz: "ⵜⵉⴷⵍⵉⵙⵉⵏ" },
  'sub_music': { en: "Music", fr: "Musique", ar: "موسيقى وأغاني", tz: "ⵓⵥⴰⵡⴰⵏ" },
  'sub_movies': { en: "Movies", fr: "Films", ar: "أفلام سينما", tz: "ⵉⵙⴰⵔⵓⵏ" },
  'sub_video-cases-tins': { en: "Video Cases & Tins", fr: "Boîtiers & Coffrets vidéo", ar: "حقائب وعلب أقراص الفيديو", tz: "ⵜⵉⵙⴰⴽⵉⵏ ⵏ ⵓⴼⵉⴷⵢⵓ" },

  'sub_personalized-gifts': { en: "Personalized Gifts", fr: "Cadeaux personnalisés", ar: "هدايا مخصصة", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵓⵙⵏⴼⵍ" },
  'sub_anniversary-gifts': { en: "Anniversary Gifts", fr: "Cadeaux d'anniversaire de mariage", ar: "هدايا ذكرى سنوية", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵓⴽⵜⵜⴰⵢ" },
  'sub_birthday-gifts': { en: "Birthday Gifts", fr: "Cadeaux d'anniversaire", ar: "هدايا أعياد الميلاد", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵓⵍⵓⴷ" },
  'sub_gifts-for-her': { en: "Gifts for Her", fr: "Cadeaux pour elle", ar: "هدايا لها", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵉ ⵜⵎⵖⴰⵔⵜ" },
  'sub_gifts-for-him': { en: "Gifts for Him", fr: "Cadeaux pour lui", ar: "هدايا له", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵉ ⵓⵔⴳⴰⵣ" },
  'sub_gifts-under-30': { en: "Gifts Under $30", fr: "Cadeaux à moins de 300 DH", ar: "هدايا أقل من 300 درهم", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵎⵥⵥⵉⵢⵏ" },
  'sub_housewarming-gifts': { en: "Housewarming Gifts", fr: "Cadeaux de pendaison de crémaillère", ar: "هدايا الانتقال لبيت جديد", tz: "ⵜⵉⴽⵓⴼⵜⵉⵡⵉⵏ ⵏ ⵜⴷⴷⴰⵔⵜ ⵜⴰⵎⴰⵢⵏⵓⵜ" }
};

export function translateCategory(catId: string, lang: string, defaultName: string = ''): string {
  const trans = categoryTranslations[catId];
  return trans?.[lang] || trans?.en || defaultName;
}

export function translateSubcategory(subId: string, lang: string, defaultName: string = ''): string {
  const trans = categoryTranslations[subId];
  return trans?.[lang] || trans?.en || defaultName;
}

export function suggestCategories(description: string): SuggestionMatch[] {
  if (!description || description.trim() === '') return [];
  
  const keywords = description.toLowerCase().split(/[\s,.-]+/).filter(w => w.length > 2);
  if (keywords.length === 0) return [];

  const matches: SuggestionMatch[] = [];

  taxonomy.forEach(cat => {
    cat.subcategories.forEach(sub => {
      let score = 0;
      
      const catTrans = categoryTranslations[cat.id] || {};
      const subTrans = categoryTranslations[sub.id] || {};
      
      const catNames = Object.values(catTrans).map(v => v.toLowerCase());
      const subNames = Object.values(subTrans).map(v => v.toLowerCase());
      
      const subNameLow = sub.name.toLowerCase();
      const catNameLow = cat.name.toLowerCase();
      if (!catNames.includes(catNameLow)) catNames.push(catNameLow);
      if (!subNames.includes(subNameLow)) subNames.push(subNameLow);

      keywords.forEach(kw => {
        if (subNames.some(name => name.includes(kw))) {
          score += 3;
        } else if (catNames.some(name => name.includes(kw))) {
          score += 1;
        }
      });

      if (score > 0) {
        matches.push({
          categoryId: cat.id,
          categoryName: cat.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          score
        });
      }
    });
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, 5); // Return top 5 suggestions
}
