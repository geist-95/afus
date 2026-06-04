'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getActiveSession, logoutUser, UserSession } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { staticCategories } from '@/lib/supabase';
import LoginModal from './LoginModal';

// Outline SVG Icon Components (matching Etsy design style)
function MagnifyingGlassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-white">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function ShoppingCartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5.5 h-5.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0L3.04 4.866A1.5 1.5 0 014.485 3.75h15.03a1.5 1.5 0 011.446 1.116L21.5 9.35" />
    </svg>
  );
}

function ChatBubbleLeftRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5.5 h-5.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.074-.83l1.248-4.99C4.547 13.97 4 12.05 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function ArrowLeftOnRectangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  );
}

function GlobeAltIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4.5 h-4.5 text-black">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-black/60">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-black">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

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
  const [catCanScrollLeft, setCatCanScrollLeft] = useState(false);
  const [catCanScrollRight, setCatCanScrollRight] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const active = await getActiveSession();
      setSession(active);
      setLoading(false);
    }
    loadSession();
  }, [pathname]);

  // Click outside language switcher to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
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
