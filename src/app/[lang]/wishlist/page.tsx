import type { Metadata } from 'next';
import WishlistPageClient from './WishlistPageClient';

export const metadata: Metadata = {
  title: 'Saved Items — Afus',
  description: 'Your hearted artisan products, saved for later.',
};

interface WishlistPageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  return <WishlistPageClient lang={lang} />;
}
