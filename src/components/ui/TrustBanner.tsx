import React from 'react';
import { IconTruck, IconShieldCheck, IconCashBanknote, IconBuildingStore, IconArrowRight } from '@tabler/icons-react';

interface TrustBannerProps {
  lang: string;
}

export default function TrustBanner({ lang }: TrustBannerProps) {
  const t = {
    en: {
      whyChoose: "Why choose afus",
      title: "Support local\nMoroccan artisans.",
      cta: "Discover",
      cod: "Cash on Delivery",
      codDesc: "Pay when you receive",
      authentic: "100% Authentic",
      authenticDesc: "Verified artisans",
      direct: "Direct from Artisans",
      directDesc: "Fair trade guaranteed",
      delivery: "National Delivery",
      deliveryDesc: "Via Amana Network",
      secure: "Secure Cash on Delivery Network",
    },
    fr: {
      whyChoose: "Pourquoi choisir afus",
      title: "Soutenez les\nartisans marocains.",
      cta: "Découvrir",
      cod: "Paiement à la livraison",
      codDesc: "Payez à réception",
      authentic: "100% Authentique",
      authenticDesc: "Artisans vérifiés",
      direct: "En direct des artisans",
      directDesc: "Commerce équitable garanti",
      delivery: "Livraison Nationale",
      deliveryDesc: "Via le réseau Amana",
      secure: "Réseau de paiement à la livraison sécurisé",
    },
    ar: {
      whyChoose: "لماذا تختار afus",
      title: "ادعم الحرفيين\nالمغاربة المحليين.",
      cta: "اكتشف",
      cod: "الدفع عند الاستلام",
      codDesc: "ادفع عند استلام طلبك",
      authentic: "أصيل 100%",
      authenticDesc: "حرفيون موثوقون",
      direct: "مباشرة من الحرفيين",
      directDesc: "تجارة عادلة مضمونة",
      delivery: "توصيل وطني",
      deliveryDesc: "عبر شبكة أمانة",
      secure: "شبكة الدفع عند الاستلام الآمنة",
    },
    tz: {
      whyChoose: "ⵎⴰⵅⴼ ⴰⴷ ⵜⵙⵜⵉⴷ ⴰⴼⵓⵙ",
      title: "ⴰⵡⵙ ⵉⵎⵙⴽⴰⵔⵏ\nⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⵉⴷⵖⴰⵔⴰⵏⵏ.",
      cta: "ⴰⴼ",
      cod: "ⴰⵙⵖⵏ ⴳ ⵓⵙⵉⵡⴹ",
      codDesc: "ⵙⵖⵏ ⵍⵉⵖ ⵜⴰⵎⵥⴷ",
      authentic: "100% ⴰⵎⴰⴷⴷⴰⵏ",
      authenticDesc: "ⵉⵎⵙⴽⴰⵔⵏ ⵜⵜⵓⵙⵏⵉⴷⵏ",
      direct: "ⵙ ⵓⵙⵔⵉⴷ ⵙⴳ ⵉⵎⵙⴽⴰⵔⵏ",
      directDesc: "ⵜⴰⵙⴱⴱⴰⴱⵜ ⵜⴰⵣⵔⴼⴰⵏⵜ ⵜⵜⵓⵏⴼⵔ",
      delivery: "ⴰⵙⵉⵡⴹ ⴰⵏⴰⵎⵓⵔ",
      deliveryDesc: "ⵙ ⴰⵎⴰⵏⴰ",
      secure: "ⵜⴰⵥⵟⵟⴰ ⵏ ⵓⵙⵖⵏ ⴳ ⵓⵙⵉⵡⴹ ⵉⵏⴼⵔⵏ",
    }
  }[lang] || {
    whyChoose: "Why choose afus",
    title: "Support local\nMoroccan artisans.",
    cta: "Discover",
    cod: "Cash on Delivery",
    codDesc: "Pay when you receive",
    authentic: "100% Authentic",
    authenticDesc: "Verified artisans",
    direct: "Direct from Artisans",
    directDesc: "Fair trade guaranteed",
    delivery: "National Delivery",
    deliveryDesc: "Via Amana Network",
    secure: "Secure Cash on Delivery Network",
  };

  const features = [
    { icon: <IconCashBanknote className="w-5 h-5 text-[#532e71]" />, title: t.cod, desc: t.codDesc },
    { icon: <IconShieldCheck className="w-5 h-5 text-[#532e71]" />, title: t.authentic, desc: t.authenticDesc },
    { icon: <IconBuildingStore className="w-5 h-5 text-[#532e71]" />, title: t.direct, desc: t.directDesc },
    { icon: <IconTruck className="w-5 h-5 text-[#532e71]" />, title: t.delivery, desc: t.deliveryDesc },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 md:mb-[30px]">
        <h2 className="text-xl md:text-3xl font-bold text-start !text-black">{t.whyChoose}</h2>
      </div>
      {/* Main Banner */}
      <div 
        className="w-full h-[160px] ps-10 pe-0 md:ps-16 flex flex-row items-center justify-between relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at top left, transparent 12px, #11061c 13px) top left,
            radial-gradient(circle at top right, transparent 12px, #11061c 13px) top right,
            radial-gradient(circle at bottom left, transparent 12px, #11061c 13px) bottom left,
            radial-gradient(circle at bottom right, transparent 12px, #11061c 13px) bottom right
          `,
          backgroundSize: '51% 51%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Text */}
        <div className="z-10 flex flex-col justify-center text-start min-w-max">
          <h2 className="text-xl md:text-2xl lg:text-3xl !font-ariom font-medium tracking-tight leading-[1.1] !text-[#F5EAFB] whitespace-pre-line">
            {t.title}
          </h2>
        </div>

        {/* CTA Button */}
        <div className="z-10 flex-shrink-0 flex items-center justify-center ps-6 md:ps-10">
          <button className="border border-[#F5EAFB] text-[#F5EAFB] !font-ariom hover:bg-[#F5EAFB] hover:text-[#11061c] transition-all duration-300 rounded-full px-6 py-2.5 text-sm md:text-base whitespace-nowrap flex items-center gap-2">
            {t.cta}
            <IconArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* People Image */}
        <div className="z-10 h-full flex items-end justify-end pe-10 md:pe-16 lg:pe-20 ms-auto">
          <img 
            src="/people.png" 
            alt="Moroccan Artisans" 
            className="h-[120px] md:h-[140px] object-contain object-bottom"
          />
        </div>
      </div>

      {/* Feature Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-4 md:p-5 flex flex-col items-center justify-center text-center gap-2.5 cursor-default"
            style={{
              background: `
                radial-gradient(circle at top left, transparent 12px, #f5eafb 13px) top left,
                radial-gradient(circle at top right, transparent 12px, #f5eafb 13px) top right,
                radial-gradient(circle at bottom left, transparent 12px, #f5eafb 13px) bottom left,
                radial-gradient(circle at bottom right, transparent 12px, #f5eafb 13px) bottom right
              `,
              backgroundSize: '51% 51%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="shrink-0 flex items-center justify-center">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs md:text-sm font-bold !text-[#532e71]">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Secure Payment Footer */}
      <div className="mt-8 flex flex-col items-center">
        <h3 className="text-sm font-bold !text-[#532e71] mb-4">{t.secure}</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 transition-all duration-300">
          <img src="/logo/logo.png" alt="Afus" className="h-6 object-contain" />
          <div className="h-4 w-px bg-neutral-300"></div>
          <img src="/amana.png" alt="Amana" className="h-6 object-contain" />
        </div>
      </div>
    </div>
  );
}
