'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { staticCategories } from '@/lib/supabase';

// Static list of cities
const citiesList = [
  { slug: "marrakech", names: { en: "Marrakech", fr: "Marrakech", ar: "مراكش", tz: "ⵎⵕⵕⴰⴽⵛ" } },
  { slug: "fes", names: { en: "Fez", fr: "Fès", ar: "فاس", tz: "ⴼⴰⵙ" } },
  { slug: "meknes", names: { en: "Meknes", fr: "Meknès", ar: "مكناس", tz: "ⵎⴽⵏⴰⵙ" } },
  { slug: "rabat", names: { en: "Rabat", fr: "Rabat", ar: "الرباط", tz: "ⵕⴱⴰⵟ" } },
  { slug: "tetouan", names: { en: "Tetouan", fr: "Tétouan", ar: "تطوان", tz: "ⵟⵉⵟⵡⴰⵏ" } },
  { slug: "casablanca", names: { en: "Casablanca", fr: "Casablanca", ar: "الدار البيضاء", tz: "ⴰⵏⴼⴰ" } },
];

interface FooterProps {
  lang: string;
}

export default function Footer({ lang }: FooterProps) {
  const pathname = usePathname();
  
  if (pathname?.startsWith(`/${lang}/dashboard`)) {
    return null;
  }

  const t = {
    en: {
      desc: "Afus is a marketplace for authentic Moroccan artisan products. Discover handmade creations or share your own crafts with the world.",
      afus: "Afus",
      home: "Home",
      about: "About",
      blog: "Blog",
      shopping: "For Shopping",
      cart: "My Cart",
      wishlist: "My Favorites",
      shops: "Shops",
      selling: "For Sellers",
      dashboard: "Dashboard",
      inbox: "Inbox",
      categories: "Categories",
      cities: "Cities",
      rights: "All rights reserved.",
      terms: "Terms of Service",
      legal: "Legal"
    },
    fr: {
      desc: "Afus est une marketplace de produits artisanaux marocains authentiques. Découvrez des créations faites main ou partagez vos propres créations avec le monde.",
      afus: "Afus",
      home: "Accueil",
      about: "À propos",
      blog: "Blog",
      shopping: "Pour les achats",
      cart: "Mon panier",
      wishlist: "Mes favoris",
      shops: "Boutiques",
      selling: "Pour les vendeurs",
      dashboard: "Tableau de bord",
      inbox: "Messagerie",
      categories: "Catégories",
      cities: "Villes",
      rights: "Tous droits réservés.",
      terms: "Conditions d'utilisation",
      legal: "Mentions légales"
    },
    ar: {
      desc: "أفوس هي منصة لمنتجات الصناعة التقليدية المغربية الأصيلة. اكتشف إبداعات يدوية أو شارك منتجاتك مع العالم.",
      afus: "أفوس",
      home: "الرئيسية",
      about: "معلومات عنا",
      blog: "المدونة",
      shopping: "للتسوق",
      cart: "سلة المشتريات",
      wishlist: "المفضلة",
      shops: "المتاجر",
      selling: "للبائعين",
      dashboard: "لوحة التحكم",
      inbox: "الرسائل",
      categories: "الفئات",
      cities: "المدن",
      rights: "جميع الحقوق محفوظة.",
      terms: "شروط الخدمة",
      legal: "قانوني"
    },
    tz: {
      desc: "ⴰⴼⵓⵙ ⵉⴳⴰ ⵢⴰⵜ ⵜⴰⵙⵓⵇⵜ ⵏ ⵜⵉⴳⴰⵡⵉⵏ ⵏ ⵓⴼⵓⵙ ⵜⵉⵎⵖⵔⵉⴱⵉⵢⵉⵏ ⵜⵉⵎⴰⴷⴷⴰⵏⵉⵏ. ⴰⴼ ⵜⵉⴳⴰⵡⵉⵏ ⵜⵉⵎⴰⵢⵏⵓⵜⵉⵏ ⵏⵖ ⴱⴹⵓ ⵜⵉⴳⴰⵡⵉⵏ ⵏⵏⴽ ⴷ ⵓⵎⴰⴹⴰⵍ.",
      afus: "ⴰⴼⵓⵙ",
      home: "ⴰⵙⵏⵓⴱⴳ",
      about: "ⵖⴼ ⴰⴼⵓⵙ",
      blog: "ⴰⴱⵍⵓⴳ",
      shopping: "ⵉ ⵓⵙⵖⵏ",
      cart: "ⵜⴰⵙⴽⵯⵜⵉⵜ ⵉⵏⵓ",
      wishlist: "ⵜⵉⴳⴰⵡⵉⵏ ⵉⵏⵓ",
      shops: "ⵜⵉⵃⴰⵏⵓⵜⵉⵏ",
      selling: "ⵉ ⵉⵎⵣⵣⵏⵣⴰⵏ",
      dashboard: "ⵜⴰⴼⵉⵍⴰⵍⵜ ⵏ ⵓⵙⵏⵇⴷ",
      inbox: "ⵉⵣⵏⴰⵏ",
      categories: "ⵜⴰⴳⴳⴰⵢⵉⵏ",
      cities: "ⵜⵉⵖⵔⵎⵉⵏ",
      rights: "ⴰⴽⴽⵯ ⵉⵣⵔⴼⴰⵏ ⵜⵜⵓⵃⴹⴰⵏ.",
      terms: "ⵜⵉⵙⵖⴰⵍ ⵏ ⵓⵙⵎⵔⵙ",
      legal: "ⴰⵣⵔⴼⴰⵏ"
    }
  };

  const content = t[lang as keyof typeof t] || t.en;

  return (
    <footer className="text-white arabic-frame-top mt-12 relative z-20" style={{ backgroundColor: '#1D0D2C' }}>
      <div className="max-w-[100rem] mx-auto px-6 sm:px-12 pt-28 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-x-12">
          
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                alt="Afus Logo" 
                width={32} 
                height={32} 
                className="h-8 w-auto !rounded-none" 
                src="/logo/logo.png" 
              />
              <Image 
                alt="Afus Logotype" 
                width={56} 
                height={20} 
                className="h-4 w-auto brightness-0 invert !rounded-none" 
                src="/logo/afus.svg" 
              />
            </div>
            <p className="text-base text-white/80 mb-8 max-w-sm">
              {content.desc}
            </p>
            <div className="flex gap-3 mt-8">
              <a target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Instagram" href="https://www.instagram.com/afus_ma/">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram h-4 w-4" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold mb-4 !font-ariom !text-white text-xl">{content.afus}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}`}>{content.home}</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/about`}>{content.about}</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/blog`}>{content.blog}</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/shop`}>{content.shops}</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold mb-4 !font-ariom !text-white text-xl">{content.categories}</h3>
            <ul className="space-y-3 text-sm">
              {staticCategories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/category/${cat.slug}`}>
                    {cat.name[lang as 'en' | 'fr' | 'ar' | 'tz'] || cat.name.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold mb-4 !font-ariom !text-white text-xl">{content.cities}</h3>
            <ul className="space-y-3 text-sm">
              {citiesList.map((city) => (
                <li key={city.slug}>
                  <Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/city/${city.slug}`}>
                    {city.names[lang as 'en' | 'fr' | 'ar' | 'tz'] || city.names.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
        
      <div className="border-t border-white/20">
        <div className="max-w-[100rem] mx-auto px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-white/80">
            {new Date().getFullYear()} © Afus. {content.rights}
          </div>
          <div className="flex gap-4">
            <a className="text-white/80 hover:text-white transition-colors" href="#">{content.terms}</a>
            <a className="text-white/80 hover:text-white transition-colors" href="#">{content.legal}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
