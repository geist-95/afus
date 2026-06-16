'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageModalProps {
  currentLang: string;
}

export default function LanguageModal({ currentLang }: LanguageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasChosen = localStorage.getItem('languageSelected');
    const updatesSeen = localStorage.getItem('updatesSeen');
    
    if (!hasChosen) {
      setIsOpen(true);
    } else if (!updatesSeen) {
      setShowUpdates(true);
    }
  }, [pathname]);

  const handleSave = () => {
    localStorage.setItem('languageSelected', 'true');
    setIsOpen(false);
    
    if (selectedLang !== currentLang) {
      // Replace the current language in the pathname
      const newPathname = pathname.replace(`/${currentLang}`, `/${selectedLang}`);
      router.push(newPathname || `/${selectedLang}`);
    } else {
      setShowUpdates(true);
    }
  };

  const handleCloseUpdates = () => {
    localStorage.setItem('updatesSeen', 'true');
    setShowUpdates(false);
  };

  if (!isOpen && !showUpdates) return null;

  const updateDict: Record<string, {
    title: string;
    launchInfo: string;
    updatesTitle: string;
    updates: string[];
    buttonText: string;
  }> = {
    en: {
      title: "We are Live! 🚀",
      launchInfo: "We officially launched on June 16th at 16:00 (4:00 PM)!",
      updatesTitle: "Recent updates (June 15th):",
      updates: [
        "Multilanguage support (English, French, Arabic, Tamazight)",
        "Tifinagh script support",
        "Fixed product item creation issues",
        "Fixed merchant onboarding redirection loops",
        "Optimized the initial page loading speed",
        "Enhanced store pages UI layouts"
      ],
      buttonText: "Let's Explore"
    },
    fr: {
      title: "Nous sommes en ligne ! 🚀",
      launchInfo: "Nous avons officiellement lancé le 16-06 à 16h !",
      updatesTitle: "Mises à jour récentes (15-06) :",
      updates: [
        "Support multilingue (français, anglais, arabe, tifinagh)",
        "Support de l'écriture Tifinagh",
        "Correction des problèmes de création d'articles",
        "Correction des redirections d'onboarding",
        "Optimisation du chargement initial de l'application",
        "Amélioration de l'interface de la page boutique"
      ],
      buttonText: "C'est parti !"
    },
    ar: {
      title: "لقد انطلقنا! 🚀",
      launchInfo: "تم الإطلاق الرسمي يوم 16-6 على الساعة 16:00!",
      updatesTitle: "آخر التحديثات (15-06):",
      updates: [
        "دعم لغات متعددة (العربية، الفرنسية، الإنجليزية، التيفيناغ)",
        "دعم خط التيفيناغ الأمازيغي",
        "إصلاح مشاكل إنشاء وإضافة المنتجات",
        "إصلاح توجيه التسجيل للبائعين",
        "تحسين سرعة تحميل التطبيق",
        "تحسين واجهة صفحات المتاجر"
      ],
      buttonText: "اكتشف الآن"
    },
    tz: {
      title: "ⵏⴻⵍⴽⴻⵎ ⴷⵖⵉ! 🚀",
      launchInfo: "ⵏⴻⵍⴽⴻⵎ ⴳ 16-6 ⴳ 16h!",
      updatesTitle: "ⵉⵎⴰⵢⵏⵓⵜⵏ (15-06):",
      updates: [
        "ⵜⵓⵜⵍⴰⵢⵉⵏ ⵜⵉⴳⵓⵜⵉⵏ (ⵜⴰⵎⴰⵣⵉⵖⵜ, ⵜⴰⴼⵔⴰⵏⵙⵉⵙⵜ, ⵜⴰⵏⴳⵍⵉⵣⵜ, ⵜⴰⵄⵔⴰⴱⵜ)",
        "ⵜⵓⵜⵍⴰⵢⵜ ⵜⴰⵎⴰⵣⵉⵖⵜ (ⵜⵉⴼⵉⵏⴰⵖ)",
        "ⴰⵙⴳⴷⵣ ⵏ ⵓⵙⴽⴽⵉⵔ ⵏ ⵜⴼⵉⵍⵉⵏ",
        "ⴰⵙⴳⴷⵣ ⵏ ⵓⵙⵡⵉⵏ ⵏ ⵜⵃⴰⵏⵓⵜ",
        "ⴰⵙⴱⵓⵖⵍⵓ ⵏ ⵓⵣⵎⵣ ⵏ ⵓⴽⵛⵓⵎ",
        "ⵜⵉⵏⴼⵔⵓⵜⵉⵏ ⴳ ⵓⴷⵖⴰⵔ ⵏ ⵜⵃⴰⵏⵓⵜ"
      ],
      buttonText: "ⵔⵣⵓ ⴷⵖⵉ"
    }
  };

  const u = updateDict[selectedLang] || updateDict.en;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
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
                { code: 'ar', label: 'Arabic', native: 'العربية' },
                { code: 'tz', label: 'Tamazight', native: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' }
              ].map((lang) => (
                <div key={lang.code} className="flex flex-col gap-3">
                  {lang.code === 'tz' && <hr className="border-neutral-200 my-1" />}
                  <label 
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
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-black text-sm">{lang.native}</span>
                        {lang.code === 'tz' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">in progress</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">{lang.label}</span>
                  </label>
                </div>
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
      )}

      {showUpdates && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md p-8 flex flex-col gap-6"
            dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}
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
              <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">{u.title}</h2>
              <p className="text-sm font-semibold text-center text-emerald-600 bg-emerald-50 py-2.5 px-3 rounded-xl mt-3">
                {u.launchInfo}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {u.updatesTitle}
              </h3>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                {u.updates.map((update, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span className="leading-snug">{update}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={handleCloseUpdates}
              className="w-full bg-[#532e70] hover:bg-[#532e70]/90 text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-md mt-2"
            >
              {u.buttonText}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
