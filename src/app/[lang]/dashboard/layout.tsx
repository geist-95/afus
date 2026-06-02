'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getActiveSession, UserSession } from '@/lib/auth';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Loader2, ArrowLeft, FolderClosed } from 'lucide-react';
import { logoutUser } from '@/lib/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { lang } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  
  const labels: Record<string, Record<string, string>> = {
    en: {
      overview: 'overview',
      products: 'products',
      collections: 'collections',
      orders: 'orders',
      settings: 'settings',
      backToMarketplace: 'back to marketplace',
      logout: 'logout',
    },
    fr: {
      overview: 'aperçu',
      products: 'produits',
      collections: 'collections',
      orders: 'commandes',
      settings: 'paramètres',
      backToMarketplace: 'retour à la boutique',
      logout: 'déconnexion',
    },
    ar: {
      overview: 'نظرة عامة',
      products: 'المنتجات',
      collections: 'المجموعات',
      orders: 'الطلبات',
      settings: 'الإعدادات',
      backToMarketplace: 'العودة للمتجر',
      logout: 'تسجيل الخروج',
    }
  };

  const t = labels[lang] || labels.en;
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const user = await getActiveSession();
      if (!user) {
        router.push(`/${lang}/login`);
      } else {
        setSession(user);
      }
      setLoading(false);
    }
    loadSession();
  }, [lang, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push(`/${lang}/login`);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-neutral-50 font-mono text-sm">
        {/* Sidebar skeleton */}
        <aside className="w-64 border-r border-black bg-white flex flex-col p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-neutral-200/60 w-24 rounded" />
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-neutral-200/60 w-32 rounded" />
            <div className="h-3 bg-neutral-200/60 w-48 rounded" />
          </div>
          <div className="space-y-3 mt-8">
            <div className="h-10 bg-neutral-200/60 rounded" />
            <div className="h-10 bg-neutral-200/60 rounded" />
            <div className="h-10 bg-neutral-200/60 rounded" />
          </div>
        </aside>
        <main className="flex-1 p-8 space-y-6">
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-neutral-200/60 w-48 rounded" />
            <div className="h-4 bg-neutral-200/60 w-72 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 animate-pulse">
            <div className="h-32 bg-neutral-200/60 rounded-xl" />
            <div className="h-32 bg-neutral-200/60 rounded-xl" />
            <div className="h-32 bg-neutral-200/60 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!session) return null;
  const navItems = [
    { name: t.overview, href: `/${lang}/dashboard`, icon: LayoutDashboard, exact: true },
    { name: t.products, href: `/${lang}/dashboard/upload`, icon: Package, exact: false },
    { name: t.collections, href: `/${lang}/dashboard/collections`, icon: FolderClosed, exact: false },
    { name: t.orders, href: `/${lang}/dashboard/orders`, icon: ShoppingBag, exact: false },
    { name: t.settings, href: `/${lang}/dashboard/settings`, icon: Settings, exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-neutral-50 font-mono text-sm">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black bg-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-black">
          <Link href={`/${lang}`} className="text-2xl font-serif font-bold text-black tracking-tighter">
            afus.
          </Link>
          <div className="mt-4">
            <p className="font-bold truncate">{session.shop ? session.shop.name : session.full_name}</p>
            <p className="text-xs text-neutral-500 truncate">{session.email}</p>
            {session.role === 'seller' && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-black text-white text-[10px] uppercase font-bold">
                Seller Account
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 border border-black transition-colors ${
                  active 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold lowercase">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full border border-black bg-white text-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bold lowercase hidden md:block">{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-black bg-white p-4 flex justify-between items-center">
          <Link href={`/${lang}`} className="text-xl font-serif font-bold text-black tracking-tighter">
            afus.
          </Link>
          <button onClick={handleLogout} className="text-xs font-bold uppercase underline">
            Logout
          </button>
        </header>

        {/* Mobile Nav */}
        <nav className="md:hidden border-b border-black bg-white flex overflow-x-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex-shrink-0 px-4 py-3 border-r border-black font-bold lowercase ${
                  active ? 'bg-black text-white' : 'text-black'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 p-4 md:p-8 relative">
          {children}
        </div>

        {/* Back Button Bottom Left */}
        <div className="p-4 border-t border-black bg-white">
          <Link href={`/${lang}`} className="inline-flex items-center space-x-2 px-4 py-2 border border-black hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold lowercase">{t.backToMarketplace}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
