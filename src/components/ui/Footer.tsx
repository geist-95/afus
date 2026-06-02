'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  lang: string;
}

export default function Footer({ lang }: FooterProps) {
  const pathname = usePathname();
  
  if (pathname?.startsWith(`/${lang}/dashboard`)) {
    return null;
  }

  return (
    <footer className="text-white arabic-frame-top mt-12" style={{ backgroundColor: '#1D0D2C' }}>
      <div className="max-w-[100rem] mx-auto px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-y-8 md:gap-x-20 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                alt="Afus Logo" 
                width={32} 
                height={32} 
                className="h-8 w-auto" 
                src="/icon2.png" 
              />
              <Image 
                alt="Afus Logotype" 
                width={56} 
                height={20} 
                className="h-4 w-auto brightness-0 invert" 
                src="/afus.svg" 
              />
            </div>
            <p className="text-base text-white/80 mb-8 max-w-md">
              Afus est une marketplace de produits artisanaux marocains authentiques. Découvrez des créations faites main ou partagez vos propres créations avec le monde.
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
          
          <div className="md:col-span-1">
            <h3 className="font-bold mb-4 font-ariom">Afus</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/search`}>À propos d'Afus</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/search`}>Comment ça marche</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-bold mb-4 font-ariom">Pour les achats</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/search`}>Rechercher des produits</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/cart`}>Mon panier</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/search?category=sale`}>Meilleures offres</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/orders`}>Mes commandes</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/wishlist`}>Mes favoris</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-bold mb-4 font-ariom">Pour les vendeurs</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/dashboard`}>Devenir vendeur</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/dashboard`}>Tableau de bord</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/dashboard`}>Mes produits</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/dashboard`}>Mes commandes</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-bold mb-4 font-ariom">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/search`}>Aide</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/inbox`}>Nous contacter</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href={`/${lang}/profile`}>Mon compte</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-white/80">
              {new Date().getFullYear()} © Afus. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a className="text-white/80 hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="text-white/80 hover:text-white transition-colors" href="#">Legal</a>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
