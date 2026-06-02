'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchOrders, fetchShops, updateAmanaMilestone } from '@/lib/supabase';
import { getActiveSession } from '@/lib/auth';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';

interface OrderHistoryEntry {
  status: string;
  timestamp: string;
  location: string;
  note: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  quantity: number;
  price_mad: number;
  variant_sku?: string;
  attributes?: Record<string, string>;
}

interface Order {
  id: string;
  shop_id: string;
  buyer_id: string;
  customer_name: string;
  customer_phone: string;
  shipping_city: string;
  shipping_address: string;
  subtotal_mad: number;
  shipping_cost_mad: number;
  total_mad: number;
  order_status: string;
  amana_delivery_status: string;
  amana_tracking_number: string;
  amana_history: OrderHistoryEntry[];
  items: OrderItem[];
  created_at: string;
}

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function MerchantOrdersPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();

  // States
  const [authLoading, setAuthLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>('s1');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingSearch, setActiveTrackingSearch] = useState<string>('');
  
  // Modal states
  const [activeLabelOrder, setActiveLabelOrder] = useState<Order | null>(null);
  const [verifyingPhoneOrder, setVerifyingPhoneOrder] = useState<Order | null>(null);
  const [phoneVerifiedIds, setPhoneVerifiedIds] = useState<string[]>([]);
  const [updatingStatusOrder, setUpdatingStatusOrder] = useState<Order | null>(null);

  // Status update sub-states
  const [newAmanaStatus, setNewAmanaStatus] = useState<string>('collected');
  const [newScanLocation, setNewScanLocation] = useState<string>('');
  const [newScanNote, setNewScanNote] = useState<string>('');
  const [manualTrackingNum, setManualTrackingNum] = useState<string>('');

  // Initial load
  useEffect(() => {
    async function checkAuthAndLoad() {
      const activeUser = await getActiveSession();
      if (!activeUser) {
        // Redirect to login page, remembering redirect target
        router.push(`/${lang}/login?redirect=dashboard/orders`);
        return;
      }

      // Load DB records
      const dbShops = await fetchShops();
      setShops(dbShops);
      if (dbShops.length > 0) {
        setSelectedShopId(dbShops[0].id);
      }

      const dbOrders = await fetchOrders();
      setOrders(dbOrders as Order[]);

      // Check URL query parameters for direct tracking search
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const trackParam = urlParams.get('track');
        if (trackParam) {
          setActiveTrackingSearch(trackParam);
        }
      }
      setAuthLoading(false);
    }
    
    checkAuthAndLoad();
  }, [lang, router]);

  // Filter orders by shop OR tracking search
  const filteredOrders = orders.filter((order) => {
    if (activeTrackingSearch.trim()) {
      return order.amana_tracking_number.toLowerCase() === activeTrackingSearch.toLowerCase().trim();
    }
    return order.shop_id === selectedShopId;
  });

  const activeShop = shops.find((s) => s.id === selectedShopId) || shops[0] || {
    name: 'artisan',
    merchant_city: 'Marrakech',
    pickup_address_street: 'Derb Snan, Marrakech',
    ice_number: '123456789012345'
  };

  // SMS verification simulator
  const handleVerifyPhone = (orderId: string) => {
    setPhoneVerifiedIds((prev) => [...prev, orderId]);
    setVerifyingPhoneOrder(null);
  };

  // Add scan milestone to Amana logs
  const handleAddAmanaMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingStatusOrder) return;

    const newMilestone = {
      status: newAmanaStatus,
      location: newScanLocation || activeShop.merchant_city,
      note: newScanNote || `status updated to ${newAmanaStatus.replace('_', ' ')}`,
      tracking_number: manualTrackingNum || undefined,
    };

    // Update in database (runs live update query if DB configured, or resolves fallback)
    await updateAmanaMilestone(updatingStatusOrder.id, newMilestone);

    // Refresh local list state from DB to guarantee data coherence
    const dbOrders = await fetchOrders();
    setOrders(dbOrders as Order[]);

    // Reset states
    setUpdatingStatusOrder(null);
    setNewScanLocation('');
    setNewScanNote('');
    setManualTrackingNum('');
  };

  // Translation mapping
  const labels: Record<string, Record<string, string>> = {
    en: {
      consoleTitle: "merchant command console",
      activeShop: "active shop node",
      searchPlaceholder: "enter amana tracking number...",
      clearSearch: "show all shop orders",
      orderId: "order reference ID",
      buyer: "buyer",
      phone: "phone",
      address: "delivery address",
      city: "destination hub",
      amount: "cod amount due",
      status: "order status",
      deliveryStatus: "amana step",
      items: "order items",
      verifyBtn: "verify phone",
      labelBtn: "print amana label",
      milestoneBtn: "log delivery scan",
      historyTitle: "amana log history",
      statusPending: "pending verification",
      statusConfirmed: "confirmed",
      statusShipped: "in transit",
      statusDelivered: "delivered / collected",
      statusReturned: "returned",
      verifiedBadge: "phone verified ✓",
      totalMad: "mad",
      shopSwitcher: "select merchant guild",
      emptyOrders: "no orders recorded for this shop.",
      milestoneModalTitle: "register amana delivery checkpoint",
      milestoneLocation: "scanning facility location (city)",
      milestoneNote: "dispatch note (optional)",
      milestoneSave: "commit tracking status",
      trackingOverride: "override amana tracking number",
      labelTitle: "al barid bank - amana cash on delivery routing slip",
      labelSender: "shipper (artisan)",
      labelReceiver: "consignee (buyer)",
      labelInstructions: "delivery protocol: collect cash on delivery. inspect before payment allowed.",
    },
    fr: {
      consoleTitle: "console marchand",
      activeShop: "boutique active",
      searchPlaceholder: "rechercher un numéro de suivi amana...",
      clearSearch: "voir toutes les commandes",
      orderId: "référence de commande",
      buyer: "destinataire",
      phone: "téléphone",
      address: "adresse de livraison",
      city: "ville de destination",
      amount: "montant cod à percevoir",
      status: "statut commande",
      deliveryStatus: "étape amana",
      items: "articles",
      verifyBtn: "valider tél",
      labelBtn: "étiquette amana",
      milestoneBtn: "scanner amana",
      historyTitle: "historique amana",
      statusPending: "en attente confirmation",
      statusConfirmed: "confirmée",
      statusShipped: "expédiée",
      statusDelivered: "livrée / encaissée",
      statusReturned: "retournée",
      verifiedBadge: "téléphone validé ✓",
      totalMad: "dh",
      shopSwitcher: "sélectionner la boutique",
      emptyOrders: "aucune commande enregistrée pour cette boutique.",
      milestoneModalTitle: "enregistrer une étape de livraison amana",
      milestoneLocation: "lieu de scan (ville)",
      milestoneNote: "remarque d'expédition (optionnel)",
      milestoneSave: "enregistrer l'étape",
      trackingOverride: "modifier le numéro amana",
      labelTitle: "al barid bank - bordereau d'expédition amana contre remboursement",
      labelSender: "expéditeur (artisan)",
      labelReceiver: "destinataire",
      labelInstructions: "instruction de livraison : encaissement espèces à la livraison. vérification autorisée.",
    },
    ar: {
      consoleTitle: "لوحة تحكم التاجر",
      activeShop: "المتجر النشط",
      searchPlaceholder: "أدخل رقم تتبع أمانة...",
      clearSearch: "عرض جميع طلبات المتجر",
      orderId: "مرجع الطلبية",
      buyer: "المشتري",
      phone: "الهاتف",
      address: "عنوان التوصيل",
      city: "مدينة التوصيل",
      amount: "مبلغ الدفع عند الاستلام",
      status: "حالة الطلبية",
      deliveryStatus: "حالة شحن أمانة",
      items: "السلع",
      verifyBtn: "تأكيد الهاتف",
      labelBtn: "طبع ملصق أمانة",
      milestoneBtn: "تسجيل نقطة تتبع",
      historyTitle: "سجل تتبع أمانة",
      statusPending: "في انتظار التأكيد",
      statusConfirmed: "مؤكدة",
      statusShipped: "تم الشحن",
      statusDelivered: "تم التسليم والتحصيل",
      statusReturned: "مرتجعة",
      verifiedBadge: "الهاتف مؤكد ✓",
      totalMad: "درهم",
      shopSwitcher: "اختر متجر الحرفي",
      emptyOrders: "لا توجد طلبيات مسجلة لهذا المتجر.",
      milestoneModalTitle: "تسجيل نقطة فحص شحن أمانة جديدة",
      milestoneLocation: "موقع الفحص (المدينة)",
      milestoneNote: "ملاحظة الشحن (اختياري)",
      milestoneSave: "حفظ نقطة التتبع",
      trackingOverride: "تغيير رقم تتبع أمانة",
      labelTitle: "بريد المغرب - بطاقة شحن أمانة الدفع عند الاستلام",
      labelSender: "المرسل (الحرفي)",
      labelReceiver: "المرسل إليه (الزبون)",
      labelInstructions: "بروتوكول التوصيل: تحصيل المبلغ نقداً عند الاستلام. يُسمح بالفحص قبل الدفع.",
    }
  };

  const t = labels[lang] || labels.en;

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="space-y-8 font-mono text-xs lowercase">
      {/* Title */}
      <div className="border-b border-black pb-4 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
        <h1 className="text-3xl font-serif font-bold tracking-tight lowercase text-black">
          {t.consoleTitle}
        </h1>
        <div className="flex gap-4 items-center">
          <span className="text-neutral-500">{t.shopSwitcher}:</span>
          <select
            value={selectedShopId}
            onChange={(e) => {
              setSelectedShopId(e.target.value);
              setActiveTrackingSearch(''); // Reset search
            }}
            className="border border-black p-2 bg-white rounded-none focus:outline-none text-xs font-bold"
          >
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.merchant_city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Tracking Lookup Input */}
      <div className="border border-black p-4 bg-neutral-50 flex flex-col md:flex-row gap-4 items-center">
        <span className="font-bold flex-shrink-0">🔍 search tracking registry:</span>
        <input
          type="text"
          value={activeTrackingSearch}
          onChange={(e) => setActiveTrackingSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="flex-1 border border-black p-2 bg-white focus:outline-none rounded-none text-xs tracking-widest placeholder-neutral-400"
        />
        {activeTrackingSearch && (
          <button
            onClick={() => setActiveTrackingSearch('')}
            className="bg-black text-white hover:bg-neutral-800 px-3 py-2 border border-black rounded-none cursor-pointer"
          >
            {t.clearSearch}
          </button>
        )}
      </div>

      {/* Orders Output */}
      {filteredOrders.length === 0 ? (
        <div className="border border-black p-12 text-center text-neutral-400 bg-white">
          {t.emptyOrders}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map((order) => {
            const isVerified = phoneVerifiedIds.includes(order.id) || order.order_status !== 'pending';

            return (
              <div key={order.id} className="border border-black bg-white shadow-flat-sm flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-black bg-neutral-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="space-y-1">
                    <span className="font-bold text-sm block">
                      {t.orderId}: {order.id.substring(0, 8)}...
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      registered: {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                   {/* Tracking & Status Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-500 font-bold text-[10px]">status:</span>
                      {order.order_status === 'delivered' ? (
                        <span className="bg-green-50 text-green-700 border border-green-600 px-2 py-0.5 text-[10px] font-bold uppercase">
                          delivered ✓
                        </span>
                      ) : (
                        <select
                          value={order.order_status}
                          onChange={async (e) => {
                            const nextStatus = e.target.value;
                            await updateAmanaMilestone(order.id, {
                              status: order.amana_delivery_status,
                              location: activeShop.merchant_city,
                              note: `order status changed to ${nextStatus}`,
                              order_status: nextStatus
                            });
                            const dbOrders = await fetchOrders();
                            setOrders(dbOrders as Order[]);
                          }}
                          className="border border-black px-2 py-0.5 bg-white text-[10px] font-bold focus:outline-none rounded-none cursor-pointer"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                          <option value="returned">returned</option>
                        </select>
                      )}
                    </div>

                    <span className="bg-black text-white px-2 py-0.5 text-[10px] tracking-wider uppercase font-bold">
                      amana: {order.amana_tracking_number}
                    </span>
                    <span className="border border-black px-2 py-0.5 bg-white text-[10px] font-bold text-neutral-700">
                      {order.amana_delivery_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black">
                  {/* Customer details */}
                  <div className="lg:col-span-4 p-4 space-y-3">
                    <span className="font-bold border-b border-black pb-0.5 block mb-2">buyer logistics</span>
                    <div className="space-y-1.5">
                      <div><span className="text-neutral-500">{t.buyer}:</span> <strong className="text-black font-semibold">{order.customer_name}</strong></div>
                      <div>
                        <span className="text-neutral-500">{t.phone}:</span>{' '}
                        <strong className="text-black font-semibold">{order.customer_phone}</strong>
                        {isVerified ? (
                          <span className="text-green-700 font-bold block text-[10px] mt-0.5">{t.verifiedBadge}</span>
                        ) : (
                          <button
                            onClick={() => setVerifyingPhoneOrder(order)}
                            className="text-red-600 font-bold hover:underline block text-[10px] mt-0.5 cursor-pointer"
                          >
                            ⚠️ click to trigger verification sms
                          </button>
                        )}
                      </div>
                      <div><span className="text-neutral-500">{t.city}:</span> <strong className="text-black font-semibold">{order.shipping_city}</strong></div>
                      <div><span className="text-neutral-500">{t.address}:</span> <span className="text-neutral-700 leading-normal">{order.shipping_address}</span></div>
                    </div>
                  </div>

                  {/* Items and cost */}
                  <div className="lg:col-span-4 p-4 space-y-3">
                    <span className="font-bold border-b border-black pb-0.5 block mb-2">{t.items}</span>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-neutral-800 line-clamp-1">{item.title}</span>
                            {item.variant_sku && (
                              <span className="text-[10px] text-neutral-400 block">SKU: {item.variant_sku}</span>
                            )}
                          </div>
                          <span className="flex-shrink-0 text-neutral-600">
                            {item.quantity}x {item.price_mad} {t.totalMad}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-dashed border-neutral-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">subtotal:</span>
                        <span>{order.subtotal_mad} {t.totalMad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">amana shipping:</span>
                        <span>{order.shipping_cost_mad} {t.totalMad}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-black pt-1.5 text-sm">
                        <span>{t.amount}:</span>
                        <span>{order.total_mad} {t.totalMad}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking milestone logs */}
                  <div className="lg:col-span-4 p-4 space-y-3 bg-neutral-50">
                    <span className="font-bold border-b border-black pb-0.5 block mb-2">{t.historyTitle}</span>
                    
                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                      {order.amana_history.map((log, index) => (
                        <div key={index} className="relative pl-4 border-l border-black space-y-0.5 pb-1">
                          <div className="absolute w-2 h-2 bg-black left-[-4px] top-1"></div>
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-neutral-800">{log.status.replace('_', ' ')}</span>
                            <span className="text-[9px] text-neutral-400">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-600 block">node: {log.location}</span>
                          <p className="text-[10px] text-neutral-500 italic font-sans lowercase">{log.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="p-3 border-t border-black bg-neutral-100 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => {
                      setUpdatingStatusOrder(order);
                      setManualTrackingNum(order.amana_tracking_number);
                    }}
                    disabled={order.order_status === 'delivered'}
                    className="border border-black bg-white hover:bg-neutral-50 px-3 py-1.5 text-[10px] font-bold rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🚀 {t.milestoneBtn}
                  </button>
                  <button
                    onClick={() => setActiveLabelOrder(order)}
                    className="border border-black bg-white hover:bg-neutral-50 px-3 py-1.5 text-[10px] font-bold rounded-none cursor-pointer"
                  >
                    📄 {t.labelBtn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Barid Bank Amana shipping routing label */}
      {activeLabelOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-8 space-y-6 rounded-none relative">
            <button
              onClick={() => setActiveLabelOrder(null)}
              className="absolute top-4 right-4 text-lg hover:underline cursor-pointer"
            >
              ✕ close
            </button>

            {/* Label contents */}
            <div className="border-4 border-black p-4 space-y-6">
              {/* Header block */}
              <div className="grid grid-cols-3 border-b-4 border-black pb-4 items-center">
                <div className="text-left font-bold text-base leading-tight">
                  AL BARID BANK
                  <span className="block text-xs font-normal">amana express</span>
                </div>
                <div className="text-center font-bold text-lg">
                  C.O.D
                  <span className="block text-xs uppercase tracking-widest font-mono bg-black text-white px-2 py-0.5 mt-1">
                    payment on delivery
                  </span>
                </div>
                <div className="text-right text-[10px] font-mono">
                  LABEL NO: {activeLabelOrder.id.substring(0, 8)}
                  <span className="block font-bold mt-1 text-xs">{activeLabelOrder.amana_tracking_number}</span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="border border-black py-4 bg-white flex flex-col items-center justify-center space-y-1">
                <div className="h-10 w-4/5 flex gap-1 items-stretch">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: `${Math.max(1, Math.floor(Math.sin(i * 1.5) * 2) + 2)}px`,
                        opacity: i % 3 === 0 ? 0 : 1,
                      }}
                    ></div>
                  ))}
                </div>
                <span className="font-mono text-xs tracking-[6px] font-bold mt-1">
                  {activeLabelOrder.amana_tracking_number}
                </span>
              </div>

              {/* Sender & Receiver Address Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black border-y border-black font-mono text-xs">
                <div className="p-3 space-y-2">
                  <span className="font-bold block text-neutral-500 uppercase tracking-widest">{t.labelSender}</span>
                  <div>
                    <strong className="block text-sm">{activeShop.name}</strong>
                    <span>ICE: {activeShop.ice_number}</span>
                    <span className="block text-neutral-600 mt-1">{activeShop.pickup_address_street}</span>
                    <span className="block font-bold mt-1">node origin: {activeShop.merchant_city}</span>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <span className="font-bold block text-neutral-500 uppercase tracking-widest">{t.labelReceiver}</span>
                  <div>
                    <strong className="block text-sm">{activeLabelOrder.customer_name}</strong>
                    <span>TEL: {activeLabelOrder.customer_phone}</span>
                    <span className="block text-neutral-600 mt-1">{activeLabelOrder.shipping_address}</span>
                    <span className="block font-bold mt-1">node destination: {activeLabelOrder.shipping_city}</span>
                  </div>
                </div>
              </div>

              {/* Money section */}
              <div className="bg-black text-white p-4 flex justify-between items-center border border-black">
                <div className="font-mono">
                  <span className="text-[10px] text-neutral-400 block uppercase">collect total amount</span>
                  <span className="font-bold text-xl tracking-wider">{activeLabelOrder.total_mad} {t.totalMad}</span>
                </div>
                <div className="text-right text-[10px] font-mono max-w-[200px] lowercase text-neutral-300">
                  {t.labelInstructions}
                </div>
              </div>
            </div>

            {/* Print action trigger */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="bg-black text-white hover:bg-neutral-800 border border-black font-bold uppercase tracking-wider py-2.5 px-6 rounded-none cursor-pointer"
              >
                🖨️ print label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SMS Verification Trigger */}
      {verifyingPhoneOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-md w-full p-6 space-y-4 rounded-none">
            <span className="font-serif font-bold text-lg block lowercase">Moroccan COD phone validation</span>
            <p className="text-xs text-neutral-600 leading-normal lowercase">
              we are triggering an on-demand validation SMS containing a confirmation pin code to:
              <strong className="block text-black font-mono text-sm py-1.5">{verifyingPhoneOrder.customer_phone}</strong>
              this ensures the buyer is active and limits delivery failures over the Amana logistics network.
            </p>
            <div className="border border-neutral-300 p-3 bg-neutral-50 font-mono text-[10px] text-neutral-500 lowercase">
              SMS Payload: "afus confirmation code [9284] for order of {verifyingPhoneOrder.total_mad} MAD. Please reply verify."
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setVerifyingPhoneOrder(null)}
                className="border border-black px-4 py-2 hover:bg-neutral-50 cursor-pointer"
              >
                cancel
              </button>
              <button
                onClick={() => handleVerifyPhone(verifyingPhoneOrder.id)}
                className="bg-black text-white hover:bg-neutral-800 border border-black px-4 py-2 uppercase font-bold tracking-wider cursor-pointer"
              >
                confirm verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Update Amana delivery checkpoint */}
      {updatingStatusOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-md w-full p-6 space-y-4 rounded-none">
            <div className="flex justify-between items-center border-b border-black pb-2">
              <span className="font-serif font-bold text-lg lowercase">{t.milestoneModalTitle}</span>
              <button onClick={() => setUpdatingStatusOrder(null)} className="hover:underline text-sm font-mono">✕</button>
            </div>

            <form onSubmit={handleAddAmanaMilestone} className="space-y-4 font-mono text-xs lowercase">
              <div className="space-y-1">
                <label className="block text-neutral-500">{t.deliveryStatus}</label>
                <select
                  value={newAmanaStatus}
                  onChange={(e) => setNewAmanaStatus(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white rounded-none focus:outline-none"
                >
                  <option value="collected">collected - picked up from workshop</option>
                  <option value="in_transit">in transit - scanning center transfer</option>
                  <option value="out_for_delivery">out for delivery - courier allocated</option>
                  <option value="delivered">delivered - paid cash collected</option>
                  <option value="delivery_failed">delivery failed - customer unavailable</option>
                  <option value="returned_to_sender">returned to sender</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-500">{t.trackingOverride}</label>
                <input
                  type="text"
                  value={manualTrackingNum}
                  onChange={(e) => setManualTrackingNum(e.target.value)}
                  className="w-full border border-black p-2.5 bg-white rounded-none focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-500">{t.milestoneLocation}</label>
                <input
                  type="text"
                  required
                  value={newScanLocation}
                  onChange={(e) => setNewScanLocation(e.target.value)}
                  placeholder="e.g. Rabat Principal Sorting Center"
                  className="w-full border border-black p-2.5 bg-white rounded-none focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-500">{t.milestoneNote}</label>
                <input
                  type="text"
                  value={newScanNote}
                  onChange={(e) => setNewScanNote(e.target.value)}
                  placeholder="e.g. sorted into local distribution bin"
                  className="w-full border border-black p-2.5 bg-white rounded-none focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-neutral-800 border border-black py-3 uppercase font-bold tracking-widest mt-2"
              >
                {t.milestoneSave}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
