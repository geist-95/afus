import Link from "next/link";
import { fetchProducts, fetchShopBySlug } from "@/lib/supabase";
import ShopCatalogClient from "./ShopCatalogClient";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function ShopPage({ params }: PageProps) {
  const { lang, slug } = await params;

  // Find the shop matching the slug
  const shop = await fetchShopBySlug(slug);

  // Filter products by this shop
  const allProducts = await fetchProducts();
  const shopProducts = allProducts.filter((p) => p.shop_id === shop.id);

  const labels: Record<string, Record<string, string>> = {
    en: {
      verified: "verified craft guild",
      origin: "hailing from",
      mad: "mad",
      viewItem: "view item",
      policy: "store rules & returns",
      faq: "store faqs",
      ice: "ice corporate registration check",
      about: "about the artisan",
      itemsCount: "items listed",
      ordersCount: "completed orders",
    },
    fr: {
      verified: "corporation artisanale vérifiée",
      origin: "originaire de",
      mad: "dh",
      viewItem: "voir l'article",
      policy: "règles du magasin & retours",
      faq: "faqs du magasin",
      ice: "identifiant commun de l'entreprise (ice)",
      about: "à propos de l'artisan",
      itemsCount: "articles mis en ligne",
      ordersCount: "commandes complétées",
    },
    ar: {
      verified: "نقابة حرفية موثقة",
      origin: "من مدينة",
      mad: "درهم",
      viewItem: "عرض السلعة",
      policy: "قواعد المتجر والإرجاع",
      faq: "الأسئلة الشائعة للمتجر",
      ice: "رقم ICE القانوني للمؤسسة",
      about: "حول الحرفي",
      itemsCount: "السلع المعروضة",
      ordersCount: "الطلبيات المكتملة",
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="space-y-12 font-mono text-xs lowercase">
      {/* Shop Banner Header */}
      <div className="border border-black bg-neutral-50 relative overflow-hidden">
        {/* Banner Image */}
        <div className="h-48 md:h-64 border-b border-black bg-neutral-100 overflow-hidden relative">
          {shop.banner_url ? (
            <img src={shop.banner_url} alt="shop banner" className="w-full h-full object-cover grayscale contrast-125" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold">no banner uploaded</div>
          )}
        </div>

        {/* Profile Card Overlay */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div className="flex gap-4 items-center">
            {/* Logo */}
            <div className="w-16 h-16 border border-black overflow-hidden bg-neutral-50 flex-shrink-0">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt="shop logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-lg font-bold">logo</div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-serif font-bold text-black lowercase leading-none">{shop.name}</h1>
                {shop.is_verified && (
                  <span className="border border-black px-2 py-0.5 text-[9px] bg-neutral-50 uppercase tracking-widest font-bold">
                    ✓ {t.verified}
                  </span>
                )}
              </div>
              <span className="text-neutral-500 block">
                {t.origin}: <strong className="text-black font-semibold">{shop.merchant_city}</strong>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 border border-black p-3 bg-neutral-50">
            <div className="text-center">
              <span className="text-neutral-400 block text-[9px]">{t.itemsCount}</span>
              <span className="text-sm font-bold text-black">{shopProducts.length}</span>
            </div>
            <div className="w-[1px] bg-black"></div>
            <div className="text-center">
              <span className="text-neutral-400 block text-[9px]">{t.ordersCount}</span>
              <span className="text-sm font-bold text-black">{shop.completed_orders_count}</span>
            </div>
            <div className="w-[1px] bg-black"></div>
            <div className="text-center">
              <span className="text-neutral-400 block text-[9px]">rating</span>
              <span className="text-sm font-bold text-black">★ {shop.average_rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Products on Left, Store Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-serif font-bold border-b border-black pb-2 lowercase">
            shop catalog
          </h2>

          <ShopCatalogClient 
            initialProducts={shopProducts} 
            shop={shop} 
            lang={lang} 
          />
        </div>

        {/* Store Profile Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* About */}
          <div className="border border-black p-4 bg-white space-y-2">
            <span className="font-bold border-b border-black pb-0.5 block">{t.about}</span>
            <p className="text-neutral-600 font-sans leading-relaxed lowercase">
              {shop.description_translations[lang as 'en'|'fr'|'ar'] || shop.description_translations.en}
            </p>
          </div>

          {/* Policies */}
          <div className="border border-black p-4 bg-white space-y-2">
            <span className="font-bold border-b border-black pb-0.5 block">{t.policy}</span>
            <p className="text-neutral-500 leading-normal lowercase">
              {shop.store_policy_translations[lang as 'en'|'fr'|'ar'] || shop.store_policy_translations.en}
            </p>
          </div>

          {/* FAQs */}
          <div className="border border-black p-4 bg-white space-y-3">
            <span className="font-bold border-b border-black pb-0.5 block">{t.faq}</span>
            {shop.faq_translations && shop.faq_translations.length > 0 ? (
              <div className="space-y-3 font-sans leading-relaxed">
                {shop.faq_translations.map((faq: any, idx: number) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="font-bold block text-black">q: {faq.q[lang] || faq.q.en}</span>
                    <span className="text-neutral-600 block">a: {faq.a[lang] || faq.a.en}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-neutral-400 block font-sans">no FAQs loaded.</span>
            )}
          </div>

          {/* Corporate info */}
          <div className="border border-black p-4 bg-neutral-50 space-y-2 text-[10px] text-neutral-500">
            <span className="font-bold block text-neutral-700">{t.ice}</span>
            <div>moroccan ice registration: <strong className="text-black font-semibold">{shop.ice_number}</strong></div>
            <div>warehouse address: <span className="text-black font-semibold">{shop.pickup_address_street}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
