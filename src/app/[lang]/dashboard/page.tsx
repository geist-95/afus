'use client';

import { use, useEffect, useState } from 'react';
import { getActiveSession, UserSession } from '@/lib/auth';
import Link from 'next/link';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = use(params);
  const [session, setSession] = useState<UserSession | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

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

  const labels: Record<string, Record<string, string>> = {
    en: {
      overview: "overview",
      welcome: "welcome back",
      viewShop: "view my shop",
      totalOrders: "total orders",
      activeProducts: "active products",
      totalRevenue: "total revenue",
      manageOrders: "manage orders →",
      manageProducts: "manage products →",
      startSelling: "want to start selling?",
      noStore: "you currently don't have a store associated with your account. create one now to start uploading and selling products.",
      createStore: "create store",
      mad: "mad",
    },
    fr: {
      overview: "aperçu",
      welcome: "bon retour",
      viewShop: "voir ma boutique",
      totalOrders: "commandes totales",
      activeProducts: "produits actifs",
      totalRevenue: "revenu total",
      manageOrders: "gérer les commandes →",
      manageProducts: "gérer les produits →",
      startSelling: "envie de commencer à vendre ?",
      noStore: "vous n'avez actuellement aucune boutique associée à votre compte. créez-en une maintenant pour commencer à publier et vendre vos produits.",
      createStore: "créer une boutique",
      mad: "dh",
    },
    ar: {
      overview: "نظرة عامة على لوحة التحكم",
      welcome: "مرحباً بعودتك",
      viewShop: "عرض متجري",
      totalOrders: "إجمالي الطلبات",
      activeProducts: "المنتجات النشطة",
      totalRevenue: "إجمالي الإيرادات",
      manageOrders: "إدارة الطلبات ←",
      manageProducts: "إدارة المنتجات ←",
      startSelling: "هل ترغب في البدء بالبيع؟",
      noStore: "ليس لديك حالياً متجر مرتبط بحسابك. قم بإنشاء متجر الآن للبدء في رفع وبيع منتجاتك.",
      createStore: "إنشاء متجر",
      mad: "درهم",
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 font-mono lowercase">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black block">{t.overview}</h1>
          <p className="text-neutral-500 mt-1">{t.welcome}, {session.full_name}</p>
        </div>
        {session.shop && (
          <div className="mt-4 md:mt-0 text-right">
            <Link 
              href={`/${lang}/shop/${session.shop.slug}`} 
              className="bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors inline-block"
            >
              {t.viewShop}
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-black p-6 bg-white shadow-sm">
          <h3 className="font-bold text-neutral-600 mb-2">{t.totalOrders}</h3>
          <p className="text-4xl font-serif">{ordersCount}</p>
          <Link href={`/${lang}/dashboard/orders`} className="text-xs font-bold underline mt-4 inline-block hover:text-neutral-600">
            {t.manageOrders}
          </Link>
        </div>

        <div className="border border-black p-6 bg-white shadow-sm">
          <h3 className="font-bold text-neutral-600 mb-2">{t.activeProducts}</h3>
          <p className="text-4xl font-serif">{productsCount}</p>
          <Link href={`/${lang}/dashboard/upload`} className="text-xs font-bold underline mt-4 inline-block hover:text-neutral-600">
            {t.manageProducts}
          </Link>
        </div>

        <div className="border border-black p-6 bg-white shadow-sm">
          <h3 className="font-bold text-neutral-600 mb-2">{t.totalRevenue}</h3>
          <p className="text-4xl font-serif">{revenue} <span className="text-lg">{t.mad}</span></p>
        </div>
      </div>

      {!session.shop && (
        <div className="mt-8 border border-black p-6 bg-[#f4f4f4]">
          <h2 className="text-xl font-bold mb-2">{t.startSelling}</h2>
          <p className="mb-4">{t.noStore}</p>
          <Link href={`/${lang}/dashboard/settings`} className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors inline-block">
            {t.createStore}
          </Link>
        </div>
      )}
    </div>
  );
}
