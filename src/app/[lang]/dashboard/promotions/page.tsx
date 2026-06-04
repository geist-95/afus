import React from 'react';
import { Tag } from 'lucide-react';

export default async function PromotionsPage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Promotions</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Promote your items by creating discounts for a specific period of time.
          </p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Create Promotion
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <Tag className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No active promotions</h3>
        <p className="text-sm text-neutral-500 max-w-sm mt-2">
          You don't have any active discounts or promotions. Create one to boost your sales.
        </p>
      </div>
    </div>
  );
}
