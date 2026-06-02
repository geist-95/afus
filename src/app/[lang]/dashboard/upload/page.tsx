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
    <div className="space-y-8 font-mono text-xs lowercase max-w-3xl mx-auto">
      {/* Title */}
      <div className="border-b border-black pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-black lowercase">
            create new listing
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            add a new craft product to the marketplace listing catalog
          </p>
        </div>
        <Link href={`/${lang}/dashboard/orders`} className="border border-black px-3 py-1.5 hover:bg-neutral-50">
          💼 view orders dashboard
        </Link>
      </div>

      <div>
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Finder / Suggestion Box */}
          <div className="border border-black p-4 bg-neutral-100 space-y-3">
            <div className="space-y-1">
              <label className="block text-neutral-600 font-bold">find category by description (2-3 keywords)</label>
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
                className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs"
              />
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-[10px] text-neutral-500 uppercase tracking-wider block">suggested categories (click to select):</span>
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
                      className="border border-black px-3 py-1.5 bg-white hover:bg-black hover:text-white transition-colors text-[10px] font-mono normal-case"
                    >
                      💡 {s.categoryName} &gt; {s.subcategoryName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories and price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-black p-4 bg-neutral-50">
            <div className="space-y-1">
              <label className="block text-neutral-600 font-bold">category</label>
              <select
                value={selectedCatId}
                onChange={(e) => {
                  const catId = e.target.value;
                  setSelectedCatId(catId);
                  const firstSub = taxonomy.find(c => c.id === catId)?.subcategories[0]?.id || '';
                  setSelectedSubcatId(firstSub);
                }}
                className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs normal-case"
              >
                {taxonomy.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-neutral-600 font-bold">subcategory</label>
              <select
                value={selectedSubcatId}
                onChange={(e) => setSelectedSubcatId(e.target.value)}
                className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs normal-case"
              >
                {taxonomy.find(c => c.id === selectedCatId)?.subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                )) || <option value="">no subcategories</option>}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-neutral-600 font-bold">base price (mad)</label>
              <input
                type="number"
                required
                placeholder="e.g. 350"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs"
              />
            </div>
          </div>

          {/* Sales Promotion (Optional) */}
          <div className="border border-black p-4 bg-red-50/20 space-y-4">
            <span className="font-bold border-b border-black pb-0.5 block text-red-800">
              🏷️ sales promotion (optional)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-neutral-600 font-bold">sale price (mad)</label>
                <input
                  type="number"
                  placeholder="e.g. 299"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-600 font-bold">promotion expires at (local time)</label>
                <input
                  type="datetime-local"
                  value={saleExpiresAt}
                  onChange={(e) => setSaleExpiresAt(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs"
                />
              </div>
            </div>
            <p className="text-[10px] text-neutral-500">
              if specified, a sale price will be shown alongside a countdown timer until the expiration date.
            </p>
          </div>

          {/* Trilingual Title Translations */}
          <div className="border border-black p-4 bg-white space-y-4">
            <span className="font-bold border-b border-black pb-0.5 block">trilingual titles</span>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-neutral-500 block">english title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. handwoven wool berber carpet"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full border border-black p-2.5 focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">french title (titre en français)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: tapis berbère en laine tissé main"
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  className="w-full border border-black p-2.5 focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1" dir="rtl">
                <label className="text-neutral-500 block text-right">العنوان باللغة العربية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سجادة بربرية منسوجة يدوياً من الصوف"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full border border-black p-2.5 focus:outline-none rounded-none text-right font-sans"
                />
              </div>
            </div>
          </div>

          {/* Media drag-and-drop uploader */}
          <div className="border border-black p-4 bg-white space-y-3">
            <span className="font-bold border-b border-black pb-0.5 block">product gallery (media uploader)</span>
            <MediaUploader onUploadComplete={handleUploadComplete} maxFiles={4} />
          </div>

          {/* Trilingual Descriptions */}
          <div className="border border-black p-4 bg-white space-y-4">
            <span className="font-bold border-b border-black pb-0.5 block font-serif-editorial">trilingual descriptions</span>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-neutral-500 block">english description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="describe the product's origin, craft methods, size..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full border border-black p-2.5 focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">french description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="décrivez l'origine du produit, le processus de fabrication..."
                  value={descFr}
                  onChange={(e) => setDescFr(e.target.value)}
                  className="w-full border border-black p-2.5 focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1" dir="rtl">
                <label className="text-neutral-500 block text-right font-sans">الوصف باللغة العربية</label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب تفاصيل المنتج، كيفية الصنع والمواد المستعملة..."
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full border border-black p-2.5 focus:outline-none rounded-none text-right font-sans"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800 text-sm font-mono tracking-widest py-4 border border-black uppercase transition-colors rounded-none font-bold"
          >
            publish listing
          </button>
        </form>

        {/* Existing Products List */}
        {shopProducts.length > 0 && (
          <div className="border-t border-black pt-12 mt-12 space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-black block lowercase">
                active store listings
              </h2>
              <p className="text-neutral-500 text-xs mt-1">
                view, click, or remove active craft listings from your marketplace catalog
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopProducts.map((p) => {
                const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'artisan craft';
                const slug = p.slug_translations?.[lang as 'en'|'fr'|'ar'] || p.slug_translations?.en || 'product';
                const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
                return (
                  <div key={p.id} className="border border-black p-4 bg-white flex gap-4 items-center">
                    <div className="w-16 h-16 border border-black overflow-hidden flex-shrink-0 bg-neutral-50">
                      <img src={image} alt={title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm truncate text-black">{title}</h4>
                      <p className="font-mono text-neutral-500 text-[10px] mt-0.5">{p.base_price_mad} dh</p>
                    </div>
                    <div className="flex flex-col gap-1.5 font-mono text-[10px] text-center">
                      <Link
                        href={`/${lang}/listing/${p.numeric_id}/${slug}`}
                        className="border border-black px-2 py-1 bg-neutral-50 hover:bg-neutral-100 font-bold"
                      >
                        view
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
                        className="border border-red-600 px-2 py-1 text-red-600 hover:bg-red-50 font-bold cursor-pointer"
                      >
                        delete
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
