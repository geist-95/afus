'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function AuthCallbackPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleAuthCallback() {
      try {
        // Wait a brief moment for Supabase to parse URL parameters and set local session
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!active) return;

        const session = await getActiveSession();
        if (session) {
          // Redirect authenticated user to the home page in their active language
          router.replace(`/${lang}`);
        } else {
          // If no session is found, redirect back to login page
          router.replace(`/${lang}/login`);
        }
      } catch (err: any) {
        console.error('Callback handler error:', err);
        if (active) {
          setError(err.message || 'Authentication sync failed.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      active = false;
    };
  }, [router, lang]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-100 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo/logo.png" alt="Afus" className="w-8 h-8 object-contain" />
          <img src="/logo/afus.svg" alt="afus" className="h-5 object-contain" />
        </div>

        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl mx-auto">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Authentication Error</h2>
            <p className="text-sm text-neutral-500">{error}</p>
            <button
              onClick={() => router.replace(`/${lang}/login`)}
              className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary/90 transition-all cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Elegant Moroccan-themed copper-orange spinner */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800">Signing in...</h2>
            <p className="text-sm text-neutral-500">Securing your session with Google</p>
          </div>
        )}
      </div>
    </div>
  );
}
