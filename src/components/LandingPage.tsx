// app/marketing/page.tsx
"use client";

import { landingTranslations } from "./LandingTranslations";
import LanguageModal from "./ui/LanguageModal";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Store,
  MapPin,
  Truck,
  HeartHandshake,
  Smartphone,
  ShieldCheck,
  ListChecks,
} from "lucide-react";
import { IconBrandInstagram } from "@tabler/icons-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { joinWaitlist } from "@/app/actions/waitlist";



import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
});

const BrandStar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 108 110"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M54.1416 0.291992L70.5439 16.6943H92.1592V38.8096L107.913 54.5645L107.991 54.6426L92.1592 70.4746V92.8408H70.5439L54.1416 109.243V109.535L53.9951 109.389L53.8496 109.535V109.243L37.4473 92.8408H15.832V70.4746L0 54.6426L0.078125 54.5645L15.832 38.8096V16.6943H37.4473L53.8496 0.291992V0L53.9951 0.145508L54.1416 0V0.291992Z" />
  </svg>
);

type AutoRowProps = {
  labels: string[];
  reverse?: boolean;
  duration?: number;
};

const LABEL_STYLES = [
  { border: "#f1d9c7", star: "#e06a35" }, // peach
  { border: "#f3d2c7", star: "#c85527" }, // terracotta
  { border: "#e3c7b3", star: "#77401e" }, // brown
  { border: "#e8d9ff", star: "#b38cff" }, // lilac
  { border: "#F7BFBF", star: "#EB5E5E" }, // red
];

