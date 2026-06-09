'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuildingStore,
  IconLock,
  IconArrowRight,
} from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function SignupPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate Moroccan phone string
    const phoneRegex = /^(?:\+212|0)[67]\d{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError(
        lang === 'ar'
          ? 'رقم الهاتف المحمول المغربي غير صالح'
          : lang === 'tz'
          ? 'ⵓⵟⵟⵓⵏ ⵏ ⵜⵉⵍⵉⴼⵓⵏ ⵓⵔ ⵢⵓⵖⴰⵍ'
          : 'invalid moroccan mobile phone number (+212 / 06 / 07)'
      );
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(
        lang === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'
          : lang === 'tz'
          ? 'ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ ⵉⵍⴰⵇ ⴰⴷ ⵜⴳ 6 ⵉⵙⴽⴽⵉⵍⵏ'
          : 'password must be at least 6 characters'
      );
      setLoading(false);
      return;
    }

    try {
      // Register via Supabase and insert profile & shop
      await registerUser({
        email,
        password,
        fullName,
        phone,
        shopName: shopName.trim() || undefined,
      });

      // Redirect to login page upon success
      router.push(`/${lang}/login?registered=true`);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'registration failed');
      setLoading(false);
    }
  };

  const labels: Record<string, Record<string, string>> = {
    en: {
      title: "Create your afus account",
      fullName: "Full name",
      email: "Email address",
      phone: "Mobile phone number",
      phoneHelp: "Must start with +212, 06, or 07 (mandatory for COD confirmation)",
      shopName: "Store name (optional)",
      shopNameHelp: "Leave blank if you just want to buy",
      password: "Password (min 6 characters)",
      btn: "Create account",
      hasAccount: "Already have an account?",
      login: "Sign in",
      fullNamePlaceholder: "e.g. Amine Bensouda",
      placeholderEmail: "e.g. amine@example.com",
      placeholderPhone: "e.g. 0661234567",
      placeholderShopName: "e.g. Atlas Artisanat",
    },
    fr: {
      title: "Créer votre compte afus",
      fullName: "Nom complet",
      email: "Adresse e-mail",
      phone: "Numéro de téléphone mobile",
      phoneHelp: "Doit commencer par +212, 06, ou 07 (obligatoire pour confirmation COD)",
      shopName: "Nom de la boutique (optionnel)",
      shopNameHelp: "Laissez vide si vous souhaitez uniquement acheter",
      password: "Mot de passe (min 6 caractères)",
      btn: "Créer mon compte",
      hasAccount: "Vous avez déjà un compte ?",
      login: "Se connecter",
      fullNamePlaceholder: "ex. Amine Bensouda",
      placeholderEmail: "ex. amine@example.com",
      placeholderPhone: "ex. 0661234567",
      placeholderShopName: "ex. Maison Artisanale",
    },
    ar: {
      title: "إنشاء حساب أفوس جديد",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف المحمول",
      phoneHelp: "يجب أن يبدأ بـ 212+ أو 06 أو 07 (ضروري لتأكيد طلبيات الدفع عند الاستلام)",
      shopName: "اسم المتجر (اختياري)",
      shopNameHelp: "اتركه فارغًا إذا كنت تريد الشراء فقط",
      password: "كلمة المرور (6 أحرف كحد أدنى)",
      btn: "إنشاء الحساب",
      hasAccount: "هل لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      fullNamePlaceholder: "مثال: أمين بنسودة",
      placeholderEmail: "مثال: amine@example.com",
      placeholderPhone: "مثال: 0661234567",
      placeholderShopName: "مثال: أطلس للحرف اليدوية",
    },
    tz: {
      title: "ⵙⵏⴼⵍ ⴰⵎⵉⴹⴰⵏ ⵏ ⴰⴼⵓⵙ",
      fullName: "ⵉⵙⵎ ⴰⵎⵖⵔⴰⴷ",
      email: "ⴰⵏⵙⴰ ⵏ ⵓⵎⴰⵢⵍ",
      phone: "ⵓⵟⵟⵓⵏ ⵏ ⵜⵉⵍⵉⴼⵓⵏ",
      phoneHelp: "ⵢⵓⴷⴷⵓ ⵙ +212, 06, ⵏⵖ 07 (ⵉⵍⴰⵇ ⵉ ⵓⵙⵏⵇⴷ)",
      shopName: "ⵉⵙⵎ ⵏ ⵜⴰⵃⴰⵏⵓⵜ (ⴰⵙⵜⴰⵢ)",
      shopNameHelp: "ⵙⵙⵉⵔⵉⵡ ⵜⵉⵍⵉ ⵢⵉⵍⵉ ⵖⴰⵙ ⵜⵙⵖⵉⴷ",
      password: "ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ (6 ⵉⵙⴽⴽⵉⵍⵏ ⴽ حد ⴰⴷⵔⴰⵔ)",
      btn: "ⵙⵏⴼⵍ ⴰⵎⵉⴹⴰⵏ",
      hasAccount: "ⵉⵍⵍⴰ ⵖⵓⵔⴽ ⴰⵎⵉⴹⴰⵏ?",
      login: "ⴽⵛⵎ",
      fullNamePlaceholder: "ⵎⴷⵢⴰ. Amine Bensouda",
      placeholderEmail: "ⵎⴷⵢⴰ. amine@example.com",
      placeholderPhone: "ⵎⴷⵢⴰ. 0661234567",
      placeholderShopName: "ⵎⴷⵢⴰ. Atlas Artisanat",
    }
  };

  const t = labels[lang] || labels.en;
  const isTz = lang === 'tz';

  return (
    <div className={`min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-50/50 ${isTz ? 'font-tifinagh' : ''}`}>
      <div className="w-full max-w-md bg-white border border-neutral-100 rounded-3xl p-8 shadow-xl shadow-neutral-100/70 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center pb-6 mb-6 border-b border-neutral-100 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo/logo.png" alt="Afus" className="w-8 h-8 object-contain !rounded-none" />
            <img src="/logo/afus.svg" alt="afus" className="h-5 object-contain !rounded-none" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-neutral-800">{t.fullName}</label>
            <div className="relative">
              <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={1.8} />
              <input
                type="text"
                required
                placeholder={t.fullNamePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-base text-black bg-neutral-50/30 focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all hover:border-neutral-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-neutral-800">{t.email}</label>
            <div className="relative">
              <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={1.8} />
              <input
                type="email"
                required
                placeholder={t.placeholderEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-base text-black bg-neutral-50/30 focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all hover:border-neutral-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-neutral-800">{t.phone}</label>
            <div className="relative">
              <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={1.8} />
              <input
                type="text"
                required
                placeholder={t.placeholderPhone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-base text-black bg-neutral-50/30 focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all hover:border-neutral-300"
              />
            </div>
            <span className="text-xs text-neutral-400 block px-1">{t.phoneHelp}</span>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-neutral-800">{t.shopName}</label>
            <div className="relative">
              <IconBuildingStore className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={1.8} />
              <input
                type="text"
                placeholder={t.placeholderShopName}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-base text-black bg-neutral-50/30 focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all hover:border-neutral-300"
              />
            </div>
            <span className="text-xs text-neutral-400 block px-1">{t.shopNameHelp}</span>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-neutral-800">{t.password}</label>
            <div className="relative">
              <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={1.8} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-base text-black bg-neutral-50/30 focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all hover:border-neutral-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t.btn}
                <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <div className="text-center border-t border-neutral-100 pt-6 mt-6 text-sm text-neutral-500">
          <span>{t.hasAccount} </span>
          <Link href={`/${lang}/login`} className="text-primary font-bold hover:underline">
            {t.login}
          </Link>
        </div>
      </div>
    </div>
  );
}

