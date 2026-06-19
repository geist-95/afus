'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProductCard, SimpleProductCard } from './ProductGrid';
import { staticCategories, legacyCategoryMapping } from '@/lib/supabase';

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
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    let scrollAmount = direction === 'left' ? -400 : 400;
    if (isRtl) {
      scrollAmount = -scrollAmount;
    }
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
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
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
  const recentlyViewedRef = useRef<HTMLDivElement>(null);
  const under100Ref = useRef<HTMLDivElement>(null);
  const freeShippingRef = useRef<HTMLDivElement>(null);
  const newestStoresRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    let scrollAmount = direction === 'left' ? -400 : 400;
    if (isRtl) {
      scrollAmount = -scrollAmount;
    }
    ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCatId = localStorage.getItem('recently_viewed_category_id');
      setRecentCategoryId(storedCatId || 'cat_home_living');
    }
  }, []);

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  // Labels & translations
  const labels: Record<string, Record<string, string>> = {
    en: {
      newItems: "Last Created Products",
      newItemsSub: "See the most recently added items on afus",
      yourCity: "Your City Specialty",
      yourCitySub: "Unique creations straight from local makers in",
      recentlyViewed: "Based on Your Interests",
      recentlyViewedSub: "Handcrafted recommendations from your visited categories",
      exploreCities: "Explore Craft Cities",
      exploreCitiesSub: "Click a city to discover its historic specialty guilds",
      newestStores: "Meet Our Newest Stores",
      newestStoresSub: "Support emerging Moroccan independent artisans",
      under100: "Finds Under 100 MAD",
      under100Sub: "Great artisanal deals that won't break the bank",
      freeShipping: "Free Delivery Items",
      freeShippingSub: "Enjoy complimentary shipping on these orders",
      mad: "MAD",
      emptyProducts: "No products available in this section.",
      contact: "Contact",
      follow: "Follow",
      founder: "Founder",
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
      newItems: "Derniers produits créés",
      newItemsSub: "Découvrez les derniers articles ajoutés sur afus",
      yourCity: "Spécialités de votre ville",
      yourCitySub: "Créations uniques provenant directement d'artisans à",
      recentlyViewed: "Selon vos intérêts",
      recentlyViewedSub: "Recommandations artisanales basées sur vos catégories visitées",
      exploreCities: "Explorer les villes artisanales",
      exploreCitiesSub: "Cliquez sur une ville pour découvrir ses corporations historiques",
      newestStores: "Découvrez nos nouvelles boutiques",
      newestStoresSub: "Soutenez les artisans indépendants marocains émergents",
      under100: "Trouvailles à moins de 100 DH",
      under100Sub: "Superbes offres artisanales à petit prix",
      freeShipping: "Articles avec livraison gratuite",
      freeShippingSub: "Profitez de la livraison offerte sur ces articles",
      mad: "DH",
      emptyProducts: "Aucun produit disponible dans cette section.",
      contact: "Contact",
      follow: "S'abonner",
      founder: "Fondateur",
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
      newItems: "آخر المنتجات المضافة",
      newItemsSub: "شاهد أحدث المنتجات التي تم إضافتها على أفوس",
      yourCity: "حرف وتخصصات مدينتك",
      yourCitySub: "إبداعات فريدة مباشرة من الصناع التقليديين في",
      recentlyViewed: "بناءً على اهتماماتك",
      recentlyViewedSub: "توصيات يدوية من الفئات التي زرتها مؤخراً",
      exploreCities: "استكشف مدن الحرف",
      exploreCitiesSub: "انقر فوق مدينة لاكتشاف تخصصات نقابات الحرف التقليدية فيها",
      newestStores: "تعرف على متاجرنا الجديدة",
      newestStoresSub: "ادعم الحرفيين المستقلين الصاعدين في المغرب",
      under100: "اكتشافات أقل من 100 درهم",
      under100Sub: "عروض حرفية رائعة بأسعار مناسبة",
      freeShipping: "منتجات بتوصيل مجاني",
      freeShippingSub: "استمتع بشحن مجاني على هذه الطلبات",
      mad: "درهم",
      emptyProducts: "لا توجد منتجات متوفرة في هذا القسم.",
      contact: "اتصال",
      follow: "متابعة",
      founder: "مؤسس",
      faqTitle: "الأسئلة الشائعة",
      faq1Q: "ما هو afus؟",
      faq1A: "أفوس عبارة عن منصة تسوق تربط الصناع التقليديين المغاربة الموثوقين بالزبناء مباشرة. نحرص على إبراز التراث الحرفي الإقليمي ونوفر خدمة الدفع عند الاستلام بشكل آمن.",
      faq2Q: "كيف تعمل خدمة الدفع عند الاستلام (COD)؟",
      faq2A: "بمجرد تقديم طلبك، يبدأ الحرفي في إعداد وتغليف طلبيتك، ثم يتم شحنها بأمان عبر خدمة أمانة لبريد المغرب. وتدفع ثمنها نقداً فقط عند استلامها على باب منزلك.",
      faq3Q: "هل المتاجر موثقة؟",
      faq3A: "نعم. يخضع جميع الحرفيين المهنيين في المنصة لعملية تدقيق تشمل التحقق من بطاقات الصانع التقليدي الخاصة بهم ومواقعهم وأرقام التعريف الموحدة للمقاولات (ICE).",
      faq4Q: "ما هي سياسة الإرجاع؟",
      faq4A: "يقبل الحرفيون الإرجاع في غضون 7 أيام من استلام الطرد. يجب أن يكون المنتج غير مستخدم وفي تغليفه الأصلي. ويتم تنسيق عملية الإرجاع مباشرة مع البائع.",
    },
    tz: {
      newItems: "ⵜⵉⴳⴰⵡⵉⵏ ⵜⵉⵎⴳⴳⵓⵔⴰ ⵉⵜⵜⵓⵙⴽⴰⵔⵏ",
      newItemsSub: "ⵥⵕ ⵜⵉⴳⴰⵡⵉⵏ ⵜⵉⵎⴰⵢⵏⵓⵜⵉⵏ ⴳ afus",
      yourCity: "ⵜⵉⴳⴰⵡⵉⵏ ⵏ ⵜⵖⵔⵎⵜ ⵏⵏⴽ",
      yourCitySub: "ⵜⵉⴳⴰⵡⵉⵏ ⵜⵉⵥⵍⴰⵢⵉⵏ ⵙⴳ ⵉⵎⵙⴽⴰⵔⵏ ⵉⴷⵖⴰⵔⴰⵏⵏ ⴳ",
      recentlyViewed: "ⵅⴼ ⵎⴰⵢⴷ ⵜⵔⵉⴷ",
      recentlyViewedSub: "ⵜⵉⵙⵖⴰⵏ ⵏ ⵓⴼⵓⵙ ⵙⴳ ⵜⴰⴳⴳⴰⵢⵉⵏ ⵏⵏⴰ ⵜⵥⵕⵉⴷ",
      exploreCities: "ⵔⵣⵓ ⵅⴼ ⵜⵉⵖⵔⵎⵉⵏ ⵏ ⵜⴳⴰⵡⵉⵏ",
      exploreCitiesSub: "ⴽⵍⵉⴽⵉ ⵅⴼ ⵢⴰⵜ ⵜⵖⵔⵎⵜ ⴰⴷ ⵜⴰⴼⴷ ⵜⵉⴳⴰⵡⵉⵏ ⵏⵏⵙ ⵜⵉⵎⵣⵔⴰⵢⵉⵏ",
      newestStores: "ⵙⵙⵏ ⵜⵉⵃⴰⵏⵓⵜⵉⵏ ⵏⵏⵖ ⵜⵉⵎⴰⵢⵏⵓⵜⵉⵏ",
      newestStoresSub: "ⴰⵡⵙ ⵉⵎⵙⴽⴰⵔⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⵉⵙⵉⵎⴰⵏⵏ ⵉⵎⴰⵢⵏⵓⵜⵏ",
      under100: "ⵜⵉⴳⴰⵡⵉⵏ ⴷⴷⴰⵡ 100 ⴷⵔⵀⵎ",
      under100Sub: "ⵜⵉⴳⴰⵡⵉⵏ ⵉⴼⵓⵍⴽⵉⵏ ⵙ ⵡⴰⵜⵉⴳ ⵉⵎⵥⵥⵉⵏ",
      freeShipping: "ⴰⵙⵉⵡⴹ ⴱⴰⵟⵍ",
      freeShippingSub: "ⵉⵜⵜⵓⵙⵉⵡⴹ ⴱⴰⵟⵍ ⵅⴼ ⵜⴳⴰⵡⵉⵏ ⴰⴷ",
      mad: "ⴷⵔⵀⵎ",
      emptyProducts: "ⵓⵔ ⵍⵍⵉⵏⵜ ⵜⴳⴰⵡⵉⵏ ⴳ ⵓⴷⵖⴰⵔ ⴰ.",
      contact: "ⴰⵎⵢⴰⵡⴰⴹ",
      follow: "ⴹⴼⵕ",
      founder: "ⴰⵎⵙⵔⵙⵍ",
      faqTitle: "ⵉⵙⵇⵙⵉⵜⵏ ⴷ ⵜⵉⵡⵉⵙⵉ",
      faq1Q: "ⵎⴰ ⵉⴳⴰⵏ ⴰⴼⵓⵙ?",
      faq1A: "ⴰⴼⵓⵙ ⵉⴳⴰ ⵢⴰⵜ ⵜⴰⵙⵓⵇⵜ ⵉⵜⵜⵓⵙⴽⴰⵔⵏ ⴰⴷ ⵜⵙⵎⵓⵏ ⵉⵎⵙⴽⴰⵔⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⴷ ⵉⵎⵙⴰⵖⵏ ⵙ ⵓⵙⵔⵉⴷ. ⵏⵙⵙⵎⵖⵓⵔ ⵜⴰⴳⴰⵡⵜ ⵜⴰⴷⵖⴰⵔⴰⵏⵜ ⴷ ⵏⵙⵙⵓⴷⵙ ⴰⵙⵖⵏ ⴳ ⵓⵙⵉⵡⴹ ⵙ ⵜⵏⴼⵔⵓⵜ.",
      faq2Q: "ⵎⴰⵎⵏⴽ ⵉⵜⵜⵡⵓⵔⵉ ⵓⵙⵖⵏ ⴳ ⵓⵙⵉⵡⴹ (COD)?",
      faq2A: "ⵍⵉⵖ ⵜⵙⵔⵙⴷ ⵜⴰⵏⴱⴰⴹⵜ, ⴰⵎⵙⴽⴰⵔ ⵉⵜⵜⵓⵅⴱⴰⵔ ⴰⴷ ⵉⵙⵡⵊⴷ ⵜⴰⴳⴰⵡⵜ ⵏⵏⴽ. ⵜⵜⴰⵣⴰⵏ ⵙ ⵜⵏⴼⵔⵓⵜ ⵙ ⴰⵎⴰⵏⴰ. ⴰⵔ ⵜⵙⵖⵏⴷ ⵉ ⵓⵎⴰⵣⴰⵏ ⵙ ⵉⴷⵔⵉⵎⵏ ⵖⴰⵙ ⵍⵉⵖ ⵉⵍⴽⵎ ⵓⵇⵔⴰⴱ ⵖⵔ ⵜⴰⴳⴳⵓⵔⵜ ⵏⵏⴽ.",
      faq3Q: "ⵉⵙ ⵜⵜⵓⵙⵏⵉⴷⵏ ⵉⵎⵣⵣⵏⵣⴰⵏ?",
      faq3A: "ⵢⴰⵀ. ⴰⴽⴽⵯ ⵉⵎⵙⴽⴰⵔⵏ ⵉⵣⵣⵓⵍⴰⵏⵏ ⴳ ⴰⴼⵓⵙ ⴰⵔ ⵜⵜⵓⵙⵏⵉⴷⵏ, ⴷⵉⴳⵙⵏ ⴰⵙⵏⵉⴷ ⵏ ⵓⵎⵓⵖⵍⵉ ⵏⵏⵙⵏ ⴳ ⵓⵎⵎⴰⵙ ⴰⵏⴰⵎⵓⵔ ⵏ ⵉⵎⵙⴽⴰⵔⵏ, ⴰⴷⵖⴰⵔ, ⴷ ⵓⵟⵟⵓⵏ ⵏ ⵓⵣⵎⵎⴻⵎ ⴰⵣⵔⴼⴰⵏ ICE.",
      faq4Q: "ⵎⴰ ⵉⴳⴰⵏ ⵜⴰⵙⵔⵜⵉⵜ ⵏ ⵓⵙⵓⵖⴰⵍ?",
      faq4A: "ⵉⵎⵙⴽⴰⵔⵏ ⴰⵔ ⵇⴱⴱⵍⵏ ⴰⵙⵓⵖⴰⵍ ⴳ 7 ⵓⵙⵙⴰⵏ ⴷⴼⴼⵉⵔ ⵓⵙⵉⵡⴹ. ⵜⴰⴳⴰⵡⵜ ⵉⵇⵇⴰⵏ ⴰⴷ ⵓⵔ ⵜⵜⵓⵙⵎⵔⵙ ⴷ ⴰⴷ ⵜⵉⵍⵉ ⴳ ⵓⵇⵔⴰⴱ ⵏⵏⵙ ⴰⵎⵣⵡⴰⵔⵓ. ⴰⵙⵓⵖⴰⵍ ⴰⵔ ⵉⵜⵜⵓⵙⴽⴰⵔ ⵙ ⵓⵙⵔⵉⴷ ⴷ ⵓⵎⵣⵣⵏⵣⵉ.",
    }
  };

  const t = labels[lang] || labels.en;

  const newProducts = [...allProducts]
    .filter(p => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(p.id)))
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 8);

  const matchedCategory = staticCategories.find(c => c.id === recentCategoryId || c.slug === recentCategoryId);
  const recentCategoryName = matchedCategory?.name[lang as 'en' | 'fr' | 'ar' | 'tz'] || matchedCategory?.name.en || "";
  const recentCategoryProducts = allProducts.filter((p) => {
    const isDirectMatch = p.category_id === recentCategoryId;
    const legacyMappedId = legacyCategoryMapping[p.category_id] || p.category_id;
    return isDirectMatch || legacyMappedId === recentCategoryId;
  })
  .filter(p => p.media_gallery?.[0] && !p.media_gallery[0].includes('1579783900882-c0d3dad7b119'))
  .slice(0, 8);

  const newestStores = [...shops]
    .filter(store => !store.is_placeholder)
    .sort((a, b) => {
      if (a.logo_url && !b.logo_url) return -1;
      if (!a.logo_url && b.logo_url) return 1;
      return 0;
    });

  const under100Products = [...allProducts]
    .filter(p => {
       const activePrice = (p.sale_price_mad !== null && p.sale_price_mad !== undefined && (!p.sale_expires_at || new Date(p.sale_expires_at) > new Date())) 
           ? p.sale_price_mad 
           : p.base_price_mad;
       return activePrice > 0 && activePrice < 100;
    })
    .slice(0, 10);

  const freeShippingProducts = [...allProducts]
    .filter(p => p.metadata?.shipping?.amana === true || p.metadata?.free_shipping === true || p.shipping_cost === 0)
    .slice(0, 10);

  return (
    <div className="space-y-16">

      {/* New Items Trail */}
      {newProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 md:mb-[30px]">
            <div>
              <h2 className="text-xl md:text-3xl font-bold !text-black">{t.newItems}</h2>
              <p className="text-xs text-neutral-500 mt-1">{t.newItemsSub}</p>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex" dir="ltr">
              <button onClick={() => scrollContainer(newArrivalsRef, 'left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scrollContainer(newArrivalsRef, 'right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
          <div ref={newArrivalsRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {newProducts.map((p) => {
              const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
              return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} className="flex-shrink-0 snap-start w-36 md:w-48 lg:w-[calc(20%-12.8px)]" />;
            })}
          </div>
        </section>
      )}

      {/* 4. Recently Viewed Category Trail */}
      {recentCategoryName && recentCategoryProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 md:mb-[30px]">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-start !text-black">
                {t.recentlyViewed} ({recentCategoryName})
              </h2>
              <p className="text-xs text-neutral-500 mt-1 text-start">{t.recentlyViewedSub}</p>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex" dir="ltr">
              <button onClick={() => scrollContainer(recentlyViewedRef, 'left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scrollContainer(recentlyViewedRef, 'right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
          <div ref={recentlyViewedRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {recentCategoryProducts.map((p) => {
              const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
              return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} className="flex-shrink-0 snap-start w-36 md:w-48 lg:w-[18%]" />;
            })}
          </div>
        </section>
      )}

      {/* Under 100 DH Trail */}
      {under100Products.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 md:mb-[30px]">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-start !text-black">{t.under100}</h2>
              <p className="text-xs text-neutral-500 mt-1 text-start">{t.under100Sub}</p>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex" dir="ltr">
              <button onClick={() => scrollContainer(under100Ref, 'left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scrollContainer(under100Ref, 'right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
          <div ref={under100Ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {under100Products.map((p) => {
              const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
              return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} className="flex-shrink-0 snap-start w-36 md:w-48 lg:w-[18%]" />;
            })}
          </div>
        </section>
      )}

      {/* Free Shipping Trail */}
      {freeShippingProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 md:mb-[30px]">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-start !text-black">{t.freeShipping}</h2>
              <p className="text-xs text-neutral-500 mt-1 text-start">{t.freeShippingSub}</p>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex" dir="ltr">
              <button onClick={() => scrollContainer(freeShippingRef, 'left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scrollContainer(freeShippingRef, 'right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
          <div ref={freeShippingRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {freeShippingProducts.map((p) => {
              const shop = shops.find((s) => s.id === p.shop_id) || shops[0];
              return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} className="flex-shrink-0 snap-start w-36 md:w-48 lg:w-[18%]" />;
            })}
          </div>
        </section>
      )}

      {/* 5. Newest Stores Trail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4 md:mb-[30px]">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-start !text-black">{t.newestStores}</h2>
            <p className="text-xs text-neutral-500 mt-1 text-start">{t.newestStoresSub}</p>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex" dir="ltr">
            <button onClick={() => scrollContainer(newestStoresRef, 'left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={() => scrollContainer(newestStoresRef, 'right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
        <div ref={newestStoresRef} className="flex gap-4 overflow-x-auto pt-[2px] pb-4 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:-mx-[2px] sm:px-[2px]">
          {newestStores.map((store) => (
            <Link 
              href={store.is_placeholder ? '#' : `/${lang}/shop/${store.slug}`}
              key={store.id} 
              className={`block flex-shrink-0 snap-start w-[280px] md:w-[320px] transition-all hover:opacity-90 ${store.is_placeholder ? 'opacity-50' : ''}`}
              style={{ filter: "drop-shadow(1px 0 0 #e5e5e5) drop-shadow(-1px 0 0 #e5e5e5) drop-shadow(0 1px 0 #e5e5e5) drop-shadow(0 -1px 0 #e5e5e5)" }}
            >
              <div className="bg-white arabic-frame p-6 flex flex-col justify-between h-full w-full">
              <div className="flex flex-col items-start text-start space-y-4">
                <div className="relative w-20 h-20 rounded-full border border-neutral-100 overflow-hidden bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <div className="space-y-1 w-full">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="block font-ariom text-neutral-900 text-xl leading-tight">
                      {store.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 text-sm font-medium">
                    <svg className="w-4 h-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    <span className="truncate">{store.merchant_city || "Morocco"}</span>
                  </div>
                </div>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </section>



    </div>
  );
}
