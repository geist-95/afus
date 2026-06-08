import Link from "next/link";
import { fetchProducts, fetchShopBySlug, fetchProfile, fetchShopReviews } from "@/lib/supabase";
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

  let reviews: any[] = [];
  try {
    reviews = await fetchShopReviews(shop.id);
  } catch (error) {
    console.error("Failed to fetch shop reviews", error);
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

  const bannerUrl = shop.metadata?.cover_url || shop.banner_url || bannerPlaceholder;
  const logoUrl = shop.metadata?.logo_url || shop.logo_url || logoPlaceholder;

  return (
    <div className="w-full pb-12">
      {/* Shop Banner with Info */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div 
          className="relative w-full overflow-hidden min-h-[300px] flex flex-col md:flex-row arabic-frame"
          style={{ backgroundColor: cityObj?.bg || "#111827" }}
        >
          {/* Left: Shop Info */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center px-6 md:px-12 py-10 z-10 text-center md:text-left">
            
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white flex-shrink-0 mb-4 shadow-sm" style={{ 
              mask: `
                radial-gradient(circle at top left, transparent 8px, black 9px) top left / 51% 51% no-repeat,
                radial-gradient(circle at top right, transparent 8px, black 9px) top right / 51% 51% no-repeat,
                radial-gradient(circle at bottom left, transparent 8px, black 9px) bottom left / 51% 51% no-repeat,
                radial-gradient(circle at bottom right, transparent 8px, black 9px) bottom right / 51% 51% no-repeat
              `,
              WebkitMask: `
                radial-gradient(circle at top left, transparent 8px, black 9px) top left / 51% 51% no-repeat,
                radial-gradient(circle at top right, transparent 8px, black 9px) top right / 51% 51% no-repeat,
                radial-gradient(circle at bottom left, transparent 8px, black 9px) bottom left / 51% 51% no-repeat,
                radial-gradient(circle at bottom right, transparent 8px, black 9px) bottom right / 51% 51% no-repeat
              `
            }}>
              <img src={logoUrl} alt="shop logo" className="w-full h-full object-cover" />
            </div>

            {/* Title & Badges */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold !font-ariom leading-tight tracking-tight !text-white">
                {shop.name}
              </h1>
              
              {/* Badges */}
              <div className="flex items-center gap-2">
                <div className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-[#fcd34d]/20 backdrop-blur-sm border border-[#fcd34d]/30 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#fcd34d]">
                    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.353.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-black/80 text-[#fcd34d] text-[11px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {lang === 'fr' ? 'Fondateur' : lang === 'ar' ? 'مؤسس' : 'Early Founder'}
                  </div>
                </div>
                
                {shop.is_verified && (
                  <div className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-100">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-black/80 text-white text-[11px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {lang === 'fr' ? 'Vendeur Vérifié' : lang === 'ar' ? 'بائع موثق' : 'Verified Seller'}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 font-medium mb-5 text-white/90">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span>{cityObj.name}, Morocco</span>
            </div>
            
            {/* Social Links */}
            {(shop.metadata?.instagram || shop.metadata?.facebook || shop.metadata?.whatsapp || shop.metadata?.phone || shop.metadata?.email) && (
              <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
                {shop.metadata?.instagram && (
                   <a href={shop.metadata.instagram.startsWith('http') ? shop.metadata.instagram : `https://instagram.com/${shop.metadata.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100 opacity-70 text-white">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                   </a>
                )}
                {shop.metadata?.facebook && (
                   <a href={shop.metadata.facebook.startsWith('http') ? shop.metadata.facebook : `https://facebook.com/${shop.metadata.facebook}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100 opacity-70 text-white">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                   </a>
                )}
                {shop.metadata?.whatsapp && (
                   <a href={`https://wa.me/${shop.metadata.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100 opacity-70 text-white">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.996 0A12 12 0 000 12c0 2.138.563 4.148 1.547 5.918L0 24l6.233-1.528A11.968 11.968 0 0011.996 24C18.625 24 24 18.625 24 12 24 5.375 18.625 0 11.996 0zm0 22c-1.802 0-3.504-.46-5.011-1.28l-.358-.2-3.73.91.998-3.606-.213-.342C2.79 15.658 2.2 13.882 2.2 12c0-5.41 4.402-9.813 9.796-9.813 5.394 0 9.795 4.403 9.795 9.813 0 5.411-4.401 9.813-9.795 9.813zm5.367-7.318c-.294-.148-1.741-.861-2.012-.958-.271-.098-.468-.148-.665.148-.196.295-.762.958-.934 1.154-.172.197-.344.221-.638.074-1.547-.775-2.613-1.378-3.593-2.684-.251-.334.25-.32.687-.991.147-.221.074-.418 0-.565-.074-.148-.665-1.603-.91-2.193-.241-.577-.487-.499-.665-.508-.172-.01-.369-.01-.566-.01-.197 0-.517.074-.788.37s-1.033 1.009-1.033 2.46c0 1.452 1.058 2.855 1.205 3.052.148.197 2.083 3.181 5.045 4.46.706.305 1.258.487 1.688.623.708.225 1.353.193 1.862.117.57-.084 1.741-.712 1.987-1.401.246-.689.246-1.28.172-1.401-.074-.123-.271-.197-.565-.344z"/></svg>
                   </a>
                )}
              </div>
            )}

            {/* Actions & Stats */}
            <div className="flex flex-col items-center md:items-start w-full">
              
              {/* Container */}
              <div className="flex flex-col gap-5 w-full md:w-auto">
                
                {/* Action Buttons (placed above stats as requested) */}
                <div className="w-full sm:w-auto">
                  <ShopActionButtons
                    shopId={shop.id}
                    contactLabel={t.contact}
                    subscribeLabel={t.subscribe}
                    lang={lang}
                  />
                </div>

                {/* Stats with vertical separators */}
                <div className="flex items-center justify-center md:justify-start text-sm md:text-base divide-x divide-white/20">
                  <div className="flex flex-col items-center md:items-start pr-6">
                    <span className="font-bold text-white text-lg leading-none">{shop.completed_orders_count || 0}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-1.5">{t.ordersCount}</span>
                  </div>
                  <div className="flex flex-col items-center md:items-start px-6">
                    <span className="font-bold flex items-center gap-1 text-white text-lg leading-none">
                      {shop.average_rating || "5.0"}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 -mt-0.5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-1.5">{t.rating}</span>
                  </div>
                  <div className="flex flex-col items-center md:items-start pl-6">
                    <span className="font-bold text-white text-lg leading-none">{shopProducts.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-1.5">{t.itemsCount}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right: image */}
          <div className="relative w-full md:w-[45%] lg:w-[50%] min-h-[200px] flex-shrink-0">
            <img
              src={bannerUrl}
              alt="shop banner"
              className="w-full h-full object-cover banner-img"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Main Content: Products Grid */}
        <div id="products" className="w-full">
          {/* Behance Style Tab Headers */}
          <div className="flex items-center gap-8 border-b border-neutral-200 pb-3 mb-6 overflow-x-auto">
            <a href="#products" className="text-sm font-bold text-black border-b-2 border-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer">
              {t.itemsCount}
            </a>
            <a href="#reviews" className="text-sm font-bold text-neutral-500 hover:text-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors">
              {lang === 'fr' ? 'Avis' : lang === 'ar' ? 'التقييمات' : 'Reviews'}
            </a>
            <a href="#faq" className="text-sm font-bold text-neutral-500 hover:text-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors">
              {lang === 'fr' ? 'FAQ' : lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </a>
            <a href="#about" className="text-sm font-bold text-neutral-500 hover:text-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors">
              {t.about}
            </a>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-black mb-6">{lang === 'fr' ? 'Tous les produits' : lang === 'ar' ? 'جميع المنتجات' : 'All products'}</h3>

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
        <section id="reviews" className="border-t border-neutral-200 pt-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4">{lang === 'fr' ? 'Avis' : lang === 'ar' ? 'التقييمات' : 'Reviews'}</h2>
            <div className="flex items-center gap-1 mb-2">
              <span className="font-bold text-lg text-black">{shop.average_rating || 5.0}</span>
              <svg viewBox="0 0 24 24" fill="#111827" className="w-4 h-4"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
              <span className="text-neutral-500 text-sm">({reviews.length})</span>
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
              {reviews.length > 0 ? reviews.map((review: any) => (
                <div key={review.id} className="flex flex-col sm:flex-row gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-neutral-500">
                    {review.reviewer_profile?.avatar_url ? (
                      <img src={review.reviewer_profile.avatar_url} alt={review.reviewer_profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 p-1"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-2"><span className="underline cursor-pointer">{review.reviewer_profile?.full_name || 'Anonymous'}</span> le {new Date(review.created_at).toLocaleDateString()}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} viewBox="0 0 24 24" fill={star <= review.rating ? "#111827" : "#e5e7eb"} className="w-3.5 h-3.5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      ))}
                    </div>
                    <p className="text-sm text-black mb-2">{review.comment}</p>
                    
                    <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg max-w-sm">
                      <img src={review.product?.media_gallery?.[0] || bannerUrl} className="w-12 h-12 object-cover rounded-md" alt="Product" />
                      <p className="text-xs text-neutral-600 line-clamp-2">{review.product?.title_translations?.[lang as 'en' | 'fr' | 'ar' | 'tz'] || review.product?.title_translations?.en || 'Product'}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-neutral-500 italic">
                  {lang === 'fr' ? 'Aucun avis pour le moment.' : lang === 'ar' ? 'لا توجد تقييمات حتى الآن.' : 'No reviews yet.'}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-neutral-200 pt-10 pb-8 flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{lang === 'fr' ? 'FAQ' : lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
          </div>
          <div className="flex-1 w-full space-y-4">
            {shop.faq_translations?.length > 0 ? shop.faq_translations.map((faq: any, idx: number) => (
              <div key={idx} className="border border-neutral-200 rounded-xl p-5">
                <h3 className="font-bold text-black mb-2">{faq.q[lang as 'en' | 'fr' | 'ar' | 'tz'] || faq.q.en}</h3>
                <p className="text-neutral-600 text-sm">{faq.a[lang as 'en' | 'fr' | 'ar' | 'tz'] || faq.a.en}</p>
              </div>
            )) : (
              <div className="border border-neutral-200 rounded-xl p-5">
                <h3 className="font-bold text-black mb-2">{lang === 'fr' ? 'Proposez-vous des commandes personnalisées ?' : lang === 'ar' ? 'هل تقبلون الطلبات الخاصة؟' : 'Do you accept custom orders?'}</h3>
                <p className="text-neutral-600 text-sm">{lang === 'fr' ? 'Oui ! Contactez-moi directement via le bouton de contact.' : lang === 'ar' ? 'نعم! تواصل معي مباشرة عبر زر التواصل.' : 'Yes! Please reach out to me directly via the contact button.'}</p>
              </div>
            )}
          </div>
        </section>

        {/* About / Owner Section */}
        {(owner || shop.metadata?.description || shop.description_translations) && (
          <section id="about" className="border-t border-neutral-200 pt-10 pb-16 flex flex-col md:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{t.about}</h2>
            </div>
            <div className="flex-1 w-full flex flex-col">
              {owner && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                    {owner.avatar_url ? (
                      <img src={owner.avatar_url} alt={owner.full_name || 'Owner'} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-neutral-400 p-2"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">{lang === 'fr' ? 'Propriétaire de la boutique' : lang === 'ar' ? 'صاحب المتجر' : 'Shop Owner'}</span>
                    <Link href={`/${lang}/user/${owner.id}`} className="text-lg font-bold text-black hover:underline mt-0.5">
                      {owner.full_name || 'Anonymous'}
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Bio / Description */}
              <p className="text-sm md:text-base leading-relaxed text-neutral-700 max-w-3xl whitespace-pre-wrap">
                {shop.metadata?.description || shop.description_translations?.[lang as 'en' | 'fr' | 'ar' | 'tz'] || shop.description_translations?.en}
              </p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
