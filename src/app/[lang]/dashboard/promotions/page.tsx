import React, { use } from 'react';
import { IconTag, IconPlus } from '@tabler/icons-react';
import { getDictionary } from '@/lib/i18n';

export default function PromotionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const t = getDictionary(lang).promotions;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{t.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">{t.subtitle}</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <IconPlus className="w-4 h-4" />
          {t.newPromotion}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No active promotions</h3>
        <p className="text-sm text-neutral-500 max-w-sm mt-2">
          You don't have any active discounts or promotions. Create one to boost your sales.
        </p>
      </div>
    </div>
  );
}
