"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    bg: "bg-[#1b0f2b]",
    title: "The world of handmade",
    desc: "Launch your digital storefront in minutes. Empower your craft and connect with a growing community of conscious shoppers across Morocco.",
    descColor: "text-[#F3E2F5]",
    btnText: "Become a seller now",
    image: "/seller.png",
  },
  {
    bg: "bg-[#2d1b4d]",
    title: "Passion into profit",
    desc: "From workshop to doorstep. Share your Moroccan heritage with the world and scale your business with our dedicated artisan dashboard.",
    descColor: "text-[#E8D5E8]",
    btnText: "Open your shop",
    image: "/seller.png",
  },
  {
    bg: "bg-[#1a1a1a]",
    title: "Share your craft",
    desc: "Crafted by you, discovered by many. Start your professional selling journey today and reach buyers from Tangier to Lagouira.",
    descColor: "text-white/80",
    btnText: "Discover more",
    image: "/seller.png",
  },
];

export default function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
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
                      style={{ transform: `translate3d(calc(-${currentSlide * 100}% - ${currentSlide * 24}px), 0px, 0px)` }}
                    >
                      {slides.map((slide, index) => (
                        <div 
                          key={index}
                          role="group" 
                          aria-roledescription="slide" 
                          className="min-w-full shrink-0 grow-0 basis-full h-full will-change-transform transform-gpu"
                        >
                          <div className={`relative ${slide.bg} px-10 lg:px-14 h-full flex items-center overflow-hidden will-change-transform transform-gpu arabic-frame`}>
                            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 w-full">
                              <div className="max-w-xl">
                                <h2 className="text-4xl font-bold leading-[1.05] tracking-tight !text-white sm:text-5xl !font-ariom">
                                  {slide.title}
                                </h2>
                                <p className={`mt-8 max-w-md text-base leading-snug sm:text-lg ${slide.descColor}`}>
                                  {slide.desc}
                                </p>
                                <div className="mt-10">
                                  <button type="button" className="inline-flex items-center justify-center !rounded-full bg-white px-8 py-3 text-sm font-bold text-[#160a23] transition hover:opacity-95 active:opacity-90 sm:text-base">
                                    {slide.btnText}
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-center lg:justify-end h-full w-full">
                                <div className="relative h-72 w-72 lg:h-80 lg:w-80 mx-auto lg:mx-0">
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
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          currentSlide === index ? "bg-white" : "bg-white/20 hover:bg-white/40"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <Link className="h-full block group" href="/landing">
            <div 
              className="overflow-hidden h-full transition-all duration-500 group-hover:scale-[0.99] group-active:scale-[0.97] arabic-frame" 
              style={{ background: "linear-gradient(to bottom, #fef8ec, #f4e9fa)" }}
            >
              <div className="relative flex flex-col h-full pt-10 px-10">
                <p className="text-2xl md:text-3xl font-semibold text-center text-[#673399] !font-ariom">
                  Mobile <br /> Coming Soon
                </p>
                <div className="relative flex-1 flex items-end justify-end mt-8">
                  <div className="relative w-full h-[350px] mx-auto">
                    <Image 
                      alt="Hand" 
                      src="/landing/hands.png"
                      fill
                      className="object-contain object-bottom transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
