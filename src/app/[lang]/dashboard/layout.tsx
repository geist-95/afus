'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getActiveSession, UserSession } from '@/lib/auth';
import { logoutUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ArrowLeft, FolderClosed, Store, ChevronDown, Wallet, User, ChevronLeft, ChevronRight, Zap, Tag, MessageSquare } from 'lucide-react';
import { IconBuildingStore, IconMessage2, IconWallet, IconUser, IconShoppingBag, IconPackage, IconFolder, IconTag, IconTagFilled, IconSettings, IconLogout, IconChevronDown, IconLayoutDashboard, IconLayoutDashboardFilled, IconShoppingCart, IconShoppingCartFilled, IconCoin, IconCoinFilled } from '@tabler/icons-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { lang } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({ store: true, earnings: false, account: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  const t = getDictionary(lang).dashboard;

  const banners = [
    {
      message: t.banners.boost,
      buttonText: t.banners.upgrade,
      icon: <Zap className="w-3.5 h-3.5 fill-green-400" />
    },
    {
      message: t.banners.summer,
      buttonText: t.banners.learnMore,
      icon: <span className="text-[12px] leading-none">✨</span>
    },
    {
      message: t.banners.seamless,
      buttonText: t.banners.tryPremium,
      icon: <Zap className="w-3.5 h-3.5 fill-green-400" />
    }
  ];
  const toggleGroup = (group: keyof typeof openGroups) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    async function loadSession() {
      const user = await getActiveSession();
      if (!user) {
        router.push(`/${lang}/login`);
      } else if (!user.shop) {
        // Redirect to homepage if user does not have a registered store/shop
        router.push(`/${lang}`);
      } else {
        setSession(user);
      }
      setLoading(false);
    }
    loadSession();
  }, [lang, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleLogout = async () => {
    await logoutUser();
    router.push(`/${lang}/login`);
  };

  if (loading || !session) {
    return (
      <div className="h-[100dvh] overflow-hidden bg-[#2A1C2C] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
          <span className="text-white/60 font-medium">{t.loading}</span>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  const navItemClass = (active: boolean) => 
    `block px-3 py-2 text-[13px] transition-colors rounded-md font-medium ${
      active 
        ? 'bg-neutral-100 text-[#663399] font-bold' 
        : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
    }`;

  const mobileNavItemClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
      active
        ? 'border-black text-black font-semibold'
        : 'border-transparent text-neutral-500 hover:text-black hover:border-gray-200 font-medium'
    }`;

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#2A1C2C] flex flex-col font-sans antialiased">
      <header className="hidden md:flex h-16 items-center justify-between px-6 lg:px-12 flex-shrink-0 w-full">
        {/* Logo */}
        <div className="flex-shrink-0 w-[200px]">
          <Link prefetch={true} className="flex items-center gap-3 hover:opacity-80 transition-opacity" href={`/${lang}`}>
            <img src="/logo/logo.png" alt="Afus Logo" className="w-8 h-8 object-contain !rounded-none" />
          </Link>
        </div>

        {/* Centered Banner */}
        <div className="hidden lg:flex items-center justify-center flex-1 overflow-hidden">
          <div className="flex items-center gap-6 text-[13px] text-neutral-300">
            <button 
              onClick={() => setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
              className="text-neutral-500 hover:text-white transition-colors p-1 z-10 relative"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="relative w-[500px] h-8 flex items-center justify-center overflow-hidden">
              {banners.map((banner, idx) => (
                <div 
                  key={idx} 
                  className={`absolute flex items-center gap-4 transition-all duration-500 ease-in-out ${idx === currentBanner ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                  <span className="whitespace-nowrap">{banner.message}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-700 bg-neutral-800/40 text-neutral-400 font-medium whitespace-nowrap text-xs">
                    {lang === 'fr' ? 'Bientôt disponible' : lang === 'ar' ? 'قريباً' : 'Coming Soon'}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
              className="text-neutral-500 hover:text-white transition-colors p-1 z-10 relative"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right spacing to balance center */}
        <div className="hidden lg:block w-[200px]"></div>
      </header>
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <div className="flex-1 bg-white flex flex-col md:flex-row overflow-hidden max-md:border-none md:shadow-2xl md:arabic-frame">
          
          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-[60] pb-safe flex justify-around items-center h-[65px]">
            <Link prefetch={true} href={`/${lang}/dashboard`} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(`/${lang}/dashboard`, true) ? 'text-[#663399]' : 'text-neutral-500'}`}>
              {isActive(`/${lang}/dashboard`, true) ? <IconLayoutDashboardFilled className="w-6 h-6" /> : <IconLayoutDashboard className="w-6 h-6" strokeWidth={1.8} />}
              <span className="text-[10px] font-medium">Dashboard</span>
            </Link>
            <Link prefetch={true} href={`/${lang}/dashboard/products`} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(`/${lang}/dashboard/products`) ? 'text-[#663399]' : 'text-neutral-500'}`}>
              {isActive(`/${lang}/dashboard/products`) ? <IconTagFilled className="w-6 h-6" /> : <IconTag className="w-6 h-6" strokeWidth={1.8} />}
              <span className="text-[10px] font-medium">{t.products}</span>
            </Link>
            <Link prefetch={true} href={`/${lang}/dashboard/orders`} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(`/${lang}/dashboard/orders`) ? 'text-[#663399]' : 'text-neutral-500'}`}>
              {isActive(`/${lang}/dashboard/orders`) ? <IconShoppingCartFilled className="w-6 h-6" /> : <IconShoppingCart className="w-6 h-6" strokeWidth={1.8} />}
              <span className="text-[10px] font-medium">{t.orders}</span>
            </Link>
            <Link prefetch={true} href={`/${lang}/dashboard/earnings/overview`} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(`/${lang}/dashboard/earnings/overview`) ? 'text-[#663399]' : 'text-neutral-500'}`}>
              {isActive(`/${lang}/dashboard/earnings/overview`) ? <IconCoinFilled className="w-6 h-6" /> : <IconCoin className="w-6 h-6" strokeWidth={1.8} />}
              <span className="text-[10px] font-medium">{lang === 'fr' ? 'Gain' : lang === 'ar' ? 'الأرباح' : 'Gain'}</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(true)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMobileMenuOpen ? 'text-[#663399]' : 'text-neutral-500'}`}>
              <div className="flex flex-col gap-[3px] items-center justify-center w-6 h-6">
                <span className={`w-5 h-0.5 bg-current rounded-full transition-all ${isMobileMenuOpen ? 'w-6' : ''}`} />
                <span className="w-5 h-0.5 bg-current rounded-full" />
                <span className={`w-5 h-0.5 bg-current rounded-full transition-all ${isMobileMenuOpen ? 'w-6' : ''}`} />
              </div>
              <span className="text-[10px] font-medium">{lang === 'fr' ? 'Plus' : lang === 'ar' ? 'المزيد' : 'More'}</span>
            </button>
          </nav>

          {/* Mobile "More" Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-[70] bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="text-xl font-bold">{lang === 'fr' ? 'Plus' : lang === 'ar' ? 'المزيد' : 'More'}</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-[100px]">
                <div className="space-y-1">
                  <Link prefetch={true} onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}`} className="w-full flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl bg-neutral-50 mb-6 border border-neutral-100">
                    <ArrowLeft className="w-5 h-5 text-neutral-500" />
                    <span>{t.backToApp}</span>
                  </Link>

                  <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{t.myStore}</p>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}/dashboard/collections`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl">
                    <FolderClosed className="w-5 h-5 text-neutral-400" />
                    <span>{t.collections}</span>
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}/dashboard/promotions`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl">
                    <Tag className="w-5 h-5 text-neutral-400" />
                    <span>{t.promotions}</span>
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}/dashboard/messages`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-neutral-400" />
                    <span>{t.messages}</span>
                  </Link>
                </div>

                <div className="space-y-1 border-t border-neutral-100 pt-6">
                  <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{t.earnings}</p>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}/dashboard/earnings/overview`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl">
                    <Wallet className="w-5 h-5 text-neutral-400" />
                    <span>{t.overview}</span>
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}/dashboard/earnings/credits`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl">
                    <Wallet className="w-5 h-5 text-neutral-400" />
                    <span>{t.payouts}</span>
                  </Link>
                </div>

                <div className="space-y-1 border-t border-neutral-100 pt-6">
                  <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{t.account}</p>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={`/${lang}/dashboard/settings`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-neutral-700 active:bg-neutral-100 rounded-xl">
                    <Settings className="w-5 h-5 text-neutral-400" />
                    <span>{t.settings}</span>
                  </Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-red-600 active:bg-red-50 rounded-xl">
                    <LogOut className="w-5 h-5" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 bg-neutral-50/50 border-r border-neutral-200 flex-shrink-0 z-30 overflow-hidden">
            <div className="h-full flex flex-col">
              <nav className="flex-1 overflow-y-auto p-4 pt-6 space-y-2">
                
                {/* My Store Group */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => toggleGroup('store')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <div className="flex items-center gap-3 relative">
                      <IconBuildingStore className="w-[20px] h-[20px] text-neutral-500 group-hover:text-neutral-800 transition-colors relative z-10" strokeWidth={1.8} />
                      <span>{t.myStore}</span>
                    </div>
                    <IconChevronDown className={`w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${openGroups.store ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroups.store ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 py-1 ml-[21px] border-l border-neutral-200 pl-2 mb-2">
                      <Link className={navItemClass(isActive(`/${lang}/dashboard`, true))} href={`/${lang}/dashboard`}>{t.overview}</Link>
                      {session.shop && (
                        <Link 
                          className="block px-3 py-2 text-[13px] transition-colors rounded-md font-medium text-neutral-600 hover:text-black hover:bg-neutral-100" 
                          href={`/${lang}/shop/${session.shop.slug}`}
                        >
                          {lang === 'fr' ? 'Ma boutique ↗' : lang === 'ar' ? 'متجري ↗' : 'My Shop ↗'}
                        </Link>
                      )}
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/products`))} href={`/${lang}/dashboard/products`}>{t.products}</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/orders`))} href={`/${lang}/dashboard/orders`}>{t.orders}</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/collections`))} href={`/${lang}/dashboard/collections`}>{t.collections}</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/promotions`))} href={`/${lang}/dashboard/promotions`}>{t.promotions}</Link>
                    </div>
                  </div>
                </div>

                <Link href={`/${lang}/dashboard/messages`} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isActive(`/${lang}/dashboard/messages`) ? 'bg-primary/10 text-primary' : 'text-neutral-800 hover:bg-neutral-100'}`}>
                  <IconMessage2 className={`w-5 h-5 ${isActive(`/${lang}/dashboard/messages`) ? 'text-primary' : 'text-neutral-500'}`} strokeWidth={1.8} />
                  <span>{t.messages}</span>
                </Link>

                {/* Earnings Group */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => toggleGroup('earnings')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <div className="flex items-center gap-3 relative">
                      <IconWallet className="w-[20px] h-[20px] text-neutral-500 group-hover:text-neutral-800 transition-colors relative z-10" strokeWidth={1.8} />
                      <span>{t.earnings}</span>
                    </div>
                    <IconChevronDown className={`w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${openGroups.earnings ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroups.earnings ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 py-1 ml-[21px] border-l border-neutral-200 pl-2 mb-2">
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/earnings/overview`))} href={`/${lang}/dashboard/earnings/overview`}>{t.overview}</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/earnings/credits`))} href={`/${lang}/dashboard/earnings/credits`}>{t.payouts}</Link>
                    </div>
                  </div>
                </div>

                {/* Account Group */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => toggleGroup('account')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <div className="flex items-center gap-3 relative">
                      <IconUser className="w-[20px] h-[20px] text-neutral-500 group-hover:text-neutral-800 transition-colors relative z-10" strokeWidth={1.8} />
                      <span>{t.account}</span>
                    </div>
                    <IconChevronDown className={`w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${openGroups.account ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroups.account ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 py-1 ml-[21px] border-l border-neutral-200 pl-2 mb-2">
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/settings`))} href={`/${lang}/dashboard/settings`}>{t.settings}</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-[13px] transition-colors rounded-md text-red-600 hover:bg-red-50 font-medium">{t.logout}</button>
                    </div>
                  </div>
                </div>

              </nav>

              <div className="p-4 border-t border-neutral-200 mt-auto">
                <Link prefetch={true} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-600 hover:text-black transition-colors rounded-lg hover:bg-neutral-100" href={`/${lang}`}>
                  <ArrowLeft className="w-[18px] h-[18px]" />
                  <span>{t.backToApp}</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto bg-[#F9F9F9] pb-[65px] md:pb-0">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}

