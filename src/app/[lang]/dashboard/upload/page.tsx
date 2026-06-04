'use client';

import { useState, useEffect, use } from 'react';
import MediaUploader from '@/components/ui/media-uploader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';
import { createProductListing } from '@/lib/supabase';
import { taxonomy, suggestCategories } from '@/lib/categories';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function AddProductPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();

  // Auth States
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('cat_jewelry');
  const [selectedSubcatId, setSelectedSubcatId] = useState('sub_body-jewelry');
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleExpiresAt, setSaleExpiresAt] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [compiledPayload, setCompiledPayload] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<any[]>([]);

  useEffect(() => {
    async function checkAuth() {
      const activeUser = await getActiveSession();
      if (!activeUser) {
        // Redirect to login page, remembering redirect target
        router.push(`/${lang}/login?redirect=dashboard/upload`);
        return;
      }
      setSession(activeUser);
      setAuthLoading(false);

      if (activeUser.shop) {
        const { fetchProducts } = await import('@/lib/supabase');
        const all = await fetchProducts();
        const filtered = all.filter((p) => p.shop_id === activeUser.shop.id);
        setShopProducts(filtered);
      }
    }
    
    checkAuth();
  }, [lang, router]);

  const handleUploadComplete = (urls: string[]) => {
    setMediaUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reverseCategoryMapping: Record<string, string> = {
      'cat_jewelry': '1a111111-1111-1111-1111-111111111111',
      'cat_art_collectibles': '2b222222-2222-2222-2222-222222222222',
      'cat_bath_beauty': '3c333333-3333-3333-3333-333333333333',
      'cat_clothing': '4d444444-4444-4444-4444-444444444444',
      'cat_bags_purses': '5e555555-5555-5555-5555-555555555555',
      'cat_home_living': '6f666666-6666-6666-6666-666666666666',
    };
    const dbCategoryId = reverseCategoryMapping[selectedCatId] || selectedCatId;

    // Compile stateless JSON object payload
    const payload = {
      shop_id: session?.shop?.id || (session?.id === 's1_owner' ? 's1' : 's2'), // Select shop owned by merchant
      category_id: dbCategoryId,
      subcategory_id: selectedSubcatId,
      base_price_mad: parseFloat(price),
      sale_price_mad: salePrice ? parseFloat(salePrice) : null,
      sale_expires_at: saleExpiresAt ? new Date(saleExpiresAt).toISOString() : null,
      title_translations: {
        en: titleEn,
        fr: titleFr,
        ar: titleAr,
      },
      description_translations: {
        en: descEn,
        fr: descFr,
        ar: descAr,
      },
      media_gallery: mediaUrls, // Base64 compressed image strings
      stock_quantity: 10,
    };

    // Save to database
    const result = await createProductListing(payload);
    if (result) {
      // Save locally to persist on app refresh in browser
      const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
      localProducts.unshift(result);
      localStorage.setItem('local_products', JSON.stringify(localProducts));

      const numericId = result.numeric_id || Math.floor(100000 + Math.random() * 900000);
      const slug = (titleEn || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      router.push(`/${lang}/listing/${numericId}/${slug}`);
    }
  };

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-neutral-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            Create New Listing
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Add a new craft product to the marketplace listing catalog
          </p>
        </div>
        <Link href={`/${lang}/dashboard/orders`}>
          <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-white hover:bg-neutral-100 hover:text-black h-10 px-4 rounded-lg border-neutral-200 font-semibold text-sm">
            View Orders ↗
          </button>
        </Link>
      </div>

      <div>
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Finder / Suggestion Box */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
            <div className="space-y-2">
              <label className="block text-neutral-800 font-semibold text-sm">Find category by description (2-3 keywords)</label>
              <input
                type="text"
                placeholder="e.g. wool berber carpet, silver ring, leather bag..."
                value={suggestionQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSuggestionQuery(val);
                  if (val.trim()) {
                    setSuggestions(suggestCategories(val));
                  } else {
                    setSuggestions([]);
                  }
                }}
                className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
              />
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="font-bold text-xs text-neutral-500 uppercase tracking-wider block">Suggested categories (click to select):</span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedCatId(s.categoryId);
                        setSelectedSubcatId(s.subcategoryId);
                        setSuggestionQuery('');
                        setSuggestions([]);
                      }}
                      className="border border-neutral-200 px-4 py-2 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-colors text-sm rounded-lg font-medium"
                    >
                      💡 {s.categoryName} &gt; {s.subcategoryName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories and price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-neutral-200">
            <div className="space-y-2">
              <label className="block text-neutral-800 font-semibold text-sm">Category</label>
              <select
                value={selectedCatId}
                onChange={(e) => {
                  const catId = e.target.value;
                  setSelectedCatId(catId);
                  const firstSub = taxonomy.find(c => c.id === catId)?.subcategories[0]?.id || '';
                  setSelectedSubcatId(firstSub);
                }}
                className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
              >
                {taxonomy.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-neutral-800 font-semibold text-sm">Subcategory</label>
              <select
                value={selectedSubcatId}
                onChange={(e) => setSelectedSubcatId(e.target.value)}
                className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
              >
                {taxonomy.find(c => c.id === selectedCatId)?.subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                )) || <option value="">no subcategories</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-neutral-800 font-semibold text-sm">Base Price (MAD)</label>
              <input
                type="number"
                required
                placeholder="e.g. 350"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
              />
            </div>
          </div>

          {/* Sales Promotion (Optional) */}
          <div className="bg-red-50/30 p-6 rounded-xl border border-red-100 space-y-4">
            <span className="font-bold border-b border-red-200 pb-2 block text-red-800 text-sm">
              🏷️ Sales Promotion (Optional)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-neutral-800 font-semibold text-sm">Sale Price (MAD)</label>
                <input
                  type="number"
                  placeholder="e.g. 299"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full border border-red-200 p-3 bg-white focus:outline-none focus:border-red-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-neutral-800 font-semibold text-sm">Promotion Expires At</label>
                <input
                  type="datetime-local"
                  value={saleExpiresAt}
                  onChange={(e) => setSaleExpiresAt(e.target.value)}
                  className="w-full border border-red-200 p-3 bg-white focus:outline-none focus:border-red-400 rounded-lg text-sm transition-colors"
                />
              </div>
            </div>
            <p className="text-xs text-neutral-500 pt-1">
              If specified, a sale price will be shown alongside a countdown timer until the expiration date.
            </p>
          </div>

          {/* Trilingual Title Translations */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-5">
            <span className="font-bold border-b border-neutral-200 pb-2 block text-sm text-neutral-800">Trilingual Titles</span>
            
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-neutral-600 font-semibold text-sm block">English Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handwoven wool berber carpet"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full border border-neutral-200 p-3 focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-600 font-semibold text-sm block">French Title (Titre en français)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Tapis berbère en laine tissé main"
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  className="w-full border border-neutral-200 p-3 focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2" dir="rtl">
                <label className="text-neutral-600 font-semibold text-sm block text-right">العنوان باللغة العربية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سجادة بربرية منسوجة يدوياً من الصوف"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full border border-neutral-200 p-3 focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors text-right"
                />
              </div>
            </div>
          </div>

          {/* Media drag-and-drop uploader */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
            <span className="font-bold border-b border-neutral-200 pb-2 block text-sm text-neutral-800">Product Gallery (Media Uploader)</span>
            <MediaUploader onUploadComplete={handleUploadComplete} maxFiles={4} />
          </div>

          {/* Trilingual Descriptions */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-5">
            <span className="font-bold border-b border-neutral-200 pb-2 block text-sm text-neutral-800">Trilingual Descriptions</span>
            
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-neutral-600 font-semibold text-sm block">English Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the product's origin, craft methods, size..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full border border-neutral-200 p-3 focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-600 font-semibold text-sm block">French Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Décrivez l'origine du produit, le processus de fabrication..."
                  value={descFr}
                  onChange={(e) => setDescFr(e.target.value)}
                  className="w-full border border-neutral-200 p-3 focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2" dir="rtl">
                <label className="text-neutral-600 font-semibold text-sm block text-right">الوصف باللغة العربية</label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب تفاصيل المنتج، كيفية الصنع والمواد المستعملة..."
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full border border-neutral-200 p-3 focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors text-right"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800 text-sm py-4 rounded-lg uppercase tracking-wider transition-colors font-bold"
          >
            Publish Listing
          </button>
        </form>

        {/* Existing Products List */}
        {shopProducts.length > 0 && (
          <div className="border-t border-neutral-200 pt-10 mt-10 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 block">
                Active Store Listings
              </h2>
              <p className="text-neutral-500 text-sm mt-1">
                View, click, or remove active craft listings from your marketplace catalog
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopProducts.map((p) => {
                const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'Artisan Craft';
                const slug = p.slug_translations?.[lang as 'en'|'fr'|'ar'] || p.slug_translations?.en || 'product';
                const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-neutral-200 p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-neutral-50 border border-neutral-100">
                      <img src={image} alt={title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-neutral-800">{title}</h4>
                      <p className="text-neutral-500 text-xs mt-1">{p.base_price_mad} MAD</p>
                    </div>
                    <div className="flex flex-col gap-2 text-xs font-semibold">
                      <Link
                        href={`/${lang}/listing/${p.numeric_id}/${slug}`}
                        className="border border-neutral-200 rounded-md px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-center transition-colors"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
                          const updated = localProducts.filter((item: any) => item.id !== p.id && item.numeric_id !== Number(p.id) && item.numeric_id !== p.numeric_id);
                          localStorage.setItem('local_products', JSON.stringify(updated));
                          
                          setShopProducts(prev => prev.filter(item => item.id !== p.id && item.numeric_id !== p.numeric_id));
                          alert('Listing removed successfully.');
                        }}
                        className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
