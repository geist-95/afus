'use client';

import { useState, useEffect } from 'react';
import { isFollowing, toggleFollow } from '@/lib/followers';

interface ShopActionButtonsProps {
  shopId: string;
  contactLabel: string;
  subscribeLabel: string;
  lang: string;
  variant?: 'desktop' | 'mobile';
}

export default function ShopActionButtons({ shopId, contactLabel, subscribeLabel, lang, variant = 'desktop' }: ShopActionButtonsProps) {
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

  if (variant === 'mobile') {
    return (
      <div className="flex flex-row gap-2">
        {/* Contact Button */}
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-800">
            <path fillRule="evenodd" d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997zM12 7.5a.75.75 0 100 1.5h.008a.75.75 0 100-1.5H12zm-3 0a.75.75 0 100 1.5h.008a.75.75 0 100-1.5H9zm6 0a.75.75 0 100 1.5h.008a.75.75 0 100-1.5H15z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Follow Button */}
        <button 
          onClick={handleToggle}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={followed ? "#ef4444" : "none"} stroke={followed ? "#ef4444" : "currentColor"} strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-3">
      {/* Contact Button */}
      <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#493b54] text-white border border-[#493b54] hover:opacity-90 transition-opacity font-medium text-sm w-full sm:w-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        {contactLabel}
      </button>

      {/* Follow Button */}
      <button 
        onClick={handleToggle}
        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border transition-colors font-medium text-sm w-full sm:w-auto ${
          followed 
            ? 'border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200' 
            : 'border-neutral-200 text-neutral-800 bg-transparent hover:bg-neutral-50'
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
