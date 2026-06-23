'use client';

import { use, useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { fetchCategoryProducts } from '@/lib/supabase';
import { getActiveSession } from '@/lib/auth';
import { placeCODCheckoutServer } from '@/app/actions/checkout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartPageProps {
  params: Promise<{ lang: string }>;
}

export default function CartPage({ params }: CartPageProps) {
  const { lang } = use(params);
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingCity, setShippingCity] = useState('Casablanca');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successOrderIds, setSuccessOrderIds] = useState<string[]>([]);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  
  const labels: Record<string, Record<string, string>> = {
    en: {
      successTitle: "Order Successful",
      successDesc: "Your order has been recorded. The artisans will contact you shortly to confirm the delivery. You will pay cash upon delivery.",
      continueShopping: "Continue Shopping",
      emptyCartTitle: "Your cart is empty",
      emptyCartDesc: "Discover unique handcrafted items from Moroccan artisans.",
      browseMarketplace: "Browse Marketplace",
      cartTitle: "Shopping Cart",
      optionLabel: "Option",
      noteLabel: "Note",
      remove: "Remove",
      orderSummary: "Order Summary",
      subtotal: "Item(s) total",
      items: "items",
      shippingAmana: "Delivery fees",
      shops: "shops",
      totalCod: "Total (COD)",
      deliveryDetails: "Delivery Details",
      fullName: "Full Name",
      phone: "Phone Number",
      phonePlaceholder: "e.g. 0661234567",
      invalidPhone: "Invalid Moroccan phone number",
      city: "City",
      address: "Address",
      processing: "Processing...",
      placeOrder: "Place Order",
      mad: "MAD",
      otherCity: "Rural / Other",
      errorPlace: "Failed to place order. Please try again.",
      errorGeneric: "An error occurred during checkout.",
    },
    fr: {
      successTitle: "Commande Réussie",
      successDesc: "Votre commande a été enregistrée. Les artisans vous contacteront sous peu pour confirmer la livraison. Vous paierez en espèces à la livraison.",
      continueShopping: "Continuer les achats",
      emptyCartTitle: "Votre panier est vide",
      emptyCartDesc: "Découvrez des objets uniques faits à la main par des artisans marocains.",
      browseMarketplace: "Parcourir la boutique",
      cartTitle: "Votre panier",
      optionLabel: "Option",
      noteLabel: "Note",
      remove: "Supprimer",
      orderSummary: "Résumé de la commande",
      subtotal: "Total des articles",
      items: "articles",
      shippingAmana: "Frais de livraison",
      shops: "boutiques",
      totalCod: "Total (COD)",
      deliveryDetails: "Détails de livraison",
      fullName: "Nom complet",
      phone: "Numéro de téléphone",
      phonePlaceholder: "ex: 0661234567",
      invalidPhone: "Numéro de téléphone invalide",
      city: "Ville",
      address: "Adresse",
      processing: "Traitement...",
      placeOrder: "Passer la commande",
      mad: "MAD",
      otherCity: "Rural / Autre",
      errorPlace: "Échec de la commande. Veuillez réessayer.",
      errorGeneric: "Une erreur est survenue lors de la validation.",
    },
    ar: {
      successTitle: "تم الطلب بنجاح",
      successDesc: "تم تسجيل طلبك. سيتصل بك الحرفيون قريباً لتأكيد التوصيل. ستدفع نقداً عند الاستلام.",
      continueShopping: "متابعة التسوق",
      emptyCartTitle: "سلة التسوق فارغة",
      emptyCartDesc: "اكتشف منتجات يدوية فريدة من الحرفيين المغاربة.",
      browseMarketplace: "تصفح المتجر",
      cartTitle: "سلة التسوق",
      optionLabel: "خيار",
      noteLabel: "ملاحظة",
      remove: "إزالة",
      orderSummary: "ملخص الطلب",
      subtotal: "مجموع العناصر",
      items: "عناصر",
      shippingAmana: "رسوم التوصيل",
      shops: "متاجر",
      totalCod: "المجموع (الدفع عند الاستلام)",
      deliveryDetails: "تفاصيل التوصيل",
      fullName: "الاسم الكامل",
      phone: "رقم الهاتف",
      phonePlaceholder: "مثال: 0661234567",
      invalidPhone: "رقم هاتف غير صالح",
      city: "المدينة",
      address: "العنوان",
      processing: "جاري المعالجة...",
      placeOrder: "تأكيد الطلب",
      mad: "درهم",
      otherCity: "قرى / أخرى",
      errorPlace: "فشل في إتمام الطلب. يرجى المحاولة مرة أخرى.",
      errorGeneric: "حدث خطأ أثناء إتمام الطلب.",
    }
  };

  const t = labels[lang] || labels.en;

  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Pre-fill user data if logged in
  useEffect(() => {
    async function loadUser() {
      const session = await getActiveSession();
      if (session) {
        setCustomerName(session.full_name || '');
        setCustomerPhone(session.phone_number || '');
      }
    }
    loadUser();

    fetchCategoryProducts('cat_jewelry').then(res => {
      if (res && Array.isArray(res)) {
        // Pick some random products for suggestions
        setSuggestions(res.slice(0, 4));
      }
    });
  }, []);

  const calculateShippingForCity = (origin: string, destination: string) => {
    const cleanOrigin = origin.toLowerCase().trim();
    const cleanDest = destination.toLowerCase().trim();
    if (cleanOrigin === cleanDest) return 35;
    const majorCities = ['casablanca', 'rabat', 'marrakech', 'tangier', 'fes', 'agadir', 'oujda', 'meknes', 'kenitra', 'tetouan'];
    if (majorCities.includes(cleanDest)) return 45;
    return 55;
  };

  // Group items by shop to calculate shipping correctly (one shipping charge per shop)
  const shopsInCart = Array.from(new Set(items.map(i => i.shop_id)));
  const totalShipping = shopsInCart.reduce((total, shopId) => {
    const shopItem = items.find(i => i.shop_id === shopId);
    return total + calculateShippingForCity(shopItem?.shop_city || 'Marrakech', shippingCity);
  }, 0);

  const subtotal = items.reduce((acc, item) => acc + (item.price_mad * item.quantity), 0);
  const grandTotal = subtotal + totalShipping;

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError('');

    const phoneRegex = /^(?:\+212|0)[67]\d{8}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setPhoneError(t.invalidPhone);
      return;
    }

    if (items.length === 0) return;

    setCheckoutLoading(true);

    try {
      const session = await getActiveSession();
      const payload = {
        buyer_id: session?.id || undefined,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_city: shippingCity,
        shipping_address: shippingAddress,
        items: items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          ...(item.customizationText ? { attributes: { note: item.customizationText } } : {}),
        })),
      };

      const result = await placeCODCheckoutServer(payload);
      
      if (result && result.success && result.data) {
        setSuccessOrderIds(result.data.order_ids || []);
        clearCart();
      } else {
        alert(t.errorPlace + (result.error ? ` (${result.error})` : ''));
      }
    } catch (err: any) {
      console.error(err);
      alert(t.errorGeneric + (err.message ? ` (${err.message})` : ''));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (successOrderIds.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white p-12 text-center space-y-6 arabic-frame border border-black/10">
          <h1 className="text-4xl font-ariom text-[#663399]">✓ {t.successTitle}</h1>
          <p className="text-neutral-600 text-lg leading-relaxed">
            {t.successDesc}
          </p>
          <div className="pt-8">
            <Link href={`/${lang}`} className="bg-[#663399] text-white px-8 py-4 rounded-full font-medium hover:bg-[#52297a] transition-colors inline-block">
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-8">
        <h1 className="text-4xl font-ariom text-[#663399]">{t.emptyCartTitle}</h1>
        <p className="text-neutral-600 text-lg">{t.emptyCartDesc}</p>
        <Link href={`/${lang}`} className="bg-[#663399] text-white px-8 py-4 rounded-full font-medium hover:bg-[#52297a] transition-colors inline-block mt-4">
          {t.browseMarketplace}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Custom Checkout Navbar */}
      <header className="w-full border-b border-neutral-200 bg-white py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <Image src="/logo/logo.png" alt="Afus" width={32} height={32} className="h-8 w-auto" />
          <span className="font-ariom text-2xl tracking-tight text-black mt-1">afus</span>
        </Link>
        <button onClick={() => router.back()} className="text-sm font-medium text-neutral-600 hover:text-black flex items-center gap-1">
          {lang === 'ar' ? '→ العودة' : lang === 'fr' ? '← Retour' : '← Back'}
        </button>
      </header>

      <div className="max-w-[85rem] mx-auto px-4 md:px-12 py-12">
        <h1 className="text-3xl font-ariom text-neutral-900 mb-8">{t.cartTitle}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-8">
          {shopsInCart.map((shopId) => {
            const shopItems = items.filter(i => i.shop_id === shopId);
            return (
              <div key={shopId} className="bg-white p-6 arabic-frame border border-neutral-200">
                <div className="flex items-center gap-3 mb-6 pb-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500 border border-neutral-200">
                    {shopId?.substring(0, 1).toUpperCase() || 'S'}
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-800">Boutique / Shop {shopId?.substring(0, 4)}</h3>
                </div>
                
                <div className="space-y-6">
                  {shopItems.map((item, index) => (
                    <div key={item.id} className={`flex flex-col gap-4 sm:gap-6 ${index !== shopItems.length - 1 ? 'border-b border-neutral-100 pb-6' : ''}`}>
                      <div className="flex flex-row gap-4 sm:gap-6">
                        <img src={item.image} alt={item.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col gap-1.5 mb-2">
                            <h4 className="font-medium text-base sm:text-lg text-neutral-900 leading-snug hover:underline cursor-pointer pr-2">{item.title}</h4>
                            <div className="font-bold text-lg text-[#663399]">{item.price_mad} {t.mad}</div>
                          </div>
                          
                          <div className="text-neutral-500 text-sm space-y-1 mb-4">
                            {item.variant_label && <div><span className="text-neutral-700">{t.optionLabel}:</span> {item.variant_label}</div>}
                            {item.customizationText ? (
                              <div><span className="text-neutral-700">{t.noteLabel}:</span> {item.customizationText}</div>
                            ) : index === 0 ? (
                              <div className="italic text-neutral-600"><span className="text-neutral-700 not-italic font-medium">{lang === 'fr' ? 'Sur commande' : lang === 'ar' ? 'تحت الطلب' : 'Made to order'}:</span> Engrave "Yazid" (Preview)</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row items-center justify-between w-full pt-4 mt-2 border-t border-neutral-50">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 text-sm hover:text-red-600 transition-colors underline underline-offset-2"
                        >
                          {t.remove}
                        </button>
                        {(!item.customizationText && index !== 0) ? (
                          <div className="flex items-center gap-4 border border-neutral-200 bg-neutral-50 rounded-full px-1.5 py-1.5">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-neutral-100 transition-colors font-medium text-lg"
                            >-</button>
                            <span className="w-6 text-center text-sm font-bold text-neutral-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-neutral-100 transition-colors font-medium text-lg"
                            >+</button>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-neutral-500 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200">
                            Qté: 1
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Sidebar */}
        <div className="lg:col-span-5">
          <div className="space-y-8 sticky top-24">
            
            {/* Payment Methods */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">{lang === 'fr' ? 'Mode de paiement' : lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-2 border-[#663399] p-3 rounded-xl bg-[#663399]/5">
                  <div className="flex items-center gap-3">
                    <Image src="/amana.png" alt="Amana" width={32} height={32} className="object-contain" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-neutral-900">Amana Express</span>
                      <span className="text-xs text-neutral-500">Delivery via Barid Bank</span>
                    </div>
                  </div>
                  <input type="radio" checked readOnly className="w-4 h-4 accent-[#663399]" />
                </div>
                <div className="flex items-center justify-between border-2 border-[#663399] p-3 rounded-xl bg-[#663399]/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-80 px-1">💵</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-neutral-900">Cash on Delivery</span>
                      <span className="text-xs text-neutral-500">Pay when you receive your order</span>
                    </div>
                  </div>
                  <input type="radio" checked readOnly className="w-4 h-4 accent-[#663399]" />
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                {lang === 'fr' ? 'Vous paierez le total en espèces directement au livreur Amana lors de la réception de votre colis. Aucun paiement en ligne n\'est requis aujourd\'hui.' : lang === 'ar' ? 'ستدفع المبلغ الإجمالي نقداً لموظف توصيل أمانة عند استلام طردك. لا يلزم الدفع عبر الإنترنت اليوم.' : 'You will pay the total in cash directly to the Amana delivery person upon receiving your package. No online payment is required today.'}
              </p>
            </div>

            <div className="space-y-4 text-neutral-700 pt-6 border-t border-neutral-100">
              <div className="flex justify-between items-center text-sm">
                <span>{t.subtotal} ({totalItems} {t.items})</span>
                <span>{subtotal} {t.mad}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{t.shippingAmana}</span>
                <span>{totalShipping} {t.mad}</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-neutral-200 font-bold text-xl text-neutral-900">
                <span>{t.totalCod}</span>
                <span>{grandTotal} {t.mad}</span>
              </div>
            </div>

            {/* Delivery Details Summary */}
            <div className={`space-y-4 pt-8 border-t ${(!customerName || !customerPhone || !shippingAddress) ? 'border-red-200 bg-red-50/30 -mx-4 px-4 pb-4 rounded-b-xl' : 'border-neutral-200'}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                    {t.deliveryDetails}
                    {(!customerName || !customerPhone || !shippingAddress) && (
                      <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                        {lang === 'fr' ? 'Requis' : lang === 'ar' ? 'مطلوب' : 'Required'}
                      </span>
                    )}
                  </h3>
                  <div className="text-sm text-neutral-600 leading-relaxed">
                    {customerName ? (
                      <>
                        <span className="font-medium text-neutral-900">{customerName}</span>, {customerPhone} <br/>
                        {shippingAddress ? `${shippingAddress}, ` : ''}{shippingCity}
                      </>
                    ) : (
                      <span className="italic">{lang === 'fr' ? 'Veuillez saisir vos détails' : lang === 'ar' ? 'الرجاء إدخال تفاصيلك' : 'Please enter your details'}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => setIsEditingDelivery(true)} className="text-sm font-medium text-[#663399] hover:underline underline-offset-2 shrink-0">
                  {lang === 'fr' ? 'Modifier' : lang === 'ar' ? 'تعديل' : 'Change'}
                </button>
              </div>

              <button
                onClick={() => {
                  if (!customerName || !customerPhone || !shippingAddress) {
                    setIsEditingDelivery(true);
                  } else {
                    handlePlaceOrder();
                  }
                }}
                disabled={checkoutLoading}
                className="w-full bg-neutral-900 text-white hover:bg-black py-4 rounded-full font-bold transition-all disabled:opacity-50 mt-6 shadow-sm"
              >
                {checkoutLoading ? t.processing : 
                 (!customerName || !customerPhone || !shippingAddress) ? 
                 (lang === 'fr' ? 'Ajouter l\'adresse de livraison' : lang === 'ar' ? 'أضف عنوان التوصيل' : 'Add delivery address') : 
                 t.placeOrder}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details Modal */}
      {isEditingDelivery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => customerName && customerPhone && shippingAddress && setIsEditingDelivery(false)}>
          <div className="bg-white arabic-frame border border-neutral-200 p-2 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-neutral-100">
              <h2 className="font-ariom text-2xl text-neutral-900">{t.deliveryDetails}</h2>
              <button onClick={() => setIsEditingDelivery(false)} className="text-neutral-400 hover:text-black transition-colors text-3xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsEditingDelivery(false); }} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">{t.fullName}</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">{t.phone}</label>
                <input
                  type="text"
                  required
                  placeholder={t.phonePlaceholder}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl"
                />
                {phoneError && <span className="text-sm text-red-500 font-medium block mt-1">{phoneError}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">{t.city}</label>
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none rounded-xl"
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Fes">Fes</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Kenitra">Kenitra</option>
                  <option value="Rural / Other">{t.otherCity}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">{t.address}</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 text-white hover:bg-black py-4 rounded-full font-bold transition-all mt-6 shadow-sm"
              >
                {lang === 'fr' ? 'Confirmer les détails' : lang === 'ar' ? 'تأكيد التفاصيل' : 'Confirm Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Suggestions Section Removed */}

      </div>
    </div>
  );
}
