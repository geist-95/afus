'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductGrid';
import { staticCategories } from '@/lib/supabase';

interface DynamicTrailsClientProps {
  products: any[];
  shops: any[];
  lang: string;
}

export default function DynamicTrailsClient({ products, shops, lang }: DynamicTrailsClientProps) {
  const [selectedCity, setSelectedCity] = useState('Marrakech');
  const [recentCategoryId, setRecentCategoryId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>(products);
  const cityProductsScrollRef = useRef<HTMLDivElement>(null);
  const [cityCanScrollLeft, setCityCanScrollLeft] = useState(false);
  const [cityCanScrollRight, setCityCanScrollRight] = useState(true);

  useEffect(() => {
    const el = cityProductsScrollRef.current;
    if (el) {
      el.scrollLeft = 0;
      setCityCanScrollLeft(false);
      // Wait for DOM layout to stabilize to evaluate scrollability
      setTimeout(() => {
        setCityCanScrollRight(el.scrollWidth > el.clientWidth);
      }, 100);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCatId = localStorage.getItem('recently_viewed_category_id');
      setRecentCategoryId(storedCatId || 'cat_home_living');
    }
  }, []);

  // Merge client-published products from localStorage on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localRaw = localStorage.getItem('local_products');
      if (localRaw) {
        try {
          const localProducts = JSON.parse(localRaw);
          if (Array.isArray(localProducts) && localProducts.length > 0) {
            const validLocal = localProducts.filter(
              (p) => p && typeof p === 'object' && p.title_translations
            );
            const combined = [...validLocal, ...products];
            
            // Remove duplicates by numeric_id or id
            const seen = new Set();
            const unique = combined.filter((p) => {
              const key = p.numeric_id || p.id;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            
            setAllProducts(unique);
          } else {
            setAllProducts(products);
          }
        } catch (e) {
          console.error('Failed to parse local_products in DynamicTrailsClient:', e);
          setAllProducts(products);
        }
      } else {
        setAllProducts(products);
      }
    }
  }, [products]);

  // Labels & translations
  const labels: Record<string, Record<string, string>> = {
    en: {
      newItems: "New Arrivals",
      newItemsSub: "Freshly crafted items from across Morocco",
      yourCity: "Your City Specialty",
      yourCitySub: "Unique creations straight from local makers in",
      recentlyViewed: "Based on Your Interests",
      recentlyViewedSub: "Handcrafted recommendations from your visited categories",
      exploreCities: "Explore Craft Cities",
      exploreCitiesSub: "Click a city to discover its historic specialty guilds",
      newestStores: "Meet Our Newest Stores",
      newestStoresSub: "Support emerging Moroccan independent artisans",
      mad: "MAD",
      emptyProducts: "No products available in this section.",
      visitShop: "Visit Shop",
      faqTitle: "Frequently Asked Questions",
      faq1Q: "What is afus?",
      faq1A: "afus is a curated multi-vendor marketplace designed to connect authentic Moroccan artisans directly with consumers. We highlight regional heritage crafts and handle cash-on-delivery transactions securely.",
      faq2Q: "How does Cash on Delivery (COD) work?",
      faq2A: "When you place an order, the artisan is notified immediately to package your craft. It is shipped securely via Amana (Al Barid Bank). You only pay the courier in cash when the package is delivered to your doorstep.",
      faq3Q: "Are the merchants verified?",
      faq3A: "Yes. All professional artisans on afus undergo vetting, including verification of their official national artisan register profiles, location, and legal ICE registration numbers.",
      faq4Q: "What is the return policy?",
      faq4A: "Artisans accept returns within 7 days of package delivery. The item must be unused and in its original packaging. Return shipping is handled directly with the seller.",
    },
    fr: {
      newItems: "Nouveautés",
      newItemsSub: "Articles fraîchement fabriqués à travers le Maroc",
      yourCity: "Spécialités de votre ville",
      yourCitySub: "Créations uniques provenant directement d'artisans à",
      recentlyViewed: "Selon vos intérêts",
      recentlyViewedSub: "Recommandations artisanales basées sur vos catégories visitées",
      exploreCities: "Explorer les villes artisanales",
      exploreCitiesSub: "Cliquez sur une ville pour découvrir ses corporations historiques",
      newestStores: "Découvrez nos nouvelles boutiques",
      newestStoresSub: "Soutenez les artisans indépendants marocains émergents",
      mad: "DH",
      emptyProducts: "Aucun produit disponible dans cette section.",
      visitShop: "Voir la boutique",
      faqTitle: "Questions fréquemment posées",
      faq1Q: "Qu'est-ce que afus?",
      faq1A: "afus est une place de marché multi-vendeurs conçue pour connecter directement les artisans marocains authentiques avec les consommateurs. Nous mettons en valeur l'artisanat régional et gérons les paiements à la livraison en toute sécurité.",
      faq2Q: "Comment fonctionne le paiement à la livraison (COD) ?",
      faq2A: "Lorsque vous passez commande, l'artisan est immédiatement informé pour préparer votre article. Il est expédié via Amana (Al Barid Bank). Vous ne payez le coursier en espèces que lorsque le colis est livré chez vous.",
      faq3Q: "Les vendeurs sont-ils vérifiés ?",
      faq3A: "Oui. Tous les artisans professionnels sur afus font l'objet d'une vérification de leurs profils de registre national de l'artisanat, de leur emplacement géographique et de leurs numéros d'ICE légaux.",
      faq4Q: "Quelle est la politique de retour ?",
      faq4A: "Les artisans acceptent les retours sous 7 jours après la livraison. L'article doit être inutilisé et dans son emballage d'origine. Les retours sont gérés directement avec le vendeur.",
    },
    ar: {
      newItems: "وصلنا حديثاً",
      newItemsSub: "منتجات حرفية جديدة من جميع أنحاء المغرب",
      yourCity: "حرف وتخصصات مدينتك",
      yourCitySub: "إبداعات فريدة مباشرة من الصناع التقليديين في",
      recentlyViewed: "بناءً على اهتماماتك",
      recentlyViewedSub: "توصيات يدوية من الفئات التي زرتها مؤخراً",
      exploreCities: "استكشف مدن الحرف",
      exploreCitiesSub: "انقر فوق مدينة لاكتشاف تخصصات نقابات الحرف التقليدية فيها",
      newestStores: "تعرف على متاجرنا الجديدة",
      newestStoresSub: "ادعم الحرفيين المستقلين الصاعدين في المغرب",
      mad: "درهم",
      emptyProducts: "لا توجد منتجات متوفرة في هذا القسم.",
      visitShop: "زيارة المتجر",
      faqTitle: "الأسئلة الشائعة",
      faq1Q: "ما هو afus؟",
      faq1A: "أفوس عبارة عن منصة تسوق تربط الصناع التقليديين المغاربة الموثوقين بالزبناء مباشرة. نحرص على إبراز التراث الحرفي الإقليمي ونوفر خدمة الدفع عند الاستلام بشكل آمن.",
      faq2Q: "كيف تعمل خدمة الدفع عند الاستلام (COD)؟",
      faq2A: "بمجرد تقديم طلبك، يبدأ الحرفي في إعداد وتغليف طلبيتك، ثم يتم شحنها بأمان عبر خدمة أمانة لبريد المغرب. وتدفع ثمنها نقداً فقط عند استلامها على باب منزلك.",
      faq3Q: "هل المتاجر موثقة؟",
      faq3A: "نعم. يخضع جميع الحرفيين المهنيين في المنصة لعملية تدقيق تشمل التحقق من بطاقات الصانع التقليدي الخاصة بهم ومواقعهم وأرقام التعريف الموحدة للمقاولات (ICE).",
      faq4Q: "ما هي سياسة الإرجاع؟",
      faq4A: "يقبل الحرفيون الإرجاع في غضون 7 أيام من استلام الطرد. يجب أن يكون المنتج غير مستخدم وفي تغليفه الأصلي. ويتم تنسيق عملية الإرجاع مباشرة مع البائع.",
    }
  };

  const t = labels[lang] || labels.en;

  // Filter lists using the local products merged state
  const newProducts = [...allProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const cityProducts = allProducts.filter((p) => {
    const shop = shops.find((s) => s.id === p.shop_id);
    return shop?.merchant_city?.toLowerCase() === selectedCity.toLowerCase();
  }).slice(0, 16);

  const matchedCategory = staticCategories.find(c => c.id === recentCategoryId || c.slug === recentCategoryId);
  const recentCategoryName = matchedCategory?.name[lang as 'en'|'fr'|'ar'] || matchedCategory?.name.en || "";
  const recentCategoryProducts = allProducts.filter((p) => {
    const isDirectMatch = p.category_id === recentCategoryId;
    const legacyMappedId = p.category_id === '1a111111-1111-1111-1111-111111111111' ? 'cat_jewelry'
      : p.category_id === '2b222222-2222-2222-2222-222222222222' ? 'cat_art_collectibles'
      : p.category_id === '3c333333-3333-3333-3333-333333333333' ? 'cat_bath_beauty'
      : p.category_id === '4d444444-4444-4444-4444-444444444444' ? 'cat_clothing'
      : p.category_id === '5e555555-5555-5555-5555-555555555555' ? 'cat_bags_purses'
      : p.category_id === '6f666666-6666-6666-6666-666666666666' ? 'cat_home_living'
      : p.category_id;
    return isDirectMatch || legacyMappedId === recentCategoryId;
  }).slice(0, 8);

  const citiesList = [
    { name: 'Marrakech', icon: '🏺', specialty: { en: 'Brass & rugs', fr: 'Laiton & tapis', ar: 'النحاس والسجاد' } },
    { name: 'Fes', icon: '🎨', specialty: { en: 'Pottery & tanning', fr: 'Poterie & cuir tanné', ar: 'الفخار ودباغة الجلود' } },
    { name: 'Casablanca', icon: '🧵', specialty: { en: 'Caftans & fashion', fr: 'Caftans & mode', ar: 'القفطان والموضة' } },
    { name: 'Rabat', icon: '🪵', specialty: { en: 'Wood & embroidery', fr: 'Bois & broderie', ar: 'الخشب والتطريز' } },
    { name: 'Salé', icon: '🧺', specialty: { en: 'Woven baskets & clay', fr: 'Vannerie & argile', ar: 'السلال الطينية' } },
    { name: 'Essaouira', icon: '🌊', specialty: { en: 'Thuya wood carving', fr: 'Bois de thuya sculpté', ar: 'خشب العرعر المزخرف' } },
    { name: 'Agadir', icon: '🧴', specialty: { en: 'Argan oil crafts', fr: 'Produits d\'argan', ar: 'منتجات الأركان الطبيعية' } },
    { name: 'Tangier', icon: '⚓', specialty: { en: 'Northern weaving', fr: 'Tissage du nord', ar: 'النسيج الشمالي التقليدي' } },
  ];

  const newestStores = [...shops].slice(0, 6);

  return (
    <div className="space-y-16">
      
      {/* 1. Explore Cities Trail */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-black">{t.exploreCities}</h2>
          <p className="text-xs text-neutral-500">{t.exploreCitiesSub}</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {citiesList.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
              className={`flex-shrink-0 snap-start flex items-center gap-3 border px-4 py-3 rounded-full transition-all text-xs font-semibold shadow-sm cursor-pointer ${
                selectedCity.toLowerCase() === city.name.toLowerCase()
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800'
              }`}
            >
              <span className="text-lg">{city.icon}</span>
              <div className="text-left">
                <span className="block font-bold">{city.name}</span>
                <span className={`block text-[9px] ${
                  selectedCity.toLowerCase() === city.name.toLowerCase() ? 'text-white/70' : 'text-neutral-400'
                }`}>
                  {city.specialty[lang as 'en'|'fr'|'ar'] || city.specialty.en}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Your City Trail */}
      <section className="space-y-4 relative">
        <div>
          <h2 className="text-xl font-bold text-black">
            {t.yourCity} ({selectedCity})
          </h2>
          <p className="text-xs text-neutral-500">
            {t.yourCitySub} {selectedCity}
          </p>
        </div>

        {cityProducts.length > 0 ? (
          <div className="relative">
            {/* Left fade + chevron */}
            {cityCanScrollLeft && (
              <div
                onClick={() => cityProductsScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-6 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent pointer-events-auto cursor-pointer"
                aria-label="Scroll products left"
              >
                <div className="w-9 h-9 border border-neutral-300 bg-[#FAF9F6] flex items-center justify-center shadow-sm hover:bg-neutral-100 transition-colors rounded-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-black/75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </div>
              </div>
            )}

            {/* Scrollable row */}
            <div
              ref={cityProductsScrollRef}
              onScroll={() => {
                const el = cityProductsScrollRef.current;
                if (!el) return;
                setCityCanScrollLeft(el.scrollLeft > 4);
                setCityCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
              }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="w-full flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden snap-x min-w-0"
            >
              {cityProducts.map((p) => {
                const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
                return (
                  <div key={p.id} className="w-[280px] flex-shrink-0 snap-start">
                    <ProductCard product={p} shop={shop} lang={lang} t={t} />
                  </div>
                );
              })}
            </div>

            {/* Right fade + chevron */}
            {cityCanScrollRight && (
              <div
                onClick={() => cityProductsScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-6 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent pointer-events-auto cursor-pointer"
                aria-label="Scroll products right"
              >
                <div className="w-9 h-9 border border-neutral-300 bg-[#FAF9F6] flex items-center justify-center shadow-sm hover:bg-neutral-100 transition-colors rounded-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-black/75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-neutral-100 rounded-xl p-8 text-center text-xs text-neutral-400 bg-neutral-50/50">
            {t.emptyProducts}
          </div>
        )}
      </section>

      {/* 3. New Items Trail */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-black">{t.newItems}</h2>
          <p className="text-xs text-neutral-500">{t.newItemsSub}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newProducts.map((p) => {
            const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
            return (
              <ProductCard key={p.id} product={p} shop={shop} lang={lang} t={t} />
            );
          })}
        </div>
      </section>

      {/* 4. Recently Viewed Category Trail */}
      {recentCategoryName && recentCategoryProducts.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-black">
              {t.recentlyViewed} ({recentCategoryName})
            </h2>
            <p className="text-xs text-neutral-500">{t.recentlyViewedSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentCategoryProducts.map((p) => {
              const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
              return (
                <ProductCard key={p.id} product={p} shop={shop} lang={lang} t={t} />
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Newest Stores Trail */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-black">{t.newestStores}</h2>
          <p className="text-xs text-neutral-500">{t.newestStoresSub}</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {newestStores.map((store) => (
            <div
              key={store.id}
              className="flex-shrink-0 snap-start w-56 border border-neutral-100 bg-white p-4 rounded-2xl flex flex-col items-center justify-between text-center shadow-sm"
            >
              <div className="relative w-16 h-16 rounded-full border border-neutral-100 overflow-hidden bg-neutral-50 flex items-center justify-center">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-neutral-500 font-bold uppercase text-xl">
                    {store.name.charAt(0)}
                  </span>
                )}
                {store.is_verified && (
                  <span className="absolute bottom-0 right-0 bg-neutral-900 border border-white text-white text-[8px] rounded-full p-0.5" title="Verified">
                    ✓
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <span className="block font-bold text-neutral-800 text-sm leading-tight max-w-[180px] truncate">
                  {store.name}
                </span>
                <span className="block text-[10px] text-neutral-400">
                  {store.merchant_city}
                </span>
              </div>
              <Link
                href={`/${lang}/shop/${store.slug}`}
                className="mt-4 w-full block border border-neutral-800 text-neutral-800 font-bold text-[11px] py-1.5 rounded-full hover:bg-neutral-50 transition-colors"
              >
                {t.visitShop}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Section (before footer) */}
      <section className="pt-8 border-t border-neutral-200/60 max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-black text-center">{t.faqTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2 bg-white/50 p-4 border border-neutral-100 rounded-xl">
            <h3 className="font-bold text-sm text-neutral-800 flex items-start gap-1">
              <span>❓</span> {t.faq1Q}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed pl-6">{t.faq1A}</p>
          </div>
          <div className="space-y-2 bg-white/50 p-4 border border-neutral-100 rounded-xl">
            <h3 className="font-bold text-sm text-neutral-800 flex items-start gap-1">
              <span>❓</span> {t.faq2Q}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed pl-6">{t.faq2A}</p>
          </div>
          <div className="space-y-2 bg-white/50 p-4 border border-neutral-100 rounded-xl">
            <h3 className="font-bold text-sm text-neutral-800 flex items-start gap-1">
              <span>❓</span> {t.faq3Q}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed pl-6">{t.faq3A}</p>
          </div>
          <div className="space-y-2 bg-white/50 p-4 border border-neutral-100 rounded-xl">
            <h3 className="font-bold text-sm text-neutral-800 flex items-start gap-1">
              <span>❓</span> {t.faq4Q}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed pl-6">{t.faq4A}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
