'use client';

import { use, useEffect, useState } from 'react';
import { getActiveSession, UserSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Package, MoreHorizontal, Wallet, Store } from 'lucide-react';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = use(params);
  const [session, setSession] = useState<UserSession | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const t = getDictionary(lang).dashboard;

  useEffect(() => {
    async function load() {
      const user = await getActiveSession();
      setSession(user);
      if (user && user.shop) {
        // Load real product count
        const { fetchProducts, fetchOrders } = await import('@/lib/supabase');
        const allProducts = await fetchProducts();
        const shopProducts = allProducts.filter((p) => p.shop_id === user.shop.id);
        setProductsCount(shopProducts.length);

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
    }
    load();
  }, []);

  if (!session) return null;

  const shopName = session.shop ? session.shop.name : session.full_name;

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col animate-in fade-in duration-500 font-sans">
      <div className="border-b border-neutral-200 bg-white px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800">{t.sellerDashboard}</h1>
          <p className="text-xs text-neutral-500 mt-0.5">{t.salam} {shopName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl flex-1">
        <div className="flex flex-col lg:flex-row gap-8">

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
                <Link href={`/${lang}/dashboard/upload`}>
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl hover:bg-neutral-100 h-9 px-3 text-neutral-500 hover:text-black font-medium">{t.viewAll}</button>
                </Link>
              </div>
              <div className="space-y-3">
                <Link className="block" href={`/${lang}/dashboard/upload`}>
                  <div className="w-full rounded-lg border-2 border-dashed border-neutral-300 p-4 flex items-center justify-center text-neutral-500 hover:text-black hover:border-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer group gap-2">
                    <Plus className="w-[20px] h-[20px]" />
                    <span className="text-sm font-semibold tracking-wide">{t.addNewProduct}</span>
                  </div>
                </Link>

                {/* Draft Placeholders (These would be dynamic ideally) */}
                {[1, 2, 3].map((num) => (
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
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="bg-white text-black rounded-lg border border-neutral-200 p-6 flex flex-col items-center relative overflow-hidden">
              {/* Avatar with thin border */}
              <div className="relative w-24 h-24 rounded-full p-1 border-2 border-neutral-100 mb-4 z-10 bg-white">
                <div className="w-full h-full bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                  {session.shop?.logo_url ? (
                    <img src={session.shop.logo_url} alt="Shop Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-neutral-400">{shopName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold tracking-tight mb-1 z-10 text-neutral-800">{shopName}</h3>
              <p className="text-sm text-neutral-500 mb-6 z-10">@{session.shop?.slug || shopName.toLowerCase().replace(/\s+/g, '')}</p>
              
              <div className="w-full grid grid-cols-3 gap-2 z-10">
                <div className="bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-100 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-neutral-800 mb-0.5">{productsCount}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{t.products}</span>
                </div>
                <div className="bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-100 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-neutral-800 mb-0.5">{ordersCount}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{t.sales}</span>
                </div>
                <div className="bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-100 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-neutral-800 mb-0.5">4.9</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{t.stars}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
