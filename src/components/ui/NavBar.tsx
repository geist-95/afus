'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getActiveSession, logoutUser, UserSession } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { staticCategories, fetchProducts } from '@/lib/supabase';
import { getFollowedShops, getLastCheckedNotifications, updateLastCheckedNotifications } from '@/lib/followers';
import LoginModal from './LoginModal';

import { 
  IconSearch, 
  IconPlus, 
  IconShoppingBag, 
  IconShoppingCart, 
  IconBuildingStore, 
  IconMessage2, 
  IconLogout, 
  IconKey, 
  IconWorld, 
  IconChevronDown, 
  IconHeart, 
  IconCheck, 
  IconBell 
} from '@tabler/icons-react';

function MagnifyingGlassIcon() { return <IconSearch className="w-4 h-4 text-white" strokeWidth={2.5} />; }
function PlusIcon() { return <IconPlus className="w-5 h-5" strokeWidth={2} />; }
function ShoppingBagIcon() { return <IconShoppingBag className="w-5 h-5" strokeWidth={1.8} />; }
function ShoppingCartIcon() { return <IconShoppingCart className="w-5 h-5" strokeWidth={1.8} />; }
function BriefcaseIcon() { return <IconBuildingStore className="w-5.5 h-5.5" strokeWidth={1.8} />; }
function ChatBubbleLeftRightIcon() { return <IconMessage2 className="w-5.5 h-5.5" strokeWidth={1.8} />; }
function ArrowLeftOnRectangleIcon() { return <IconLogout className="w-4 h-4" strokeWidth={1.8} />; }
function KeyIcon() { return <IconKey className="w-5 h-5" strokeWidth={1.8} />; }
function GlobeAltIcon() { return <IconWorld className="w-4.5 h-4.5 text-black" strokeWidth={1.8} />; }
function ChevronDownIcon() { return <IconChevronDown className="w-3 h-3 text-black/60" strokeWidth={2.5} />; }
function HeartIcon() { return <IconHeart className="w-5 h-5" strokeWidth={1.8} />; }
function CheckIcon() { return <IconCheck className="w-3 h-3 text-black" strokeWidth={3} />; }
function BellIcon() { return <IconBell className="w-5 h-5" strokeWidth={1.8} />; }

interface NavBarProps {
  lang: string;
}

