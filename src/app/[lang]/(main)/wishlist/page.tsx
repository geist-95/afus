import type { Metadata } from 'next';
import WishlistPageClient from './WishlistPageClient';

interface WishlistPageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  const translations = {
    en: {
      titlePlain: "Wishlist - Your Saved Treasures",
      description: "View your saved authentic Moroccan artisan items, hand-crafted rugs, pottery, and andalusian design decor.",
    },
    fr: {
      titlePlain: "Liste d'envies - Vos trésors sauvegardés",
      description: "Visualisez vos articles artisanaux marocains sauvegardés, tapis faits main, poteries et décoration.",
    },
    ar: {
      titlePlain: "قائمة المفضلة - كنوزك المحفوظة",
      description: "عرض المنتجات الحرفية المغربية الأصيلة المحفوظة، السجاد المصنوع يدويًا، الفخار، والديكور.",
    },
    tz: {
      titlePlain: "ⵜⴰⵍⴳⴰⵎⵜ ⵏ ⵜⵉⵔⴰⵜ - ⵉⴳⵔⵔⵓⵊⵏ ⵏⵏⴽ",
      description: "ⵥⵕ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⴼⵓⵙ ⵍⵍⵉ ⵜⵃⴼⵉⴹⴷ.",
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return {
    title: t.titlePlain,
    description: t.description,
  };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  return <WishlistPageClient lang={lang} />;
}
