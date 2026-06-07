'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProductCard, SimpleProductCard } from './ProductGrid';
import { staticCategories } from '@/lib/supabase';

interface DynamicTrailsClientProps {
  products: any[];
  shops: any[];
  lang: string;
}

function ScrollableTrail({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative group/trail">
      {/* Left Gradient & Chevron */}
      {showLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 flex items-center justify-start pointer-events-none">
          <button
            onClick={(e) => { e.preventDefault(); scroll('left'); }}
            className="w-10 h-10 ml-2 rounded-full bg-white shadow-lg border border-neutral-100 flex items-center justify-center text-black pointer-events-auto hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {children}
      </div>

      {/* Right Gradient & Chevron */}
      {showRight && (
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end pointer-events-none">
          <button
            onClick={(e) => { e.preventDefault(); scroll('right'); }}
            className="w-10 h-10 mr-2 rounded-full bg-white shadow-lg border border-neutral-100 flex items-center justify-center text-black pointer-events-auto hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/10 py-5 transition-colors cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-center justify-between">
        <h3 className={`font-medium text-xl md:text-2xl pr-8 ${isOpen ? 'text-black' : 'text-neutral-700'}`}>
          {question}
        </h3>
        <span className="text-xl text-neutral-400 font-light leading-none">
          {isOpen ? '×' : '+'}
        </span>
      </div>
      {isOpen && (
        <p className="mt-4 text-base md:text-lg text-neutral-600 leading-relaxed pr-8 max-w-2xl">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function DynamicTrailsClient({ products, shops, lang }: DynamicTrailsClientProps) {
  const [recentCategoryId, setRecentCategoryId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>(products);
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  const scrollNewArrivals = (direction: 'left' | 'right') => {
    if (!newArrivalsRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    newArrivalsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

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
  const newProducts = [...allProducts].slice(0, 8);

  const matchedCategory = staticCategories.find(c => c.id === recentCategoryId || c.slug === recentCategoryId);
  const recentCategoryName = matchedCategory?.name[lang as 'en' | 'fr' | 'ar'] || matchedCategory?.name.en || "";
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



  const newestStores = [...shops].slice(0, 6);
  while (newestStores.length < 6) {
    newestStores.push({
      id: `placeholder-${newestStores.length}`,
      name: 'Coming Soon',
      merchant_city: 'Morocco',
      slug: '#',
      is_placeholder: true
    });
  }

  return (
    <div className="space-y-16">

      {/* New Items Trail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4 md:mb-[30px]">
          <div>
            <h2 className="text-xl md:text-3xl font-bold !text-black">{t.newItems}</h2>
            <p className="text-xs text-neutral-500 mt-1">{t.newItemsSub}</p>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <button onClick={() => scrollNewArrivals('left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={() => scrollNewArrivals('right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
        <div ref={newArrivalsRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {newProducts.map((p) => {
            const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
            return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} className="flex-shrink-0 snap-start w-36 md:w-48 lg:w-[calc(20%-12.8px)]" />;
          })}
        </div>
      </section>

      {/* 4. Recently Viewed Category Trail */}
      {recentCategoryName && recentCategoryProducts.length > 0 && (
        <section className="space-y-4">
          <div className="mb-4 md:mb-[30px]">
            <h2 className="text-xl md:text-3xl font-bold text-left !text-black">
              {t.recentlyViewed} ({recentCategoryName})
            </h2>
            <p className="text-xs text-neutral-500 mt-1 text-left">{t.recentlyViewedSub}</p>
          </div>
          <ScrollableTrail>
            {recentCategoryProducts.map((p) => {
              const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
              return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} className="flex-shrink-0 snap-start w-36 md:w-48 lg:w-[18%]" />;
            })}
          </ScrollableTrail>
        </section>
      )}

      {/* 5. Newest Stores Trail */}
      <section className="space-y-4">
        <div className="mb-4 md:mb-[30px]">
          <h2 className="text-xl md:text-3xl font-bold text-left !text-black">{t.newestStores}</h2>
          <p className="text-xs text-neutral-500 mt-1 text-left">{t.newestStoresSub}</p>
        </div>
        <ScrollableTrail>
          {newestStores.map((store) => (
            <div
              key={store.id}
              className={`flex-shrink-0 snap-start w-56 aspect-square bg-neutral-50 p-4 arabic-frame flex flex-col items-center justify-between text-center transition-colors ${store.is_placeholder ? 'opacity-50' : ''}`}
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
                href={store.is_placeholder ? '#' : `/${lang}/shop/${store.slug}`}
                className="mt-4 w-full block border border-neutral-800 text-neutral-800 font-bold text-[11px] py-1.5 rounded-full hover:bg-neutral-50 transition-colors"
              >
                {t.visitShop}
              </Link>
            </div>
          ))}
        </ScrollableTrail>
      </section>



    </div>
  );
}
