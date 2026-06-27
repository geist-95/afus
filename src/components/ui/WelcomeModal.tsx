'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check, ChevronDown, MapPin, Truck, Smartphone, ListChecks, ShieldCheck, ShoppingBag, Users, BookOpen, PenTool, HelpCircle, Store } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { joinWaitlist } from "@/app/actions/waitlist";
import { landingTranslations } from '@/components/LandingTranslations';

import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
});

const BrandStar = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 108 110" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M54.1416 0.291992L70.5439 16.6943H92.1592V38.8096L107.913 54.5645L107.991 54.6426L92.1592 70.4746V92.8408H70.5439L54.1416 109.243V109.535L53.9951 109.389L53.8496 109.535V109.243L37.4473 92.8408H15.832V70.4746L0 54.6426L0.078125 54.5645L15.832 38.8096V16.6943H37.4473L53.8496 0.291992V0L53.9951 0.145508L54.1416 0V0.291992Z" />
  </svg>
);

const LABEL_STYLES = [
  { border: "#f1d9c7", star: "#e06a35" },
  { border: "#f3d2c7", star: "#c85527" },
  { border: "#e3c7b3", star: "#77401e" },
  { border: "#e8d9ff", star: "#b38cff" },
  { border: "#F7BFBF", star: "#EB5E5E" },
];

