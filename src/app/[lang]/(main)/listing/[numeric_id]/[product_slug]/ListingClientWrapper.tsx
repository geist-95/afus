'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockProducts, mockShops, staticCategories, fetchProducts, supabase } from "@/lib/supabase";
import { getActiveSession } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { ProductPageSkeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard, SimpleProductCard } from "@/components/ui/ProductGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ListingClientProps {
  lang: string;
  numericId: number;
  productSlug: string;
  initialTitle: string;
  initialPrice: string;
  initialImage: string;
  initialShopName: string;
}

export default function ListingClientWrapper({
  lang,
  numericId,
  productSlug,
  initialTitle,
  initialPrice,
  initialImage,
  initialShopName,
}: ListingClientProps) {
  // Page state
  const defaultPlaceholder = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop";
  const [activeImage, setActiveImage] = useState(initialImage || defaultPlaceholder);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [customizationText, setCustomizationText] = useState("");
  const [shippingCity, setShippingCity] = useState("Casablanca");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [shippingExpanded, setShippingExpanded] = useState(false);

  // Background fetched data state
  const [fetchedProduct, setFetchedProduct] = useState<any>(null);
  const [fetchedShop, setFetchedShop] = useState<any>(null);
  const [isFetchingBackground, setIsFetchingBackground] = useState(true);
  const [allProductsList, setAllProductsList] = useState<any[]>([]);
  const [allShopsList, setAllShopsList] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function loadSession() {
      const active = await getActiveSession();
      setSession(active);
    }
    loadSession();
  }, []);

  // Localization labels
  const labels: Record<string, Record<string, string>> = {
    en: {
      mad: "MAD",
      codEligible: "Cash on delivery eligible",
      checkoutTitle: "Place cash on delivery order",
      customizationLabel: "Personalization instructions (optional)",
      customizationPlaceholder: "E.g., engrave initials 'y.t.' or specify sizing...",
      buyBtn: "Buy now (pay cash on delivery)",
      shippingTitle: "Amana shipping calculator",
      selectCity: "Select delivery city",
      estShipping: "Estimated shipping (amana)",
      totalCod: "Total to pay on delivery",
      descTitle: "Product description",
      policyTitle: "Store shipping & return policies",
      faqTitle: "Frequently asked questions",
      variantLabel: "Select option",
      fetchingDetails: "Fetching full details...",
      fullName: "Your full name",
      phone: "Phone number (required for cod sms confirmation)",
      phoneHelp: "Must start with +212, 06, or 07 (e.g. 0661234567)",
      address: "Delivery street address",
      confirmBtn: "Confirm cash on delivery order",
      successTitle: "Order placed successfully!",
      successDesc: "Your order is registered. The artisan will call you to confirm before courier collection.",
      trackingNum: "Amana tracking number",
      trackLink: "Track on barid bank amana portal",
      originCity: "Origin city",
      ice: "ICE corporate registration check",
      verified: "Verified artisan",
      quantity: "Quantity",
      addToCart: "Add to cart",
      addedToCart: "Item added to cart!",
      orderNow: "Order now to receive it by",
    },
    fr: {
      mad: "DH",
      codEligible: "Éligible au paiement à la livraison",
      checkoutTitle: "Passer commande (paiement à la livraison)",
      customizationLabel: "Instructions de personnalisation (optionnel)",
      customizationPlaceholder: "Ex: graver les initiales 'y.t.' ou taille spécifique...",
      buyBtn: "Acheter (payer à la livraison)",
      shippingTitle: "Calculateur de livraison amana",
      selectCity: "Sélectionner la ville de livraison",
      estShipping: "Livraison estimée (amana)",
      totalCod: "Total à payer à la livraison",
      descTitle: "Description du produit",
      policyTitle: "Conditions de livraison & retour",
      faqTitle: "Questions fréquentes",
      variantLabel: "Sélectionner une option",
      fetchingDetails: "Chargement des détails...",
      fullName: "Nom complet",
      phone: "Numéro de téléphone (requis pour confirmation cod)",
      phoneHelp: "Doit commencer par +212, 06, ou 07 (ex: 0661234567)",
      address: "Adresse de livraison",
      confirmBtn: "Confirmer la commande COD",
      successTitle: "Commande validée !",
      successDesc: "Votre commande est enregistrée. L'artisan vous contactera par téléphone pour confirmer avant l'envoi.",
      trackingNum: "Numéro de suivi amana",
      trackLink: "Suivre sur le portail amana",
      originCity: "Ville d'origine",
      ice: "Identifiant commun de l'entreprise (ice)",
      verified: "Artisan vérifié",
      quantity: "Quantité",
      addToCart: "Ajouter au panier",
      addedToCart: "Produit ajouté au panier !",
      orderNow: "Commandez pour une livraison le",
    },
    ar: {
      mad: "درهم",
      codEligible: "متاح للدفع عند الاستلام",
      checkoutTitle: "إجراء طلب الدفع عند الاستلام",
      customizationLabel: "تعليمات التخصيص (اختياري)",
      customizationPlaceholder: "مثال: نقش الحروف الأولى 'y.t.' أو تحديد الحجم...",
      buyBtn: "اشترِ الآن (الدفع عند الاستلام)",
      shippingTitle: "حاسبة شحن أمانة",
      selectCity: "اختر مدينة التوصيل",
      estShipping: "الشحن التقديري (أمانة)",
      totalCod: "المجموع الكلي للدفع عند الاستلام",
      descTitle: "وصف المنتج",
      policyTitle: "سياسة الشحن والإرجاع للمتجر",
      faqTitle: "الأسئلة الشائعة",
      variantLabel: "اختر خياراً",
      fetchingDetails: "جاري تحميل التفاصيل...",
      fullName: "الاسم الكامل",
      phone: "رقم الهاتف (ضروري لتأكيد الطلب)",
      phoneHelp: "يجب أن يبدأ بـ 212+ أو 06 أو 07 (مثال: 0661234567)",
      address: "عنوان التوصيل بالكامل",
      confirmBtn: "تأكيد طلب الدفع عند الاستلام",
      successTitle: "تم تسجيل طلبك بنجاح!",
      successDesc: "طلبك قيد المعالجة. سيتصل بك الحرفي هاتفياً لتأكيد الطلبية قبل شحنها عبر أمانة.",
      trackingNum: "رقم تتبع أمانة",
      trackLink: "تتبع عبر بوابة أمانة لبريد المغرب",
      originCity: "مدينة الشحن",
      ice: "رقم ICE القانوني للمؤسسة",
      verified: "حرفي موثق",
      quantity: "الكمية",
      addToCart: "أضف إلى السلة",
      addedToCart: "تمت إضافة المنتج إلى السلة!",
      orderNow: "اطلب الآن لتستلم بين",
    }
  };

  const t = labels[lang] || labels.en;

  // Background fetch logic
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const allProducts = await fetchProducts();
        setAllProductsList(allProducts);
        setAllShopsList(mockShops);
        const product = allProducts.find(
          (p) => Number(p.numeric_id) === Number(numericId) || p.slug_translations?.[lang as 'en' | 'fr' | 'ar'] === productSlug
        );

        if (product) {
          if (product.media_gallery && product.media_gallery.length > 0) {
            setActiveImage(product.media_gallery[0]);
          } else {
            product.media_gallery = [activeImage];
          }
          setFetchedProduct(product);
          if (typeof window !== 'undefined' && product.category_id) {
            localStorage.setItem('recently_viewed_category_id', product.category_id);
          }
          // Find the shop in the database
          let shopData = null;
          const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
          if (isUUID(product.shop_id)) {
            const { data } = await supabase.from('shops').select('*').eq('id', product.shop_id).single();
            shopData = data;
          }
          if (shopData) {
            setFetchedShop(shopData);
          } else {
            const shop = mockShops.find((s) => s.id === product.shop_id);
            if (shop) setFetchedShop(shop);
          }

          // If product has variants, set the first variant as default
          if (product.variants && product.variants.length > 0) {
            setSelectedVariantId(product.variants[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching live listing details:', err);
      } finally {
        setIsFetchingBackground(false);
      }
    };

    fetchDetails();
  }, [numericId, productSlug, lang]);

  const [timeLeft, setTimeLeft] = useState<string>("");

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!fetchedProduct?.media_gallery) return;
    const currentIndex = fetchedProduct.media_gallery.indexOf(activeImage);
    if (currentIndex > 0) {
      setActiveImage(fetchedProduct.media_gallery[currentIndex - 1]);
    } else {
      setActiveImage(fetchedProduct.media_gallery[fetchedProduct.media_gallery.length - 1]);
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!fetchedProduct?.media_gallery) return;
    const currentIndex = fetchedProduct.media_gallery.indexOf(activeImage);
    if (currentIndex < fetchedProduct.media_gallery.length - 1) {
      setActiveImage(fetchedProduct.media_gallery[currentIndex + 1]);
    } else {
      setActiveImage(fetchedProduct.media_gallery[0]);
    }
  };

  // Determine active sale flag
  const isSaleActive = !!(
    fetchedProduct &&
    fetchedProduct.sale_price_mad !== null &&
    fetchedProduct.sale_price_mad !== undefined &&
    (!fetchedProduct.sale_expires_at || new Date(fetchedProduct.sale_expires_at) > new Date())
  );

  useEffect(() => {
    if (!fetchedProduct || !fetchedProduct.sale_expires_at || !isSaleActive) return;

    const updateTimer = () => {
      const difference = new Date(fetchedProduct.sale_expires_at).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft("");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        let timeStr = "";
        if (days > 0) timeStr += `${days}d `;
        timeStr += `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        setTimeLeft(timeStr);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [fetchedProduct, isSaleActive]);

  // Determine current active price
  let basePrice = fetchedProduct ? fetchedProduct.base_price_mad : parseFloat(initialPrice || "0");
  let currentPrice = basePrice;
  if (isSaleActive && fetchedProduct) {
    currentPrice = fetchedProduct.sale_price_mad;
  }

  if (fetchedProduct && selectedVariantId) {
    const activeVariant = fetchedProduct.variants.find((v: any) => v.id === selectedVariantId);
    if (activeVariant && activeVariant.price_override_mad) {
      currentPrice = activeVariant.price_override_mad;
    }
  }

  // Amana shipping cost calculation based on merchant origin and shipping destination
  const getShippingCost = () => {
    const origin = fetchedShop?.merchant_city || "Marrakech";
    const cleanOrigin = origin.toLowerCase().trim();
    const cleanDestination = shippingCity.toLowerCase().trim();

    if (cleanOrigin === cleanDestination) {
      return 35.00; // Intra-city
    }
    const majorCities = ['casablanca', 'rabat', 'marrakech', 'tangier', 'fes', 'agadir', 'oujda', 'meknes', 'kenitra', 'tetouan'];
    if (majorCities.includes(cleanDestination)) {
      return 45.00; // Major inter-city
    }
    return 55.00; // Rural/remote
  };

  const shippingCost = getShippingCost();
  const totalCOD = currentPrice + shippingCost;

  // Form submission handler removed in favor of cart

  if (isFetchingBackground && !fetchedProduct) {
    return <ProductPageSkeleton />;
  }

  const today = new Date();
  const formatDate = (d: Date) => d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-MA' : 'en-US', { month: 'short', day: 'numeric' });
  const shipDateMin = new Date(); shipDateMin.setDate(today.getDate() + 2);
  const shipDateMax = new Date(); shipDateMax.setDate(today.getDate() + 3);
  const delDateMin = new Date(); delDateMin.setDate(today.getDate() + 5);
  const delDateMax = new Date(); delDateMax.setDate(today.getDate() + 8);

  const matchedCategory = staticCategories.find(c => {
    const isDirectMatch = c.id === fetchedProduct?.category_id;
    const legacyMappedId = fetchedProduct?.category_id === '1a111111-1111-1111-1111-111111111111' ? 'cat_jewelry'
      : fetchedProduct?.category_id === '2b222222-2222-2222-2222-222222222222' ? 'cat_art_collectibles'
      : fetchedProduct?.category_id === '3c333333-3333-3333-3333-333333333333' ? 'cat_bath_beauty'
      : fetchedProduct?.category_id === '4d444444-4444-4444-4444-444444444444' ? 'cat_clothing'
      : fetchedProduct?.category_id === '5e555555-5555-5555-5555-555555555555' ? 'cat_bags_purses'
      : fetchedProduct?.category_id === '6f666666-6666-6666-6666-666666666666' ? 'cat_home_living'
      : fetchedProduct?.category_id;
    return isDirectMatch || c.id === legacyMappedId;
  });
  const productCategoryName = matchedCategory
    ? matchedCategory.name[lang as 'en'|'fr'|'ar'] || matchedCategory.name.en
    : (fetchedProduct?.category_id === '1a111111-1111-1111-1111-111111111111' ? 'Jewelry' : 'Homeware');

  const tags = [
    'artisan craft',
    'moroccan legacy',
    productCategoryName,
    'authentic handmade',
    'sustainable build',
    'traditional art',
    'moroccan design',
    'hand carved',
    'limited edition'
  ];



  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex justify-center items-center gap-2 text-sm text-black/40 font-medium flex-wrap">
        <Link href={`/${lang}`} className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="capitalize hover:text-black transition-colors cursor-default">{productCategoryName}</span>
        <span>/</span>
        <span className="text-black capitalize truncate max-w-[240px]">
          {fetchedProduct ? (fetchedProduct.title_translations[lang] || fetchedProduct.title_translations.en) : initialTitle}
        </span>
      </div>

      {/* Dynamic Item Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Image + Reviews + About Shop */}
        <div className="lg:col-span-8 space-y-12">

          {/* Gallery Layout */}
          <div className="flex gap-4 h-[70vh] max-h-[630px]">
            {/* Thumbnails Stack (Vertical Strip on the left) */}
            {fetchedProduct && fetchedProduct.media_gallery && fetchedProduct.media_gallery.length > 1 && (
              <div className="flex flex-col gap-2 overflow-y-auto pr-2 scrollbar-none snap-y w-20 flex-shrink-0">
                {fetchedProduct.media_gallery.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(imgUrl); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setActiveImage(imgUrl); } }}
                    className={`cursor-pointer rounded-2xl flex-shrink-0 snap-start border ${activeImage === imgUrl ? 'border-primary border-2' : 'border-primary/20'} h-20 w-20 overflow-hidden bg-primary/5`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Large Main Image */}
            <div 
              className="flex-1 border border-primary/10 bg-primary/5 overflow-hidden relative rounded-2xl h-full cursor-pointer group"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                src={activeImage}
                alt={initialTitle}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 bg-primary text-white font-medium text-xs tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                {t.codEligible}
              </span>
              
              {/* Prev/Next buttons on main image */}
              {fetchedProduct?.media_gallery && fetchedProduct.media_gallery.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>


          {/* About the Artisan Shop UI */}
          <div className="arabic-frame bg-neutral-200 p-[1px]">
            <div className="arabic-frame bg-white p-6 space-y-8 h-full">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <div className="w-20 h-20 border border-neutral-200 rounded-full overflow-hidden bg-neutral-50 flex items-center justify-center flex-shrink-0">
                      {fetchedShop?.logo_url ? (
                        <img src={fetchedShop.logo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-neutral-400">{fetchedShop?.name?.charAt(0) || initialShopName?.charAt(0)}</span>
                      )}
                    </div>
                    {fetchedShop?.is_verified && (
                      <div className="absolute bottom-0 right-0 bg-fuchsia-600 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        ★
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/${lang}/shop/${fetchedShop?.id || ''}`}>
                        <h3 className="text-xl font-bold text-black hover:underline">{fetchedShop?.name || initialShopName}</h3>
                      </Link>
                      <span className="text-sm text-neutral-500">{fetchedShop?.merchant_city || "Marrakech"}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm font-semibold text-neutral-800">
                      <span className="flex items-center gap-1">★ {fetchedShop?.average_rating || 5.0} ({fetchedShop?.completed_orders_count || 1})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[240px]">
                  <button className="w-full py-2.5 px-4 rounded-full border border-neutral-300 font-bold hover:bg-neutral-50 transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    S'abonner
                  </button>
                  <button className="w-full py-2.5 px-4 rounded-full border border-neutral-900 font-bold hover:bg-neutral-50 transition">
                    Contacter
                  </button>
                  <span className="text-center text-[11px] text-neutral-500 mt-1">Répond en 24h</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-100">
                <div>
                  <h4 className="font-bold text-sm">Livraisons efficaces</h4>
                  <p className="text-sm text-neutral-600 mt-1">Les envois sont réalisés dans les temps et accompagnés d'un suivi.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Réponses rapides</h4>
                  <p className="text-sm text-neutral-600 mt-1">Répond rapidement aux messages reçus.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Avis enthousiastes</h4>
                  <p className="text-sm text-neutral-600 mt-1">La moyenne des avis est d'au moins 4,8.</p>
                </div>
              </div>
              
              <p className="text-sm text-neutral-600 leading-relaxed capitalize mt-4 p-4 bg-neutral-50 rounded-xl">
                {fetchedShop?.description_translations?.[lang] || fetchedShop?.description_translations?.en || "We are a small collective of authentic local artisans, keeping century-old techniques and traditional crafts alive."}
              </p>
            </div>
          </div>

          {/* Buyer Reviews */}
          <div className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium text-black tracking-tight">Reviews & Rating</h2>
              <button className="text-sm font-semibold text-black hover:underline flex items-center gap-1">
                View All Reviews <span>→</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Review 1 */}
              <div className="arabic-frame bg-neutral-200 p-[1px]">
                <div className="arabic-frame bg-white p-6 space-y-4 h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src="https://i.pravatar.cc/150?img=47" alt="Aspen Siphron" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-black text-sm">Aspen Siphron</h4>
                        <p className="text-xs text-neutral-500">May 12, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-black">
                      <span className="text-yellow-400">⭐</span> 4.9
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    The LuxeBar Eleganza exceeded my expectations in every way. Not only does it look stunning in my kitchen, but it's also incredibly comfortable to sit in, even for extended periods. The plush cushioning and supportive backrest make it the perfect spot for enjoying my morning coffee or catching up with friends over cocktails. Plus, the sleek design adds a touch of elegance to my home decor. Highly recommend.
                  </p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="arabic-frame bg-neutral-200 p-[1px]">
                <div className="arabic-frame bg-white p-6 space-y-4 h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src="https://i.pravatar.cc/150?img=32" alt="Kierra Calzoni" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-black text-sm">Kierra Calzoni</h4>
                        <p className="text-xs text-neutral-500">May 11, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-black">
                      <span className="text-yellow-400">⭐</span> 4.9
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Absolutely love this product. It matches the description perfectly and the artisan was very communicative throughout the shipping process. The quality of the materials is top notch and you can really see the craftsmanship.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Price first, then Title, Tags, Specs, Inputs, Timeline, Policies */}
        <div className="lg:col-span-4 space-y-6">

          {/* Title, Store, Stars & Heart button */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit uppercase tracking-wider mb-1">
                  {t.orderNow} {formatDate(delDateMin)} – {formatDate(delDateMax)}
                </div>
                <h1 className="text-2xl font-bold tracking-tight capitalize leading-tight text-black">
                  {fetchedProduct ? (fetchedProduct.title_translations[lang] || fetchedProduct.title_translations.en) : initialTitle}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-black/60">By</span>
                  <Link href={`/${lang}/shop/${fetchedShop?.id || ''}`} className="font-bold text-primary hover:underline">
                    {fetchedShop?.name || initialShopName}
                  </Link>
                  <span className="text-black/30">•</span>
                  <span className="flex items-center gap-1 font-bold text-black/70">
                    <span className="text-yellow-400">★</span> 4.8 (788)
                  </span>
                </div>
              </div>

            </div>

            {/* Price */}
            <div className="space-y-2 py-2">
              <div className="flex flex-wrap items-baseline gap-3">
                {isSaleActive ? (
                  <>
                    <span className="text-3xl font-bold text-warning tracking-wider">
                      Now at {fetchedProduct.sale_price_mad} DH
                    </span>
                    <span className="text-lg text-black/30 line-through tracking-wider lowercase">
                      {basePrice} {t.mad}
                    </span>
                    <span className="bg-warning text-white text-xs rounded-full font-bold px-2.5 py-0.5 tracking-wider">
                      sale
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold tracking-wider text-black">
                    Now at {currentPrice} DH
                  </span>
                )}
              </div>

              {isSaleActive && timeLeft && (
                <div className="border border-warning/20 bg-warning/5 rounded-xl p-3 mt-1 text-xs text-warning flex justify-between items-center">
                  <span className="font-bold">Sale Duration:</span>
                  <span className="font-bold tracking-wider bg-warning text-white px-2.5 py-0.5 rounded-full">{timeLeft}</span>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-neutral-200"></div>

            <div className="space-y-2 py-2">
              <div className="flex items-start gap-2 text-sm text-black/80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <span>Arrives soon! Get it by <span className="underline decoration-dashed underline-offset-4">{formatDate(delDateMin)} - {formatDate(delDateMax)}</span> if you order today</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-black/80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <span>Returns & exchanges accepted</span>
              </div>
            </div>
          </div>

          {/* Customization Input */}
          <div className="space-y-2 text-sm capitalize">
            <label className="block font-bold text-black/70 capitalize">{t.customizationLabel}</label>
            <textarea
              rows={3}
              value={customizationText}
              onChange={(e) => setCustomizationText(e.target.value)}
              placeholder={t.customizationPlaceholder}
              className="flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-none"
            />
          </div>



          {/* Quantity Selector */}
          <div className="space-y-2 text-sm capitalize">
            <label className="block font-bold text-black/70 capitalize">{t.quantity}</label>
            <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val) || 1)}>
              <SelectTrigger className="w-full h-12 !rounded-md border-neutral-200 shadow-none font-bold text-black text-center bg-white justify-between">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {/* Add to Cart Button */}
            <button
              onClick={() => {
                if (fetchedProduct && fetchedShop) {
                  const variantLabel = selectedVariantId
                    ? fetchedProduct.variants.find((v: any) => v.id === selectedVariantId)?.attributes[lang]?.size || fetchedProduct.variants.find((v: any) => v.id === selectedVariantId)?.sku
                    : undefined;
                  addItem({
                    id: `${fetchedProduct.id}-${selectedVariantId || 'none'}-${customizationText}`,
                    product_id: fetchedProduct.id,
                    variant_id: selectedVariantId || null,
                    shop_id: fetchedShop.id,
                    shop_city: fetchedShop.merchant_city,
                    title: fetchedProduct.title_translations[lang] || fetchedProduct.title_translations.en,
                    price_mad: currentPrice,
                    quantity: quantity,
                    image: fetchedProduct.media_gallery[0] || initialImage,
                    customizationText: customizationText,
                    variant_label: variantLabel,
                  });
                  alert(t.addedToCart);
                }
              }}
              className="w-full bg-primary text-white hover:bg-primary/90 text-base font-bold py-4 rounded-full transition-all duration-150"
            >
              {t.addToCart}
            </button>

            {/* Heart / Save button */}
            <button
              onClick={() => {
                if (!fetchedProduct) return;
                setHeartAnimating(true);
                setTimeout(() => setHeartAnimating(false), 500);
                toggle({
                  id: fetchedProduct.id,
                  title: fetchedProduct.title_translations[lang] || fetchedProduct.title_translations.en,
                  price_mad: currentPrice,
                  image: fetchedProduct.media_gallery?.[0] || initialImage,
                  shop_name: fetchedShop?.name || initialShopName,
                  slug: fetchedProduct.slug_translations?.[lang] || fetchedProduct.slug_translations?.en || productSlug,
                  numeric_id: numericId,
                  lang,
                });
              }}
              title={isWishlisted(fetchedProduct?.id || '') ? 'Remove from saved' : 'Save for later'}
              className="w-full flex items-center justify-center gap-2 py-3 text-black font-bold hover:text-black/70 transition-colors bg-transparent border-none shadow-none"
            >
              {isWishlisted(fetchedProduct?.id || '') ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 text-red-500 transition-transform duration-200 ${heartAnimating ? 'scale-110' : 'scale-100'}`}>
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  <span className="text-red-500 tracking-wide">Saved</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span className="tracking-wide">Save for later</span>
                </>
              )}
            </button>
          </div>

          {/* Accordions */}
          <div className="w-full mt-8 border-t border-neutral-200">
            {/* Product Details Accordion */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="w-full py-5 flex items-center justify-between font-bold text-lg text-black bg-transparent hover:bg-neutral-50 transition-colors cursor-pointer text-left"
              >
                Product Details
                <span className="text-neutral-400 font-normal">{detailsExpanded ? '▴' : '▾'}</span>
              </button>
              
              {detailsExpanded && (
                <div className="pb-6 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                  {/* Listing Description */}
                  <p className="text-sm text-black/70 leading-relaxed">
                    {fetchedProduct?.description_translations?.[lang] || fetchedProduct?.description_translations?.en || "No description provided."}
                  </p>

                  {/* Specifications */}
                  <div className="flex flex-col space-y-5 text-sm">
                    <div className="flex flex-col space-y-1">
                      <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Category</span>
                      <div className="text-black font-semibold capitalize text-base">{productCategoryName}</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Origins</span>
                      <div className="text-black font-semibold capitalize text-base">{fetchedShop?.merchant_city || "Marrakech"}</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Condition</span>
                      <div className="text-black font-semibold capitalize text-base">Brand New, Authentic</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Materials</span>
                      <div className="text-black font-semibold capitalize text-base">100% Natural, Locally Sourced</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Delivery Accordion */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => setShippingExpanded(!shippingExpanded)}
                className="w-full py-5 flex items-center justify-between font-bold text-lg text-black bg-transparent hover:bg-neutral-50 transition-colors cursor-pointer text-left"
              >
                Shipping & Delivery
                <span className="text-neutral-400 font-normal">{shippingExpanded ? '▴' : '▾'}</span>
              </button>
              
              {shippingExpanded && (
                <div className="pb-6 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                  {/* Shipping & Delivery Timeline */}
                  <div className="space-y-6 mt-2">
                    <div className="relative pl-6 space-y-6 text-sm capitalize">
                      <div className="absolute left-[3px] top-1.5 bottom-1.5 w-[2px] bg-neutral-100"></div>

                      <div className="relative">
                        <div className="absolute left-[-27px] top-1 w-3 h-3 bg-neutral-900 rounded-full ring-4 ring-white"></div>
                        <div className="font-bold text-black text-base">Today</div>
                        <div className="text-neutral-500 mt-0.5">Order Placed</div>
                      </div>

                      <div className="relative">
                        <div className="absolute left-[-27px] top-1 w-3 h-3 bg-white border-2 border-neutral-300 rounded-full ring-4 ring-white"></div>
                        <div className="font-bold text-black text-base">{formatDate(shipDateMin)} – {formatDate(shipDateMax)}</div>
                        <div className="text-neutral-500 mt-0.5">Order Ships via Amana Courier</div>
                      </div>

                      <div className="relative">
                        <div className="absolute left-[-27px] top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-emerald-50"></div>
                        <div className="font-bold text-emerald-600 text-base">{formatDate(delDateMin)} – {formatDate(delDateMax)}</div>
                        <div className="text-emerald-600 font-semibold mt-0.5">Estimated Delivery!</div>
                      </div>
                    </div>
                  </div>

                  {/* Amana Shipping Calculator */}
                  <div className="space-y-5 pt-6 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-black tracking-tight text-lg">{t.shippingTitle}</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-600 text-xs font-bold uppercase tracking-wider">{t.selectCity}</label>
                      <select
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full border border-neutral-300 p-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-black font-semibold transition-all"
                      >
                        <option value="Casablanca">Casablanca</option>
                        <option value="Rabat">Rabat</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Fes">Fes</option>
                        <option value="Tangier">Tangier</option>
                        <option value="Agadir">Agadir</option>
                        <option value="Oujda">Oujda</option>
                        <option value="Kenitra">Kenitra</option>
                        <option value="Safi">Safi</option>
                        <option value="Rural / Other">Rural / Other Towns</option>
                      </select>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-neutral-200">
                      <div className="flex justify-between items-center text-neutral-600 text-sm">
                        <span>{t.estShipping}:</span>
                        <span className="font-bold text-black">{shippingCost} {t.mad}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg text-black bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                        <span>{t.totalCod}:</span>
                        <span>{totalCOD} {t.mad}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shop Policies & Return Rules */}
                  <div className="space-y-3 pt-6 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-black tracking-tight text-lg">{t.policyTitle}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-600 capitalize">
                      {fetchedShop?.store_policy_translations?.[lang] || fetchedShop?.store_policy_translations?.en || "Accepts returns within 14 days of delivery. Buyer covers return shipping fees."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          {fetchedShop?.faq_translations && fetchedShop.faq_translations.length > 0 && (
            <div className="arabic-frame bg-neutral-200 p-[1px] mt-4">
              <div className="arabic-frame bg-white p-4 space-y-3 h-full">
                <span className="font-bold border-b border-primary/10 pb-0.5 block text-xs uppercase text-black">{t.faqTitle}</span>
                <div className="space-y-3 text-sm capitalize">
                  {fetchedShop.faq_translations.map((faq: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-bold block text-black capitalize">Q: {faq.q[lang] || faq.q.en}</span>
                      <span className="text-black/60 block capitalize">A: {faq.a[lang] || faq.a.en}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isFetchingBackground && (
            <div className="text-[9px] text-black/40 animate-pulse text-center pt-2">
              {t.fetchingDetails}
            </div>
          )}

        </div>
      </div>


      {/* Similar Items Section */}
      <div className="pt-16 pb-8 space-y-6 border-t border-neutral-100">
        <h2 className="text-2xl font-bold text-black">Similar Items You Might Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allProductsList.slice(0, 4).map((p) => {
            const shop = allShopsList.find((s) => s.id === p.shop_id) || allShopsList[0];
            return <SimpleProductCard key={p.id} product={p} lang={lang} shop={shop} />;
          })}
        </div>
      </div>
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button 
            onClick={() => { setIsFullscreen(false); setZoomLevel(1); }}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {/* Zoom controls */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 rounded-full p-2 z-50">
            <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))} className="text-white p-2 hover:bg-white/20 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" /></svg></button>
            <span className="text-white flex items-center text-sm font-bold w-12 justify-center">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))} className="text-white p-2 hover:bg-white/20 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg></button>
            <button onClick={() => setZoomLevel(1)} className="text-white p-2 hover:bg-white/20 rounded-full text-xs font-bold px-3">Reset</button>
          </div>

          {fetchedProduct?.media_gallery && fetchedProduct.media_gallery.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={handleNextImage} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </>
          )}

          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            <img 
              src={activeImage} 
              alt={initialTitle}
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out', transformOrigin: 'center' }}
              className="max-w-full max-h-full object-contain cursor-zoom-in"
              onClick={(e) => { e.stopPropagation(); setZoomLevel(zoomLevel >= 2 ? 1 : zoomLevel + 0.5); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
