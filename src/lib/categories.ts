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

export function suggestCategories(description: string): SuggestionMatch[] {
  if (!description || description.trim() === '') return [];
  
  const keywords = description.toLowerCase().split(/[\s,.-]+/).filter(w => w.length > 2);
  if (keywords.length === 0) return [];

  const matches: SuggestionMatch[] = [];

  taxonomy.forEach(cat => {
    cat.subcategories.forEach(sub => {
      let score = 0;
      const subNameLow = sub.name.toLowerCase();
      const catNameLow = cat.name.toLowerCase();
      
      keywords.forEach(kw => {
        if (subNameLow.includes(kw)) score += 3;
        else if (catNameLow.includes(kw)) score += 1;
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
