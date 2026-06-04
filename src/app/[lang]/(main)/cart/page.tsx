'use client';

import { use, useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { placeCODCheckout } from '@/lib/supabase';
import { getActiveSession } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  
  const labels: Record<string, Record<string, string>> = {
    en: {
      successTitle: "order successful",
      successDesc: "your order has been recorded. the artisans will contact you shortly to confirm the delivery. you will pay cash upon delivery.",
      continueShopping: "continue shopping",
      emptyCartTitle: "your cart is empty",
      emptyCartDesc: "discover unique handcrafted items from moroccan artisans.",
      browseMarketplace: "browse marketplace",
      cartTitle: "shopping cart",
      optionLabel: "option",
      noteLabel: "note",
      remove: "remove",
      orderSummary: "order summary",
      subtotal: "subtotal",
      items: "items",
      shippingAmana: "amana shipping",
      shops: "shops",
      totalCod: "total cod to pay",
      deliveryDetails: "delivery details",
      fullName: "full name",
      phone: "phone number",
      phonePlaceholder: "e.g. 0661234567",
      invalidPhone: "invalid moroccan phone number",
      city: "city",
      address: "address",
      processing: "processing...",
      placeOrder: "place cod order",
      mad: "mad",
      otherCity: "Rural / Other",
      errorPlace: "Failed to place order. Please try again.",
      errorGeneric: "An error occurred during checkout.",
    },
    fr: {
      successTitle: "commande réussie",
      successDesc: "votre commande a été enregistrée. les artisans vous contacteront sous peu pour confirmer la livraison. vous paierez en espèces à la livraison.",
      continueShopping: "continuer les achats",
      emptyCartTitle: "votre panier est vide",
      emptyCartDesc: "découvrez des objets uniques faits à la main par des artisans marocains.",
      browseMarketplace: "parcourir la boutique",
      cartTitle: "panier d'achats",
      optionLabel: "option",
      noteLabel: "note",
      remove: "supprimer",
      orderSummary: "résumé de la commande",
      subtotal: "sous-total",
      items: "articles",
      shippingAmana: "livraison amana",
      shops: "boutiques",
      totalCod: "total à payer à la livraison",
      deliveryDetails: "détails de livraison",
      fullName: "nom complet",
      phone: "numéro de téléphone",
      phonePlaceholder: "ex: 0661234567",
      invalidPhone: "numéro de téléphone invalide",
      city: "ville",
      address: "adresse",
      processing: "traitement...",
      placeOrder: "passer la commande cod",
      mad: "dh",
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
      subtotal: "المجموع الفرعي",
      items: "عناصر",
      shippingAmana: "شحن أمانة",
      shops: "متاجر",
      totalCod: "الإجمالي للدفع عند الاستلام",
      deliveryDetails: "تفاصيل التوصيل",
      fullName: "الاسم الكامل",
      phone: "رقم الهاتف",
      phonePlaceholder: "مثال: 0661234567",
      invalidPhone: "رقم هاتف غير صالح",
      city: "المدينة",
      address: "العنوان",
      processing: "جاري المعالجة...",
      placeOrder: "تأكيد طلب الدفع عند الاستلام",
      mad: "درهم",
      otherCity: "قرى / أخرى",
      errorPlace: "فشل في إتمام الطلب. يرجى المحاولة مرة أخرى.",
      errorGeneric: "حدث خطأ أثناء إتمام الطلب.",
    }
  };

  const t = labels[lang] || labels.en;

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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
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
        })),
      };

      const result = await placeCODCheckout(payload);
      
      if (result && result.success) {
        setSuccessOrderIds(result.order_ids || []);
        clearCart();
      } else {
        alert(t.errorPlace);
      }
    } catch (err) {
      console.error(err);
      alert(t.errorGeneric);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (successOrderIds.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 font-mono lowercase">
        <div className="border-2 border-black p-8 bg-neutral-50 text-center space-y-4">
          <h1 className="text-3xl font-serif font-bold text-green-700">✓ {t.successTitle}</h1>
          <p className="text-neutral-600 leading-relaxed">
            {t.successDesc}
          </p>
          <div className="pt-6">
            <Link href={`/${lang}`} className="bg-black text-white px-6 py-3 font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors">
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 font-mono lowercase text-center space-y-6">
        <h1 className="text-3xl font-serif font-bold">{t.emptyCartTitle}</h1>
        <p className="text-neutral-500">{t.emptyCartDesc}</p>
        <Link href={`/${lang}`} className="bg-black text-white px-6 py-3 font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors inline-block mt-4">
          {t.browseMarketplace}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-mono lowercase">
      <h1 className="text-3xl font-serif font-bold border-b border-black pb-4 mb-8">{t.cartTitle}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border border-black p-4 bg-white relative">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover border border-black" />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                <div className="text-neutral-500 text-xs">
                  {item.variant_label && <span className="block">{t.optionLabel}: {item.variant_label}</span>}
                  {item.customizationText && <span className="block italic">{t.noteLabel}: {item.customizationText}</span>}
                </div>
                <div className="font-bold mt-2">{item.price_mad} {t.mad}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 text-xs hover:underline font-bold"
                >
                  ✕ {t.remove}
                </button>
                <div className="flex border border-black w-[90px] h-[30px]">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex-1 hover:bg-neutral-100 border-r border-black"
                  >-</button>
                  <span className="flex-1 flex items-center justify-center text-xs">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex-1 hover:bg-neutral-100 border-l border-black"
                  >+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Sidebar */}
        <div className="lg:col-span-5">
          <div className="border border-black p-6 bg-neutral-50 space-y-6 sticky top-24">
            <h2 className="font-serif font-bold text-xl border-b border-black pb-2">{t.orderSummary}</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">{t.subtotal} ({totalItems} {t.items})</span>
                <span className="font-bold">{subtotal} {t.mad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">{t.shippingAmana} (x{shopsInCart.length} {t.shops})</span>
                <span className="font-bold">{totalShipping} {t.mad}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-black font-bold text-lg">
                <span>{t.totalCod}</span>
                <span>{grandTotal} {t.mad}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-black">
              <h3 className="font-bold uppercase tracking-widest text-xs">{t.deliveryDetails}</h3>
              
              <div className="space-y-1">
                <label className="block text-xs text-neutral-600 font-bold">{t.fullName}</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-neutral-600 font-bold">{t.phone}</label>
                <input
                  type="text"
                  required
                  placeholder={t.phonePlaceholder}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
                {phoneError && <span className="text-[10px] text-red-600 font-bold">{phoneError}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-neutral-600 font-bold">{t.city}</label>
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full border border-black p-2 bg-white focus:outline-none"
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

              <div className="space-y-1">
                <label className="block text-xs text-neutral-600 font-bold">{t.address}</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full bg-black text-white hover:bg-neutral-800 text-sm font-bold tracking-widest py-4 border border-black uppercase transition-all disabled:opacity-50 mt-4"
              >
                {checkoutLoading ? t.processing : t.placeOrder}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
