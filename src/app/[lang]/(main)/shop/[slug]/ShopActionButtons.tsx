'use client';

import { useState, useEffect } from 'react';
import { isFollowing, toggleFollow } from '@/lib/followers';

interface ShopActionButtonsProps {
  shopId: string;
  contactLabel: string;
  subscribeLabel: string; // fallback if needed, but we will use Follow logic
  lang: string;
}

export default function ShopActionButtons({ shopId, contactLabel, subscribeLabel, lang }: ShopActionButtonsProps) {
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setFollowed(isFollowing(shopId));
  }, [shopId]);

  const handleToggle = () => {
    const newState = toggleFollow(shopId);
    setFollowed(newState);
  };

  const followLabel = followed 
    ? (lang === 'fr' ? 'Abonné' : lang === 'ar' ? 'متابَع' : 'Following')
    : (lang === 'fr' ? 'S\'abonner' : lang === 'ar' ? 'متابعة' : 'Follow');

  return (
    <div className="flex flex-row gap-3">
      {/* Contact Button */}
      <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-100 transition-colors font-medium text-sm w-full sm:w-auto shadow-sm border border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        {contactLabel}
      </button>

      {/* Follow Button */}
      <button 
        onClick={handleToggle}
        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border transition-colors font-medium text-sm w-full sm:w-auto ${
          followed 
            ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' 
            : 'border-white text-white bg-transparent hover:bg-white/5'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={followed ? "#ef4444" : "none"} stroke={followed ? "#ef4444" : "currentColor"} strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {followLabel}
      </button>
    </div>
  );
}
