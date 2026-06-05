'use client';

import React from 'react';
import { IconWallet, IconBuildingBank, IconCheck, IconClock, IconAlertCircle } from '@tabler/icons-react';

export default function EarningsCreditsPage() {
  const payouts = [
    { id: '#PO-1042', date: 'June 01, 2026', amount: '8,500.00 MAD', account: '•••• 4589', status: 'Completed' },
    { id: '#PO-1041', date: 'May 15, 2026', amount: '12,400.00 MAD', account: '•••• 4589', status: 'Completed' },
    { id: '#PO-1040', date: 'May 01, 2026', amount: '3,250.00 MAD', account: '•••• 4589', status: 'Completed' },
    { id: '#PO-1039', date: 'April 15, 2026', amount: '5,800.00 MAD', account: '•••• 4589', status: 'Completed' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F9F9F9] flex flex-col font-sans p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Payouts & Credits</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your available funds and payout history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Available Balance & Request Payout */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IconWallet className="w-5 h-5 text-primary" strokeWidth={2} />
                <p className="text-sm font-semibold text-neutral-500">Available to Withdraw</p>
              </div>
              <h2 className="text-5xl font-bold text-neutral-900 tracking-tight">12,200.00 <span className="text-2xl text-neutral-400">MAD</span></h2>
              <p className="text-xs text-neutral-500 mt-3 flex items-center gap-1.5">
                <IconAlertCircle className="w-4 h-4" />
                Minimum payout amount is 500.00 MAD.
              </p>
            </div>
            <button className="bg-primary text-white px-8 py-3.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shrink-0">
              Request Payout
            </button>
          </div>
        </div>

        {/* Linked Bank Account */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900">Linked Account</h3>
              <button className="text-xs font-semibold text-primary hover:underline">Edit</button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="w-10 h-10 bg-white border border-neutral-200 rounded-md flex items-center justify-center">
                <IconBuildingBank className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">Attijariwafa Bank</p>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">•••• •••• •••• 4589</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-100">
            <IconClock className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              Payouts are processed within 1-2 business days. Weekends and holidays may cause slight delays.
            </p>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">Payout History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Reference</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Date</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Destination</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payouts.map((po, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{po.id}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{po.date}</td>
                  <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                    <IconBuildingBank className="w-4 h-4 text-neutral-400" />
                    {po.account}
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-900 text-right">{po.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wider">
                      <IconCheck className="w-3.5 h-3.5" strokeWidth={3} />
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <span>Showing 1 to 4 of 4 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
