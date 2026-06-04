'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { registerUser } from '@/lib/auth';

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
      setError(lang === 'ar' ? 'رقم الهاتف المحمول المغربي غير صالح' : 'invalid moroccan mobile phone number (+212 / 06 / 07)');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(lang === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'password must be at least 6 characters');
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
      title: "create your afus account",
      fullName: "full name",
      email: "email address",
      phone: "mobile phone number",
      phoneHelp: "must start with +212, 06, or 07 (mandatory for cod confirmation)",
      shopName: "store name (optional)",
      shopNameHelp: "leave blank if you just want to buy",
      password: "password (min 6 characters)",
      btn: "create account",
      hasAccount: "already have an account?",
      login: "sign in",
    },
    fr: {
      title: "créer votre compte afus",
      fullName: "nom complet",
      email: "adresse e-mail",
      phone: "numéro de téléphone mobile",
      phoneHelp: "doit commencer par +212, 06, ou 07 (obligatoire pour confirmation cod)",
      shopName: "nom de la boutique (optionnel)",
      shopNameHelp: "laissez vide si vous souhaitez uniquement acheter",
      password: "mot de passe (min 6 caractères)",
      btn: "créer mon compte",
      hasAccount: "vous avez déjà un compte ?",
      login: "se connecter",
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
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="max-w-md mx-auto my-6 border border-black p-8 bg-white font-mono text-xs lowercase">
      <div className="text-center border-b border-black pb-4 mb-6">
        <span className="text-2xl font-serif font-bold text-black lowercase block mb-1">afus</span>
        <span className="text-neutral-500">{t.title}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="border border-red-600 bg-red-50 text-red-600 p-2.5 font-bold">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-neutral-600 font-bold">{t.fullName}</label>
          <input
            type="text"
            required
            placeholder="e.g. amine bensouda"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-black p-2.5 focus:outline-none rounded-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-neutral-600 font-bold">{t.email}</label>
          <input
            type="email"
            required
            placeholder="e.g. amine@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black p-2.5 focus:outline-none rounded-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-neutral-600 font-bold">{t.phone}</label>
          <input
            type="text"
            required
            placeholder="e.g. 0661234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-black p-2.5 focus:outline-none rounded-none"
          />
          <span className="text-[10px] text-neutral-400 block mt-0.5">{t.phoneHelp}</span>
        </div>

        <div className="space-y-1">
          <label className="block text-neutral-600 font-bold">{t.shopName}</label>
          <input
            type="text"
            placeholder="e.g. atlas artisanat"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full border border-black p-2.5 focus:outline-none rounded-none"
          />
          <span className="text-[10px] text-neutral-400 block mt-0.5">{t.shopNameHelp}</span>
        </div>

        <div className="space-y-1">
          <label className="block text-neutral-600 font-bold">{t.password}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black p-2.5 focus:outline-none rounded-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white hover:bg-neutral-800 py-3 uppercase tracking-widest border border-black font-bold disabled:opacity-40 transition-colors rounded-none mt-2"
        >
          {loading ? '...' : t.btn}
        </button>
      </form>

      <div className="text-center border-t border-black pt-4 mt-6 text-neutral-500">
        <span>{t.hasAccount} </span>
        <Link href={`/${lang}/login`} className="text-black font-bold hover:underline">
          {t.login}
        </Link>
      </div>
    </div>
  );
}
