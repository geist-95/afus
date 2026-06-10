'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchOrders, fetchShops } from '@/lib/supabase';
import { getActiveSession, UserSession } from '@/lib/auth';
import { IconPackage, IconMapPin, IconCalendar, IconStar, IconTruck, IconChevronDown, IconChevronUp, IconPhone, IconBuildingStore } from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function BuyerOrdersPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const user = await getActiveSession();
        if (!user) {
          router.replace(`/${lang}/login?redirect=orders`);
          return;
        }
        setSession(user);

        // Fetch user purchases
        const userOrders = await fetchOrders(undefined, user.id);
        // Sort newest first
        userOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(userOrders);

        // Load shops to display names
        const dbShops = await fetchShops();
        setShops(dbShops);
      } catch (error) {
        console.error('Error loading buyer orders:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lang, router]);

  const getShopName = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    return shop ? shop.name : 'Moroccan Artisan';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'returned':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const t = {
    title: lang === 'fr' ? 'Mes Commandes Achats' : lang === 'ar' ? 'مشترياتي وطلباتي' : lang === 'tz' ? 'ⵜⵉⵏⴱⴰⴹⵉⵏ ⵉⵏⵓ' : 'My Purchases & Orders',
    subtitle: lang === 'fr' ? 'Consultez et suivez la livraison de vos commandes fait-main.' : lang === 'ar' ? 'تابع حالة شحن وتفاصيل مشترياتك المصنوعة يدوياً.' : 'Track the progress of your handmade artisan purchases.',
    empty: lang === 'fr' ? 'Aucune commande enregistrée.' : lang === 'ar' ? 'لا توجد أي طلبيات مسجلة بعد.' : 'No purchases recorded yet.',
    backHome: lang === 'fr' ? 'Retour à l\'accueil' : lang === 'ar' ? 'العودة للرئيسية' : 'Return to Home',
    orderId: lang === 'fr' ? 'Commande N°' : lang === 'ar' ? 'رقم الطلب' : 'Order ID',
    shop: lang === 'fr' ? 'Boutique' : lang === 'ar' ? 'المتجر' : 'Shop',
    date: lang === 'fr' ? 'Date' : lang === 'ar' ? 'التاريخ' : 'Date',
    total: lang === 'fr' ? 'Total' : lang === 'ar' ? 'المجموع الكلي' : 'Total Price',
    status: lang === 'fr' ? 'Statut' : lang === 'ar' ? 'الحالة' : 'Status',
    tracking: lang === 'fr' ? 'N° Suivi Amana' : lang === 'ar' ? 'رقم تتبع أمانة' : 'Amana Tracking',
    logistics: lang === 'fr' ? 'Détails de Livraison' : lang === 'ar' ? 'تفاصيل الشحن واللوجستيات' : 'Delivery Details & Timeline',
    items: lang === 'fr' ? 'Articles' : lang === 'ar' ? 'المنتجات' : 'Items',
    summary: lang === 'fr' ? 'Résumé financier' : lang === 'ar' ? 'ملخص الفاتورة' : 'Price Summary',
    subtotal: lang === 'fr' ? 'Sous-total' : lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal',
    shipping: lang === 'fr' ? 'Livraison Amana' : lang === 'ar' ? 'شحن أمانة' : 'Amana Shipping',
    codAmount: lang === 'fr' ? 'Montant à payer (COD)' : lang === 'ar' ? 'المبلغ المطلوب للدفع نقداً' : 'COD Amount due',
    address: lang === 'fr' ? 'Adresse de livraison' : lang === 'ar' ? 'عنوان الشحن' : 'Delivery Address',
    phone: lang === 'fr' ? 'Téléphone' : lang === 'ar' ? 'الهاتف' : 'Phone',
    noMilestones: lang === 'fr' ? 'Aucune étape enregistrée pour le moment.' : lang === 'ar' ? 'لا توجد خطوات تتبع مسجلة حالياً.' : 'No tracking milestones logged yet.',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <span className="text-neutral-500 font-medium">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-16 pt-8 md:pt-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{t.title}</h1>
          <p className="text-neutral-500 mt-2 text-base">{t.subtitle}</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-100 p-12 text-center shadow-xl shadow-neutral-100/40 flex flex-col items-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <IconPackage className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-2">{t.empty}</h3>
            <button
              onClick={() => router.push(`/${lang}`)}
              className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/25"
            >
              {t.backHome}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const statusColorClass = getStatusColor(order.order_status);
              
              return (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl border border-neutral-100 shadow-lg shadow-neutral-100/40 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  
                  {/* Summary row */}
                  <div 
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/40 transition-all select-none"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                        <IconPackage className="w-6 h-6" strokeWidth={1.8} />
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="font-bold text-sm block text-neutral-800">
                          {t.orderId}: <span className="font-mono text-xs bg-neutral-100 px-1.5 py-0.5 rounded">{order.id.substring(0, 8)}</span>
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <IconCalendar className="w-3.5 h-3.5" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-left md:text-right">
                        <span className="text-xs text-neutral-400 block uppercase font-bold tracking-wider">{t.total}</span>
                        <span className="font-extrabold text-neutral-900 text-base">{order.total_mad} MAD</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${statusColorClass}`}>
                          {order.order_status}
                        </span>
                        {isExpanded ? (
                          <IconChevronUp className="w-5 h-5 text-neutral-400 hidden md:block" />
                        ) : (
                          <IconChevronDown className="w-5 h-5 text-neutral-400 hidden md:block" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100 bg-neutral-50/20 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100 text-sm">
                      
                      {/* Products & Cost */}
                      <div className="lg:col-span-6 p-6 space-y-5">
                        <div>
                          <span className="font-bold text-neutral-800 text-xs uppercase tracking-wider border-b border-neutral-100 pb-2 block mb-3">
                            {t.items}
                          </span>
                          <div className="space-y-3">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-start gap-4 text-left">
                                <div className="space-y-0.5">
                                  <span className="font-bold text-neutral-800 text-sm block">{item.title}</span>
                                  {item.variant_sku && (
                                    <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase block">SKU: {item.variant_sku}</span>
                                  )}
                                  <span className="text-[11px] text-neutral-500 font-semibold block flex items-center gap-1 mt-0.5">
                                    <IconBuildingStore className="w-3.5 h-3.5" />
                                    {getShopName(order.shop_id)}
                                  </span>
                                </div>
                                <span className="flex-shrink-0 text-neutral-600 font-semibold text-xs whitespace-nowrap bg-neutral-100/70 px-2 py-1 rounded">
                                  {item.quantity}x {item.price_mad} MAD
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-neutral-200 space-y-2">
                          <span className="font-bold text-neutral-800 text-xs uppercase tracking-wider block mb-1">
                            {t.summary}
                          </span>
                          <div className="flex justify-between text-neutral-500 font-medium text-xs">
                            <span>{t.subtotal}:</span>
                            <span>{order.subtotal_mad} MAD</span>
                          </div>
                          <div className="flex justify-between text-neutral-500 font-medium text-xs">
                            <span>{t.shipping}:</span>
                            <span>{order.shipping_cost_mad} MAD</span>
                          </div>
                          <div className="flex justify-between font-extrabold border-t border-neutral-200 pt-2 text-sm text-neutral-800">
                            <span>{t.codAmount}:</span>
                            <span className="text-primary">{order.total_mad} MAD</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery address & tracking timeline */}
                      <div className="lg:col-span-6 p-6 space-y-5 bg-neutral-50/50">
                        <div className="space-y-3">
                          <span className="font-bold text-neutral-800 text-xs uppercase tracking-wider border-b border-neutral-100 pb-2 block">
                            {t.address}
                          </span>
                          <div className="space-y-2 text-xs text-neutral-600 text-left">
                            <div className="flex items-start gap-2">
                              <IconMapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                              <span>
                                <strong className="text-black block font-semibold mb-0.5">{order.customer_name}</strong>
                                {order.shipping_address}, {order.shipping_city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconPhone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                              <span>{order.customer_phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                            <span className="font-bold text-neutral-800 text-xs uppercase tracking-wider block">
                              {t.logistics}
                            </span>
                            {order.amana_tracking_number && (
                              <span className="bg-neutral-800 text-white font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded">
                                {order.amana_tracking_number}
                              </span>
                            )}
                          </div>

                          <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1 text-left">
                            {order.amana_history && order.amana_history.length > 0 ? (
                              order.amana_history.map((log: any, index: number) => (
                                <div key={index} className="relative pl-5 border-l-2 border-primary/30 space-y-0.5 pb-2">
                                  {/* Milestone node dot */}
                                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full left-[-6px] top-1 border-2 border-white"></div>
                                  
                                  <div className="flex justify-between items-baseline gap-2">
                                    <span className="font-extrabold text-neutral-800 text-xs capitalize">
                                      {log.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 font-bold whitespace-nowrap">
                                      {new Date(log.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-neutral-500 font-semibold block capitalize flex items-center gap-1">
                                    <IconMapPin className="w-3 h-3 text-neutral-400" />
                                    {log.location}
                                  </span>
                                  <p className="text-[11px] text-neutral-500 italic mt-0.5 leading-normal">{log.note}</p>
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-xs text-neutral-400 py-4 italic">
                                {t.noMilestones}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
