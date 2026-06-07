'use client';

import React, { useState, useEffect, useRef } from 'react';
import { registerUser, loginUser, getActiveSession } from '@/lib/auth';
import { checkShopSlugAvailable } from '@/lib/supabase';
import {
  IconX,
  IconBuildingStore,
  IconUser,
  IconMail,
  IconLock,
  IconPhone,
  IconMapPin,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconSparkles,
  IconStar,
  IconPackage,
  IconTruck,
  IconShield,
  IconSelector,
} from '@tabler/icons-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface StoreOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

type Step = 'account' | 'store' | 'branding' | 'location' | 'summary' | 'success';

const STEPS: Step[] = ['account', 'store', 'branding', 'location', 'summary', 'success'];

const labels: Record<string, Record<string, string>> = {
  en: {
    // Welcome
    welcomeTitle: 'Start selling on afus',
    welcomeSubtitle: 'Join hundreds of Moroccan artisans and connect directly with buyers across the country.',
    feat1: 'Free to list your products',
    feat2: 'Cash on delivery via Amana',
    feat3: 'Secure & verified platform',
    feat4: 'Reach buyers nationwide',
    getStarted: 'Get started',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    // Account
    accountTitle: 'Create your account',
    accountSubtitle: 'Your personal details for signing in.',
    fullName: 'Full name',
    email: 'Email address',
    password: 'Password',
    phone: 'Phone number',
    next: 'Continue',
    // Store
    storeTitle: 'Name your shop',
    storeSubtitle: 'This is what buyers will see when visiting your storefront.',
    shopName: 'Shop name',
    shopNamePlaceholder: 'e.g. Atlas Artisanat',
    shopDesc: 'Short description (optional)',
    shopDescPlaceholder: 'Tell buyers what makes your shop unique...',
    // Location
    locationTitle: 'Where are you based?',
    locationSubtitle: 'Help buyers discover your crafts and plan local pickups.',
    city: 'City',
    address: 'Pickup address',
    addressPlaceholder: 'e.g. 32 Derb Snan, Bab Doukkala',
    createShop: 'Open my shop',
    // Success
    successTitle: 'Your shop is open!',
    successSubtitle: 'Congratulations! You are now a verified artisan on afus. Start adding your first products.',
    addProduct: 'Add first product',
    goToDashboard: 'Go to dashboard',
    // Misc
    back: 'Back',
    step: 'Step',
    of: 'of',
    or: 'or',
    loginEmail: 'Email',
    loginPassword: 'Password',
    signinBtn: 'Sign in',
    switchToRegister: 'Create account',
  },
  fr: {
    welcomeTitle: 'Commencez à vendre sur afus',
    welcomeSubtitle: 'Rejoignez des centaines d\'artisans marocains et connectez-vous directement aux acheteurs.',
    feat1: 'Publication gratuite',
    feat2: 'Paiement à la livraison via Amana',
    feat3: 'Plateforme sécurisée et vérifiée',
    feat4: 'Atteignez des acheteurs partout',
    getStarted: 'Commencer',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    accountTitle: 'Créez votre compte',
    accountSubtitle: 'Vos informations personnelles pour vous connecter.',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    phone: 'Numéro de téléphone',
    next: 'Continuer',
    storeTitle: 'Nommez votre boutique',
    storeSubtitle: 'C\'est ce que les acheteurs verront en visitant votre boutique.',
    shopName: 'Nom de la boutique',
    shopNamePlaceholder: 'ex. Maison Artisanale',
    shopDesc: 'Description courte (optionnel)',
    shopDescPlaceholder: 'Dites aux acheteurs ce qui rend votre boutique unique...',
    locationTitle: 'Où êtes-vous basé ?',
    locationSubtitle: 'Aidez les acheteurs à découvrir vos artisanats.',
    city: 'Ville',
    address: 'Adresse de retrait',
    addressPlaceholder: 'ex. 15 Derb El Mitar, Fès El Bali',
    createShop: 'Ouvrir ma boutique',
    successTitle: 'Votre boutique est ouverte !',
    successSubtitle: 'Félicitations ! Vous êtes maintenant un artisan certifié sur afus.',
    addProduct: 'Ajouter le premier produit',
    goToDashboard: 'Tableau de bord',
    back: 'Retour',
    step: 'Étape',
    of: 'sur',
    or: 'ou',
    loginEmail: 'E-mail',
    loginPassword: 'Mot de passe',
    signinBtn: 'Se connecter',
    switchToRegister: 'Créer un compte',
  },
  ar: {
    welcomeTitle: 'ابدأ البيع على أفوس',
    welcomeSubtitle: 'انضم إلى مئات الحرفيين المغاربة وتواصل مباشرة مع المشترين في جميع أنحاء البلاد.',
    feat1: 'إدراج المنتجات مجاناً',
    feat2: 'الدفع عند الاستلام عبر أمانة',
    feat3: 'منصة آمنة وموثقة',
    feat4: 'الوصول إلى المشترين في كل مكان',
    getStarted: 'ابدأ الآن',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    accountTitle: 'أنشئ حسابك',
    accountSubtitle: 'بياناتك الشخصية لتسجيل الدخول.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    phone: 'رقم الهاتف',
    next: 'متابعة',
    storeTitle: 'سمِّ متجرك',
    storeSubtitle: 'هذا ما سيراه المشترون عند زيارة متجرك.',
    shopName: 'اسم المتجر',
    shopNamePlaceholder: 'مثال: أطلس للحرف اليدوية',
    shopDesc: 'وصف قصير (اختياري)',
    shopDescPlaceholder: 'أخبر المشترين بما يميز متجرك...',
    locationTitle: 'أين أنت موجود؟',
    locationSubtitle: 'ساعد المشترين في اكتشاف حرفك.',
    city: 'المدينة',
    address: 'عنوان الاستلام',
    addressPlaceholder: 'مثال: درب سنان، باب دكالة',
    createShop: 'افتح متجري',
    successTitle: 'متجرك مفتوح!',
    successSubtitle: 'تهانينا! أنت الآن حرفي موثق على أفوس.',
    addProduct: 'أضف أول منتج',
    goToDashboard: 'لوحة التحكم',
    back: 'رجوع',
    step: 'خطوة',
    of: 'من',
    or: 'أو',
    loginEmail: 'البريد الإلكتروني',
    loginPassword: 'كلمة المرور',
    signinBtn: 'تسجيل الدخول',
    switchToRegister: 'إنشاء حساب',
  },
};

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tanger', 'Agadir',
  'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Sale', 'Nador',
  'Beni Mellal', 'El Jadida', 'Taza', 'Mohammedia', 'Khouribga',
  'Settat', 'Safi', 'Essaouira', 'Ouarzazate', 'Errachidia',
];

