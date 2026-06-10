'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconLock, 
  IconBuildingStore, 
  IconPlus, 
  IconShoppingCart, 
  IconFolder, 
  IconArrowRight, 
  IconUserCheck,
  IconBrandInstagram
} from "@tabler/icons-react";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const targetDate = new Date('2026-06-10T20:00:00+01:00').getTime();

export default function BetaAccessPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || "en";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCountdownOver, setIsCountdownOver] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [introIndex, setIntroIndex] = useState(0);
  
  const introSequence = ["Welcome", "مرحباً", "Bienvenue", "ⴰⵏⵚⵓⴼ"];

  // Use useMemo or static array outside component to prevent infinite effect triggers
  useEffect(() => {
    if (!showIntro) return;
    
    if (introIndex < introSequence.length - 1) {
      const timer = setTimeout(() => {
        setIntroIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [introIndex, showIntro]);

  useEffect(() => {
    setMounted(true);
    const savedUnlock = localStorage.getItem("afus_beta_unlocked");
    if (savedUnlock === "true") {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setIsCountdownOver(true);
        return false;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      setIsCountdownOver(false);
      return true;
    };

    const keepGoing = calculateTimeLeft();
    if (!keepGoing) return;

    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0173") {
      setIsUnlocked(true);
      setError("");
      localStorage.setItem("afus_beta_unlocked", "true");
      document.cookie = "afus_beta_unlocked=true; path=/; max-age=31536000";
    } else {
      setError(
        lang === "fr" 
          ? "Code incorrect. Veuillez vérifier votre invitation." 
          : lang === "ar" 
            ? "الرمز غير صحيح. يرجى التحقق من دعوتك." 
            : lang === "tz"
              ? "ⵜⴰⵏⴳⴰⵍⵜ ⵓⵔ ⵜⵎⵓⵛⵛⴰ. ⵎⴽ ⵜⵓⴼⵉⴷ ⵥⵕ ⵜⴰⴱⵔⴰⵜ ⵏ ⵜⵖⵓⵔⵉ ⵏⵏⴽ."
              : "Incorrect code. Please check your invitation email."
      );
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem("afus_beta_unlocked");
    document.cookie = "afus_beta_unlocked=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const t = {
    en: {
      lockedTitle: "Closed Beta Access",
      lockedSubtitle: "Welcome to the exclusive closed beta of afus. You have been selected to help us test the future of Moroccan artisanal commerce.",
      passwordLabel: "Enter Invitation Code",
      placeholder: "Enter code...",
      unlockBtn: "Verify Invitation",
      unlockedTitle: "Welcome to afus Closed Beta",
      unlockedSubtitle: "Thank you for joining our testing team! Please try the following flows and tasks to help us verify the platform functionality:",
      logoutBtn: "Lock Access",
      tasks: {
        store: {
          title: "1. Create & Customize Your Store",
          desc: "Go to your dashboard, create a seller profile, set your home city (Marrakech, Fez, etc.), and customize your store banner & logo.",
          action: "Setup Store"
        },
        product: {
          title: "2. Create and List a Product",
          desc: "Upload a new listing. Add a translated title, description, base price in MAD, and upload product images.",
          action: "Upload Product"
        },
        order: {
          title: "3. Complete Cash on Delivery Checkout",
          desc: "Browse other artisan stores or products from the home catalog, add items to your cart, and simulate a COD checkout.",
          action: "Browse Products"
        },
        collections: {
          title: "4. Build Curated Collections",
          desc: "Organize your newly created products into thematic collections on your dashboard to customize your storefront.",
          action: "Create Collections"
        }
      }
    },
    fr: {
      lockedTitle: "Accès Bêta Fermée",
      lockedSubtitle: "Bienvenue dans la bêta fermée exclusive d'afus. Vous avez été invité à nous aider à tester l'avenir du commerce artisanal marocain.",
      passwordLabel: "Entrez le Code d'Invitation",
      placeholder: "Entrez le code...",
      unlockBtn: "Vérifier l'Invitation",
      unlockedTitle: "Bienvenue dans la Bêta d'afus",
      unlockedSubtitle: "Merci de rejoindre notre équipe de testeurs ! Veuillez essayer les flux et tâches suivants pour nous aider à valider la plateforme :",
      logoutBtn: "Verrouiller l'Accès",
      tasks: {
        store: {
          title: "1. Créer & Personnaliser Votre Boutique",
          desc: "Allez sur votre tableau de bord, créez un profil vendeur, définissez votre ville d'origine (Marrakech, Fès, etc.) et personnalisez votre bannière.",
          action: "Configurer Boutique"
        },
        product: {
          title: "2. Créer et Publier un Produit",
          desc: "Ajoutez une nouvelle annonce. Renseignez le titre traduit, la description, le prix de base en MAD et importez des photos.",
          action: "Créer Produit"
        },
        order: {
          title: "3. Passer une Commande en Paiement à la Livraison",
          desc: "Explorez les boutiques d'artisans, ajoutez des articles au panier et simulez un paiement à la livraison (COD) sécurisé.",
          action: "Parcourir Produits"
        },
        collections: {
          title: "4. Organiser en Collections",
          desc: "Regroupez vos produits dans des collections thématiques depuis votre tableau de bord pour embellir votre vitrine.",
          action: "Créer Collections"
        }
      }
    },
    ar: {
      lockedTitle: "الولوج إلى النسخة التجريبية المغلقة",
      lockedSubtitle: "مرحبًا بك في النسخة التجريبية المغلقة الحصرية لمنصة أفوس. تم اختيارك لمساعدتنا في اختبار مستقبل التجارة الحرفية المغربية.",
      passwordLabel: "أدخل رمز الدعوة",
      placeholder: "أدخل الرمز...",
      unlockBtn: "التحقق من الدعوة",
      unlockedTitle: "مرحبًا بك في نسخة أفوس التجريبية",
      unlockedSubtitle: "شكرًا لانضمامك إلى فريق الاختبار لدينا! يرجى تجربة العمليات والمهام التالية لمساعدتنا في التحقق من وظائف المنصة:",
      logoutBtn: "قفل الدخول",
      tasks: {
        store: {
          title: "1. إنشاء وتخصيص متجرك",
          desc: "انتقل إلى لوحة التحكم الخاصة بك، وأنشئ ملف تعريف البائع، وحدد مدينتك (مربع، فاس، إلخ)، وخصص شعار وغلاف متجرك.",
          action: "إعداد المتجر"
        },
        product: {
          title: "2. إضافة وعرض منتج جديد",
          desc: "قم برفع منتج جديد. أضف عنوانًا ووصفًا مترجمين، والسعر الأساسي بالدرهم المغربي، وقم بتحميل صور المنتج.",
          action: "رفع منتج"
        },
        order: {
          title: "3. إتمام طلب الدفع عند الاستلام",
          desc: "تصفح المتاجر أو المنتجات الحرفية الأخرى، وأضف سلعًا إلى سلتك، وقم بمحاكاة الدفع عند الاستلام.",
          action: "تصفح المنتجات"
        },
        collections: {
          title: "4. بناء مجموعات مخصصة",
          desc: "نظم منتجاتك الجديدة في مجموعات موضوعية على لوحة التحكم لتخصيص واجهة متجرك.",
          action: "إنشاء مجموعات"
        }
      }
    },
    tz: {
      lockedTitle: "ⴰⴽⵛⵛⵓⵎ ⵙ ⴱⵉⵟⴰ",
      lockedSubtitle: "ⴰⵏⵚⵓⴼ ⵢⵉⵡⵏ ⵙ ⴱⵉⵟⴰ ⵏ ⴰⴼⵓⵙ. ⵜⴻⵜⵜⵓⵙⵜⴰⵢⵎ ⴰⴼⴰⴷ ⴰⴷ ⴰⵖ ⵜⴰⵡⵙⵎ ⴳ ⵓⵙⴰⵔⵎ ⵏ ⵉⵎⴰⵍ ⵏ ⵜⵙⴱⴱⴰⴱⵜ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ.",
      passwordLabel: "ⵙⴽⵛⵎ ⵜⴰⵏⴳⴰⵍⵜ ⵏ ⵜⵖⵓⵔⵉ",
      placeholder: "ⵙⴽⵛⵎ ⵜⴰⵏⴳⴰⵍⵜ...",
      unlockBtn: "ⵙⵉⵙⵙⵏ ⵜⴰⵖⵓⵔⵉ",
      unlockedTitle: "ⴰⵏⵚⵓⴼ ⵢⵉⵡⵏ ⵙ ⴱⵉⵟⴰ ⵏ ⴰⴼⵓⵙ",
      unlockedSubtitle: "ⵜⴰⵏⵎⵎⵉⵔⵜ ⵏⵏⵡⵏ ⴰⵛⴽⵓ ⵜⴷⵔⴰⵎ ⴷⵉⵖ! ⵎⴽ ⵜⵓⴼⵉⴷ ⴰⵔⵎⵎ ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⴰⴷ ⴰⴼⴰⴷ ⴰⴷ ⵏⵥⵕ ⵉⵙ ⵜⵙⵡⵓⵔⵉ ⵜⵎⵙⵙⵉⵔⵜ ⵎⵣⵢⴰⵏ:",
      logoutBtn: "ⵇⵇⵏ ⴰⴽⵛⵛⵓⵎ",
      tasks: {
        store: {
          title: "1. ⵙⵏⴼⵍⵓⵍ ⴷ ⵙⵎⵓⵜⵜⴳ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ",
          desc: "ⴷⴷⵓ ⵙ ⵜⴼⵉⵏⴰⵖ, ⵙⴽⵔ ⴰⵎⵓⵖ ⵏ ⵓⵎⵙⵏⵣⵉ, ⵙⵜⵉ ⵜⵉⵖⵔⵎⵜ ⵏⵏⴽ, ⴷ ⵙⵎⵓⵜⵜⴳ ⵜⴰⵏⵉⵜ ⵏ ⵜⵃⴰⵏⵓⵜ ⵏⵏⴽ.",
          action: "ⵙⵎⵓⵜⵜⴳ ⵜⴰⵃⴰⵏⵓⵜ"
        },
        product: {
          title: "2. ⵙⵏⴼⵍⵓⵍ ⴷ ⵙⵔⵙ ⴰⴼⴰⵔⵉⵙ",
          desc: "ⵙⵔⵙ ⴰⴼⴰⵔⵉⵙ ⴰⵎⴰⵢⵏⵓ. ⵔⵏⵓ ⴰⵣⵡⵍ, ⴰⴳⵍⴰⵎ, ⴰⵜⵉⴳ ⵙ ⴷⵔⵀⵎ, ⴷ ⵜⵡⵍⴰⴼⵉⵏ ⵏ ⵓⴼⴰⵔⵉⵙ.",
          action: "ⵙⵔⵙ ⴰⴼⴰⵔⵉⵙ"
        },
        order: {
          title: "3. ⵙⵎⴷ ⵜⴰⵖⵜⵙⵜ ⵏ ⵜⵖⵔⴰⴷ",
          desc: "ⵥⵕ ⵜⵉⵃⵓⵏⴰ ⵢⴰⴹⵏ, ⵔⵏⵓ ⵉⴼⴰⵔⵉⵙⵏ ⵙ ⵜⴽⵔⵔⵓⵙⵜ ⵏⵏⴽ, ⴷ ⵙⴽⵔ ⵜⴰⵖⵜⵙⵜ ⵏ ⵜⵖⵔⴰⴷ.",
          action: "ⵥⵕ ⵉⴼⴰⵔⵉⵙⵏ"
        },
        collections: {
          title: "4. ⵙⴽⵔ ⵜⵉⴳⵔⵓⵎⵎⴰⵡⵉⵏ",
          desc: "ⵙⵎⵓⵏ ⵉⴼⴰⵔⵉⵙⵏ ⵏⵏⴽ ⴳ ⵜⴳⵔⵓⵎⵎⴰⵡⵉⵏ ⴰⴼⴰⴷ ⴰⴷ ⵜⵙⵎⵓⵜⵜⴳⴷ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ.",
          action: "ⵙⴽⵔ ⵜⵉⴳⵔⵓⵎⵎⴰⵡⵉⵏ"
        }
      }
    }
  }[lang as "en" | "fr" | "ar" | "tz"] || {
    lockedTitle: "Closed Beta Access",
    lockedSubtitle: "Welcome to the exclusive closed beta of afus. You have been selected to help us test the future of Moroccan artisanal commerce.",
    passwordLabel: "Enter Invitation Code",
    placeholder: "Enter code...",
    unlockBtn: "Verify Invitation",
    unlockedTitle: "Welcome to afus Closed Beta",
    unlockedSubtitle: "Thank you for joining our testing team! Please try the following flows and tasks to help us verify the platform functionality:",
    logoutBtn: "Lock Access",
    tasks: {
      store: {
        title: "1. Create & Customize Your Store",
        desc: "Go to your dashboard, create a seller profile, set your home city (Marrakech, Fez, etc.), and customize your store banner & logo.",
        action: "Setup Store"
      },
      product: {
        title: "2. Create and List a Product",
        desc: "Upload a new listing. Add a translated title, description, base price in MAD, and upload product images.",
        action: "Upload Product"
      },
      order: {
        title: "3. Complete Cash on Delivery Checkout",
        desc: "Browse other artisan stores or products from the home catalog, add items to your cart, and simulate a COD checkout.",
        action: "Browse Products"
      },
      collections: {
        title: "4. Build Curated Collections",
        desc: "Organize your newly created products into thematic collections on your dashboard to customize your storefront.",
        action: "Create Collections"
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3defd] to-[#fdf7eb] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#200a2a]"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={introIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="!text-white text-7xl md:text-[10rem] font-bold font-serif !font-ariom tracking-wider drop-shadow-md"
              >
                {introSequence[introIndex]}
              </motion.h1>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!isUnlocked ? (
        /* LOCKED STATE */
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden arabic-frame">
          <div className="p-8 text-center bg-[#200a2a] relative">
            <div className="mx-auto flex items-center justify-center mb-4">
              <img src="/logo/logo.png" alt="Afus Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif !font-ariom tracking-wide !text-[#f5deb3]" style={{ color: '#f5deb3' }}>
              {t.lockedTitle}
            </h1>
            <p className="mt-4 text-sm md:text-base leading-relaxed max-w-sm mx-auto !text-[#f5deb3]/90" style={{ color: 'rgba(245, 222, 179, 0.9)' }}>
              {t.lockedSubtitle}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {!mounted ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-[#23102f]/20 border-t-[#23102f] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {!isCountdownOver ? (
                  <div className="space-y-6">
                    <p className="text-center text-sm font-bold uppercase tracking-widest text-[#200a2a]">
                      {lang === 'fr' ? 'Lancement dans' : lang === 'ar' ? 'الإنطلاق خلال' : lang === 'tz' ? 'ⴰⴱⴰⵔⵓⵢ ⴳ' : 'Launching in'}
                    </p>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                        <span className="block text-3xl font-extrabold text-[#200a2a]">{timeLeft.days}</span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">{lang === 'fr' ? 'Jours' : lang === 'ar' ? 'أيام' : 'Days'}</span>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                        <span className="block text-3xl font-extrabold text-[#200a2a]">{timeLeft.hours}</span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">{lang === 'fr' ? 'Heures' : lang === 'ar' ? 'ساعات' : 'Hours'}</span>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                        <span className="block text-3xl font-extrabold text-[#200a2a]">{timeLeft.minutes}</span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">{lang === 'fr' ? 'Min' : lang === 'ar' ? 'دقائق' : 'Min'}</span>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                        <span className="block text-3xl font-extrabold text-[#200a2a]">{timeLeft.seconds}</span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">{lang === 'fr' ? 'Sec' : lang === 'ar' ? 'ثواني' : 'Sec'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUnlock} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-neutral-700 font-bold text-sm block">
                        {t.passwordLabel}
                      </label>
                      <input
                        type="password"
                        required
                        placeholder={t.placeholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-neutral-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#200a2a] rounded-lg text-center text-lg tracking-wider"
                      />
                      {error && (
                        <p className="text-red-600 text-xs font-semibold text-center mt-2">
                          ⚠️ {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#200a2a] hover:bg-[#3d0f2b] text-white text-sm py-3.5 rounded-full font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <IconUserCheck className="w-5 h-5" />
                      {t.unlockBtn}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* UNLOCKED STATE */
        <div className="w-full max-w-4xl bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 md:p-12 space-y-10 arabic-frame">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-100 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-[#200a2a]">
                {t.unlockedTitle}
              </h1>
              <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                {t.unlockedSubtitle}
              </p>
            </div>
            <button
              onClick={handleLock}
              className="px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-50 hover:text-black font-semibold text-xs rounded-lg uppercase tracking-wider transition-all cursor-pointer"
            >
              {t.logoutBtn}
            </button>
          </div>

          {/* Tasks Checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Task 1: Store Setup */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-[#fcd34d]/10 border border-[#fcd34d]/30 text-[#854d0e] rounded-lg">
                    <IconBuildingStore className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#854d0e] bg-[#fcd34d]/20 px-2 py-0.5 rounded">
                    {lang === "fr" ? "Vendeur" : lang === "ar" ? "بائع" : lang === "tz" ? "ⴰⵎⵙⵏⵣⵉ" : "Seller Setup"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 leading-tight">
                  {t.tasks.store.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t.tasks.store.desc}
                </p>
              </div>
            </div>

            {/* Task 2: Upload Product */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
                    <IconPlus className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    {lang === "fr" ? "Inventaire" : lang === "ar" ? "مخزون" : lang === "tz" ? "ⵜⴰⴳⴰⵍⴰ" : "Inventory"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 leading-tight">
                  {t.tasks.product.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t.tasks.product.desc}
                </p>
              </div>
            </div>

            {/* Task 3: COD Order */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                    <IconShoppingCart className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-800 bg-green-100 px-2 py-0.5 rounded">
                    {lang === "fr" ? "Logistique" : lang === "ar" ? "لوجستيات" : lang === "tz" ? "ⵜⴰⵍⵓⵊⵉⵙⵜⵉⴽⵜ" : "Logistics"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 leading-tight">
                  {t.tasks.order.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t.tasks.order.desc}
                </p>
              </div>
            </div>

            {/* Task 4: Collections */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg">
                    <IconFolder className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    {lang === "fr" ? "Collection" : lang === "ar" ? "مجموعات" : lang === "tz" ? "ⴰⵙⵜⴰⵢ" : "Curation"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 leading-tight">
                  {t.tasks.collections.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t.tasks.collections.desc}
                </p>
              </div>
            </div>

          </div>

          {/* Action Button: Access the App Directly */}
          <div className="flex justify-center pt-4">
            <Link
              href={`/${lang}`}
              className="px-10 py-4 bg-[#200a2a] hover:bg-[#3d0f2b] text-white text-sm rounded-full font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>
                {lang === "fr" 
                  ? "Accéder directement à l'application" 
                  : lang === "ar" 
                    ? "الدخول مباشرة إلى التطبيق" 
                    : lang === "tz"
                      ? "ⴽⵛⵎ ⵙ ⵓⵙⵏⵙⵉ ⵙ ⵓⵙⵔⵉⴷ"
                      : "Access the App Directly"}
              </span>
              <IconArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      )}

      {/* Instagram Promo Section */}
      <div className="mt-8 text-center max-w-md mx-auto px-4 z-10">
        <p className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-2">
          {lang === "fr" 
            ? "Suivez notre aventure" 
            : lang === "ar" 
              ? "تابعوا رحلتنا" 
              : lang === "tz"
                ? "ⴷⴼⵔ ⵜⴰⵡⴰⴷⴰ ⵏⵏⵖ"
                : "Follow our journey"}
        </p>
        <a 
          href="https://instagram.com/afus_ma" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 active:scale-95 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer"
        >
          <IconBrandInstagram className="w-5 h-5" />
          <span>@afus_ma</span>
        </a>
      </div>
    </div>
  );
}
