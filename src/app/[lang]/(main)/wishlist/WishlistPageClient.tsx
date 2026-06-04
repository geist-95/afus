'use client';

import { useWishlist } from '@/lib/wishlist';
import Link from 'next/link';
import { useState } from 'react';

function HeartFilledIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function HeartOutlineIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

interface WishlistPageClientProps {
  lang: string;
}

export default function WishlistPageClient({ lang }: WishlistPageClientProps) {
  const { items, removeItem } = useWishlist();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      removeItem(id);
      setRemoving(null);
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <HeartOutlineIcon className="w-16 h-16 text-black/20" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-black capitalize">Your Saved Items</h1>
          <p className="text-sm text-black/40">Items you heart will appear here.</p>
        </div>
        <Link
          href={`/${lang}`}
          className="mt-4 bg-black text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-black/80 transition-colors"
        >
          Browse Artisan Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold capitalize">Saved Items</h1>
        <span className="text-sm text-black/40 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group relative border border-black/8 rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
              removing === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Image */}
            <Link href={`/${item.lang || lang}/listing/${item.numeric_id}/${item.slug}`}>
              <div className="aspect-square overflow-hidden bg-neutral-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Remove heart button */}
            <button
              onClick={() => handleRemove(item.id)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-red-500 hover:scale-110 transition-transform duration-150"
              title="Remove from saved"
            >
              <HeartFilledIcon className="w-4 h-4" />
            </button>

            {/* Info */}
            <div className="p-3 space-y-1">
              <Link href={`/${item.lang || lang}/listing/${item.numeric_id}/${item.slug}`}>
                <p className="text-xs font-semibold text-black capitalize leading-tight line-clamp-2 hover:underline">{item.title}</p>
              </Link>
              <p className="text-xs text-black/40 capitalize">{item.shop_name}</p>
              <p className="text-sm font-bold text-black">{item.price_mad} MAD</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
