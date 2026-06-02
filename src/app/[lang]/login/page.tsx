'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function LoginPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email && password.length >= 6) {
        // Perform live Supabase Auth and load profile
        await loginUser(email, password);

        // Determine redirect path target
        let redirectTarget = `/${lang}/dashboard/orders`;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get('redirect');
          if (redirectParam) {
            redirectTarget = `/${lang}/${redirectParam}`;
          }
        }

        router.push(redirectTarget);
      } else {
        setError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صالحة' : 'invalid email or password');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'authentication failed');
      setLoading(false);
    }
  };

  const labels: Record<string, Record<string, string>> = {
    en: {
      title: "sign in to afus",
      email: "email address",
      password: "password",
      btn: "sign in",
      noAccount: "no account yet?",
      register: "create account",
      placeholderEmail: "e.g. amine@example.com",
    },
    fr: {
      title: "connexion à afus",
      email: "adresse e-mail",
      password: "mot de passe",
      btn: "se connecter",
      noAccount: "pas encore de compte ?",
      register: "créer un compte",
      placeholderEmail: "ex: amine@example.com",
    },
    ar: {
      title: "تسجيل الدخول إلى أفوس",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      btn: "دخول",
      noAccount: "ليس لديك حساب؟",
      register: "إنشاء حساب جديد",
      placeholderEmail: "مثال: amine@example.com",
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="max-w-md mx-auto my-12 border border-black p-8 bg-white font-mono text-xs lowercase">
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
          <label className="block text-neutral-600 font-bold">{t.email}</label>
          <input
            type="email"
            required
            placeholder={t.placeholderEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black p-2.5 focus:outline-none rounded-none"
          />
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
        <span>{t.noAccount} </span>
        <Link href={`/${lang}/signup`} className="text-black font-bold hover:underline">
          {t.register}
        </Link>
      </div>
    </div>
  );
}