export default function NavBar({ lang }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const langRef = useRef<HTMLDivElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [catCanScrollLeft, setCatCanScrollLeft] = useState(false);
  const [catCanScrollRight, setCatCanScrollRight] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newAlerts, setNewAlerts] = useState<any[]>([]);

  useEffect(() => {
    async function checkNotifications() {
      const followed = getFollowedShops();
      if (followed.length === 0) {
        setNewAlerts([]);
        return;
      }
      const lastCheckedStr = getLastCheckedNotifications();
      const lastChecked = new Date(lastCheckedStr).getTime();
      
      const allProds = await fetchProducts();
      const recent = allProds.filter(p => {
        if (!followed.includes(p.shop_id)) return false;
        const createdAt = new Date(p.created_at).getTime();
        return createdAt > lastChecked;
      });
      setNewAlerts(recent);
    }
    // Only fetch/check if modal is closed so we don't clear alerts while viewing them
    if (!notificationsOpen) {
      checkNotifications();
    }
  }, [pathname, notificationsOpen]);

  const handleOpenNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && newAlerts.length > 0) {
      updateLastCheckedNotifications();
    }
  };

  useEffect(() => {
    async function loadSession() {
      const active = await getActiveSession();
      setSession(active);
      setLoading(false);
    }
    loadSession();
  }, [pathname]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    router.push(`/${lang}`);
  };

  const labels: Record<string, Record<string, string>> = {
    en: {
      searchPlaceholder: 'Search for unique handmade crafts...',
      orders: 'Orders',
      messages: 'Messages',
      login: 'Login',
      signup: 'Sign up',
      list: 'List item',
      dashboard: 'Dashboard',
      logout: 'Logout',
      seller: 'Seller',
      buyer: 'Buyer',
      greeting: 'Hi',
      myShop: 'My Shop',
      cart: 'Cart',
      manageStore: 'Store',
    },
    fr: {
      searchPlaceholder: 'Rechercher des objets artisanaux uniques...',
      orders: 'Commandes',
      messages: 'Messages',
      login: 'Connexion',
      signup: "S'inscrire",
      list: 'Publier',
      dashboard: 'Tableau de bord',
      logout: 'Déconnexion',
      seller: 'Vendeur',
      buyer: 'Acheteur',
      greeting: 'Bonjour',
      myShop: 'Ma Boutique',
      cart: 'Panier',
      manageStore: 'Boutique',
    },
    ar: {
      searchPlaceholder: 'ابحث عن مشغولات يدوية فريدة...',
      orders: 'الطلبات',
      messages: 'الرسائل',
      login: 'دخول',
      signup: 'إنشاء حساب',
      list: 'إضافة منتج',
      dashboard: 'لوحة التحكم',
      logout: 'خروج',
      seller: 'بائع',
      buyer: 'مشتري',
      greeting: 'مرحباً',
      myShop: 'متجري',
      cart: 'السلة',
      manageStore: 'المتجر',
    },
  };

  const t = labels[lang] || labels.en;
  const shortName = session?.full_name?.split(' ')[0] || session?.email?.split('@')[0] || '';

  if (pathname?.startsWith(`/${lang}/dashboard`)) {
    return null;
  }

  return (
    <header className="border-b border-primary/10 bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <img src="/logo/logo.png" alt="Afus Logo" className="w-8 h-8 object-contain !rounded-none" />
          <img src="/logo/afus.svg" alt="afus" className="h-5 object-contain !rounded-none" />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4 hidden sm:block">
          <div className="relative flex items-center">
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              className="w-full border border-neutral-300 rounded-full pl-6 pr-12 py-3 text-sm focus:outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-200/50 placeholder-black/40 bg-white text-black transition-all duration-200 hover:border-neutral-400"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-[#E8583F] text-white rounded-full flex items-center justify-center hover:bg-[#E8583F]/90 transition-colors shadow-sm cursor-pointer">
              <MagnifyingGlassIcon />
            </button>
          </div>
        </div>

        {/* Nav Actions */}
        <nav className="flex items-center gap-4.5 text-xs font-medium flex-shrink-0 text-black">

          {loading ? (
            <div className="h-5 w-20 bg-primary/10 animate-pulse rounded-lg" />
          ) : session ? (
            <>
              {/* Seller Actions */}
              {session.role === 'seller' && (
                <>
                  <Link
                    href={`/${lang}/dashboard/upload`}
                    className="hidden md:flex items-center text-black hover:text-black/80"
                    title={t.list}
                  >
                    <PlusIcon />
                  </Link>
                  {session.shop && (
                    <Link
                      href={`/${lang}/shop/${session.shop.slug}`}
                      className="hidden md:flex items-center text-black/70 hover:text-black"
                      title={t.myShop}
                    >
                      <ShoppingBagIcon />
                    </Link>
                  )}
                </>
              )}

              {/* Shared Links (Icon-only) */}
              <Link
                href={`/${lang}/dashboard`}
                className="hidden sm:flex items-center text-black hover:text-black/80 transition-colors"
                title={t.manageStore}
              >
                <BriefcaseIcon />
              </Link>
              <Link
                href={`/${lang}/inbox`}
                className="hidden sm:flex items-center text-black hover:text-black/80"
                title={t.messages}
              >
                <ChatBubbleLeftRightIcon />
              </Link>

              <Link href={`/${lang}/wishlist`} className="flex items-center text-black hover:text-black/80 relative" title="Saved items">
                <HeartIcon />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Notification Bell */}
              <div className="relative flex items-center" ref={notifRef}>
                <button onClick={handleOpenNotifications} className="flex items-center text-black hover:text-black/80 relative cursor-pointer" title="Notifications">
                  <BellIcon />
                  {newAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E8583F] w-2.5 h-2.5 rounded-full border border-white"></span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-primary/20 rounded-lg shadow-lg z-50 p-2">
                    <div className="px-2 py-2 border-b border-primary/10 text-xs font-bold text-black mb-2">
                      {lang === 'fr' ? 'Alertes' : lang === 'ar' ? 'تنبيهات' : 'Notifications'}
                    </div>
                    {newAlerts.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {newAlerts.map(alert => (
                          <Link 
                            key={alert.id}
                            href={`/${lang}/shop/${alert.shops?.slug || '#'}`}
                            onClick={() => setNotificationsOpen(false)}
                            className="flex items-start gap-3 p-2 hover:bg-neutral-50 rounded-md transition-colors"
                          >
                            <img src={alert.media_gallery?.[0] || 'https://via.placeholder.com/40'} alt="product" className="w-10 h-10 object-cover rounded-md" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-black truncate">{alert.shops?.name || 'A shop'} posted a new product</p>
                              <p className="text-[10px] text-neutral-500 truncate">{alert.title_translations?.[lang as 'en'|'fr'|'ar'] || alert.title_translations?.en}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-neutral-400 text-xs">
                        {lang === 'fr' ? 'Aucune nouvelle alerte.' : lang === 'ar' ? 'لا توجد تنبيهات جديدة.' : 'No new alerts.'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link href={`/${lang}/cart`} className="flex items-center text-black hover:text-black/80 relative" title={t.cart}>
                <ShoppingCartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3.5 bg-warning text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 border border-primary/30 rounded-lg px-3 py-1.5 bg-white hover:bg-primary/5 cursor-pointer text-black"
                >
                  <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center uppercase">
                    {shortName.charAt(0)}
                  </span>
                  <span className="hidden sm:inline max-w-[80px] truncate">{shortName}</span>
                  <span className="text-black/50 text-[10px]">▼</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-primary/20 rounded-lg z-50 p-1">
                    <div className="px-3 py-2 border-b border-primary/10 text-[10px] text-black/60">
                      {t.greeting}, <strong className="text-black">{shortName}</strong>
                    </div>
                    <Link
                      href={`/${lang}/dashboard`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-lg text-black text-[11px]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <BriefcaseIcon />
                      <span>{t.manageStore}</span>
                    </Link>
                    <Link
                      href={`/${lang}/inbox`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-lg text-black text-[11px]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ChatBubbleLeftRightIcon />
                      <span>{t.messages}</span>
                    </Link>
                    {session.role === 'seller' && (
                      <>
                        <Link
                          href={`/${lang}/dashboard/upload`}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-lg text-black text-[11px]"
                          onClick={() => setMenuOpen(false)}
                        >
                          <PlusIcon />
                          <span>{t.list}</span>
                        </Link>
                        {session.shop && (
                          <Link
                            href={`/${lang}/shop/${session.shop.slug}`}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-lg text-black text-[11px]"
                            onClick={() => setMenuOpen(false)}
                          >
                            <ShoppingBagIcon />
                            <span>{t.myShop}</span>
                          </Link>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-warning/10 text-warning font-bold text-[11px] cursor-pointer rounded-lg mt-1"
                    >
                      <ArrowLeftOnRectangleIcon />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/${lang}/seller/onboarding`}
                className="text-black font-bold text-[12px] hover:underline px-2 hidden md:block"
              >
                {lang === 'fr' ? 'Vendre sur afus' : lang === 'ar' ? 'البيع على afus' : 'Sell on afus'}
              </Link>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="bg-primary text-white px-5 py-2 hover:bg-primary/95 font-bold rounded-full transition-colors text-[12px] whitespace-nowrap"
              >
                {t.login}
              </button>
              <Link href={`/${lang}/cart`} className="flex items-center gap-1.5 text-black hover:text-black/80 relative ml-1" title={t.cart}>
                <ShoppingCartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3.5 bg-warning text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="border border-neutral-200 rounded-lg px-3 py-1.5 flex items-center gap-1 bg-white text-xs font-semibold text-black hover:bg-neutral-50 cursor-pointer"
            >
              <GlobeAltIcon />
              <span className="uppercase">{lang}</span>
              <ChevronDownIcon />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1.5 min-w-[6rem] bg-white border border-neutral-200 rounded-md z-50 p-1 flex flex-col gap-0.5 animate-in fade-in-80 duration-100">
                <Link
                  href="/en"
                  onClick={() => setLangOpen(false)}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-7 pr-2.5 text-xs outline-none hover:bg-neutral-100 hover:text-neutral-900 font-semibold ${lang === 'en' ? 'text-black' : 'text-neutral-600'}`}
                >
                  {lang === 'en' && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon />
                    </span>
                  )}
                  EN
                </Link>
                <Link
                  href="/fr"
                  onClick={() => setLangOpen(false)}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-7 pr-2.5 text-xs outline-none hover:bg-neutral-100 hover:text-neutral-900 font-semibold ${lang === 'fr' ? 'text-black' : 'text-neutral-600'}`}
                >
                  {lang === 'fr' && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon />
                    </span>
                  )}
                  FR
                </Link>
                <Link
                  href="/ar"
                  onClick={() => setLangOpen(false)}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-7 pr-2.5 text-xs outline-none hover:bg-neutral-100 hover:text-neutral-900 font-semibold ${lang === 'ar' ? 'text-black' : 'text-neutral-600'}`}
                >
                  {lang === 'ar' && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon />
                    </span>
                  )}
                  AR
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Categories Bar — hidden scrollbar + fade chevron */}
      <div className="border-t border-primary/10 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Left fade + chevron */}
          {catCanScrollLeft && (
            <button
              onClick={() => catScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              className="absolute left-4 top-0 bottom-0 z-10 flex items-center pl-1 pr-4 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-auto"
              aria-label="Scroll categories left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-black/50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Scrollable row — no visible scrollbar */}
          <div
            ref={catScrollRef}
            onScroll={() => {
              const el = catScrollRef.current;
              if (!el) return;
              setCatCanScrollLeft(el.scrollLeft > 4);
              setCatCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
            }}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="w-full py-3 flex items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden min-w-0 text-xs font-semibold text-black"
          >
            {staticCategories.map((cat, index) => [
              <Link
                key={cat.slug}
                href={`/${lang}/category/${cat.slug}`}
                className="hover:text-black/70 transition-colors whitespace-nowrap capitalize flex-shrink-0"
              >
                {cat.name[lang as 'en' | 'fr' | 'ar'] || cat.name.en}
              </Link>,
              index < staticCategories.length - 1 && (
                <span key={`sep-${cat.slug}`} className="text-black/30 select-none text-[10px] flex-shrink-0">
                  ✦
                </span>
              )
            ])}
          </div>

          {/* Right fade + chevron */}
          {catCanScrollRight && (
            <button
              onClick={() => catScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="absolute right-4 top-0 bottom-0 z-10 flex items-center pr-1 pl-4 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-auto"
              aria-label="Scroll categories right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-black/50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} lang={lang} />
    </header>
  );
}
