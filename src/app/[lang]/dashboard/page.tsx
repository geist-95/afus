'use client';

import { use, useEffect, useState } from 'react';
import { getActiveSession, UserSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Package, MoreHorizontal, Wallet, Store, Star, Link as LinkIcon } from 'lucide-react';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = use(params);
  const [session, setSession] = useState<UserSession | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);
  const t = getDictionary(lang).dashboard;

  useEffect(() => {
    async function load() {
      const user = await getActiveSession();
      setSession(user);
      if (user && user.shop) {
        // Load real product count
        const { fetchShopProducts, fetchOrders } = await import('@/lib/supabase');
        const shopProducts = await fetchShopProducts(user.shop.id);
        setProductsCount(shopProducts.length);
        setProducts(shopProducts);

        // Load real orders count and revenue
        try {
          const shopOrders = await fetchOrders(user.shop.id);
          setOrdersCount(shopOrders.length);
          const total = shopOrders.reduce((acc: number, o: any) => acc + (o.total_mad || o.subtotal_mad || 0), 0);
          setRevenue(total);
        } catch (e) {
          console.warn('Failed to load orders for dashboard stats:', e);
        }
      }
      setAuthLoading(false);
    }
    load();
  }, []);

  if (authLoading) return <DashboardPageSkeleton />;
  if (!session) return null;

  const shopName = session.shop ? session.shop.name : session.full_name;

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col animate-in fade-in duration-500 font-sans">
      <div className="border-b border-neutral-200 bg-white px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800">
            {lang === 'fr' ? 'Tableau de bord' : lang === 'ar' ? 'لوحة القيادة' : 'Dashboard'}
          </h1>
        </div>
        <Link
          href={`/${lang}/shop/${session.shop?.slug || shopName.toLowerCase().replace(/\s+/g, '')}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#663399] text-white text-xs font-bold rounded-lg hover:bg-[#663399]/90 transition-colors shadow-sm"
        >
          <Store className="w-3.5 h-3.5" />
          <span>{lang === 'fr' ? 'Voir ma boutique' : lang === 'ar' ? 'عرض متجري' : 'View Store'}</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl flex-1">
        <div className="flex flex-col-reverse lg:flex-row gap-8">

          {/* Main Content Column */}
          <div className="flex-1 space-y-8 min-w-0">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white text-black rounded-lg border border-neutral-200 p-6 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-bold tracking-tight leading-none mb-2">{revenue.toFixed(2)}</div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">{t.totalRevenue}</div>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg">
                  <Wallet className="w-5 h-5 text-neutral-400" />
                </div>
              </div>

              <div className="bg-white text-black rounded-lg border border-neutral-200 p-6 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-bold tracking-tight leading-none mb-2">{ordersCount}</div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">{t.activeOrders}</div>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg">
                  <Package className="w-5 h-5 text-neutral-400" />
                </div>
              </div>

              <div className="bg-white text-black rounded-lg border border-neutral-200 p-6 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-bold tracking-tight leading-none mb-2">{productsCount}</div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">{t.totalProducts}</div>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg">
                  <Store className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Your Products */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold tracking-tight">{t.yourProducts}</h2>
                <Link href={`/${lang}/dashboard/products`}>
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl hover:bg-neutral-100 h-9 px-3 text-neutral-500 hover:text-black font-medium">{t.viewAll}</button>
                </Link>
              </div>
              <div className="space-y-3">
                <Link className="block" href={`/${lang}/dashboard/products/new`}>
                  <div className="w-full rounded-lg border-2 border-dashed border-neutral-300 p-4 flex items-center justify-center text-neutral-500 hover:text-black hover:border-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer group gap-2">
                    <Plus className="w-[20px] h-[20px]" />
                    <span className="text-sm font-semibold tracking-wide">{t.addNewProduct}</span>
                  </div>
                </Link>

                {products.length > 0 ? (
                  products.slice(0, 3).map((p) => {
                    const title = p.title_translations?.[lang as 'en'|'fr'|'ar'] || p.title_translations?.en || 'Artisan Craft';
                    const image = p.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
                    return (
                      <div key={p.id} className="w-full rounded-lg border border-neutral-200 bg-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded border border-neutral-200 bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-neutral-800 line-clamp-1">{title}</div>
                            <div className="text-xs text-neutral-500 mt-0.5">{p.base_price_mad} MAD</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold tracking-wider uppercase">{lang === 'fr' ? 'Actif' : lang === 'ar' ? 'نشط' : 'Active'}</span>
                          <Link href={`/${lang}/dashboard/products/${p.id}`}>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl hover:bg-neutral-100 hover:text-black h-8 w-8 text-neutral-400">
                              <MoreHorizontal className="w-[18px] h-[18px]" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : null}
                {products.length > 3 && (
                  <Link href={`/${lang}/dashboard/products`} className="w-full">
                    <button className="w-full mt-2 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-sm font-semibold text-neutral-700 transition-colors">
                      {lang === 'fr' ? 'Plus' : lang === 'ar' ? 'المزيد' : 'More'}
                    </button>
                  </Link>
                )}
                {products.length === 0 && (
                  [1, 2, 3].map((num) => (
                    <div key={num} className="w-full rounded-lg border border-neutral-200 bg-white p-4 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded border border-neutral-200 bg-neutral-100 flex items-center justify-center shrink-0">
                          <Package className="w-[20px] h-[20px] text-neutral-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-neutral-800">{t.draftProduct} #{num}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">{t.physicalItem} • 0.00 MAD</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold tracking-wider uppercase">{t.draft}</span>
                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl hover:bg-neutral-100 hover:text-black h-8 w-8 text-neutral-400">
                          <MoreHorizontal className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="text-black flex flex-col items-start relative overflow-visible">
              {/* Avatars Container */}
              <div className="relative mb-3 inline-block">
                {/* Shop Avatar (Rounded Rectangle) */}
                <div className="w-20 h-20 rounded-2xl bg-[#E8DECC] flex items-center justify-center overflow-hidden">
                  {session.shop?.logo_url ? (
                    <img src={session.shop.logo_url} alt="Shop Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'serif' }}>
                      {shopName.substring(0, 4).toLowerCase()}<br/>{shopName.substring(4, 8).toLowerCase()}
                    </span>
                  )}
                </div>
                {/* User Avatar (Circle Overlapping) */}
                <div className="absolute -bottom-1 -right-2 w-10 h-10 rounded-full border-[3px] border-white bg-neutral-200 overflow-hidden flex items-center justify-center shadow-sm">
                  {session.user_metadata?.avatar_url ? (
                    <img src={session.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-neutral-600">{shopName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-serif text-neutral-800 tracking-tight flex items-center gap-2 mb-2 mt-2">
                Salam, {shopName}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-600 font-medium w-full mt-1">
                <span className="flex items-center text-black font-bold">
                  <Star className="w-4 h-4 mr-1 fill-black" /> 4.9 <span className="font-normal text-neutral-500 ml-1">(120)</span>
                </span>
                <span className="text-neutral-300">|</span>
                <span>{ordersCount} {lang === 'fr' ? 'ventes' : lang === 'ar' ? 'مبيعات' : 'sales'}</span>
                <span className="text-neutral-300">|</span>
                <span>{productsCount} {lang === 'fr' ? 'actifs' : lang === 'ar' ? 'نشط' : 'active listings'}</span>
                <span className="text-neutral-300">|</span>
                <Link href={`/${lang}/shop/${session.shop?.slug || shopName.toLowerCase().replace(/\s+/g, '')}`} className="flex items-center hover:underline text-neutral-800">
                  {session.shop?.slug || shopName.toLowerCase().replace(/\s+/g, '')}.afus.ma
                  <LinkIcon className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
