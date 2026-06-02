'use client';

import { use, useEffect, useState } from 'react';
import { getActiveSession, UserSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface SettingsPageProps {
  params: Promise<{ lang: string }>;
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { lang } = use(params);
  const [session, setSession] = useState<UserSession | null>(null);
  
  // Form State
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const labels: Record<string, Record<string, string>> = {
    en: {
      title: "store settings",
      desc: "manage your store information and pickup details",
      storeName: "store name",
      storeNamePlaceholder: "e.g. Atlas Artisanat",
      merchantCity: "merchant city (for amana shipping)",
      merchantCityPlaceholder: "e.g. Marrakech",
      pickupAddress: "pickup address (for amana courier)",
      pickupAddressPlaceholder: "e.g. 32 Derb Snan, Bab Doukkala",
      saving: "saving...",
      saveChanges: "save changes",
      createStore: "create store",
      successUpdate: "Shop updated successfully.",
      successCreate: "Store created successfully! Please refresh to see all seller options.",
      errorGeneric: "An error occurred.",
    },
    fr: {
      title: "paramètres de la boutique",
      desc: "gérez les informations de votre boutique et les détails de ramassage",
      storeName: "nom de la boutique",
      storeNamePlaceholder: "ex: Atlas Artisanat",
      merchantCity: "ville du marchand (pour livraison amana)",
      merchantCityPlaceholder: "ex: Marrakech",
      pickupAddress: "adresse de ramassage (pour le coursier amana)",
      pickupAddressPlaceholder: "ex: 32 Derb Snan, Bab Doukkala",
      saving: "enregistrement...",
      saveChanges: "enregistrer les modifications",
      createStore: "créer une boutique",
      successUpdate: "Boutique mise à jour avec succès.",
      successCreate: "Boutique créée avec succès ! Veuillez actualiser pour voir toutes les options vendeur.",
      errorGeneric: "Une erreur est survenue.",
    },
    ar: {
      title: "إعدادات المتجر",
      desc: "قم بإدارة معلومات متجرك وتفاصيل الاستلام",
      storeName: "اسم المتجر",
      storeNamePlaceholder: "مثال: أطلس للصناعة التقليدية",
      merchantCity: "مدينة التاجر (لشحن أمانة)",
      merchantCityPlaceholder: "مثال: مراكش",
      pickupAddress: "عنوان الاستلام (لمندوب أمانة)",
      pickupAddressPlaceholder: "مثال: 32 درب السنان، باب دكالة",
      saving: "جاري الحفظ...",
      saveChanges: "حفظ التغييرات",
      createStore: "إنشاء متجر",
      successUpdate: "تم تحديث المتجر بنجاح.",
      successCreate: "تم إنشاء المتجر بنجاح! يرجى تحديث الصفحة لرؤية جميع خيارات البائع.",
      errorGeneric: "حدث خطأ.",
    }
  };

  const t = labels[lang] || labels.en;

  useEffect(() => {
    async function load() {
      const user = await getActiveSession();
      setSession(user);
      if (user?.shop) {
        setShopName(user.shop.name || '');
        setCity(user.shop.merchant_city || '');
        setAddress(user.shop.pickup_address_street || '');
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (session.shop) {
        // Update existing shop
        const { error: updateError } = await supabase
          .from('shops')
          .update({
            name: shopName,
            merchant_city: city,
            pickup_address_street: address,
          })
          .eq('id', session.shop.id);

        if (updateError) throw updateError;
        setSuccess(t.successUpdate);
      } else {
        // Create new shop for a buyer
        const shopSlug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        const { data: newShop, error: insertError } = await supabase
          .from('shops')
          .insert({
            owner_id: session.id,
            name: shopName,
            slug: shopSlug,
            merchant_city: city || 'Marrakech',
            pickup_address_street: address || 'TBD',
            ice_number: '123456789012345',
            is_verified: true,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        // Update user role to seller
        await supabase
          .from('profiles')
          .update({ role: 'seller' })
          .eq('id', session.id);

        setSuccess(t.successCreate);
        
        // Update local session mock
        const updatedSession = { ...session, role: 'seller', shop: newShop };
        localStorage.setItem('afus_session_user', JSON.stringify(updatedSession));
        setSession(updatedSession as UserSession);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-2xl font-mono lowercase">
      <div className="border-b border-black pb-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-black block">{t.title}</h1>
        <p className="text-neutral-500 mt-1">{t.desc}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && <div className="border border-red-600 bg-red-50 text-red-600 p-4 font-bold">{error}</div>}
        {success && <div className="border border-green-600 bg-green-50 text-green-700 p-4 font-bold">{success}</div>}

        <div className="space-y-2">
          <label className="block font-bold">{t.storeName}</label>
          <input
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full border border-black p-3 focus:outline-none"
            placeholder={t.storeNamePlaceholder}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold">{t.merchantCity}</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-black p-3 focus:outline-none"
            placeholder={t.merchantCityPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold">{t.pickupAddress}</label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-black p-3 focus:outline-none h-24"
            placeholder={t.pickupAddressPlaceholder}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {loading ? t.saving : (session.shop ? t.saveChanges : t.createStore)}
        </button>
      </form>
    </div>
  );
}
