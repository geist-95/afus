'use client';

import React, { use } from 'react';
import { IconWallet, IconArrowUpRight, IconClock, IconBuildingBank, IconTrendingUp, IconDownload } from '@tabler/icons-react';
import { getDictionary } from '@/lib/i18n';

export default function EarningsOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const t = getDictionary(lang).earningsOverview;
  const transactions = [
    { id: '#TRX-091', date: 'Today, 14:30', item: 'Atlas Moroccan Rug', amount: '+4,500 MAD', status: 'Cleared' },
    { id: '#TRX-090', date: 'Yesterday', item: 'Copper Tea Tray', amount: '+850 MAD', status: 'Cleared' },
    { id: '#TRX-089', date: 'Yesterday', item: 'Handwoven Basket Set', amount: '+320 MAD', status: 'Pending' },
    { id: '#TRX-088', date: 'May 12, 2026', item: 'Ceramic Serving Bowl', amount: '+180 MAD', status: 'Cleared' },
    { id: '#TRX-087', date: 'May 10, 2026', item: 'Vintage Leather Pouf', amount: '+1,200 MAD', status: 'Pending' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F9F9F9] flex flex-col font-sans p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{t.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">{t.subtitle}</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-colors">
          <IconDownload className="w-4 h-4" />
          {t.exportReport}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Net Revenue */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
              <IconTrendingUp className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+12.5% this month</span>
          </div>
          <p className="text-sm font-semibold text-neutral-500 mb-1 relative z-10">{t.netRevenue}</p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight relative z-10">18,450.00 <span className="text-lg text-neutral-400">MAD</span></h2>
        </div>

        {/* Available for Payout */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <IconWallet className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-500 mb-1 relative z-10">{t.availablePayout}</p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight relative z-10">12,200.00 <span className="text-lg text-neutral-400">MAD</span></h2>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
              <IconClock className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-500 mb-1 relative z-10">{t.pendingClearance}</p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight relative z-10">1,520.00 <span className="text-lg text-neutral-400">MAD</span></h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">{t.revenueOverTime}</h3>
          <div className="flex-1 flex items-center justify-center bg-neutral-50 rounded-lg border border-neutral-100 border-dashed min-h-[300px]">
            <div className="text-center">
              <IconTrendingUp className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-400">{t.chartPlaceholder}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900">{t.recentTransactions}</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary/80">{t.viewAll}</button>
          </div>
          <div className="space-y-5 flex-1">
            {transactions.map((trx, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
                    <IconArrowUpRight className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 line-clamp-1">{trx.item}</p>
                    <p className="text-xs text-neutral-500 font-medium">{trx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-900">{trx.amount}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${trx.status === 'Cleared' ? 'text-green-600' : 'text-orange-500'}`}>{trx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
