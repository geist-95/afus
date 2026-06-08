"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StoreOnboardingModal from "./StoreOnboardingModal";



interface HomeCarouselProps {
  lang: string;
}

export default function HomeCarousel({ lang }: HomeCarouselProps) {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const t = {
    en: {
      openShop: "Open your shop",
      videoTitle: "Turn your craft into a thriving business",
      slides: [
        {
          bg: "bg-[#1b0f2b]",
          title: "The world of handmade",
          desc: "Launch your digital storefront in minutes. Connect with a growing community of conscious shoppers.",
          descColor: "text-[#F3E2F5]",
          btnText: "Become a seller now",
          image: "/seller.png",
          openOnboarding: true,
        },
        {
          bg: "bg-[#381932]",
          title: "Share the love, get rewarded",
          desc: "Invite friends to discover handmade treasures. When they shop, you both earn exclusive rewards!",
          descColor: "text-[#E8D5E8]",
          btnText: "Invite friends",
          image: "/carousel-3.png",
          openOnboarding: false,
        },
        {
          bg: "bg-[#1B2E35]",
          title: "Made for you",
          desc: "Explore bespoke pieces and personalized goods tailored to your unique style and needs.",
          descColor: "text-[#D0E3EA]",
          btnText: "Explore custom items",
          image: "/carousel-4.png",
          openOnboarding: false,
        },
      ]
    },
    fr: {
      openShop: "Ouvrez votre boutique",
      videoTitle: "Transformez votre art en une activité prospère",
      slides: [
        {
          bg: "bg-[#1b0f2b]",
          title: "Le monde du fait main",
          desc: "Lancez votre vitrine numérique en quelques minutes. Connectez-vous à une communauté grandissante.",
          descColor: "text-[#F3E2F5]",
          btnText: "Devenir vendeur",
          image: "/seller.png",
          openOnboarding: true,
        },
        {
          bg: "bg-[#381932]",
          title: "Partagez l'amour, soyez récompensé",
          desc: "Invitez des amis à découvrir des trésors faits main. Gagnez des récompenses exclusives !",
          descColor: "text-[#E8D5E8]",
          btnText: "Inviter des amis",
          image: "/carousel-3.png",
          openOnboarding: false,
        },
        {
          bg: "bg-[#1B2E35]",
          title: "Fait pour vous",
          desc: "Explorez des pièces sur mesure et des produits personnalisés adaptés à votre style.",
          descColor: "text-[#D0E3EA]",
          btnText: "Explorer le sur-mesure",
          image: "/carousel-4.png",
          openOnboarding: false,
        },
      ]
    },
    ar: {
      openShop: "افتح متجرك",
      videoTitle: "حوّل حرفتك إلى عمل مزدهر",
      slides: [
        {
          bg: "bg-[#1b0f2b]",
          title: "عالم الصناعة اليدوية",
          desc: "أطلق واجهة متجرك الرقمية في دقائق. تواصل مع مجتمع متنامٍ من المتسوقين الواعين.",
          descColor: "text-[#F3E2F5]",
          btnText: "كن بائعاً الآن",
          image: "/seller.png",
          openOnboarding: true,
        },
        {
          bg: "bg-[#381932]",
          title: "شارك الحب واحصل على مكافآت",
          desc: "ادعُ الأصدقاء لاكتشاف الكنوز المصنوعة يدوياً. عندما يتسوقون، تكسبون مكافآت حصرية!",
          descColor: "text-[#E8D5E8]",
          btnText: "دعوة الأصدقاء",
          image: "/carousel-3.png",
          openOnboarding: false,
        },
        {
          bg: "bg-[#1B2E35]",
          title: "صُنع من أجلك",
          desc: "استكشف قطعاً مخصصة ومنتجات مصممة خصيصاً لتناسب أسلوبك واحتياجاتك الفريدة.",
          descColor: "text-[#D0E3EA]",
          btnText: "استكشف العناصر المخصصة",
          image: "/carousel-4.png",
          openOnboarding: false,
        },
      ]
    },
    tz: {
      openShop: "ⵕⵥⵎ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ",
      videoTitle: "ⵙⵙⵏⴼⵍ ⵜⴰⵡⵓⵔⵉ ⵏⵏⴽ ⵖⵔ ⵜⴰⵎⵙⵙⵓⴳⵓⵔⵜ ⵉⵎⵓⵔⵙⵏ",
      slides: [
        {
          bg: "bg-[#1b0f2b]",
          title: "ⴰⵎⴰⴹⴰⵍ ⵏ ⵜⵡⵓⵔⵉ ⵏ ⵓⴼⵓⵙ",
          desc: "ⵙⵙⵏⵜⵉ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ ⵜⴰⵎⵓⵟⵟⵓⵏⵜ ⴳ ⵎⵏⵏⴰⵡ ⵜⵓⵙⴷⴰⴷⵉⵏ. ⵎⵓⵏ ⴷ ⵢⴰⵜ ⵜⵔⴰⴱⴱⵓⵜ ⵉⵎⵇⵇⵓⵔⵏ ⵏ ⵉⵎⵙⴰⵖⵏ.",
          descColor: "text-[#F3E2F5]",
          btnText: "ⵓⵖⴰⵍ ⴷ ⴰⵎⵣⵣⵏⵣⵉ ⴷⵖⵉ",
          image: "/seller.png",
          openOnboarding: true,
        },
        {
          bg: "bg-[#381932]",
          title: "ⴱⴹⵓ ⵜⴰⵢⵔⵉ, ⴰⵎⵥ ⵜⵉⵙⵎⵖⵓⵔⵉⵏ",
          desc: "ⵖⵔ ⵉ ⵉⵎⴷⴷⵓⴽⴽⴰⵍ ⴰⴷ ⴰⴼⵉⵏ ⵜⵉⴳⴰⵡⵉⵏ ⵏ ⵓⴼⵓⵙ. ⵎⴽ ⵙⵖⴰⵏ, ⴰⴷ ⵜⴰⵎⵥⵎ ⵜⵉⵙⵎⵖⵓⵔⵉⵏ ⵉⵥⵍⵉⵏ!",
          descColor: "text-[#E8D5E8]",
          btnText: "ⵖⵔ ⵉ ⵉⵎⴷⴷⵓⴽⴽⴰⵍ",
          image: "/carousel-3.png",
          openOnboarding: false,
        },
        {
          bg: "bg-[#1B2E35]",
          title: "ⵉⵜⵜⵓⵙⴽⴰⵔ ⵉ ⴽⵢⵢⵉⵏ",
          desc: "ⵔⵣⵓ ⵅⴼ ⵜⵉⴳⴰⵡⵉⵏ ⵉⵜⵜⵓⵙⴽⴰⵔⵏ ⵙ ⵓⴼⵓⵙ ⵏⵏⴰ ⵉⵎⵙⴰⵙⴰⵏ ⴷ ⵓⵙⵏⵎⵉⵍⵉ ⵏⵏⴽ.",
          descColor: "text-[#D0E3EA]",
          btnText: "ⵔⵣⵓ ⵜⵉⴳⴰⵡⵉⵏ ⵏⵏⴽ",
          image: "/carousel-4.png",
          openOnboarding: false,
        },
      ]
    }
  };

  const content = t[lang as keyof typeof t] || t.en;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="hidden md:block relative w-full h-[476px] bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid md:grid-cols-3 gap-6 items-stretch h-full">
            <div className="md:col-span-2 h-full">
              <section className="w-full h-full">
                <div className="mx-auto w-full h-full max-w-7xl">
                  <div className="relative w-full h-full flex flex-col" role="region" aria-roledescription="carousel">
                    <div className="overflow-hidden h-full">
                      <div
                        className="flex h-full transition-transform duration-[800ms] ease-in-out gap-6"
                        style={{ transform: `translate3d(calc(${lang === 'ar' ? '' : '-'}${currentSlide * 100}% ${lang === 'ar' ? '+' : '-'} ${currentSlide * 24}px), 0px, 0px)` }}
                      >
                        {content.slides.map((slide, index) => (
                          <div
                            key={index}
                            role="group"
                            aria-roledescription="slide"
                            className="min-w-full shrink-0 grow-0 basis-full h-full will-change-transform transform-gpu"
                          >
                            <div className={`relative ${slide.bg} px-10 lg:px-14 h-full flex items-center overflow-hidden will-change-transform transform-gpu arabic-frame`}>
                              <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16 w-full">
                                <div className="max-w-2xl lg:col-span-3">
                                  <h2 className="text-4xl font-bold leading-[1.05] tracking-tight !text-white sm:text-5xl !font-ariom">
                                    {slide.title}
                                  </h2>
                                  <p className={`mt-4 max-w-xs text-sm leading-snug sm:text-base font-medium ${slide.descColor}`}>
                                    {slide.desc}
                                  </p>
                                  <div className="mt-10">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (slide.openOnboarding) setOnboardingOpen(true);
                                      }}
                                      className="inline-flex items-center justify-center !rounded-full bg-white px-8 py-3 text-sm font-bold text-[#160a23] transition hover:opacity-95 active:opacity-90 sm:text-base"
                                    >
                                      {slide.btnText}
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center w-full flex-1 min-h-0 lg:col-span-2">
                                  <div className="relative h-[280px] w-[280px] mx-auto">
                                    <Image
                                      alt="Seller"
                                      src={slide.image}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 w-32 z-20">
                      {content.slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${currentSlide === index ? "bg-white" : "bg-white/20 hover:bg-white/40"
                            }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column: Video Section */}
            <div className="h-full block group text-start">
              <div className="relative w-full h-full arabic-frame overflow-hidden">
                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#11061c]/95 via-[#2d1b4d]/50 to-transparent z-10 pointer-events-none" />

                <video
                  src="/video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 pb-8">
                  <div className="flex flex-col w-full">
                    <div>
                      <h2 className="text-3xl font-bold leading-[1.05] tracking-tight !text-white !font-ariom">
                        {content.videoTitle}
                      </h2>
                    </div>
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                      <div className="overflow-hidden">
                        <div className="pt-4 shrink-0 transform transition-all duration-500 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                          <button
                            type="button"
                            onClick={() => setOnboardingOpen(true)}
                            className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#160a23] transition-[opacity,transform] hover:opacity-95 active:opacity-90 shadow-lg"
                          >
                            {content.openShop}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hero CTA */}
      <div className="md:hidden bg-[#1b0f2b] py-10 px-6 text-center arabic-frame">
        <h2 className="text-2xl font-bold text-white !font-ariom">{content.videoTitle}</h2>
        <button
          onClick={() => setOnboardingOpen(true)}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#160a23] transition hover:opacity-95"
        >
          {content.openShop}
        </button>
      </div>

      <StoreOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        lang={lang}
      />
    </>
  );
}