function AutoScrollRow({ labels, reverse, duration = 26 }: AutoRowProps) {
  const items = [...labels, ...labels];
  const [actualDuration, setActualDuration] = useState(duration);

  // Detect mobile and speed up
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 640; // sm breakpoint
      setActualDuration(isMobile ? duration * 0.5 : duration);
      // 0.5 = 2x faster. Adjust if needed.
    }
  }, [duration]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-3 py-1"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{
          duration: actualDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {items.map((label, i) => {
          const style = LABEL_STYLES[i % LABEL_STYLES.length];

          return (
            <span
              key={`${label}-${i}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-1 text-base sm:text-base md:text-lg font-normal text-neutral-900"
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: style.border,
              }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center"
                style={{ color: style.star }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 108 110"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M54.1416 0.291992L70.5439 16.6943H92.1592V38.8096L107.913 54.5645L107.991 54.6426L92.1592 70.4746V92.8408H70.5439L54.1416 109.243V109.535L53.9951 109.389L53.8496 109.535V109.243L37.4473 92.8408H15.832V70.4746L0 54.6426L0.078125 54.5645L15.832 38.8096V16.6943H37.4473L53.8496 0.291992V0L53.9951 0.145508L54.1416 0V0.291992Z" />
                </svg>
              </span>

              <span>{label}</span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

const NAV_LINKS = [
  { href: "#manifesto", label: "What", color: "#e06a35" }, // orange
  { href: "#features", label: "Why", color: "#d4b300" }, // yellow
  { href: "#faq", label: "How", color: "#d86adf" }, // pink
];

/* ========= Reveal helpers ========= */

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

function RevealOnScroll({
  children,
  delay = 0,
  className,
}: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ========= Page ========= */

export default function MarketingPage({ lang = 'en' }: { lang?: string }) {
  const t = landingTranslations[lang] || landingTranslations.en;
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [windowHeight, setWindowHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40); // triggers once you start scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Measure window height */
  useEffect(() => {
    const measureWindow = () => {
      setWindowHeight(window.innerHeight);
    };

    measureWindow();
    window.addEventListener("resize", measureWindow);

    return () => window.removeEventListener("resize", measureWindow);
  }, []);

  /* Measure content height (react to images / layout changes) */
  useEffect(() => {
    if (!contentRef.current || typeof ResizeObserver === "undefined") return;

    const el = contentRef.current;

    const observer = new ResizeObserver(() => {
      setContentHeight(el.offsetHeight);
    });

    observer.observe(el);
    setContentHeight(el.offsetHeight);

    return () => observer.disconnect();
  }, []);

  /* Native scroll listener */
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Derived values */

  const heightDocument = (windowHeight || 0) + (contentHeight || 0);
  const bgPosY = 50 - (scrollY * 100) / (heightDocument || 1);

  const heroProgress = Math.min(scrollY / ((windowHeight || 1) * 0.8), 1);
  const heroScale = 1 - heroProgress * 0.15;
  const heroOpacity = Math.max(1 - heroProgress * 1.2, 0);

  const imageOffset = heroProgress * 28;
  const contentOffset = -heroProgress * 20;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#f6f3ec] tracking-tight ">
      <LanguageModal currentLang={lang} />
      <nav
        className={`
    hidden md:block fixed left-1/2 -translate-x-1/2
    z-[9999]          /* ✅ real z-index, above hero */
    pointer-events-none
    top-4 w-full
  `}
      >
        {/* Inner wrapper = actual navbar pill + invisible bottom space */}
        <div
          className={`
      mx-auto  
      flex items-center justify-between
      px-4 sm:px-6 lg:px-8 lg:pr-4 py-3
      transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
      pointer-events-auto
      ${scrolled
              ? "max-w-5xl  bg-white  arabic-frame border border-[#f3e3d9]"
              : "max-w-[1400px] bg-transparent shadow-none rounded-none  border-none "
            }
    `}
          style={{
            marginBottom: "18px", // ✅ invisible space under the navbar
          }}
        >
          {/* Logo / wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo/logo.png"
              alt="Afus"
              width={40}
              height={40}
              className="h-6 w-auto sm:h-8"
              priority
            />
            <Image
              src="/logo/afus.svg"
              alt="Afus"
              width={60}
              height={24}
              className="h-3.5 w-auto sm:h-4"
              priority
            />
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-10 ml-6">
            {t.navLinks.map((item: any) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.href === "#manifesto") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const el = document.querySelector(item.href);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="flex items-center gap-2 text-sm sm:text-base font-medium text-[#341339] hover:opacity-80"
              >
                <span
                  className="flex h-3 w-3 items-center justify-center"
                  style={{ color: item.color }}
                >
                  <BrandStar className="h-2.5 w-2.5" />
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-full bg-[#23102f] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2d183b] transition-colors"
          >
            <span>{t.nav.openApp}</span>
          </Link>
        </div>
      </nav>

      <div
        id="scroll-animate"
        style={{
          overflow: "hidden",
          height: heightDocument || windowHeight || 0,
          position: "relative",
        }}
      >
        <div
          id="scroll-animate-main"
          style={{
            position: "relative",
            width: "100%",
            height: heightDocument || windowHeight || 0,
          }}
        >
          <div
            className="wrapper-parallax shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{
              marginTop: windowHeight,
              marginBottom: 0,
            }}
          >
            {/* ================= HERO ================= */}
            <header
              style={{
                width: "100%",
                height: windowHeight || 0,
                position: "fixed",
                top: 0,
                zIndex: 0,
                backgroundImage: "linear-gradient(to bottom, #FEF8EB, #F5E8FB)",
                backgroundPosition: `50% ${bgPosY}%`,
                backgroundSize: "cover",
              }}
            >
              {/* NAVBAR */}

              {/* Huge Afus.MA */}
              <div
                className="pointer-events-none absolute inset-x-0 top-4 sm:top-18 flex justify-center"
                style={{
                  transform: `scale(${heroScale})`,
                  opacity: heroOpacity,
                  transformOrigin: "center top",
                }}
              >
                <span className="vazirmatn-font select-none text-[22vw] sm:text-[18vw] mt-0 sm:mt-10 font-bold leading-none text-[#E5C0F4]">
                  {lang === 'tz' ? 'ⴰⴼⵓⵙ' : 'آفــوس'}
                </span>
              </div>

              {/* afus.ma */}
              <div
                className="relative z-10 flex h-full items-center"
                style={{
                  transform: `scale(${heroScale})`,
                  opacity: heroOpacity,
                  transformOrigin: "center center",
                }}
              >
                <motion.section
                  className="relative h-full w-full"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
                >
                  {/* Hand + phone anchored near bottom */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center md:inset-0 md:items-center"
                    style={{
                      transform: `translateY(${imageOffset}px)`,
                      transformOrigin: "center bottom",
                    }}
                  >
                    <motion.div
                      className="relative w-full max-w-sm h-[55vh] md:max-w-none md:h-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 3, ease: EASE, delay: 0.15 }}
                    >
                      <Image
                        src="/landing/handspremium2.png"
                        alt="Afus app in hand"
                        fill
                        className="object-contain object-bottom md:object-contain"
                        priority
                      />
                    </motion.div>
                  </div>

                  {/* Foreground text + CTA */}
                  <div
                    className="mt-0 sm:mt-24 relative z-10 mx-auto flex h-full max-w-[90vw] flex-col items-center justify-center gap-10 px-4 pt-24 pb-[34vh] sm:pt-28 sm:pb-[36vh] md:flex-row md:items-center md:justify-end md:gap-12 md:px-8 lg:px-12 md:pb-24"
                    style={{
                      transform: `translateY(${contentOffset}px)`,
                      transformOrigin: "center center",
                    }}
                  >
                    {/* Left block */}
                    <div className="w-full max-w-sm text-center md:flex-1 mt-0 sm:mt-10 ">
                      <motion.div
                        className="mx-auto mb-4 flex items-center justify-center sm:mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
                      >
                        <BrandStar className="h-6 w-6 text-[#C9B6A6] sm:h-6 sm:w-6" />
                      </motion.div>

                      <motion.h1
                        className="text-[2.1rem] sm:text-[2.6rem] md:text-[2.8rem] font-semibold leading-10 sm:leading-[1.15] text-[#1B1124] "
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
                      >
                        {t.hero.title1}
                        <br />
                        {t.hero.title2}
                        <br />
                        {t.hero.title3}{" "}
                        <span
                          className={`${playfair.className} italic font-normal`}
                        >
                          {t.hero.soul}
                        </span>
                      </motion.h1>
                    </div>

                    {/* Spacer center on desktop */}
                    <div className="hidden flex-1 md:block" />

                    {/* Right copy + QR CTA card */}
                    <motion.div
                      className="w-full max-w-xs text-center md:flex-1"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, ease: EASE, delay: 0.4 }}
                    >
                      <p className="text-base sm:text-lg leading-relaxed text-[#1B1124] font-normal mt-0 sm:mt-7 ">
                        <span className="font-semibold text-[#e06a35]">{t.hero.comingSoon}</span>{" "}
                        {t.hero.description}
                      </p>

                      <motion.div
                        className="mt-5 flex justify-center sm:mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                      >
                        <form onSubmit={handleWaitlistSubmit} className="flex w-full max-w-md items-center space-x-2 bg-white rounded-full p-1.5 border border-neutral-200">
                          <input type="email" name="email" placeholder={t.hero.emailPlaceholder} className="flex h-11 w-full bg-transparent px-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none" required />
                          <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center !rounded-full bg-[#23102f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#2d183b] whitespace-nowrap disabled:opacity-70">
                            {isSubmitting ? t.hero.submitting : t.hero.notifyMe}
                          </button>
                        </form>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.section>
              </div>
            </header>

            {/* ================= WHITE SECTION ================= */}
            <section className="content relative z-10" ref={contentRef}>
              <div className="mx-auto container   py-8">
                <div className="arabic-frame max-w-4xl mx-auto">
                  <div className="arabic-frame bg-white pt-16 pb-12 lg:pb-0">
                    <div className="flex flex-col gap-1   pb-10 lg:pb-0 ">
                      {/* Manifesto card */}
                      <RevealOnScroll>
                        <div id="manifesto" className="mx-auto w-full max-w-4xl bg-white pt-10 pb-2 sm:pb-4 sm:pt-12 scroll-mt-32">
                          <div className="mb-10 flex justify-center sm:mb-12">
                            <motion.span
                              className="mt-10 inline-flex items-center rounded-full border border-neutral-200 px-4 py-1.5 text-sm sm:px-5 sm:text-bas e font-normal tracking-tight text-neutral-700"
                              initial={{ opacity: 0, y: 14 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "0px 0px -60px" }}
                              transition={{ duration: 0.6, ease: EASE }}
                            >
                              Our Manifesto
                            </motion.span>
                          </div>

                          <div className="mx-auto max-w-xl px-7 sm:px-0  ">
                            <motion.p
                              className="text-center text-lg sm:text-2xl font-medium leading-relaxed"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "0px 0px -60px" }}
                              transition={{
                                duration: 1.2,
                                ease: EASE,
                                delay: 0.25,
                              }}
                            >
                              {t.manifesto.p1}
                            </motion.p>

                            <motion.p
                              className="mt-6 sm:mt-8 text-center text-lg sm:text-2xl font-medium leading-relaxed tracking-tight"
                              initial={{ opacity: 0, y: 22 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "0px 0px -60px" }}
                              transition={{
                                duration: 1.2,
                                ease: EASE,
                                delay: 0.3,
                              }}
                            >
                              {t.manifesto.p2}
                            </motion.p>

                            <motion.p
                              className="mt-6 sm:mt-8 text-center text-lg sm:text-2xl font-medium leading-relaxed tracking-tight"
                              initial={{ opacity: 0, y: 22 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "0px 0px -60px" }}
                              transition={{
                                duration: 1.2,
                                ease: EASE,
                                delay: 0.34,
                              }}
                            >
                              {t.manifesto.p3}
                            </motion.p>

                            <motion.p
                              className="mt-10 sm:mt-12 text-center text-xl sm:text-2xl font-medium text-neutral-900"
                              initial={{ opacity: 0, y: 22 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "0px 0px -60px" }}
                              transition={{
                                duration: 1.2,
                                ease: EASE,
                                delay: 0.68,
                              }}
                            >
                              <span>{t.manifesto.welcome1}</span>
                              <br className="hidden sm:block" />
                              <span className="sm:ml-0 ml-1">{t.manifesto.welcome2}</span>
                            </motion.p>
                          </div>

                          {/* Creator avatars row */}
                          <motion.div
                            className="my-24 flex flex-col items-center justify-center gap-8 px-4 sm:my-32 sm:flex-row sm:gap-12 md:gap-14"
                            initial={{ opacity: 0, y: 26 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -80px" }}
                            transition={{
                              duration: 0.75,
                              ease: EASE,
                              delay: 0.08,
                            }}
                          >
                            <div className="relative h-40 w-40 overflow-hidden rounded-2xl sm:h-28 sm:w-28 md:h-32 md:w-32">
                              <Image
                                src="/landing/aa.png"
                                alt="Creator 1"
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="relative  h-40 w-40 overflow-hidden rounded-full sm:h-30 sm:w-30">
                              <Image
                                src="/landing/bb.png"
                                alt="Creator 2"
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="relative  h-40 w-40 overflow-hidden rounded-2xl sm:h-28 sm:w-28 md:h-32 md:w-32">
                              <Image
                                src="/landing/3.png"
                                alt="Creator 3"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </motion.div>

                          <div id="features" className="px-4 text-center sm:px-0 scroll-mt-32">
                            <h2 className="mx-auto mb-14 max-w-sm text-3xl sm:text-4xl font-medium text-neutral-900">
                              {t.featuresHeading}
                            </h2>
                          </div>

                          {/* 4 feature cards */}
                          <div className="grid gap-4 px-4 pb-4 sm:px-10 md:grid-cols-2 md:gap-8">
                            {[
                              {
                                title: t.features[0].title,
                                desc: t.features[0].desc,
                                image: "/landing/a.png",
                                placeholder: "Home Feed Image",
                              },
                              {
                                title: t.features[1].title,
                                desc: t.features[1].desc,
                                image: "/landing/b.png",
                                placeholder: "Shop Page Image",
                              },
                              {
                                title: t.features[2].title,
                                desc: t.features[2].desc,
                                image: "/landing/dashboard.png",
                                placeholder: "Product Page Image",
                              },
                              {
                                title: t.features[3].title,
                                desc: t.features[3].desc,
                                image: "/landing/d.png",
                                placeholder: "Contact Sheet Image",
                              },
                            ].map((item, i) => {
                              const titleColor =
                                i % 2 === 0 ? "#be7846" : "#ae74e4";

                              return (
                                <motion.div
                                  key={i}
                                  className="rounded-xl text-left border-2 border-neutral-100"
                                  initial={{ opacity: 0, y: 26 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{
                                    once: true,
                                    margin: "0px 0px -80px",
                                  }}
                                  transition={{
                                    duration: 0.7,
                                    ease: EASE,
                                    delay: 0.05 * i,
                                  }}
                                >
                                  {/* TEXT BLOCK */}
                                  <h3
                                    className="mt-1 text-xl sm:text-2xl font-semibold px-8 pt-8"
                                    style={{ color: titleColor }}
                                  >
                                    {item.title}
                                  </h3>

                                  <p className="max-w-xs mt-2 text-md sm:text-lg font-normal   text-neutral-500 leading-6 sm:leading-7 px-8">
                                    {item.desc}
                                  </p>

                                  {/* IMAGE BLOCK */}
                                  <div className="overflow-hidden rounded-t-xl">
                                    {item.image ? (
                                      <div className="pb-0">
                                        <Image
                                          src={item.image}
                                          alt={item.title}
                                          width={800}
                                          height={600}
                                          className="w-full mx-auto h-auto object-contain rounded-xl"
                                        />
                                      </div>
                                    ) : (
                                      <div className="aspect-[4/3] w-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
                                        {item.placeholder}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* ========= FEATURE LIST SECTION (aligned + no colored bg) ========= */}
                          <RevealOnScroll>
                            <section className="mt-20 px-4 sm:px-6 lg:px-8">
                              <h2 className="mx-auto mb-8 max-w-sm text-3xl sm:text-4xl font-medium text-neutral-900 capitalize text-center">
                                And much more..
                              </h2>

                              <div className="grid grid-cols-1 sm:grid-cols-3">
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
                                  const columns = 3;
                                  const total = t.featureItems.length;

                                  const isLastColumn =
                                    i % columns === columns - 1;
                                  const isLastRow = i >= total - columns;

                                  return (
                                    <div
                                      key={item.title}
                                      className={`
          flex flex-col 
          items-center sm:items-center
          justify-center 
          pt-10 gap-4 px-6 pb-10
          text-center sm:text-center

          ${i !== 0 ? "border-t border-neutral-200 sm:border-t-0" : ""}
          ${!isLastColumn ? "sm:border-r border-neutral-200" : ""}
          ${!isLastRow ? "border-b border-neutral-200" : ""}
        `}
                                    >
                                      {/* Icon with background star */}
                                      <div className="relative flex items-center justify-center h-12 w-12">
                                        <BrandStar className="absolute inset-0 h-full w-full scale-[1.5] text-[#f3e3d9] opacity-50" />
                                        <div className="relative z-10 text-[#997b68]">
                                          {icon}
                                        </div>
                                      </div>

                                      <h3 className="text-lg sm:text-xl font-semibold text-neutral-600 capitalize mt-3">
                                        {item.title}
                                      </h3>

                                      <p className="max-w-xs text-md sm:text-md text-neutral-500 leading-relaxed">
                                        {item.desc}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </section>
                          </RevealOnScroll>

                          {/* ========= FAQ SECTION (Accordion) ========= */}
                          <RevealOnScroll>
                            <section id="faq" className="gap-6 pt-16 sm:pt-20 scroll-mt-32">
                              <h2 className="mx-auto mb-4 max-w-xl text-3xl sm:text-4xl font-medium text-neutral-900 capitalize text-center">
                                {t.faqTitle}
                              </h2>

                              <div className="mt-8 divide-y divide-neutral-200 mx-auto max-w-2xl container px-4 sm:px-6 lg:px-8">
                                {t.faq.map((faq: any, i: number) => {
                                  const isOpen = openIndex === i;

                                  return (
                                    <details
                                      key={faq.question}
                                      open={isOpen}
                                      className="group py-3 sm:py-4"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setOpenIndex(isOpen ? null : i);
                                      }}
                                    >
                                      <summary
                                        className={`
                flex cursor-pointer items-center justify-between gap-4 list-none
                text-lg sm:text-lg
                transition-opacity

                ${isOpen
                                            ? "font-semibold text-neutral-900 opacity-100" /* ACTIVE */
                                            : "font-medium text-neutral-800 opacity-70"
                                          }    /* INACTIVE */
              `}
                                      >
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                      </summary>

                                      <p className="mt-2 max-w-xl text-md sm:text-base text-neutral-700 leading-relaxed">
                                        {faq.answer}
                                      </p>
                                    </details>
                                  );
                                })}
                              </div>
                            </section>
                          </RevealOnScroll>

                          {/* Marketplace + scrolling labels */}
                          <RevealOnScroll>
                            <section className="flex flex-col gap-6 pb-20 pt-16 sm:pt-20 sm:pb-24">
                              <div className="text-center">
                                <h2 className="mx-auto mb-4 max-w-sm text-3xl sm:text-4xl font-medium text-neutral-900 capitalize">
                                  {t.marketplaceBuilt}
                                </h2>
                              </div>

                              <div className="space-y-3">
                                <RevealOnScroll delay={0.02}>
                                  <AutoScrollRow
                                    labels={t.labels.row1}
                                    reverse={false}
                                    duration={20}
                                  />
                                </RevealOnScroll>
                                <RevealOnScroll delay={0.08}>
                                  <AutoScrollRow
                                    labels={t.labels.row2}
                                    reverse={true}
                                    duration={35}
                                  />
                                </RevealOnScroll>
                                <RevealOnScroll delay={0.14}>
                                  <AutoScrollRow
                                    labels={t.labels.row3}
                                    reverse={false}
                                    duration={30}
                                  />
                                </RevealOnScroll>
                              </div>
                            </section>
                          </RevealOnScroll>

                          {/* CTA Banner */}
                          <RevealOnScroll>
                            <div className="arabic-frame bg-[#e5d6ff] p-[1px] mx-2 sm:mx-3 rounded-xl overflow-hidden">
                              <section className="arabic-frame relative overflow-hidden bg-gradient-to-b from-[#F5E8FB] to-[#FEF7EB]">
                                {/* Background image block on the right */}
                                <div className="pointer-events-none absolute inset-0 right-0 flex items-center justify-end">
                                  <div className="relative h-[260px] w-14/12 sm:w-7/12 min-w-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] mr:0 sm:-mr-16">
                                    <Image
                                      src="/landing/caftan.png"
                                      alt="Phone"
                                      fill
                                      className="object-contain object-right"
                                      priority
                                    />
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-20 flex flex-col gap-8 md:flex-row md:items-center">
                                  {/* Left text column */}
                                  <div className="max-w-xl py-6 sm:px-8 sm:py-10 md:px-10 px-6">
                                    <h3 className="text-xl sm:text-4xl font-semibold leading-7 text-neutral-900">
                                      <span className="block">
                                        {t.banner.explore} <br className="block sm:hidden" />
                                        {t.banner.handmade}
                                      </span>

                                      <span
                                        className={`${playfair.className} italic -mt-1 sm:mt-0 block font-serif text-xl sm:text-4xl`}
                                      >
                                        {t.banner.treasures}
                                      </span>
                                    </h3>

                                    <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-neutral-800 sm:block hidden">
                                      {t.banner.desc}
                                    </p>

                                    <div className="mt-6 sm:mt-8">
                                      <form onSubmit={handleWaitlistSubmit} className="flex w-full max-w-md items-center space-x-2 bg-white rounded-full p-1.5 border border-[#e5d6ff]">
                                        <input type="email" name="email" placeholder={t.hero.emailPlaceholder} className="flex h-11 w-full bg-transparent px-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none" required />
                                        <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center !rounded-full bg-[#23102f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#2d183b] whitespace-nowrap disabled:opacity-70">
                                          {isSubmitting ? t.hero.submitting : t.hero.notifyMe}
                                        </button>
                                      </form>
                                    </div>
                                  </div>

                                  {/* Spacer for two-column layout on desktop */}
                                  <div className="hidden flex-1 md:block" />
                                </div>
                              </section>
                            </div>
                          </RevealOnScroll>
                        </div>
                      </RevealOnScroll>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand footer bar */}
              <div style={{ opacity: 1, transform: "none" }}>
                <section className="mt-6 mb-8 px-1 sm:px-0">
                  <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 arabic-frame bg-white px-5 py-4 text-center border border-[#f3e3d9] sm:flex-row sm:gap-0 sm:text-left">
                    <div className="flex items-center gap-3">
                      <p className="text-xs sm:text-sm font-normal text-gray-500">
                        © {new Date().getFullYear()} afus. {t.footer.rights}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[#3b153f]">
                      <button className="inline-flex items-center justify-center rounded-full p-1.5 hover:opacity-80">
                        <IconBrandInstagram className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
              <div className="h-24" /> {/* Extra spacing beneath */}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