function AutoScrollRow({ labels, reverse, duration = 26, isRtl = false }: { labels: string[], reverse?: boolean, duration?: number, isRtl?: boolean }) {
  const items = [...labels, ...labels];
  const [actualDuration, setActualDuration] = useState(duration);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 640;
      setActualDuration(isMobile ? duration * 0.5 : duration);
    }
  }, [duration]);

  const activeReverse = isRtl ? !reverse : reverse;

  return (
    <div className="relative overflow-hidden py-1" dir="ltr">
      <motion.div
        className="flex w-max gap-3 py-2"
        animate={{ x: activeReverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: actualDuration, repeat: Infinity, ease: "linear" }}
      >
        {items.map((label, i) => {
          const style = LABEL_STYLES[i % LABEL_STYLES.length];
          return (
            <span key={`${label}-${i}`} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-1 text-base sm:text-base md:text-lg font-normal text-neutral-900" style={{ borderWidth: 1, borderStyle: "solid", borderColor: style.border }}>
              <span className="flex h-5 w-5 items-center justify-center" style={{ color: style.star }}>
                <BrandStar className="w-[18px] h-[18px]" />
              </span>
              <span>{label}</span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

interface WelcomeModalProps {
  lang?: string;
}

export default function WelcomeModal({ lang = 'en' }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const t = landingTranslations[lang] || landingTranslations['en'];
  
  const slides = [
    { title: t.features[0].title, desc: t.features[0].desc, image: "/landing/a.png", color: "#be7846" },
    { title: t.features[1].title, desc: t.features[1].desc, image: "/landing/b.png", color: "#ae74e4" },
    { title: t.features[2].title, desc: t.features[2].desc, image: "/landing/dashboard.png", color: "#be7846" },
    { title: t.features[3].title, desc: t.features[3].desc, image: "/landing/d.png", color: "#ae74e4" }
  ];

  const registerText = lang === 'fr' ? "S'inscrire" : lang === 'ar' ? 'إنشاء حساب' : lang === 'tz' ? 'ⵣⵎⵎⴻⵎ' : 'Register';
  const continueText = lang === 'fr' ? "Continuer vers l'app" : lang === 'ar' ? 'متابعة إلى التطبيق' : lang === 'tz' ? 'ⴹⴼⵕ ⵖⵔ ⵜⵙⵏⵙⵉⵜ' : 'Continue to app';

  const langNames: Record<string, string> = {
    en: 'EN',
    fr: 'FR',
    ar: 'AR',
    tz: 'TZ'
  };

  const introText: Record<string, string> = {
    en: "Afus is a 🇲🇦 Moroccan marketplace for artisans and handmade goods.",
    fr: "Afus est une platforme 🇲🇦 marocaine pour les artisans et les produits faits main.",
    ar: "Afus هو سوق 🇲🇦 مغربي للحرفيين والمنتجات المصنوعة يدوياً.",
    tz: "Afus ⵉⴳⴰ ⵢⴰⵏ ⵓⴷⵖⴰⵔ 🇲🇦 ⵏ ⵜⵎⴳⵓⵔⵉ ⵉ ⵉⵎⴳⵓⵔⵉⵢⵏ ⴷ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⴼⵓⵙ."
  };

  const statsText: Record<string, string> = {
    en: "500+ artisans, 12 228 active users / 24h",
    fr: "500+ artisans, 12 228 utilisateurs actifs / 24h",
    ar: "500+ حرفي، 12 228 مستخدم نشط / 24 ساعة",
    tz: "Uggar n 500 imnayn, 12 228 inawen / 24h"
  };

  const descriptionText: Record<string, string> = {
    en: "We connect artisans with those who value their craft, honoring the stories behind every meaningful purchase.",
    fr: "Nous connectons les artisans avec ceux qui valorisent leur art, en honorant les histoires derrière chaque achat porteur de sens.",
    ar: "نربط الحرفيين بأولئك الذين يقدرون براعتهم، ونكرم القصص التي تكمن وراء كل عملية شراء ذات مغزى.",
    tz: "Nsskr assaɣ gr imsnulfutn d wid ittawzn i tazzla nnsn, nqqdr timucuha n kraygat tiɣri tesɛa azuk."
  };

  const newFaq = [
    {
      question: lang === 'fr' ? 'Combien ça coûte de devenir vendeur ?' :
         lang === 'ar' ? 'كم يكلف أن تصبح بائعاً؟' :
         lang === 'tz' ? 'ⵎⵏⵛⴽ ⴰⴷ ⵜⴳⵉⵜ ⴰⵎⵙⵖⴰⵏ?' :
         'How much to be a seller?',
      answer: lang === 'fr' ? "C'est gratuit de créer une boutique et de vendre vos articles, 0% de commission." :
         lang === 'ar' ? 'إنشاء متجر وبيع عناصرك مجاني، بعمولة 0%.' :
         lang === 'tz' ? 'ⴼⴰⴱⵓⵕ ⴰⴷ ⵜⵕⵥⵎⵜ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ, 0% ⵏ ⵜⵖⵔⴰⴷ.' :
         'It is free to create a store and sell your items, 0% commission.'
    },
    {
      question: lang === 'fr' ? "Est-il sûr d'utiliser ma carte de crédit ?" :
         lang === 'ar' ? 'هل من الآمن استخدام بطاقتي الائتمانية؟' :
         lang === 'tz' ? 'ⵉⵙ ⵉⴼⵓⵍⴽⵉ ⴰⴷ ⵙⵅⴷⵎⵖ ⵜⴰⴽⴰⵕⴹⴰ ⵉⵏⵓ ⵏ ⵍⴱⴰⵏⴽⴰ?' :
         'Is it safe to use my credit card?',
      answer: lang === 'fr' ? "Nous n'enregistrons aucune méthode de paiement, tout est payé à la livraison pour le moment." :
         lang === 'ar' ? 'نحن لا نحفظ أي طريقة دفع، كل شيء يكون بالدفع عند الاستلام في الوقت الحالي.' :
         lang === 'tz' ? 'ⵓⵔ ⵏⵃⴹⴰ ⴰⵡⴷ ⴽⵔⴰ ⵏ ⵜⵖⴰⵔⴰⵙⵜ ⵏ ⵓⵙⵅⵍⵚ, ⴽⵓⵍⵛⵉ ⴰⵔ ⵉⵜⵜⵓⵙⵅⵍⴰⵚ ⴳ ⵓⵙⵉⵡⴹ ⵖⵉⵍⴰⴷ.' :
         "We don't save any payment method, everything is cash on delivery for the moment."
    },
    {
      question: lang === 'fr' ? 'Afus est-il uniquement pour les vendeurs professionnels ?' :
         lang === 'ar' ? 'هل Afus مخصص فقط للبائعين المحترفين؟' :
         lang === 'tz' ? 'ⵉⵙ Afus ⵉⵜⵜⵓⵙⴽⴰⵔ ⵖⴰⵙ ⵉ ⵉⵎⵙⵖⴰⵏⵏ ⵉⵎⵙⵡⵓⵔⵉⵢⵏ?' :
         'Is Afus only for professional sellers?',
      answer: lang === 'fr' ? 'Non. Que vous soyez une marque établie ou que vous commenciez tout juste avec quelques pièces faites à la main, vous pouvez ouvrir une boutique et commencer à vendre.' :
         lang === 'ar' ? 'لا. سواء كنت علامة تجارية راسخة أو بدأت للتو ببضع قطع مصنوعة يدوياً، يمكنك فتح متجر والبدء في البيع.' :
         lang === 'tz' ? 'ⵓⵀⵓ. ⵉⴳ ⵜⴳⵉⵜ ⵜⴰⵎⵙⵙⵓⵔⵜ ⵏⵖ ⵜⵙⵙⵏⵜⵉⵜ ⵖⴰⵙ ⵙ ⴽⵔⴰ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ, ⵜⵥⴹⴰⵕⵜ ⴰⴷ ⵜⵕⵥⵎⵜ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ.' :
         'No. Whether you’re an established brand or just starting with a few handmade pieces, you can open a shop and start selling.'
    },
    {
      question: lang === 'fr' ? 'De quoi ai-je besoin pour commencer à vendre ?' :
         lang === 'ar' ? 'ما الذي أحتاجه للبدء في البيع؟' :
         lang === 'tz' ? 'ⵎⴰⵜⵜⴰ ⴰⵢⵍⵍⵉ ⵙⵔⵙ ⵅⵚⵚⴰⵖ ⴰⴼⴰⴷ ⴰⴷ ⵙⵙⵏⵜⵉⵖ ⴰⵙⴳⴷⵣ?' :
         'What do I need to start selling?',
      answer: lang === 'fr' ? "Votre article que vous avez fabriqué, et votre adresse, c'est tout." :
         lang === 'ar' ? 'العنصر الذي صنعته، وعنوانك، هذا كل شيء.' :
         lang === 'tz' ? 'ⵜⴰⵖⴰⵡⵙⴰ ⵍⵍⵉ ⵜⵙⴽⵔⵜ, ⴷ ⵜⵏⵙⴰ ⵏⵏⴽ, ⴱⴰⵔⴰⴽⴰ.' :
         "Your item that you made, and the address of you, that's it."
    }
  ];

  const quickLinks = [
    {
      href: `/${lang}/category/all`,
      icon: <ShoppingBag className="w-5 h-5 text-neutral-600" />,
      title: lang === 'fr' ? 'Boutique' : lang === 'ar' ? 'المتجر' : lang === 'tz' ? 'ⵜⴰⵃⴰⵏⵓⵜ' : 'Shop All'
    },
    {
      href: `/${lang}/artisans`,
      icon: <Users className="w-5 h-5 text-neutral-600" />,
      title: lang === 'fr' ? 'Artisans' : lang === 'ar' ? 'الحرفيون' : lang === 'tz' ? 'ⵉⵎⴳⵓⵔⵉⵢⵏ' : 'Artisans'
    },
    {
      href: `/${lang}/about`,
      icon: <BookOpen className="w-5 h-5 text-neutral-600" />,
      title: lang === 'fr' ? 'À propos' : lang === 'ar' ? 'من نحن' : lang === 'tz' ? 'ⴼⵍⵍⴰⵖ' : 'About Us'
    },
    {
      href: `/${lang}/blog`,
      icon: <PenTool className="w-5 h-5 text-neutral-600" />,
      title: lang === 'fr' ? 'Journal' : lang === 'ar' ? 'المدونة' : lang === 'tz' ? 'ⴰⵖⵎⵉⵙ' : 'Journal'
    },
    {
      href: `/${lang}/help`,
      icon: <HelpCircle className="w-5 h-5 text-neutral-600" />,
      title: lang === 'fr' ? 'Aide & FAQ' : lang === 'ar' ? 'المساعدة' : lang === 'tz' ? 'ⵜⵉⵡⵉⵙⵉ' : 'Help & FAQ'
    },
    {
      href: `/${lang}/sell`,
      icon: <Store className="w-5 h-5 text-neutral-600" />,
      title: lang === 'fr' ? 'Vendre sur Afus' : lang === 'ar' ? 'البيع على Afus' : lang === 'tz' ? 'ⵣⵣⵏⵣ ⴳ Afus' : 'Sell on Afus'
    }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isRelaunch = urlParams.get('relaunch') === 'true';

    const shouldReopen = sessionStorage.getItem('reopenWelcomeModal');
    const hasSeenModal = localStorage.getItem('welcomeModalSeen');

    if (isRelaunch) {
      // Force open, update localStorage, and remove the parameter from URL
      localStorage.removeItem('welcomeModalSeen'); // Reset just in case they close it, it will save it again
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (shouldReopen === 'true') {
      sessionStorage.removeItem('reopenWelcomeModal');
      setIsOpen(true);
    } else if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-welcome-modal', handleOpenModal);
    return () => window.removeEventListener('open-welcome-modal', handleOpenModal);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll and add marker class when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('welcome-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('welcome-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('welcome-modal-open');
    };
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem('welcomeModalSeen', 'true');
    setIsOpen(false);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await joinWaitlist(formData);
      if (result?.error) {
        toast.error(t.hero.error);
      } else if (result?.success || result?.message) {
        toast.success(t.hero.success);
        form.reset();
      }
    } catch (error) {
      toast.error(t.hero.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 animate-in fade-in duration-300">
      <div className="min-h-full flex items-center justify-center p-4 md:p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div 
          className="w-full max-w-xl bg-white relative shadow-2xl flex flex-col arabic-frame overflow-hidden"
        >
          {/* Top Bar */}
        <div className="flex items-start justify-between px-8 pt-6 md:px-10 md:pt-8 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/logo/logo.png" alt="Afus" width={64} height={64} className="w-16 h-16 object-contain" />
          </div>
          
          <div className="flex items-start gap-4">
            <div className="relative" ref={langRef}>
               <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 text-black border border-neutral-200 px-3 py-1.5 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                 <span>{langNames[lang] || 'EN'}</span>
               </button>
               {langOpen && (
                 <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-neutral-200 rounded-md z-50 p-1 shadow-lg">
                    {['en', 'fr', 'ar', 'tz'].map((l) => (
                      <Link 
                        key={l}
                        href={`/${l}`} 
                        onClick={() => {
                          setLangOpen(false);
                          sessionStorage.setItem('reopenWelcomeModal', 'true');
                        }} 
                        className={`relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-8 pr-2 text-xs hover:bg-neutral-100 font-bold ${lang === l ? 'text-black' : 'text-neutral-600'}`}
                      >
                        {lang === l && <span className="absolute left-2 text-[#673399]"><Check className="w-3 h-3" strokeWidth={3} /></span>} 
                        {langNames[l]}
                      </Link>
                    ))}
                 </div>
               )}
            </div>
            <button onClick={handleClose} className="text-neutral-400 hover:text-black bg-neutral-100 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content (Natural Height) */}
        <div className="p-6 md:p-8 flex-1">
           
           {/* Definition */}
           <div className="text-start mb-8 px-2">
             <h2 className="text-3xl sm:text-4xl font-semibold leading-tight sm:leading-tight text-black mb-6 !tracking-[-0.8px] max-w-[92%]" style={{ fontWeight: 600 }}>
               {introText[lang] || introText['en']}
             </h2>
             
             <hr className="border-neutral-200 mb-6" />
             
             <p className="text-neutral-600 leading-relaxed font-medium text-base sm:text-lg mb-6 !tracking-[-0.3px]">
               {descriptionText[lang] || descriptionText['en']}
             </p>

             {/* Temporarily hidden */}
             <div className="hidden items-center gap-2.5 text-base sm:text-lg font-medium text-black">
               <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span>{statsText[lang] || statsText['en']}</span>
             </div>
           </div>

           {/* Actions */}
           <div className="flex flex-row gap-4 mb-10 w-full px-2">
              <button 
                onClick={() => { 
                  handleClose(); 
                  window.dispatchEvent(new CustomEvent('open-auth-modal')); 
                }} 
                className="flex-1 bg-[#372d41] text-white font-bold py-3.5 px-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#372d41]/20"
              >
                {registerText}
              </button>
              <button 
                onClick={handleClose} 
                className="flex-1 bg-neutral-50 border-2 border-black text-black font-bold py-3.5 px-4 rounded-full hover:opacity-80 transition-opacity"
              >
                {continueText}
              </button>
           </div>

           {/* Features Carousel */}
           <div className="arabic-frame bg-neutral-200 p-[1px] mb-12">
             <div className="relative bg-white arabic-frame p-6 text-center h-full">
             
               <div className="relative overflow-hidden w-full" style={{ height: '420px' }}>
               <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                 {slides.map((slide, idx) => (
                   <div key={idx} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-start">
                      <div className="h-[300px] mb-6 relative w-full flex items-center justify-center">
                        <Image src={slide.image} alt={slide.title} width={400} height={300} className="h-full w-auto object-contain" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2" style={{ color: slide.color }}>{slide.title}</h4>
                      <p className="text-sm text-neutral-500 max-w-[280px] mx-auto leading-relaxed">{slide.desc}</p>
                   </div>
                 ))}
               </div>
             </div>

             {/* Controls (Arrows & Dots) */}
             <div className="flex items-center justify-center gap-6 mt-2">
               <button 
                 onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)} 
                 className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-neutral-100 hover:text-black text-neutral-500 transition-colors"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>

               <div className="flex justify-center gap-2">
                  {slides.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveSlide(idx)} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === idx ? 'bg-black w-6' : 'bg-neutral-300'}`} 
                    />
                  ))}
               </div>

               <button 
                 onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)} 
                 className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-neutral-100 hover:text-black text-neutral-500 transition-colors"
               >
                  <ChevronRight className="w-6 h-6" />
               </button>
             </div>
           </div>
         </div>

           {/* And much more */}
           <section className="mb-12">
             <div className="grid grid-cols-2">
               {t.featureItems.map((item: any, i: number) => {
                 const icons = [
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor"><path d="M239.18 91.05A15.75 15.75 0 0 0 224 80h-61l-19.77-60.74a15.93 15.93 0 0 0-30.45-.05L93.06 80H32a16 16 0 0 0-9.37 29l49.46 35.58L53.15 203A15.75 15.75 0 0 0 59 220.88a15.74 15.74 0 0 0 18.77 0L128 184.75l50.23 36.13A16 16 0 0 0 202.85 203l-19-58.46l49.49-35.61a15.74 15.74 0 0 0 5.84-17.88M128 24.15L146.12 80h-36.24ZM32 96h55.87L77.3 128.56Zm36.34 112l17.39-53.59l28.54 20.54Zm22.57-69.57L104.69 96h46.62l13.75 42.38L128 165ZM187.6 208l-45.9-33l28.54-20.54Zm-8.93-79.38L168.13 96H224Z" /></svg>,
                   <MapPin className="h-6 w-6" />,
                   <Truck className="h-6 w-6" />,
                   <Smartphone className="h-6 w-6" />,
                   <ListChecks className="h-6 w-6" />,
                   <ShieldCheck className="h-6 w-6" />
                 ];
                 const icon = icons[i];
                 
                 
                 const borderClasses = `border-neutral-100 ${i < t.featureItems.length - 2 ? 'border-b' : ''} ${i % 2 === 0 ? 'border-r' : ''}`;
                 
                 return (
                   <div key={item.title} className={`flex flex-col items-center text-center p-6 ${borderClasses}`}>
                     <div className="relative flex items-center justify-center h-10 w-10 mb-2">
                       <BrandStar className="absolute inset-0 h-full w-full scale-[1.5] text-[#f3e3d9] opacity-50" />
                       <div className="relative z-10 text-[#997b68]">{icon}</div>
                     </div>
                     <h3 className="text-base font-semibold text-neutral-700 capitalize mt-2">{item.title}</h3>
                     <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
                   </div>
                 );
               })}
             </div>
           </section>

           {/* FAQ */}
           <section className="mb-12">
             <h2 className="mx-auto mb-6 text-2xl font-semibold text-neutral-900 capitalize text-center">{t.faqTitle}</h2>
             <div className="divide-y divide-neutral-200">
               {newFaq.map((faq: any, i: number) => {
                 const isOpen = openFaqIndex === i;
                 return (
                   <details key={faq.question} open={isOpen} className="group py-3" onClick={(e) => { e.preventDefault(); setOpenFaqIndex(isOpen ? null : i); }}>
                     <summary className={`flex cursor-pointer items-center justify-between gap-4 list-none text-base transition-opacity ${isOpen ? "font-semibold text-neutral-900 opacity-100" : "font-medium text-neutral-800 opacity-70"}`}>
                       <span>{faq.question}</span>
                       <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                     </summary>
                     {isOpen && <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>}
                   </details>
                 );
               })}
             </div>
           </section>

           {/* Marketplace built for makers */}
           <section className="mb-12">
             <h2 className="mx-auto mb-6 text-2xl font-semibold text-neutral-900 capitalize text-center">{t.marketplaceBuilt}</h2>
             <div className="space-y-3 -mx-6 md:-mx-8">
               <AutoScrollRow labels={t.labels.row1} reverse={false} duration={20} isRtl={lang === 'ar'} />
               <AutoScrollRow labels={t.labels.row2} reverse={true} duration={35} isRtl={lang === 'ar'} />
               <AutoScrollRow labels={t.labels.row3} reverse={false} duration={30} isRtl={lang === 'ar'} />
             </div>
           </section>

           {/* Instagram Banner */}
           <div className="arabic-frame bg-[#f5e9fb] p-8 mb-10 flex flex-col items-center text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#673399]">
               {lang === 'fr' ? 'Suivez-nous sur Instagram pour les nouveautés' :
                lang === 'ar' ? 'تابعنا على إنستغرام للحصول على التحديثات والأخبار' :
                lang === 'tz' ? 'ⴹⴼⵕⴰⵜ ⴰⵖ ⴳ ⵉⵏⵙⵜⴰⴳⵔⴰⵎ' :
                'Follow us on Instagram for updates & news'}
             </h3>
             <a href="https://instagram.com/afus_ma" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-black text-black hover:bg-black/5 px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2.5 transition-colors w-full sm:w-auto min-w-[200px]">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               @afus_ma
             </a>
           </div>

           {/* Quick Links */}
           <section className="mb-10 px-2 sm:px-6">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-center">
               {quickLinks.map((link, idx) => (
                 <Link 
                   key={idx} 
                   href={link.href}
                   onClick={handleClose}
                   className="text-neutral-900 hover:text-black font-medium transition-colors text-[15px] sm:text-base"
                 >
                   {link.title}
                 </Link>
               ))}
             </div>
           </section>

           <div className="text-center pb-2 text-[13px] text-neutral-400 font-medium">
             © {new Date().getFullYear()} Afus. All rights reserved.
           </div>

        </div>
      </div>
    </div>
  </div>
  );
}
