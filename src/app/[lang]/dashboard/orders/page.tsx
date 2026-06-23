'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchOrders, fetchShops, updateAmanaMilestone } from '@/lib/supabase';
import { getActiveSession } from '@/lib/auth';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';
import { FileText, MapPin, Search, CheckCircle2, AlertCircle, X, Navigation, Package, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  image_url?: string | null;
  attributes?: Record<string, any>;
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
  const [activeShop, setActiveShop] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingSearch, setActiveTrackingSearch] = useState<string>('');
  
  // Modal & Sheet states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
        router.push(`/${lang}/login?redirect=dashboard/orders`);
        return;
      }

      if (activeUser.shop) {
        setActiveShop(activeUser.shop);
      }

      const dbOrders = activeUser.shop ? await fetchOrders(activeUser.shop.id) : [];
      setOrders(dbOrders as Order[]);

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

  // Filter orders by tracking search
  const filteredOrders = orders.filter((order) => {
    if (activeTrackingSearch.trim()) {
      return order.amana_tracking_number.toLowerCase() === activeTrackingSearch.toLowerCase().trim();
    }
    return true;
  });

  const shopFallback = activeShop || {
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
      location: newScanLocation || shopFallback.merchant_city,
      note: newScanNote || `status updated to ${newAmanaStatus.replace('_', ' ')}`,
      tracking_number: manualTrackingNum || undefined,
    };

    await updateAmanaMilestone(updatingStatusOrder.id, newMilestone);

    const dbOrders = activeShop ? await fetchOrders(activeShop.id) : [];
    setOrders(dbOrders as Order[]);

    // If we're updating the currently viewed order in the sheet, update it there too
    if (selectedOrder && selectedOrder.id === updatingStatusOrder.id) {
        const updatedOrder = dbOrders.find(o => o.id === selectedOrder.id);
        if (updatedOrder) setSelectedOrder(updatedOrder as Order);
    }

    setUpdatingStatusOrder(null);
    setNewScanLocation('');
    setNewScanNote('');
    setManualTrackingNum('');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'shipped': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        case 'returned': return 'bg-red-100 text-red-800 hover:bg-red-100';
        default: return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    }
  };

  const labels: Record<string, Record<string, string>> = {
    en: {
      consoleTitle: "Store Orders",
      subtitle: "Manage your orders and logistics",
      searchPlaceholder: "Enter amana tracking number...",
      clearSearch: "Show all shop orders",
      orderId: "Order ID",
      buyer: "Buyer",
      city: "Destination",
      amount: "Total COD",
      status: "Status",
      emptyOrders: "No orders recorded for this shop.",
      trackShipment: "Track Shipment",
      verifyBtn: "Verify Phone",
      labelBtn: "Print Label",
      milestoneBtn: "Log Scan",
      historyTitle: "Amana History",
      items: "Articles",
      subtotal: "Subtotal",
      amanaShipping: "Amana Shipping",
      milestoneModalTitle: "register amana delivery checkpoint",
      milestoneLocation: "scanning facility location (city)",
      milestoneNote: "dispatch note (optional)",
      milestoneSave: "commit tracking status",
      trackingOverride: "override amana tracking number",
      deliveryStatus: "amana step",
      labelSender: "shipper (artisan)",
      labelReceiver: "consignee (buyer)",
      labelInstructions: "delivery protocol: collect cash on delivery. inspect before payment allowed.",
    },
    fr: {
      consoleTitle: "Commandes",
      subtitle: "Gérez vos commandes et vos expéditions",
      searchPlaceholder: "Rechercher un numéro de suivi amana...",
      clearSearch: "Voir toutes les commandes",
      orderId: "Réf",
      buyer: "Destinataire",
      city: "Destination",
      amount: "Total COD",
      status: "Statut",
      emptyOrders: "Aucune commande enregistrée pour cette boutique.",
      trackShipment: "Suivre l'expédition",
      verifyBtn: "Valider Tél",
      labelBtn: "Étiquette",
      milestoneBtn: "Scanner",
      historyTitle: "Historique Amana",
      items: "Articles",
      subtotal: "Sous-total",
      amanaShipping: "Expédition Amana",
      milestoneModalTitle: "enregistrer une étape de livraison amana",
      milestoneLocation: "lieu de scan (ville)",
      milestoneNote: "remarque d'expédition (optionnel)",
      milestoneSave: "enregistrer l'étape",
      trackingOverride: "modifier le numéro amana",
      deliveryStatus: "étape amana",
      labelSender: "expéditeur (artisan)",
      labelReceiver: "destinataire",
      labelInstructions: "instruction de livraison : encaissement espèces à la livraison. vérification autorisée.",
    },
    ar: {
      consoleTitle: "الطلبيات",
      subtitle: "إدارة وتتبع الطلبيات والشحن",
      searchPlaceholder: "أدخل رقم تتبع أمانة...",
      clearSearch: "عرض جميع طلبات المتجر",
      orderId: "المرجع",
      buyer: "المشتري",
      city: "الوجهة",
      amount: "المجموع",
      status: "الحالة",
      emptyOrders: "لا توجد طلبيات مسجلة لهذا المتجر.",
      trackShipment: "تتبع الشحنة",
      verifyBtn: "تأكيد الهاتف",
      labelBtn: "ملصق أمانة",
      milestoneBtn: "تسجيل فحص",
      historyTitle: "سجل أمانة",
      items: "السلع",
      subtotal: "المجموع الفرعي",
      amanaShipping: "شحن أمانة",
      milestoneModalTitle: "تسجيل نقطة فحص شحن أمانة جديدة",
      milestoneLocation: "موقع الفحص (المدينة)",
      milestoneNote: "ملاحظة الشحن (اختياري)",
      milestoneSave: "حفظ نقطة التتبع",
      trackingOverride: "تغيير رقم تتبع أمانة",
      deliveryStatus: "حالة شحن أمانة",
      labelSender: "المرسل (الحرفي)",
      labelReceiver: "المرسل إليه (الزبون)",
      labelInstructions: "بروتوكول التوصيل: تحصيل المبلغ نقداً عند الاستلام. يُسمح بالفحص قبل الدفع.",
    },
  };

  const t = labels[lang] || labels.en;

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-50/30">
      {/* Title */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800 capitalize">
            {t.consoleTitle}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">{t.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-6xl flex-1 space-y-8">
        {/* Global Tracking Lookup Input */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex items-center gap-2 text-neutral-700 flex-shrink-0">
            <Search className="w-4 h-4" />
            <span className="font-semibold text-sm">Search Tracking Registry:</span>
          </div>
          <input
            type="text"
            value={activeTrackingSearch}
            onChange={(e) => setActiveTrackingSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full md:flex-1 border border-neutral-200 p-2 bg-neutral-50 focus:bg-white focus:border-neutral-300 focus:outline-none rounded-lg text-sm transition-all placeholder-neutral-400"
          />
          {activeTrackingSearch && (
            <button
              onClick={() => setActiveTrackingSearch('')}
              className="w-full md:w-auto bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              {t.clearSearch}
            </button>
          )}
        </div>

        {/* View 1: The Order Card (Overview) */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 p-8 md:p-12 text-center text-neutral-400 bg-white shadow-sm">
            {t.emptyOrders}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              return (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 border-b bg-neutral-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">{t.orderId}</p>
                        <CardTitle className="text-sm font-mono tracking-tight">{order.id.substring(0,8)}</CardTitle>
                      </div>
                      <select
                        value={order.order_status}
                        onChange={async (e) => {
                          const nextStatus = e.target.value;
                          await updateAmanaMilestone(order.id, {
                            status: order.amana_delivery_status,
                            location: shopFallback.merchant_city,
                            note: `order status changed to ${nextStatus}`,
                            order_status: nextStatus,
                            skip_history: true
                          });
                          const dbOrders = activeShop ? await fetchOrders(activeShop.id) : [];
                          setOrders(dbOrders as Order[]);
                        }}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none appearance-none capitalize ${getStatusColor(order.order_status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">{order.customer_name}</p>
                            <div className="flex items-center text-xs text-neutral-500 gap-1">
                                <MapPin className="w-3 h-3" />
                                {order.shipping_city}
                            </div>
                        </div>
                        {/* Mini Map Placeholder */}
                        <div className="w-16 h-12 bg-neutral-100 rounded border flex items-center justify-center overflow-hidden shrink-0 relative">
                            <div className="absolute inset-0 bg-blue-50/50 opacity-50"></div>
                            <MapPin className="w-4 h-4 text-red-500 z-10" />
                            <div className="absolute bottom-1 text-[8px] font-medium z-10">{order.shipping_city}</div>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center text-sm">
                        <div className="text-neutral-500">
                            {order.items.length} {t.items}
                        </div>
                        <div className="font-bold text-right">
                            <span className="text-xs text-neutral-500 block uppercase tracking-wider">{t.amount}</span>
                            {order.total_mad} MAD
                        </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4 bg-white">
                    <button 
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-colors"
                    >
                        <Navigation className="w-4 h-4" />
                        {t.trackShipment}
                    </button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* View 2: The Detailed Order Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="bottom" className="w-full sm:max-w-xl md:max-w-2xl mx-auto max-h-[85vh] h-full rounded-t-3xl border-t p-0 flex flex-col bg-neutral-50 overflow-hidden outline-none">
          {selectedOrder && (
            <>
              {/* Drawer Handle */}
              <div className="w-full bg-white flex justify-center pt-3 pb-2 z-30 shrink-0 relative">
                 <div className="w-12 h-1.5 rounded-full bg-neutral-300"></div>
              </div>
              {/* Sheet Header */}
              <div className="bg-white px-6 pb-4 border-b shrink-0 z-20 relative">
                <SheetHeader className="text-left space-y-1">
                  <div className="flex justify-between items-start gap-4">
                      <div>
                          <SheetTitle className="text-xl">Tracking: {selectedOrder.amana_tracking_number}</SheetTitle>
                          <SheetDescription className="font-mono text-xs">
                            ID: {selectedOrder.id} • {new Date(selectedOrder.created_at).toLocaleString()}
                          </SheetDescription>
                      </div>
                      <Badge className={getStatusColor(selectedOrder.order_status)} variant="secondary">
                        {selectedOrder.order_status}
                      </Badge>
                  </div>
                </SheetHeader>
              </div>

              {/* Sheet Body */}
              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* Status Updater */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{t.status}</label>
                  <Select
                    value={selectedOrder.order_status}
                    onValueChange={async (value) => {
                      await updateAmanaMilestone(selectedOrder.id, {
                        status: selectedOrder.amana_delivery_status,
                        location: shopFallback.merchant_city,
                        note: `order status changed to ${value}`,
                        order_status: value,
                        skip_history: true
                      });
                      const dbOrders = activeShop ? await fetchOrders(activeShop.id) : [];
                      setOrders(dbOrders as Order[]);
                      const updatedOrder = dbOrders.find(o => o.id === selectedOrder.id);
                      if (updatedOrder) setSelectedOrder(updatedOrder as Order);
                    }}
                  >
                    <SelectTrigger className="w-full font-bold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Logistics Timeline */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base flex items-center gap-2">
                            <History className="w-4 h-4" />
                            {t.historyTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-5">
                        {selectedOrder.amana_history.map((log, index) => (
                            <div key={index} className="relative pl-6 pb-2 border-l border-neutral-200 last:border-0 last:pb-0">
                                <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full left-[-6.5px] top-1"></div>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm capitalize">{log.status.replace('_', ' ')}</span>
                                    <span className="text-xs text-neutral-500">
                                        {new Date(log.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="text-xs font-medium text-neutral-700 block capitalize">{log.location}</span>
                                {log.note && <p className="text-xs text-neutral-500 mt-1">{log.note}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Itemized List */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {t.items}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-neutral-100">
                            {selectedOrder.items.map(item => (
                                <div key={item.id} className="p-4 flex gap-3 justify-between items-start">
                                    {item.image_url && (
                                        <div className="w-12 h-12 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 leading-snug">{item.title}</p>
                                        {item.variant_sku && <p className="text-xs text-neutral-500 uppercase mt-1">SKU: {item.variant_sku}</p>}
                                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                {Object.entries(item.attributes).map(([key, val]) => (
                                                    <span key={key} className="text-[10px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                                                        <span className="font-semibold capitalize">{key}:</span> {String(val)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold">{item.price_mad} dh</p>
                                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-4 bg-neutral-50/50 space-y-2 text-sm border-t border-neutral-200">
                            <div className="flex justify-between text-neutral-600">
                                <span>{t.subtotal}</span>
                                <span>{selectedOrder.subtotal_mad} dh</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>{t.amanaShipping}</span>
                                <span>{selectedOrder.shipping_cost_mad} dh</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-base">
                                <span>{t.amount}</span>
                                <span>{selectedOrder.total_mad} dh</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Buyer & Destination Details */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base">{t.buyer}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Name</span>
                            <span className="font-medium">{selectedOrder.customer_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Phone</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{selectedOrder.customer_phone}</span>
                                {phoneVerifiedIds.includes(selectedOrder.id) || selectedOrder.order_status !== 'pending' ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                    <button onClick={() => setVerifyingPhoneOrder(selectedOrder)} className="text-xs font-bold text-red-600 hover:underline">
                                        Verify
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Destination</span>
                            <span className="font-medium">{selectedOrder.shipping_city}</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-neutral-500 shrink-0">Address</span>
                            <span className="font-medium text-right">{selectedOrder.shipping_address}</span>
                        </div>
                    </CardContent>
                </Card>
              </div>

              {/* Sheet Actions Cluster */}
              <div className="bg-white p-4 border-t shrink-0 z-20 flex flex-wrap gap-2 justify-end mb-safe">
                {!(phoneVerifiedIds.includes(selectedOrder.id) || selectedOrder.order_status !== 'pending') && (
                    <button
                        onClick={() => setVerifyingPhoneOrder(selectedOrder)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {t.verifyBtn}
                    </button>
                )}
                <button
                  onClick={() => {
                    setUpdatingStatusOrder(selectedOrder);
                    setManualTrackingNum(selectedOrder.amana_tracking_number);
                  }}
                  disabled={selectedOrder.order_status === 'delivered'}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <MapPin className="w-4 h-4" />
                  {t.milestoneBtn}
                </button>
                <button
                  onClick={() => setActiveLabelOrder(selectedOrder)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {t.labelBtn}
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* MODAL 1: Barid Bank Amana shipping routing label */}
      {activeLabelOrder && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4">
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
                    <strong className="block text-sm">{shopFallback.name}</strong>
                    <span>ICE: {shopFallback.ice_number}</span>
                    <span className="block text-neutral-600 mt-1">{shopFallback.pickup_address_street}</span>
                    <span className="block font-bold mt-1">node origin: {shopFallback.merchant_city}</span>
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
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900">Moroccan COD Phone Validation</h3>
            </div>
            
            <p className="text-sm text-neutral-600 leading-relaxed">
              We are triggering an on-demand validation SMS containing a confirmation pin code to:
              <strong className="block text-black font-mono text-base py-2">{verifyingPhoneOrder.customer_phone}</strong>
              This ensures the buyer is active and limits delivery failures over the Amana logistics network.
            </p>
            
            <div className="border border-neutral-200 p-3 bg-neutral-50 rounded-lg font-mono text-xs text-neutral-500">
              SMS Payload: "Afus confirmation code [9284] for order of {verifyingPhoneOrder.total_mad} MAD. Please reply verify."
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setVerifyingPhoneOrder(null)}
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyPhone(verifyingPhoneOrder.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Update Amana delivery checkpoint */}
      {updatingStatusOrder && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-neutral-700" />
                </div>
                <h3 className="font-bold text-lg text-neutral-900 capitalize">{t.milestoneModalTitle}</h3>
              </div>
              <button onClick={() => setUpdatingStatusOrder(null)} className="text-neutral-400 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAmanaMilestone} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700">{t.deliveryStatus}</label>
                <select
                  value={newAmanaStatus}
                  onChange={(e) => setNewAmanaStatus(e.target.value)}
                  className="w-full border border-neutral-200 p-2.5 bg-white rounded-lg focus:border-neutral-400 focus:outline-none transition-colors"
                >
                  <option value="collected">Collected - Picked up from workshop</option>
                  <option value="in_transit">In Transit - Scanning center transfer</option>
                  <option value="out_for_delivery">Out for Delivery - Courier allocated</option>
                  <option value="delivered">Delivered - Paid cash collected</option>
                  <option value="delivery_failed">Delivery Failed - Customer unavailable</option>
                  <option value="returned_to_sender">Returned to Sender</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700">{t.trackingOverride}</label>
                <input
                  type="text"
                  value={manualTrackingNum}
                  onChange={(e) => setManualTrackingNum(e.target.value)}
                  className="w-full border border-neutral-200 p-2.5 bg-white rounded-lg focus:border-neutral-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700">{t.milestoneLocation}</label>
                <input
                  type="text"
                  required
                  value={newScanLocation}
                  onChange={(e) => setNewScanLocation(e.target.value)}
                  placeholder="e.g. Rabat Principal Sorting Center"
                  className="w-full border border-neutral-200 p-2.5 bg-white rounded-lg focus:border-neutral-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700">{t.milestoneNote}</label>
                <input
                  type="text"
                  value={newScanNote}
                  onChange={(e) => setNewScanNote(e.target.value)}
                  placeholder="e.g. Sorted into local distribution bin"
                  className="w-full border border-neutral-200 p-2.5 bg-white rounded-lg focus:border-neutral-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-neutral-800 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t.milestoneSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
