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
    <div className="flex flex-col gap-3 mb-8">
      {/* Contact Button */}
      <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1f2937] text-white hover:bg-black transition-colors font-medium text-sm w-full shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
        </svg>
        {contactLabel}
      </button>

      {/* Follow Button */}
      <button 
        onClick={handleToggle}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 transition-colors font-bold text-sm w-full ${
          followed 
            ? 'border-neutral-200 bg-neutral-100 text-[#111827] hover:bg-neutral-200' 
            : 'border-neutral-200 bg-transparent text-[#111827] hover:bg-neutral-50'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={followed ? "#ef4444" : "none"} stroke={followed ? "#ef4444" : "currentColor"} strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {followLabel}
      </button>
    </div>
  );
}
