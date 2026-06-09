'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';
import { Package, Plus } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function ProductsManagerPage({ params }: PageProps) {
  const { lang } = use(params);
  const t = getDictionary(lang).upload;
  const router = useRouter();

  // Auth States
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<any[]>([]);

  useEffect(() => {
    async function checkAuth() {
      const activeUser = await getActiveSession();
      if (!activeUser) {
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

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9F9F9]">
      {/* Title */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800">
            {t.title}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${lang}/dashboard/orders`}>
            <button className="h-10 px-4 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-sm rounded-lg transition-colors">
              View Orders
            </button>
          </Link>
          <Link href={`/${lang}/dashboard/products/new`}>
            <button className="h-10 px-4 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> {t.newProduct}
            </button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* Products Grid */}
        {shopProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-neutral-300 p-12 text-center flex flex-col items-center">
            <Package className="w-12 h-12 text-neutral-300 mb-4" />
            <h3 className="text-lg font-bold text-neutral-800">{t.noProducts}</h3>
            <p className="text-neutral-500 text-sm mt-1 max-w-sm mb-6">
              {t.createFirst}
            </p>
            <Link href={`/${lang}/dashboard/products/new`}>
              <button className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-lg transition-colors">
                {t.newProduct}
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shopProducts.map((p) => {
              const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'Artisan Craft';
              const slug = p.slug_translations?.[lang as 'en'|'fr'|'ar'] || p.slug_translations?.en || 'product';
              const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
              return (
                <div key={p.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col group hover:shadow-sm transition-all hover:border-neutral-300">
                  <div className="aspect-square bg-neutral-100 relative">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-sm text-neutral-800 line-clamp-2 mb-1">{title}</h4>
                    <p className="text-neutral-500 text-sm font-medium mb-4">{p.base_price_mad} MAD</p>
                    
                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/${lang}/listing/${p.numeric_id}/${slug}`}
                        className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-center text-xs font-bold transition-colors"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this listing?')) {
                            const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
                            const updated = localProducts.filter((item: any) => item.id !== p.id && item.numeric_id !== Number(p.id) && item.numeric_id !== p.numeric_id);
                            localStorage.setItem('local_products', JSON.stringify(updated));
                            setShopProducts(prev => prev.filter(item => item.id !== p.id && item.numeric_id !== p.numeric_id));
                          }
                        }}
                        className="text-red-600 hover:bg-red-50 border border-neutral-200 hover:border-red-200 px-3 py-2 rounded-lg transition-colors text-xs font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
