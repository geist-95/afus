'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, loginWithGoogleToken } from '@/lib/auth';
import { IconMail, IconLock, IconArrowRight } from '@tabler/icons-react';

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

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true);
    setError('');
    try {
      const sessionUser = await loginWithGoogleToken(credential);
      
      document.cookie = "afus_beta_unlocked=true; path=/; max-age=31536000";
      localStorage.setItem("afus_beta_unlocked", "true");

      let redirectTarget = `/${lang}`;
      if (sessionUser?.shop || sessionUser?.role === 'seller') {
        redirectTarget = `/${lang}/dashboard`;
      }
      
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get('redirect');
        if (redirectParam) {
          redirectTarget = `/${lang}/${redirectParam}`;
        }
      }

      window.location.href = redirectTarget;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email && password.length >= 6) {
        // Perform live Supabase Auth and load profile
        const sessionUser = await loginUser(email, password);

        // Automatically unlock beta access for logged in / registered users
        document.cookie = "afus_beta_unlocked=true; path=/; max-age=31536000";
        localStorage.setItem("afus_beta_unlocked", "true");

        // Determine redirect path target
        let redirectTarget = `/${lang}`;
        if (sessionUser?.shop || sessionUser?.role === 'seller') {
          redirectTarget = `/${lang}/dashboard`;
        }

        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get('redirect');
          if (redirectParam) {
            redirectTarget = `/${lang}/${redirectParam}`;
          }
        }

        window.location.href = redirectTarget;
      } else {
        setError(
          lang === 'ar'
            ? 'البريد الإلكتروني أو كلمة المرور غير صالحة'
            : lang === 'tz'
            ? 'ⴰⵎⴰⵢⵍ ⵏⵖ ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ ⵓⵔ ⵢⵓⵖⴰⵍ'
            : 'invalid email or password'
        );
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
      title: "Sign in to afus",
      email: "Email address",
      password: "Password",
      btn: "Sign in",
      noAccount: "No account yet?",
      register: "Create account",
      placeholderEmail: "e.g. amine@example.com",
    },
    fr: {
      title: "Connexion à afus",
      email: "Adresse e-mail",
      password: "Mot de passe",
      btn: "Se connecter",
      noAccount: "Pas encore de compte ?",
      register: "Créer un compte",
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
    },
    tz: {
      title: "ⴽⵛⵎ ⵖⵔ ⴰⴼⵓⵙ",
      email: "ⴰⵏⵙⴰ ⵏ ⵓⵎⴰⵢⵍ",
      password: "ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ",
      btn: "ⴽⵛⵎ",
      noAccount: "ⵓⵔⵜⴰ ⵜⵙⵄⵉⴷ ⴰⵎⵉⴹⴰⵏ?",
      register: "ⵙⵏⴼⵍ ⴰⵎⵉⴹⴰⵏ",
      placeholderEmail: "ⵎⴷⵢⴰ. amine@example.com",
    }
  };

  const t = labels[lang] || labels.en;
  const isTz = lang === 'tz';

  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-4 py-12 bg-neutral-50/50 ${isTz ? 'font-tifinagh' : ''}`}>
      <div className="w-full max-w-md bg-white border border-neutral-100 rounded-3xl p-8 shadow-xl shadow-neutral-100/70 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center pb-6 mb-6 border-b border-neutral-100 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo/logo.png" alt="Afus" className="w-8 h-8 object-contain !rounded-none" />
            <img src="/logo/afus.svg" alt="afus" className="h-5 object-contain !rounded-none" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-neutral-500 font-semibold uppercase tracking-wider">
              {lang === 'fr' ? 'OU' : lang === 'ar' ? 'أو' : lang === 'tz' ? 'ⵏⵖ' : 'OR'}
            </span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleSuccess(credentialResponse.credential);
              }
            }}
            onError={() => {
              setError('Google login failed');
            }}
            useOneTap
            shape="pill"
            size="large"
            text="continue_with"
            width="400"
          />
        </div>

        <div className="text-center border-t border-neutral-100 pt-6 mt-6 text-sm text-neutral-500">
          <span>{t.noAccount} </span>
          <Link href={`/${lang}/signup`} className="text-primary font-bold hover:underline">
            {t.register}
          </Link>
        </div>
      </div>
    </div>
  );
}

