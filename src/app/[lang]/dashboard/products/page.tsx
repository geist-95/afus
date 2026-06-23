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

      if (activeUser.shop) {
        const { fetchShopProducts } = await import('@/lib/supabase');
        const shopProducts = await fetchShopProducts(activeUser.shop.id);
        setShopProducts(shopProducts);
      }
      
      setAuthLoading(false);
    }
    
    checkAuth();
  }, [lang, router]);

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9F9F9]">
      {/* Title */}
      <div className="border-b border-neutral-200 bg-white px-4 md:px-6 py-4 flex flex-row justify-between items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800">
            {t.title}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${lang}/dashboard/orders`} className="hidden md:block">
            <button className="h-10 px-4 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-sm rounded-lg transition-colors">
              {lang === 'fr' ? 'Voir les commandes' : lang === 'ar' ? 'عرض الطلبات' : 'View Orders'}
            </button>
          </Link>
          <Link href={`/${lang}/dashboard/products/new`}>
            <button className="h-10 w-10 md:w-auto px-0 md:px-4 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5 md:w-4 md:h-4" /> 
              <span className="hidden md:inline">{t.newProduct}</span>
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
          <div className="flex flex-col gap-4">
            {shopProducts.map((p) => {
              const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'Artisan Craft';
              const slug = p.slug_translations?.[lang as 'en'|'fr'|'ar'] || p.slug_translations?.en || 'product';
              const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
              return (
                <div key={p.id} className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-row flex-wrap md:flex-nowrap gap-4 items-center transition-all hover:border-neutral-300">
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-[200px] flex flex-col gap-1.5 text-left">
                    <h4 className="font-bold text-base text-neutral-800 truncate">{title}</h4>
                    <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 text-sm">
                      <span className="font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">{p.base_price_mad} MAD</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {p.is_active ? (lang === 'fr' ? 'Actif' : 'Active') : (lang === 'fr' ? 'Inactif' : 'Inactive')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                    <Link
                      href={`/${lang}/listing/${p.numeric_id}/${slug}`}
                      className="flex-1 md:flex-none border border-neutral-200 rounded-lg px-4 py-2 bg-white hover:bg-neutral-50 text-center text-xs font-bold transition-colors"
                    >
                      {lang === 'fr' ? 'Voir' : lang === 'ar' ? 'عرض' : 'View'}
                    </Link>
                    <Link
                      href={`/${lang}/dashboard/products/${p.id}`}
                      className="flex-1 md:flex-none border border-neutral-200 rounded-lg px-4 py-2 bg-white hover:bg-neutral-50 text-center text-xs font-bold transition-colors"
                    >
                      {lang === 'fr' ? 'Modifier' : lang === 'ar' ? 'تعديل' : 'Edit'}
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        const confirmMsg = lang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette annonce ?' : lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا المنتج؟' : 'Are you sure you want to delete this listing?';
                        if (confirm(confirmMsg)) {
                          const { supabase } = await import('@/lib/supabase');
                          const { error } = await supabase.from('products').delete().eq('id', p.id);
                          if (error) {
                            console.error('Failed to delete product', error);
                            alert('Failed to delete product');
                          } else {
                            setShopProducts(prev => prev.filter(item => item.id !== p.id));
                          }
                        }
                      }}
                      className="flex-1 md:flex-none text-red-600 hover:bg-red-50 border border-neutral-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors text-xs font-bold"
                    >
                      {lang === 'fr' ? 'Supprimer' : lang === 'ar' ? 'حذف' : 'Delete'}
                    </button>
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
