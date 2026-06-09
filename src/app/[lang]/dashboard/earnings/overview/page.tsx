'use client';

import React, { use, useEffect, useState } from 'react';
import { IconWallet, IconArrowUpRight, IconClock, IconBuildingBank, IconTrendingUp, IconDownload } from '@tabler/icons-react';
import { getDictionary } from '@/lib/i18n';
import { getActiveSession } from '@/lib/auth';
import { fetchOrders } from '@/lib/supabase';

export default function EarningsOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const t = getDictionary(lang).earningsOverview;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const session = await getActiveSession();
      if (session?.shop?.id) {
        try {
          const fetchedOrders = await fetchOrders(session.shop.id);
          setOrders(fetchedOrders);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const netRevenue = orders.reduce((acc, o) => acc + (o.subtotal_mad || 0), 0);
  const availablePayout = orders.filter(o => ['delivered', 'confirmed'].includes(o.order_status)).reduce((acc, o) => acc + (o.subtotal_mad || 0), 0);
  const pendingClearance = orders.filter(o => ['pending', 'shipped'].includes(o.order_status)).reduce((acc, o) => acc + (o.subtotal_mad || 0), 0);

  const transactions = orders.map(o => ({
    id: o.id,
    date: new Date(o.created_at).toLocaleDateString(),
    item: o.items?.[0]?.title || 'Order Item',
    amount: `+${o.subtotal_mad} MAD`,
    status: ['delivered', 'confirmed'].includes(o.order_status) ? 'Cleared' : 'Pending'
  })).slice(0, 5);

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
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight relative z-10">{netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg text-neutral-400">MAD</span></h2>
        </div>

        {/* Available for Payout */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <IconWallet className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-500 mb-1 relative z-10">{t.availablePayout}</p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight relative z-10">{availablePayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg text-neutral-400">MAD</span></h2>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
              <IconClock className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-500 mb-1 relative z-10">{t.pendingClearance}</p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight relative z-10">{pendingClearance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg text-neutral-400">MAD</span></h2>
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
