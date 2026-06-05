'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getActiveSession, UserSession } from '@/lib/auth';
import { logoutUser } from '@/lib/auth';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ArrowLeft, FolderClosed, Store, ChevronDown, Wallet, User, ChevronLeft, ChevronRight, Zap, Tag, MessageSquare } from 'lucide-react';
import { IconBuildingStore, IconMessage2, IconWallet, IconUser, IconShoppingBag, IconPackage, IconFolder, IconTag, IconSettings, IconLogout, IconChevronDown } from '@tabler/icons-react';

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
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      message: "Boost your shop visibility with our new artisan features",
      buttonText: "Upgrade Shop",
      icon: <Zap className="w-3.5 h-3.5 fill-green-400" />
    },
    {
      message: "Get early access to the exclusive Summer Collection",
      buttonText: "Learn More",
      icon: <span className="text-[12px] leading-none">✨</span>
    },
    {
      message: "Enjoy seamless multi-channel selling and workflows",
      buttonText: "Try Premium",
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
          <span className="text-white/60 font-medium">Loading Dashboard...</span>
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
      <header className="h-16 flex items-center justify-between px-6 lg:px-12 flex-shrink-0 w-full">
        {/* Logo */}
        <div className="flex-shrink-0 w-[200px]">
          <Link className="flex items-center gap-3 hover:opacity-80 transition-opacity" href={`/${lang}`}>
            <img src="/logo/logo.png" alt="Afus Logo" className="w-8 h-8 object-contain !rounded-none invert" />
            <img src="/logo/afus.svg" alt="afus" className="h-5 object-contain !rounded-none invert brightness-0" />
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
                  <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/40 bg-neutral-800/50 text-green-400 hover:bg-neutral-800 transition-colors font-medium whitespace-nowrap">
                    {banner.icon}
                    {banner.buttonText}
                  </button>
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
        <div className="flex-1 bg-white arabic-frame flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-2xl md:rounded-none">
          
          {/* Mobile Nav */}
          <nav className="md:hidden border-b border-neutral-100 bg-white sticky top-0 z-40">
            <div className="px-4">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard`, true))} href={`/${lang}/dashboard`}>
                  <LayoutDashboard className="w-[18px] h-[18px]" />
                  <span>Dashboard</span>
                </Link>
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard/upload`))} href={`/${lang}/dashboard/upload`}>
                  <Package className="w-[18px] h-[18px]" />
                  <span>Products</span>
                </Link>
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard/orders`))} href={`/${lang}/dashboard/orders`}>
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  <span>Orders</span>
                </Link>
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard/collections`))} href={`/${lang}/dashboard/collections`}>
                  <FolderClosed className="w-[18px] h-[18px]" />
                  <span>Collections</span>
                </Link>
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard/promotions`))} href={`/${lang}/dashboard/promotions`}>
                  <Tag className="w-[18px] h-[18px]" />
                  <span>Promotions</span>
                </Link>
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard/messages`))} href={`/${lang}/dashboard/messages`}>
                  <MessageSquare className="w-[18px] h-[18px]" />
                  <span>Messages</span>
                </Link>
                <Link className={mobileNavItemClass(isActive(`/${lang}/dashboard/settings`))} href={`/${lang}/dashboard/settings`}>
                  <Settings className="w-[18px] h-[18px]" />
                  <span>Settings</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap border-transparent text-red-500 hover:text-red-700 hover:border-red-200">
                  <LogOut className="w-[18px] h-[18px]" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 bg-neutral-50/50 border-r border-neutral-200 flex-shrink-0 z-30 overflow-hidden">
            <div className="h-full flex flex-col">
              <nav className="flex-1 overflow-y-auto p-4 pt-6 space-y-2">
                
                {/* My Store Group */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => toggleGroup('store')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <div className="flex items-center gap-3 relative">
                      <IconBuildingStore className="w-[20px] h-[20px] text-neutral-500 group-hover:text-neutral-800 transition-colors relative z-10" strokeWidth={1.8} />
                      <span>My Store</span>
                    </div>
                    <IconChevronDown className={`w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${openGroups.store ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroups.store ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 py-1 ml-[21px] border-l border-neutral-200 pl-2 mb-2">
                      <Link className={navItemClass(isActive(`/${lang}/dashboard`, true))} href={`/${lang}/dashboard`}>Dashboard</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/upload`))} href={`/${lang}/dashboard/upload`}>Products</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/orders`))} href={`/${lang}/dashboard/orders`}>Orders</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/collections`))} href={`/${lang}/dashboard/collections`}>Collections</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/promotions`))} href={`/${lang}/dashboard/promotions`}>Promotions</Link>
                    </div>
                  </div>
                </div>

                <Link href={`/${lang}/dashboard/messages`} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isActive(`/${lang}/dashboard/messages`) ? 'bg-primary/10 text-primary' : 'text-neutral-800 hover:bg-neutral-100'}`}>
                  <IconMessage2 className={`w-5 h-5 ${isActive(`/${lang}/dashboard/messages`) ? 'text-primary' : 'text-neutral-500'}`} strokeWidth={1.8} />
                  <span>Messages</span>
                </Link>

                {/* Earnings Group */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => toggleGroup('earnings')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <div className="flex items-center gap-3 relative">
                      <IconWallet className="w-[20px] h-[20px] text-neutral-500 group-hover:text-neutral-800 transition-colors relative z-10" strokeWidth={1.8} />
                      <span>Earnings</span>
                    </div>
                    <IconChevronDown className={`w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${openGroups.earnings ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroups.earnings ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 py-1 ml-[21px] border-l border-neutral-200 pl-2 mb-2">
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/earnings/overview`))} href={`/${lang}/dashboard/earnings/overview`}>Overview</Link>
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/earnings/credits`))} href={`/${lang}/dashboard/earnings/credits`}>Payouts / Credits</Link>
                    </div>
                  </div>
                </div>

                {/* Account Group */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => toggleGroup('account')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <div className="flex items-center gap-3 relative">
                      <IconUser className="w-[20px] h-[20px] text-neutral-500 group-hover:text-neutral-800 transition-colors relative z-10" strokeWidth={1.8} />
                      <span>Account</span>
                    </div>
                    <IconChevronDown className={`w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${openGroups.account ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroups.account ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 py-1 ml-[21px] border-l border-neutral-200 pl-2 mb-2">
                      <Link className={navItemClass(isActive(`/${lang}/dashboard/settings`))} href={`/${lang}/dashboard/settings`}>Settings</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-[13px] transition-colors rounded-md text-red-600 hover:bg-red-50 font-medium">Logout</button>
                    </div>
                  </div>
                </div>

              </nav>

              <div className="p-4 border-t border-neutral-200 mt-auto">
                <Link className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-600 hover:text-black transition-colors rounded-lg hover:bg-neutral-100" href={`/${lang}`}>
                  <ArrowLeft className="w-[18px] h-[18px]" />
                  <span>Back to App</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto bg-[#F9F9F9]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}

