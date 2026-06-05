import Link from "next/link";
import { fetchProducts, fetchShopBySlug, fetchProfile } from "@/lib/supabase";
import ShopCatalogClient from "./ShopCatalogClient";
import ShopActionButtons from "./ShopActionButtons";

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

  let owner = null;
  try {
    if (shop.owner_id) {
      owner = await fetchProfile(shop.owner_id);
    }
  } catch (error) {
    console.error("Failed to fetch shop owner", error);
  }

  const CITIES: Record<string, {
    slug: string;
    name: string;
    tifinagh: string;
    image: string;
    bg: string;
    textColor: string;
  }> = {
    marrakech: { slug: "marrakech", name: "Marrakech", tifinagh: "ⵎⵕⵕⴰⴽⵛ", image: "/cities-2/marrakesh.avif", bg: "#2a0a1e", textColor: "#f5deb3" },
    fes: { slug: "fes", name: "Fès", tifinagh: "ⴼⴰⵙ", image: "/cities-2/fes.jpg", bg: "#0d1f2d", textColor: "#c9e0f0" },
    meknes: { slug: "meknes", name: "Meknès", tifinagh: "ⵎⴽⵏⴰⵙ", image: "/cities-2/meknes-2.jpg", bg: "#1e0a2e", textColor: "#e8d5f0" },
    rabat: { slug: "rabat", name: "Rabat", tifinagh: "ⵕⴱⴰⵟ", image: "/cities-2/rabat.jpg", bg: "#0a1a0e", textColor: "#c5e8cc" },
    tetouan: { slug: "tetouan", name: "Tétouan", tifinagh: "ⵟⵉⵟⵡⴰⵏ", image: "/cities-2/hamama.jpg", bg: "#1a1200", textColor: "#f5e6b0" },
  };

  // Find the city object
  const shopCitySlug = (shop.merchant_city || "").toLowerCase().trim();
  let cityObj = CITIES[shopCitySlug];
  // Fallback to marrakech if not found for demo purposes
  if (!cityObj) cityObj = CITIES["marrakech"];

  const labels: Record<string, Record<string, string>> = {
    en: {
      verified: "Verified Artisan",
      origin: "Based in",
      about: "About the artisan",
      itemsCount: "Products",
      ordersCount: "Sales",
      rating: "Rating",
      catalog: "Shop Collection",
      contact: "Contact",
      subscribe: "Subscribe",
    },
    fr: {
      verified: "Artisan Vérifié",
      origin: "Basé à",
      about: "À propos de l'artisan",
      itemsCount: "Produits",
      ordersCount: "Ventes",
      rating: "Évaluation",
      catalog: "Collection de la boutique",
      contact: "Contact",
      subscribe: "S'abonner",
    },
    ar: {
      verified: "حرفي موثق",
      origin: "مقرها في",
      about: "حول الحرفي",
      itemsCount: "المنتجات",
      ordersCount: "المبيعات",
      rating: "التقييم",
      catalog: "مجموعة المتجر",
      contact: "تواصل",
      subscribe: "متابعة",
    }
  };

  const t = labels[lang] || labels.en;

  const bannerPlaceholder = "https://previews.123rf.com/images/elnur/elnur1906/elnur190605511/124459111-young-beautiful-woman-knitting-at-home.jpg";
  const logoPlaceholder = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80";

  const bannerUrl = shop.banner_url || bannerPlaceholder;
  const logoUrl = shop.logo_url || logoPlaceholder;

  return (
    <div className="w-full pb-12">
      {/* Full Width Banner (Bleed) */}
      <div className="relative w-[100vw] ml-[calc(50%-50vw)] h-[160px] md:h-[220px] lg:h-[260px] bg-neutral-100 flex-shrink-0 -mt-8 overflow-hidden arabic-frame-bottom">
        <img
          src={bannerUrl}
          alt="shop banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-0">

        {/* Left Sidebar Profile (No background, overlapping avatar) */}
        <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 flex flex-col z-10">

          {/* Avatar (Overlapping banner) */}
          <div className="flex items-center gap-4 mb-4 -mt-10 md:-mt-12 lg:-mt-16 relative z-20">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-white overflow-hidden flex-shrink-0">
              <img src={logoUrl} alt="shop logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Name and Owner */}
          <div className="flex flex-col mt-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#111827] leading-tight tracking-tight">
              {shop.name}
            </h1>
            {owner && (
              <Link href={`/${lang}/user/${owner.id}`} className="text-sm font-medium text-[#E8583F] hover:underline mt-1">
                (owned by {owner.full_name || 'Anonymous'})
              </Link>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.353.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
              </svg>
              {lang === 'fr' ? 'Fondateur' : lang === 'ar' ? 'مؤسس' : 'Early Founder'}
            </span>
            {shop.is_verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                {lang === 'fr' ? 'Vendeur Vérifié' : lang === 'ar' ? 'بائع موثق' : 'Verified Seller'}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#6b7280] text-sm md:text-base mt-2 mb-4 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>{cityObj.name}, Morocco</span>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-[#4b5563] leading-relaxed mb-6 font-medium mt-1">
            {shop.description_translations[lang as 'en' | 'fr' | 'ar'] || shop.description_translations.en}
          </p>

          {/* Action Buttons */}
          <ShopActionButtons
            shopId={shop.id}
            contactLabel={t.contact}
            subscribeLabel={t.subscribe}
            lang={lang}
          />

          {/* Stats Flex */}
          <div className="flex flex-col gap-4 text-[#111827] text-sm md:text-base border-t border-neutral-200 pt-6">
            {/* Rating */}
            <div className="flex items-center justify-between">
              <span className="text-[#6b7280] font-medium">{t.rating}</span>
              <span className="font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffb400" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
                </svg>
                {shop.average_rating || "5.0"}
                <span className="text-[#6b7280] text-xs font-normal ml-1">{(0)}</span>
              </span>
            </div>

            {/* Sales */}
            <div className="flex items-center justify-between">
              <span className="text-[#6b7280] font-medium">{t.ordersCount}</span>
              <span className="font-bold">{shop.completed_orders_count || 0}</span>
            </div>

            {/* Products */}
            <div className="flex items-center justify-between">
              <span className="text-[#6b7280] font-medium">{t.itemsCount}</span>
              <span className="font-bold">{shopProducts.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content: Products Grid */}
        <div className="flex-1 w-full pt-10 lg:pt-16">
          {/* Behance Style Tab Headers */}
          <div className="flex items-center gap-8 border-b border-neutral-200 pb-3 mb-6">
            <h2 className="text-sm font-bold text-black border-b-2 border-black pb-3 -mb-[14px] whitespace-nowrap">
              {t.catalog}
            </h2>
          </div>

          <ShopCatalogClient
            initialProducts={shopProducts}
            shop={shop}
            lang={lang}
          />
        </div>
      </div>

      {/* Bottom Sections: Reviews, Announcements, FAQ */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 space-y-16">

        {/* Announcements Section */}
        <section className="border-t border-neutral-200 pt-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-1">{lang === 'fr' ? 'Annonce' : lang === 'ar' ? 'إعلان' : 'Announcement'}</h2>
            <p className="text-xs text-neutral-500">{lang === 'fr' ? 'Dernière mise à jour : 03 mai 2021' : 'Last updated: May 03, 2021'}</p>
          </div>
          <div className="flex-1 w-full flex flex-col items-center">
            <div className="w-full text-sm text-neutral-600 mb-6 text-center md:text-left">
              <span className="text-yellow-500 mr-1">⚠️</span>
              <strong>**DATE LIMITE DE LIVRAISON POUR LES FÊTES**</strong> Les commandes doivent être passées avant les dates ci-dessous pour garantir une livraison avant le 24 décembre (Livraison standard) :
            </div>
            <button className="px-6 py-2 border-2 border-blue-600 text-black font-bold text-sm rounded-full hover:bg-neutral-50 transition-colors">
              {lang === 'fr' ? 'En lire plus' : lang === 'ar' ? 'اقرأ المزيد' : 'Read more'}
            </button>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="border-t border-neutral-200 pt-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4">{lang === 'fr' ? 'Avis' : lang === 'ar' ? 'التقييمات' : 'Reviews'}</h2>
            <div className="flex items-center gap-1 mb-2">
              <span className="font-bold text-lg text-black">4.7</span>
              <svg viewBox="0 0 24 24" fill="#111827" className="w-4 h-4"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
              <span className="text-neutral-500 text-sm">(21)</span>
            </div>
            <p className="font-bold text-xs text-black mb-1">{lang === 'fr' ? 'Moyenne des évaluations' : 'Average rating'}</p>
            <p className="text-[10px] text-neutral-500 leading-tight">
              {lang === 'fr' ? 'Nous calculons ceci en réalisant une moyenne de tous les avis pondérée en fonction de leur caractère récent : le poids d\'un avis diminue de moitié chaque année, afin de refléter au mieux l\'expérience actuelle.' : 'We calculate this by averaging all reviews weighted by their recency...'}
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-end mb-6">
              <button className="text-xs font-bold text-black flex items-center gap-1 hover:underline">
                {lang === 'fr' ? 'Trier par : suggéré' : 'Sort by: suggested'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
              </button>
            </div>

            <div className="space-y-8">
              {/* Mock Review 1 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-2"><span className="underline cursor-pointer">Annette</span> le 22 mars 2026</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} viewBox="0 0 24 24" fill="#111827" className="w-3.5 h-3.5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    ))}
                  </div>
                  <p className="text-sm text-black mb-2">Tout est parfait. Article conforme à la description.</p>
                  <button className="text-xs font-bold text-black hover:underline mb-4">Voir dans la langue d'origine</button>
                  <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg max-w-sm">
                    <img src={shopProducts[0]?.media_gallery?.[0] || bannerUrl} className="w-12 h-12 object-cover rounded-md" alt="Product" />
                    <p className="text-xs text-neutral-600 line-clamp-2">{shopProducts[0]?.title_translations?.[lang as 'en' | 'fr' | 'ar'] || shopProducts[0]?.title_translations?.en || 'Product'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-neutral-200 pt-10 pb-8 flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{lang === 'fr' ? 'FAQ' : lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
          </div>
          <div className="flex-1 w-full space-y-4">
            {shop.faq_translations?.length > 0 ? shop.faq_translations.map((faq: any, idx: number) => (
              <div key={idx} className="border border-neutral-200 rounded-xl p-5">
                <h3 className="font-bold text-black mb-2">{faq.q[lang as 'en' | 'fr' | 'ar'] || faq.q.en}</h3>
                <p className="text-neutral-600 text-sm">{faq.a[lang as 'en' | 'fr' | 'ar'] || faq.a.en}</p>
              </div>
            )) : (
              <div className="border border-neutral-200 rounded-xl p-5">
                <h3 className="font-bold text-black mb-2">{lang === 'fr' ? 'Proposez-vous des commandes personnalisées ?' : lang === 'ar' ? 'هل تقبلون الطلبات الخاصة؟' : 'Do you accept custom orders?'}</h3>
                <p className="text-neutral-600 text-sm">{lang === 'fr' ? 'Oui ! Contactez-moi directement via le bouton de contact.' : lang === 'ar' ? 'نعم! تواصل معي مباشرة عبر زر التواصل.' : 'Yes! Please reach out to me directly via the contact button.'}</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