export default function StoreOnboardingModal({ isOpen, onClose, lang }: StoreOnboardingModalProps) {
  const t = labels[lang] || labels.en;

  const [hasSession, setHasSession] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('afus_session_user');
    }
    return false;
  });

  const [step, setStep] = useState<Step>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('afus_session_user')) {
      return 'store';
    }
    return 'account';
  });
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Account fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Store fields
  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');

  // Location fields
  const [city, setCity] = useState('');
  const [openCity, setOpenCity] = useState(false);
  const [address, setAddress] = useState('');

  const [shopLogoPreview, setShopLogoPreview] = useState<string | null>(null);

  const [createdShopSlug, setCreatedShopSlug] = useState('');
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewFading, setReviewFading] = useState(false);

  const REVIEWS = [
    {
      name: 'Aspen Siphron',
      avatar: 'https://i.pravatar.cc/150?img=47',
      rating: 4.9,
      text: 'The quality exceeded my expectations. You can really see the craftsmanship — this is what authentic Moroccan artisanry looks like.',
      product: 'Handcrafted Cedar Box',
    },
    {
      name: 'Kierra Calzoni',
      avatar: 'https://i.pravatar.cc/150?img=32',
      rating: 5.0,
      text: 'Absolutely love this product. The artisan was very communicative and the packaging was perfect. Will definitely order again.',
      product: 'Berber Wool Rug',
    },
    {
      name: 'Youssef Alami',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 4.8,
      text: 'Ordered a custom leather bag — the stitching is perfect and the smell of genuine leather is amazing. A true gem.',
      product: 'Leather Satchel',
    },
    {
      name: 'Nadia Benchekroun',
      avatar: 'https://i.pravatar.cc/150?img=56',
      rating: 5.0,
      text: 'The zellige mirror is absolutely stunning. Everyone who visits asks where I got it — truly a conversation piece.',
      product: 'Zellige Wall Mirror',
    },
  ];

  const stepIndex = STEPS.indexOf(step);
  const contentSteps: Step[] = hasSession ? ['store', 'branding', 'location', 'summary'] : ['account', 'store', 'branding', 'location', 'summary'];
  const contentStepIndex = contentSteps.indexOf(step);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(hasSession ? 'store' : 'account');
      setIsLoginMode(false);
      setError('');
      setFullName(''); setEmail(''); setPassword(''); setPhone('');
      setLoginEmail(''); setLoginPassword('');
      setShopName(''); setShopDesc('');
      setCity(''); setAddress('');
      setShopLogoPreview(null);
      setReviewIdx(0);

      getActiveSession().then((session) => {
        if (session) {
          setHasSession(true);
          setStep((prev) => (prev === 'account' ? 'store' : prev));
        } else {
          setHasSession(false);
          setStep((prev) => (prev === 'store' ? 'account' : prev));
        }
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-advance review carousel
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setReviewFading(true);
      setTimeout(() => {
        setReviewIdx(prev => (prev + 1) % REVIEWS.length);
        setReviewFading(false);
      }, 300);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, REVIEWS.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { setError('Please fill all fields.'); return; }
    setLoading(true); setError('');
    try {
      await loginUser(loginEmail, loginPassword);
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError('Please fill all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setStep('store');
  };

  const handleStoreNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = shopName.trim();
    if (!cleanName) { setError('Please enter a shop name.'); return; }
    if (cleanName.length < 4 || cleanName.length > 20) { setError('Shop name must be between 4 and 20 characters.'); return; }
    if (!/^[a-zA-Z0-9]+$/.test(cleanName)) { setError('Shop name can only contain letters and numbers (no spaces, special characters, or emojis).'); return; }
    
    setLoading(true);
    try {
      const isAvailable = await checkShopSlugAvailable(cleanName.toLowerCase());
      if (!isAvailable) {
        setError('This shop name is already taken.');
        setLoading(false);
        return;
      }
      setError('');
      setStep('branding');
    } catch (err) {
      setError('Error verifying shop name.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('location');
  };

  const handleLocationNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) { setError('Please select your city.'); return; }
    setError('');
    setStep('summary');
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) { setError('Please select your city.'); return; }
    setLoading(true); setError('');
    try {
      const result = await registerUser({
        email,
        password,
        fullName,
        phone: phone || '',
        role: 'seller',
        shopName,
      });
      setCreatedShopSlug(result.shop?.slug || '');
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to create shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const progressPercent = step === 'success' ? 100
    : isLoginMode ? 0
    : ((contentStepIndex + 1) / contentSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch justify-stretch">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal — fullscreen */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Left panel — form (visually on the left) */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden order-first md:order-first">

          {/* Unified header */}
          <div className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-14 md:py-8 border-b md:border-none border-neutral-100 bg-white z-20">
            <div className="flex items-center gap-2 md:gap-3">
              <img src="/logo/logo.png" alt="Afus" className="w-6 h-6 md:w-8 md:h-8 object-contain !rounded-none" />
              <img src="/logo/afus.svg" alt="afus" className="h-4 md:h-5 object-contain !rounded-none" />
            </div>
            <div className="flex items-center gap-4">

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all"
              >
                <IconX className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto relative flex flex-col">
            
            {/* ── GLOBAL STEPPER (Absolute to not affect vertical centering) ── */}
            {!isLoginMode && step !== 'success' && (
              <div className="absolute top-6 md:top-10 lg:top-14 left-6 right-6 md:left-10 md:right-10 lg:left-14 lg:right-14 z-10 pointer-events-none">
                <div className="w-full max-w-md mx-auto pointer-events-auto">
                  {step !== 'account' && !(step === 'store' && hasSession) && (
                    <button
                      onClick={() => {
                        setError('');
                        if (step === 'store') setStep('account');
                        else if (step === 'branding') setStep('store');
                        else if (step === 'location') setStep('branding');
                        else if (step === 'summary') setStep('location');
                      }}
                      className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-6 transition-colors"
                    >
                      <IconArrowLeft className="w-4 h-4" strokeWidth={2} />
                      <span>{t.back}</span>
                    </button>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-wider">
                      <span>{t.step} {contentStepIndex + 1} {t.of} {contentSteps.length}</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>

                    <div className="flex gap-1.5">
                      {contentSteps.map((s, i) => (
                        <div
                          key={s}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= contentStepIndex ? 'bg-primary' : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-full flex items-center justify-center p-6 md:p-10 lg:p-14">
              <div className="w-full max-w-md">

              {/* ── LOGIN MODE ── */}
                {isLoginMode && (
                  <div className="space-y-6 text-center">
                    <div>
                      <button
                        onClick={() => { setIsLoginMode(false); setError(''); }}
                        className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-6 transition-colors mx-auto"
                      >
                        <IconArrowLeft className="w-4 h-4" strokeWidth={2} />
                        <span>Back</span>
                      </button>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.signIn}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.alreadyHaveAccount}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.loginEmail}</label>
                        <div className="relative">
                          <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="you@example.com"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.loginPassword}</label>
                        <div className="relative">
                          <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '...' : t.signinBtn}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { setIsLoginMode(false); setError(''); }}
                          className="text-sm text-primary font-semibold hover:underline"
                        >
                          {t.switchToRegister}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 1: ACCOUNT ── */}
                {step === 'account' && !isLoginMode && (
                  <div className="space-y-6 text-center">
                    <div>


                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.accountTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.accountSubtitle}</p>
                    </div>

                    <form onSubmit={handleAccountNext} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.fullName} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="Youssef Alami"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.email} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.password} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="At least 6 characters"
                          />
                        </div>
                      </div>



                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>

                      <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-xs text-neutral-400 font-medium">{t.or}</span>
                        <div className="flex-1 h-px bg-neutral-200" />
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { setIsLoginMode(true); setError(''); }}
                          className="text-sm text-primary font-semibold hover:underline"
                        >
                          {t.alreadyHaveAccount} {t.signIn}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 2: STORE ── */}
                {step === 'store' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.storeTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.storeSubtitle}</p>
                    </div>

                    <form onSubmit={handleStoreNext} className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-base text-center text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.shopNamePlaceholder}
                          />
                        </div>
                        {shopName && (
                          <p className="text-xs text-neutral-400 mt-1">
                            afus.ma/shop/{shopName.toLowerCase()}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </form>
                  </div>
                )}

                {/* ── STEP 3: BRANDING ── */}
                {step === 'branding' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">Brand your shop</h1>
                      <p className="text-neutral-500 mt-2 text-base">Make your artisan profile stand out.</p>
                    </div>

                    <form onSubmit={handleBrandingNext} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group cursor-pointer">
                          {shopLogoPreview ? (
                            <img src={shopLogoPreview} alt="Shop logo" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-2xl uppercase">
                              {shopName ? shopName.charAt(0) : <IconBuildingStore className="w-6 h-6 text-neutral-400" />}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center">Upload</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setShopLogoPreview(URL.createObjectURL(e.target.files[0]));
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-black block">Shop logo</label>
                          <p className="text-xs text-neutral-500">Upload a profile picture for your shop (optional).</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.shopDesc}</label>
                        <textarea
                          value={shopDesc}
                          onChange={(e) => setShopDesc(e.target.value)}
                          rows={3}
                          className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-neutral-50 hover:bg-white resize-none"
                          placeholder={t.shopDescPlaceholder}
                        />
                      </div>



                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </form>
                  </div>
                )}

                {/* ── STEP 4: LOCATION ── */}
                {step === 'location' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.locationTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.locationSubtitle}</p>
                    </div>

                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.city} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full border border-neutral-200 rounded-xl pl-10 pr-10 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-neutral-50 hover:bg-white appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select your city...</option>
                            {MOROCCAN_CITIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <IconSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.address}</label>
                        <div className="relative">
                          <IconMapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            className="w-full border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-neutral-50 hover:bg-white resize-none"
                            placeholder={t.addressPlaceholder}
                          />
                        </div>
                      </div>



                      <button
                        type="button"
                        onClick={handleLocationNext}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 5: SUMMARY ── */}
                {step === 'summary' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">Review details</h1>
                      <p className="text-neutral-500 mt-2 text-base">Make sure everything looks good before launching your shop.</p>
                    </div>

                    <form onSubmit={handleCreateShop} className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      {/* Preview card */}
                      {shopName && (
                        <div className="arabic-frame bg-neutral-200 p-[1px]">
                          <div className="arabic-frame bg-neutral-50 py-4 pr-4 pl-6 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {shopLogoPreview ? (
                                <img src={shopLogoPreview} alt="Shop logo" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-primary font-bold text-lg uppercase">{shopName.charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-black text-sm truncate">{shopName}</p>
                              <p className="text-xs text-neutral-500 truncate">{shopDesc || 'Your artisan shop on afus'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating...
                          </span>
                        ) : (
                          <>
                            {t.createShop}
                            <IconCheck className="w-5 h-5" strokeWidth={2.5} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* ── SUCCESS ── */}
                {step === 'success' && (
                  <div className="space-y-8 text-center mt-12 md:mt-0">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                          <IconCheck className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <IconBuildingStore className="w-4 h-4 text-white" strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.successTitle}</h1>
                      <p className="text-neutral-500 mt-3 text-base leading-relaxed">
                        {t.successSubtitle}
                      </p>
                    </div>



                    <div className="space-y-4">
                      <a
                        href={`/${lang}/dashboard/upload`}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all"
                        onClick={() => { onClose(); window.location.reload(); }}
                      >
                        <IconPackage className="w-5 h-5" strokeWidth={2} />
                        {t.addProduct}
                      </a>
                      <a
                        href={`/${lang}/dashboard`}
                        className="w-full flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 py-4 rounded-2xl font-bold text-base hover:bg-neutral-50 transition-all"
                        onClick={() => { onClose(); window.location.reload(); }}
                      >
                        {t.goToDashboard}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </a>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Right panel — decorative (visually on the right) */}
        <div
          className="hidden md:flex md:w-[42%] lg:w-[38%] flex-col justify-between relative overflow-hidden order-last md:order-last"
          style={{
            backgroundImage: 'url(/onboarding.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >

          {/* Top spacer */}
          <div className="relative z-10 p-10 lg:p-14"></div>

          {/* Bottom block — review + step indicator, flush to bottom with equal padding */}
          <div className="relative z-10 px-10 pb-10 lg:px-14 lg:pb-14 space-y-4">



            {/* Review carousel */}
            {false && step !== 'success' && (
              <div
                className={`transition-opacity duration-300 ${
                  reviewFading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* Card */}
                <div className="arabic-frame bg-neutral-200 p-[1px]">
                  <div className="arabic-frame bg-white p-5 space-y-3 flex flex-col">

                    {/* Stars + rating */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} viewBox="0 0 20 20" fill={i < Math.floor(REVIEWS[reviewIdx].rating) ? '#FBBF24' : 'none'} stroke="#FBBF24" strokeWidth={i < Math.floor(REVIEWS[reviewIdx].rating) ? 0 : 1.5} className="w-4 h-4">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs font-bold text-black">{REVIEWS[reviewIdx].rating.toFixed(1)}</span>
                    </div>

                    {/* Quote — deep charcoal */}
                    <p className="text-base text-neutral-900 leading-relaxed font-medium">
                      &ldquo;{REVIEWS[reviewIdx].text}&rdquo;
                    </p>

                    {/* Divider + avatar + name + product */}
                    <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                      <img
                        src={REVIEWS[reviewIdx].avatar}
                        alt={REVIEWS[reviewIdx].name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-black truncate">{REVIEWS[reviewIdx].name}</p>
                        <p className="text-xs text-neutral-600 truncate">{REVIEWS[reviewIdx].product}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {REVIEWS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setReviewFading(true); setTimeout(() => { setReviewIdx(i); setReviewFading(false); }, 300); }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === reviewIdx ? 'bg-white w-4' : 'bg-white/40 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}



          </div>
        </div>

      </div>
    </div>
  );
}
