'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import { FolderClosed, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';

interface PageProps {
  params: Promise<{ lang: string }>;
}

interface Collection {
  id: string;
  shop_id: string;
  name_translations: {
    en: string;
    fr: string;
    ar: string;
  };
  product_ids: string[];
}

export default function CollectionsPage({ params }: PageProps) {
  const { lang } = use(params);
  const t = getDictionary(lang).collections;
  const router = useRouter();

  // Auth States
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Form States
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Feedback
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      const activeUser = await getActiveSession();
      if (!activeUser) {
        router.push(`/${lang}/login?redirect=dashboard/collections`);
        return;
      }
      setSession(activeUser);
      setAuthLoading(false);

      if (activeUser.shop) {
        const shopId = activeUser.shop.id;
        
        // Fetch all products from remote/mock DB
        const { fetchProducts } = await import('@/lib/supabase');
        const allRemote = await fetchProducts();
        const remoteFiltered = allRemote.filter((p) => p.shop_id === shopId);

        // Fetch local products
        const localRaw = localStorage.getItem('local_products');
        let localFiltered: any[] = [];
        if (localRaw) {
          try {
            const parsed = JSON.parse(localRaw);
            if (Array.isArray(parsed)) {
              localFiltered = parsed.filter((p: any) => p && p.shop_id === shopId);
            }
          } catch (e) {
            console.error('Failed to parse local products:', e);
          }
        }

        // Merge products
        const mergedMap = new Map();
        [...localFiltered, ...remoteFiltered].forEach((p) => {
          const key = p.id || p.numeric_id?.toString();
          if (key && !mergedMap.has(key)) {
            mergedMap.set(key, p);
          }
        });
        setProducts(Array.from(mergedMap.values()));

        // Fetch local collections
        const collectionsRaw = localStorage.getItem('local_collections');
        if (collectionsRaw) {
          try {
            const parsedCollections = JSON.parse(collectionsRaw);
            if (Array.isArray(parsedCollections)) {
              const shopCollections = parsedCollections.filter((c: any) => c.shop_id === shopId);
              setCollections(shopCollections);
            }
          } catch (e) {
            console.error('Failed to parse local collections:', e);
          }
        }
      }
    }
    loadData();
  }, [lang, router]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) {
      alert('English name is required');
      return;
    }
    if (!session?.shop?.id) return;

    const newCollection: Collection = {
      id: `col_${Math.floor(100000 + Math.random() * 900000)}`,
      shop_id: session.shop.id,
      name_translations: {
        en: nameEn.trim(),
        fr: nameFr.trim() || nameEn.trim(),
        ar: nameAr.trim() || nameEn.trim(),
      },
      product_ids: selectedProductIds,
    };

    // Save to local collections list
    const allCollectionsRaw = localStorage.getItem('local_collections') || '[]';
    let allCollections: Collection[] = [];
    try {
      allCollections = JSON.parse(allCollectionsRaw);
      if (!Array.isArray(allCollections)) allCollections = [];
    } catch {
      allCollections = [];
    }

    allCollections.unshift(newCollection);
    localStorage.setItem('local_collections', JSON.stringify(allCollections));

    // Update state
    setCollections((prev) => [newCollection, ...prev]);

    // Reset Form
    setNameEn('');
    setNameFr('');
    setNameAr('');
    setSelectedProductIds([]);
    setMessage('collection created successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteCollection = (id: string) => {
    if (!confirm('are you sure you want to delete this collection?')) return;
    
    const allCollectionsRaw = localStorage.getItem('local_collections') || '[]';
    let allCollections: Collection[] = [];
    try {
      allCollections = JSON.parse(allCollectionsRaw);
    } catch {
      allCollections = [];
    }

    const updated = allCollections.filter((c) => c.id !== id);
    localStorage.setItem('local_collections', JSON.stringify(updated));

    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="border-b border-neutral-200 bg-white px-6 py-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{t.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-5xl flex-1 space-y-8">

      {message && (
        <div className="border border-green-600 bg-green-50 text-green-700 p-3 font-bold font-mono">
          ✓ {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCreateCollection} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
            <span className="font-bold border-b border-neutral-200 pb-2 block text-neutral-800 text-sm flex items-center gap-2 capitalize">
              <Plus className="w-5 h-5" /> {t.newCollection}
            </span>

            {/* Trilingual Title Translations */}
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-neutral-600 font-semibold text-sm block">English Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer sales, Silver rings, Berber rugs..."
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-600 font-semibold text-sm block">French Name (Nom Français)</label>
                <input
                  type="text"
                  placeholder="ex: Soldes d'été, Bagues en argent..."
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2" dir="rtl">
                <label className="text-neutral-600 font-semibold text-sm block text-right">اسم المجموعة بالعربية</label>
                <input
                  type="text"
                  placeholder="مثال: عروض الصيف، خواتم الفضة..."
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors text-right"
                />
              </div>
            </div>

            {/* Products Selector */}
            <div className="space-y-3">
              <label className="block text-neutral-800 font-semibold text-sm">
                Select products to include ({selectedProductIds.length} selected)
              </label>
              {products.length === 0 ? (
                <div className="border border-dashed border-neutral-200 rounded-lg p-6 text-center text-neutral-500 bg-neutral-50/50 text-sm">
                  No products found in your shop. Create products first to add them to collections.
                </div>
              ) : (
                <div className="border border-neutral-200 rounded-lg max-h-64 overflow-y-auto divide-y divide-neutral-100 custom-scrollbar">
                  {products.map((p) => {
                    const id = p.id || p.numeric_id?.toString();
                    const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'Artisan Craft';
                    const isSelected = selectedProductIds.includes(id);
                    const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleProductSelection(id)}
                        className={`w-full text-left p-3 flex items-center gap-4 transition-colors ${
                          isSelected ? 'bg-neutral-50 hover:bg-neutral-100' : 'bg-white hover:bg-neutral-50'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-neutral-800 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                        )}
                        <img src={image} alt="" className="w-10 h-10 object-cover rounded-md border border-neutral-100 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-neutral-800 truncate">{title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{p.base_price_mad} MAD</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-neutral-800 text-sm py-4 rounded-lg uppercase tracking-wider transition-colors font-bold mt-2"
            >
              {t.newCollection}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Collections */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
            <span className="font-bold border-b border-neutral-200 pb-2 block text-sm text-neutral-800 flex items-center gap-2 capitalize">
              <FolderClosed className="w-5 h-5" /> {t.activeCollections} ({collections.length})
            </span>

            {collections.length === 0 ? (
              <div className="border border-dashed border-neutral-200 rounded-lg p-8 text-center text-neutral-500 bg-neutral-50/50 text-sm">
                {t.noCollections}
              </div>
            ) : (
              <div className="space-y-4">
                {collections.map((c) => {
                  const name = c.name_translations[lang as 'en'|'fr'|'ar'] || c.name_translations.en;
                  return (
                    <div key={c.id} className="rounded-lg border border-neutral-200 p-4 bg-white hover:bg-neutral-50 transition-colors flex justify-between items-start gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-neutral-800 truncate">{name}</h4>
                        <div className="flex gap-2 flex-wrap">
                          <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md font-semibold text-xs border border-neutral-200">
                            📦 {c.product_ids.length} Products
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(c.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 flex-shrink-0 cursor-pointer transition-colors"
                        title="Delete collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
