'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection({ lang }: { lang: string }) {
  const pathname = usePathname();
  
  // Only show on home page
  if (pathname !== `/${lang}` && pathname !== `/${lang}/`) {
    return null;
  }

  const labels: Record<string, Record<string, string>> = {
    en: {
      faqTitle: "Frequently Asked Questions",
      faq1Q: "What is afus?",
      faq1A: "afus is a curated multi-vendor marketplace designed to connect authentic Moroccan artisans directly with consumers. We highlight regional heritage crafts and handle cash-on-delivery transactions securely.",
      faq2Q: "How does Cash on Delivery (COD) work?",
      faq2A: "When you place an order, the artisan is notified immediately to package your craft. It is shipped securely via Amana (Al Barid Bank). You only pay the courier in cash when the package is delivered to your doorstep.",
      faq3Q: "Are the merchants verified?",
      faq3A: "Yes. All professional artisans on afus undergo vetting, including verification of their official national artisan register profiles, location, and legal ICE registration numbers.",
      faq4Q: "What is the return policy?",
      faq4A: "Artisans accept returns within 7 days of package delivery. The item must be unused and in its original packaging. Return shipping is handled directly with the seller.",
      faq5Q: "How are products shipped?",
      faq5A: "Products are securely packaged by the artisan and shipped via the national Al Barid Bank Amana network.",
      faq6Q: "Can I sell on afus?",
      faq6A: "Yes, authentic Moroccan artisans can apply to become merchants. We verify your artisan register profile before approving.",
    },
    fr: {
      faqTitle: "Questions fréquemment posées",
      faq1Q: "Qu'est-ce que afus?",
      faq1A: "afus est une place de marché multi-vendeurs conçue pour connecter directement les artisans marocains authentiques avec les consommateurs. Nous mettons en valeur l'artisanat régional et gérons les paiements à la livraison en toute sécurité.",
      faq2Q: "Comment fonctionne le paiement à la livraison (COD) ?",
      faq2A: "Lorsque vous passez commande, l'artisan est immédiatement informé pour préparer votre article. Il est expédié via Amana (Al Barid Bank). Vous ne payez le coursier en espèces que lorsque le colis est livré chez vous.",
      faq3Q: "Les vendeurs sont-ils vérifiés ?",
      faq3A: "Oui. Tous les artisans professionnels sur afus font l'objet d'une vérification de leurs profils de registre national de l'artisanat, de leur emplacement géographique et de leurs numéros d'ICE légaux.",
      faq4Q: "Quelle est la politique de retour ?",
      faq4A: "Les artisans acceptent les retours sous 7 jours après la livraison. L'article doit être inutilisé et dans son emballage d'origine. Les retours sont gérés directement avec le vendeur.",
      faq5Q: "Comment les produits sont-ils expédiés ?",
      faq5A: "Les produits sont soigneusement emballés par l'artisan et expédiés via le réseau national Amana d'Al Barid Bank.",
      faq6Q: "Puis-je vendre sur afus ?",
      faq6A: "Oui, les artisans marocains authentiques peuvent postuler pour devenir vendeurs. Nous vérifions votre profil du registre de l'artisanat avant approbation.",
    },
    ar: {
      faqTitle: "الأسئلة الشائعة",
      faq1Q: "ما هو afus؟",
      faq1A: "أفوس عبارة عن منصة تسوق تربط الصناع التقليديين المغاربة الموثوقين بالزبناء مباشرة. نحرص على إبراز التراث الحرفي الإقليمي ونوفر خدمة الدفع عند الاستلام بشكل آمن.",
      faq2Q: "كيف تعمل خدمة الدفع عند الاستلام (COD)؟",
      faq2A: "بمجرد تقديم طلبك، يبدأ الحرفي في إعداد وتغليف طلبيتك، ثم يتم شحنها بأمان عبر خدمة أمانة لبريد المغرب. وتدفع ثمنها نقداً فقط عند استلامها على باب منزلك.",
      faq3Q: "هل المتاجر موثقة؟",
      faq3A: "نعم. يخضع جميع الحرفيين المهنيين في المنصة لعملية تدقيق تشمل التحقق من بطاقات الصانع التقليدي الخاصة بهم ومواقعهم وأرقام التعريف الموحدة للمقاولات (ICE).",
      faq4Q: "ما هي سياسة الإرجاع؟",
      faq4A: "يقبل الحرفيون الإرجاع في غضون 7 أيام من استلام الطرد. يجب أن يكون المنتج غير مستخدم وفي تغليفه الأصلي. ويتم تنسيق عملية الإرجاع مباشرة مع البائع.",
      faq5Q: "كيف يتم شحن المنتجات؟",
      faq5A: "يتم تغليف المنتجات بعناية من قبل الحرفي ويتم شحنها عبر شبكة أمانة الوطنية لبريد المغرب.",
      faq6Q: "هل يمكنني البيع على أفوس؟",
      faq6A: "نعم، يمكن للحرفيين المغاربة الأصليين التقديم ليصبحوا تجاراً. نقوم بالتحقق من ملفك في سجل الصناعة التقليدية قبل الموافقة.",
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="w-full bg-white pb-24 md:pb-28 mt-12 -mb-12 relative z-0 overflow-hidden">
      <div className="w-full bg-[#1D0D2C] text-white py-3 flex overflow-hidden whitespace-nowrap border-b border-black/5">
        <div className="flex animate-marquee items-center text-sm md:text-base font-bold tracking-[0.2em] opacity-90">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="mx-6 font-ariom font-normal text-lg mt-1 tracking-normal">afus</span>
              <span className="text-[#C495E5] text-xs">✦</span>
              <span className="mx-6 text-lg font-normal font-tifinagh mt-1">ⴰⴼⵓⵙ</span>
              <span className="text-[#C495E5] text-xs">✦</span>
              <span className="mx-6 text-lg font-normal mt-1">أفوس</span>
              <span className="text-[#C495E5] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
      <section className="max-w-[1400px] mx-auto space-y-8 mt-12 md:mt-16 px-4 sm:px-6 lg:px-8">


        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-end">
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col space-y-4">
            <div className="relative">
              <img src="/faq-girl.png" alt="FAQ" className="w-full h-auto object-contain" />
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed pt-2">
              Have questions? Find helpful answers to understand Afus and how our platform connects you with authentic artisans.
            </p>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
            <h2 className="text-3xl md:text-5xl font-bold text-left !text-black mb-8">
              FAQ
            </h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg md:text-xl text-neutral-800">{t.faq1Q}</AccordionTrigger>
                <AccordionContent className="text-base text-neutral-600 leading-relaxed max-w-2xl">{t.faq1A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg md:text-xl text-neutral-800">{t.faq2Q}</AccordionTrigger>
                <AccordionContent className="text-base text-neutral-600 leading-relaxed max-w-2xl">{t.faq2A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg md:text-xl text-neutral-800">{t.faq3Q}</AccordionTrigger>
                <AccordionContent className="text-base text-neutral-600 leading-relaxed max-w-2xl">{t.faq3A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg md:text-xl text-neutral-800">{t.faq4Q}</AccordionTrigger>
                <AccordionContent className="text-base text-neutral-600 leading-relaxed max-w-2xl">{t.faq4A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg md:text-xl text-neutral-800">{t.faq5Q}</AccordionTrigger>
                <AccordionContent className="text-base text-neutral-600 leading-relaxed max-w-2xl">{t.faq5A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg md:text-xl text-neutral-800">{t.faq6Q}</AccordionTrigger>
                <AccordionContent className="text-base text-neutral-600 leading-relaxed max-w-2xl">{t.faq6A}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
