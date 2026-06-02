'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';
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
    <div className="space-y-8 font-mono text-xs lowercase max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-black pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-black lowercase">
            manage collections
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            group your products into custom merchant collections to showcase on your store page
          </p>
        </div>
      </div>

      {message && (
        <div className="border border-green-600 bg-green-50 text-green-700 p-3 font-bold font-mono">
          ✓ {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCreateCollection} className="border border-black p-4 bg-white space-y-6">
            <span className="font-bold border-b border-black pb-1.5 block text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> create new collection
            </span>

            {/* Trilingual Title Translations */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-neutral-500 block">english name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. summer sales, silver rings, berber rugs..."
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">french name (nom français)</label>
                <input
                  type="text"
                  placeholder="ex: soldes d'été, bagues en argent..."
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs"
                />
              </div>

              <div className="space-y-1" dir="rtl">
                <label className="text-neutral-500 block text-right font-sans">اسم المجموعة بالعربية</label>
                <input
                  type="text"
                  placeholder="مثال: عروض الصيف، خواتم الفضة..."
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white focus:outline-none rounded-none text-xs text-right font-sans"
                />
              </div>
            </div>

            {/* Products Selector */}
            <div className="space-y-2">
              <label className="block text-neutral-600 font-bold">
                select products to include ({selectedProductIds.length} selected)
              </label>
              {products.length === 0 ? (
                <div className="border border-dashed border-neutral-300 p-6 text-center text-neutral-400">
                  no products found in your shop. create products first to add them to collections.
                </div>
              ) : (
                <div className="border border-black max-h-60 overflow-y-auto divide-y divide-black bg-neutral-50">
                  {products.map((p) => {
                    const id = p.id || p.numeric_id?.toString();
                    const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'artisan craft';
                    const isSelected = selectedProductIds.includes(id);
                    const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleProductSelection(id)}
                        className="w-full text-left p-2.5 hover:bg-neutral-100 flex items-center gap-3 transition-colors rounded-none"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-black flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        )}
                        <img src={image} alt="" className="w-8 h-8 object-cover border border-black flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-bold text-xs truncate leading-tight">{title}</p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{p.base_price_mad} mad</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-neutral-800 text-[10px] font-mono tracking-widest py-3.5 border border-black uppercase transition-colors rounded-none font-bold"
            >
              create collection
            </button>
          </form>
        </div>

        {/* Right Column: Existing Collections */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-black p-4 bg-white space-y-4">
            <span className="font-bold border-b border-black pb-1.5 block text-sm flex items-center gap-2">
              <FolderClosed className="w-4 h-4" /> active collections ({collections.length})
            </span>

            {collections.length === 0 ? (
              <div className="border border-dashed border-neutral-300 p-8 text-center text-neutral-400">
                no collections created yet.
              </div>
            ) : (
              <div className="space-y-4">
                {collections.map((c) => {
                  const name = c.name_translations[lang as 'en'|'fr'|'ar'] || c.name_translations.en;
                  return (
                    <div key={c.id} className="border border-black p-3.5 bg-neutral-50 flex justify-between items-start gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-sm text-black truncate leading-tight">{name}</h4>
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="bg-neutral-200 text-neutral-700 px-2 py-0.5 font-bold text-[9px] font-mono">
                            📦 {c.product_ids.length} products
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(c.id)}
                        className="text-red-600 hover:text-red-800 p-1 border border-red-600 hover:bg-red-50 flex-shrink-0 cursor-pointer"
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
  );
}
