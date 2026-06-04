'use client';

import { use, useEffect, useState } from 'react';
import { getActiveSession, UserSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Settings, Image as ImageIcon, Phone, LayoutGrid, Star, Upload } from 'lucide-react';
import Link from 'next/link';

interface SettingsPageProps {
  params: Promise<{ lang: string }>;
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { lang } = use(params);
  const [session, setSession] = useState<UserSession | null>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState('general');

  // Form State
  const [shopName, setShopName] = useState('');
  const [shopSlug, setShopSlug] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  
  // Header State
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Contact State
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const labels: Record<string, Record<string, string>> = {
    en: {
      title: "Customize Store",
      saveChanges: "Save Changes",
      saving: "Saving...",
    },
    fr: {
      title: "Personnaliser la Boutique",
      saveChanges: "Enregistrer",
      saving: "Enregistrement...",
    },
    ar: {
      title: "تخصيص المتجر",
      saveChanges: "حفظ التغييرات",
      saving: "جاري الحفظ...",
    }
  };

  const t = labels[lang] || labels.en;

  useEffect(() => {
    async function load() {
      const user = await getActiveSession();
      setSession(user);
      if (user?.shop) {
        setShopName(user.shop.name || '');
        setShopSlug(user.shop.slug || '');
        setCity(user.shop.merchant_city || '');
        setAddress(user.shop.pickup_address_street || '');
        
        // Parse metadata if it exists
        try {
           const meta = user.shop.metadata || {};
           setDescription(meta.description || '');
           setLogoUrl(meta.logo_url || '');
           setCoverUrl(meta.cover_url || '');
           setPhone(meta.phone || '');
           setEmail(meta.email || '');
           setWhatsapp(meta.whatsapp || '');
           setInstagram(meta.instagram || '');
           setFacebook(meta.facebook || '');
        } catch(e) {
           // ignore
        }
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!session) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const metadata = {
        description,
        logo_url: logoUrl,
        cover_url: coverUrl,
        phone,
        email,
        whatsapp,
        instagram,
        facebook
      };

      if (session.shop) {
        // Update existing shop
        const { error: updateError } = await supabase
          .from('shops')
          .update({
            name: shopName,
            slug: shopSlug || session.shop.slug,
            merchant_city: city,
            pickup_address_street: address,
            metadata
          })
          .eq('id', session.shop.id);

        if (updateError) throw updateError;
        setSuccess('Shop updated successfully.');
      } else {
        // Create new shop for a buyer
        const generatedSlug = shopSlug || shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        const { data: newShop, error: insertError } = await supabase
          .from('shops')
          .insert({
            owner_id: session.id,
            name: shopName,
            slug: generatedSlug,
            merchant_city: city || 'Marrakech',
            pickup_address_street: address || 'TBD',
            ice_number: '123456789012345',
            is_verified: true,
            metadata
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        // Update user role to seller
        await supabase
          .from('profiles')
          .update({ role: 'seller' })
          .eq('id', session.id);

        setSuccess('Store created successfully! Please refresh.');
        
        // Update local session mock
        const updatedSession = { ...session, role: 'seller', shop: newShop };
        localStorage.setItem('afus_session_user', JSON.stringify(updatedSession));
        setSession(updatedSession as UserSession);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-neutral-800 capitalize tracking-tight">{t.title}</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your store information and pickup details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#9c7a97] hover:bg-[#866581] text-white px-6 py-2.5 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? t.saving : t.saveChanges}
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-6xl flex-1 space-y-6">

      {error && <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-lg font-medium text-sm">{error}</div>}
      {success && <div className="border border-green-200 bg-green-50 text-green-700 p-4 rounded-lg font-medium text-sm">{success}</div>}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Secondary Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <Settings className="w-4 h-4" /> General
          </button>
          <button 
            onClick={() => setActiveTab('header')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'header' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <ImageIcon className="w-4 h-4" /> Header
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'contact' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <Phone className="w-4 h-4" /> Contact
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'collections' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Collections
          </button>
          <button 
            onClick={() => setActiveTab('featured')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'featured' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <Star className="w-4 h-4" /> Featured Items
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-xl border border-neutral-200 p-8 min-h-[500px]">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Store name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Store URL</label>
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden focus-within:border-neutral-400 transition-colors">
                  <span className="bg-neutral-50 text-neutral-500 px-3 py-3 text-sm border-r border-neutral-200 whitespace-nowrap">
                    afus.ma/store/
                  </span>
                  <input
                    type="text"
                    value={shopSlug}
                    onChange={(e) => setShopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full p-3 bg-white focus:outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-neutral-400">This is your unique store link. Only use lowercase letters, numbers, and hyphens.</p>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors h-32"
                />
              </div>
            </div>
          )}

          {/* Header Tab */}
          {activeTab === 'header' && (
            <div className="space-y-8">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-neutral-800 text-lg">Store logo</h3>
                  <p className="text-sm text-neutral-500">Upload your store logo (recommended: square, 500x500px)</p>
                </div>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover border border-neutral-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-neutral-400" />
                    </div>
                  )}
                  <button className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                    <Upload className="w-4 h-4" /> Upload Logo
                  </button>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-8 space-y-3">
                <div>
                  <h3 className="font-bold text-neutral-800 text-lg">Store cover image</h3>
                  <p className="text-sm text-neutral-500">Upload a cover image for your store (recommended: 1920x400px)</p>
                </div>
                <div className="space-y-4">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover" className="w-full h-32 rounded-lg object-cover border border-neutral-200" />
                  ) : (
                    <div className="w-full h-32 rounded-lg bg-neutral-100 border border-neutral-200 border-dashed flex flex-col items-center justify-center gap-2 text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-sm">No cover image</span>
                    </div>
                  )}
                  <button className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                    <Upload className="w-4 h-4" /> Upload Cover
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="font-bold text-neutral-800 text-lg mb-4">Contact information</h3>
              
              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6 00 00 00 00"
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="store@example.com"
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+212 6 00 00 00 00"
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Instagram</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@username or URL"
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Facebook</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="username or full URL"
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                />
              </div>
            </div>
          )}

          {/* Collections Tab */}
          {activeTab === 'collections' && (
            <div className="flex flex-col items-center justify-center text-center h-full space-y-4 py-12">
              <LayoutGrid className="w-12 h-12 text-neutral-300" />
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-800 text-lg">Manage Store Collections</h3>
                <p className="text-sm text-neutral-500 max-w-sm">Create and organize custom product collections to showcase on your store page.</p>
              </div>
              <Link href={`/${lang}/dashboard/collections`}>
                <button className="bg-neutral-800 hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2">
                  Go to Collections Manager
                </button>
              </Link>
            </div>
          )}

          {/* Featured Items Tab */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <h3 className="font-bold text-neutral-800 text-lg">Featured Showcase</h3>
              <p className="text-sm text-neutral-500">Pin top products or specific collections to the top of your grid.</p>
              
              <div className="border border-dashed border-neutral-200 rounded-xl p-12 text-center text-neutral-500">
                <Star className="w-8 h-8 mx-auto text-neutral-300 mb-3" />
                <p className="text-sm">Select products to feature (Coming soon)</p>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
    </div>
  );
}
