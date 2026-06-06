'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageModalProps {
  currentLang: string;
}

export default function LanguageModal({ currentLang }: LanguageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasChosen = localStorage.getItem('languageSelected');
    if (!hasChosen) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('languageSelected', 'true');
    setIsOpen(false);
    
    if (selectedLang !== currentLang) {
      // Replace the current language in the pathname
      const newPathname = pathname.replace(`/${currentLang}`, `/${selectedLang}`);
      router.push(newPathname || `/${selectedLang}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      {/* Modal Container with Inverted Corners Effect */}
      <div 
        className="relative w-full max-w-sm p-8 flex flex-col gap-6"
        style={{
          background: `
            radial-gradient(circle at top left, transparent 16px, white 17px) top left,
            radial-gradient(circle at top right, transparent 16px, white 17px) top right,
            radial-gradient(circle at bottom left, transparent 16px, white 17px) bottom left,
            radial-gradient(circle at bottom right, transparent 16px, white 17px) bottom right
          `,
          backgroundSize: '51% 51%',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))'
        }}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-black mb-1">Select Language</h2>
          <p className="text-xs text-neutral-500">Choose your preferred language for Afus.</p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { code: 'en', label: 'English', native: 'English' },
            { code: 'fr', label: 'French', native: 'Français' },
            { code: 'ar', label: 'Arabic', native: 'العربية' }
          ].map((lang) => (
            <label 
              key={lang.code}
              className={`flex items-center justify-between p-3 cursor-pointer border-2 transition-colors ${selectedLang === lang.code ? 'border-[#532e70] bg-[#532e70]/5' : 'border-neutral-200 hover:border-neutral-300'}`}
              style={{
                 borderRadius: '12px'
              }}
            >
              <input 
                type="radio" 
                name="language" 
                value={lang.code} 
                checked={selectedLang === lang.code} 
                onChange={() => setSelectedLang(lang.code)} 
                className="sr-only" 
              />
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLang === lang.code ? 'border-[#532e70]' : 'border-neutral-300'}`}>
                  {selectedLang === lang.code && <div className="w-2.5 h-2.5 bg-[#532e70] rounded-full" />}
                </div>
                <span className="font-semibold text-black text-sm">{lang.native}</span>
              </div>
              <span className="text-xs text-neutral-400">{lang.label}</span>
            </label>
          ))}
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-[#532e70] hover:bg-[#532e70]/90 text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
