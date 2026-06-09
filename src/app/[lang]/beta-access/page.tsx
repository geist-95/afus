'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  IconLock, 
  IconBuildingStore, 
  IconPlus, 
  IconShoppingCart, 
  IconFolder, 
  IconArrowRight, 
  IconUserCheck 
} from "@tabler/icons-react";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function BetaAccessPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || "en";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUnlock = localStorage.getItem("afus_beta_unlocked");
    if (savedUnlock === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0173") {
      setIsUnlocked(true);
      setError("");
      localStorage.setItem("afus_beta_unlocked", "true");
    } else {
      setError(
        lang === "fr" 
          ? "Code incorrect. Veuillez vérifier votre invitation." 
          : lang === "ar" 
            ? "الرمز غير صحيح. يرجى التحقق من دعوتك." 
            : "Incorrect code. Please check your invitation email."
      );
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem("afus_beta_unlocked");
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
    }
  }[lang as "en" | "fr" | "ar"] || {
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
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {!isUnlocked ? (
        /* LOCKED STATE */
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden arabic-frame">
          <div className="p-8 text-center bg-[#2a0a1e] relative">
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

          <form onSubmit={handleUnlock} className="p-8 space-y-6">
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
                className="w-full border border-neutral-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2a0a1e] rounded-lg text-center text-lg tracking-wider"
              />
              {error && (
                <p className="text-red-600 text-xs font-semibold text-center mt-2">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#2a0a1e] hover:bg-[#3d0f2b] text-white text-sm py-3.5 rounded-full font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconUserCheck className="w-5 h-5" />
              {t.unlockBtn}
            </button>
          </form>
        </div>
      ) : (
        /* UNLOCKED STATE */
        <div className="w-full max-w-4xl bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 md:p-12 space-y-10 arabic-frame">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-100 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-[#2a0a1e]">
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
                    {lang === "fr" ? "Vendeur" : lang === "ar" ? "بائع" : "Seller Setup"}
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
                    {lang === "fr" ? "Inventaire" : lang === "ar" ? "مخزون" : "Inventory"}
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
                    {lang === "fr" ? "Logistique" : lang === "ar" ? "لوجستيات" : "Logistics"}
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
                    {lang === "fr" ? "Collection" : lang === "ar" ? "مجموعات" : "Curation"}
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
              className="px-10 py-4 bg-[#2a0a1e] hover:bg-[#3d0f2b] text-white text-sm rounded-full font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>
                {lang === "fr" 
                  ? "Accéder directement à l'application" 
                  : lang === "ar" 
                    ? "الدخول مباشرة إلى التطبيق" 
                    : "Access the App Directly"}
              </span>
              <IconArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
