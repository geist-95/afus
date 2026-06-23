'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchOrders, fetchShops, updateAmanaMilestone, updateOrderTracking } from '@/lib/supabase';
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
  customization_instructions?: string | null;
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'clients'>('orders');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [verifyingPhoneOrder, setVerifyingPhoneOrder] = useState<Order | null>(null);
  const [phoneVerifiedIds, setPhoneVerifiedIds] = useState<string[]>([]);
  const [confirmingStatusOrder, setConfirmingStatusOrder] = useState<{order: Order, nextStatus: string} | null>(null);

  // Tracking update state
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

  // Filter orders by tracking search and status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.order_status !== statusFilter) {
      return false;
    }
    if (activeTrackingSearch.trim()) {
      return order.amana_tracking_number.toLowerCase() === activeTrackingSearch.toLowerCase().trim();
    }
    return true;
  });

  // Derived unique clients
  const uniqueClients = useMemo(() => {
    const clientsMap: Record<string, any> = {};
    orders.forEach(order => {
      // Use phone as the unique identifier for a client
      const key = order.customer_phone;
      if (!clientsMap[key]) {
        clientsMap[key] = {
          name: order.customer_name,
          phone: order.customer_phone,
          city: order.shipping_city,
          address: order.shipping_address,
          total_spent: 0,
          order_count: 0,
          latest_order_date: order.created_at,
          items: order.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            ...(item.attributes?.note ? { attributes: { note: item.attributes.note } } : {}),
          })),
        };
      }
      if (order.order_status?.toLowerCase() !== 'cancelled') {
        clientsMap[key].total_spent += order.total_mad;
        clientsMap[key].order_count += 1;
      }
      // update latest date
      if (new Date(order.created_at) > new Date(clientsMap[key].latest_order_date)) {
        clientsMap[key].latest_order_date = order.created_at;
      }
    });
    // Convert to array and sort by latest order date
    return Object.values(clientsMap).sort((a, b) => new Date(b.latest_order_date).getTime() - new Date(a.latest_order_date).getTime());
  }, [orders]);

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

  // Inline Tracking Number Save
  const handleSaveTracking = async (trackingNum: string) => {
    if (!selectedOrder) return;
    await updateOrderTracking(selectedOrder.id, trackingNum);
    
    const dbOrders = activeShop ? await fetchOrders(activeShop.id) : [];
    setOrders(dbOrders as Order[]);

    // Update the currently viewed order in the sheet
    const updatedOrder = dbOrders.find((o: Order) => o.id === selectedOrder.id);
    if (updatedOrder) setSelectedOrder(updatedOrder as Order);
  };

  // Change Status with confirmation
  const handleConfirmStatus = async (nextStatus: string) => {
    if (!selectedOrder) return;
    await updateAmanaMilestone(selectedOrder.id, {
      status: selectedOrder.amana_delivery_status,
      location: shopFallback.merchant_city,
      note: `order status changed to ${nextStatus}`,
      order_status: nextStatus,
      skip_history: true
    });
    const dbOrders = activeShop ? await fetchOrders(activeShop.id) : [];
    setOrders(dbOrders as Order[]);

    const updatedOrder = dbOrders.find((o: Order) => o.id === selectedOrder.id);
    if (updatedOrder) setSelectedOrder(updatedOrder as Order);
    
    setConfirmingStatusOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'shipped': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        case 'returned': return 'bg-red-100 text-red-800 hover:bg-red-100';
        case 'cancelled': return 'bg-neutral-100 text-neutral-600 hover:bg-neutral-100 border border-neutral-200';
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
      {/* Title & Tabs Section (White Background) */}
      <div className="border-b border-neutral-200 bg-white flex flex-col">
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4 border-b border-neutral-100">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-800 capitalize">
              {t.consoleTitle}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        {/* Full Width Tabs */}
        <div className="flex w-full">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 text-sm font-semibold py-3 border-b-2 transition-colors ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex-1 text-sm font-semibold py-3 border-b-2 transition-colors ${activeTab === 'clients' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'}`}
          >
            Clients
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-6xl flex-1 space-y-8">

        {activeTab === 'orders' ? (
          <>
            <div className="flex flex-row gap-3 mb-6">
              {/* Global Tracking Lookup Input */}
              <div className="relative flex items-center w-full md:flex-1">
                <Search className="w-4 h-4 absolute left-3 text-neutral-400" />
                <input
                  type="text"
                  value={activeTrackingSearch}
                  onChange={(e) => setActiveTrackingSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full border border-neutral-200 py-2.5 pl-9 pr-4 bg-white focus:border-neutral-300 focus:outline-none rounded-xl text-sm transition-all placeholder-neutral-400"
                />
                {activeTrackingSearch && (
                  <button
                    onClick={() => setActiveTrackingSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded text-neutral-600 transition-colors font-medium"
                  >
                    {t.clearSearch}
                  </button>
                )}
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-neutral-200 py-2.5 px-4 pr-8 bg-white focus:border-neutral-300 focus:outline-none rounded-xl text-sm transition-all md:w-48 appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

        {/* View 1: The Order Card (Overview) */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 p-8 md:p-12 text-center text-neutral-400 bg-white">
            {t.emptyOrders}
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 md:hidden gap-6">
              {filteredOrders.map((order) => {
                return (
                <Card key={order.id} className="overflow-hidden border-neutral-200 hover:border-neutral-300 transition-colors">
                  <CardHeader className="pb-3 border-b bg-neutral-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-mono tracking-tight mt-1">{order.id.substring(0,8)}</CardTitle>
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
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">{order.customer_name}</p>
                            <p className="text-xs text-neutral-600">{order.customer_phone}</p>
                            <div className="flex items-start text-xs text-neutral-500 gap-1 mt-1">
                                <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                <span className="line-clamp-2 leading-relaxed">{order.shipping_address}, {order.shipping_city}</span>
                            </div>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded object-cover bg-neutral-100 shrink-0 border border-neutral-200" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
                              <Package className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
                            <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Customization Notes */}
                    {order.items.some(item => item.attributes?.note) && (
                      <div className="flex flex-col gap-1">
                        {order.items.filter(item => item.attributes?.note).map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-2.5 py-1.5">
                            <span className="shrink-0 mt-0.5">✏️</span>
                            <span><span className="font-semibold">{item.customization_instructions || 'Sur commande'}:</span> {item.attributes!.note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
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

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-50/80">
                  <TableRow>
                    <TableHead className="font-semibold text-neutral-900">{t.orderId}</TableHead>
                    <TableHead className="font-semibold text-neutral-900">{t.buyer}</TableHead>
                    <TableHead className="font-semibold text-neutral-900">{t.items}</TableHead>
                    <TableHead className="font-semibold text-neutral-900">{t.amount}</TableHead>
                    <TableHead className="font-semibold text-neutral-900">{t.status}</TableHead>
                    <TableHead className="text-right font-semibold text-neutral-900"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id} className="hover:bg-neutral-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <TableCell className="font-mono text-xs text-neutral-600 align-top pt-4">
                        {order.id.substring(0,8)}
                        <span className="block text-[10px] text-neutral-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <p className="text-sm font-semibold text-neutral-900">{order.customer_name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{order.customer_phone}</p>
                        <div className="flex items-start text-xs text-neutral-500 gap-1 mt-1">
                          <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-neutral-400" />
                          <span className="line-clamp-1">{order.shipping_city}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <div className="flex -space-x-2 relative z-0">
                           {order.items.slice(0, 3).map((item, idx) => item.image_url ? (
                             <img key={idx} src={item.image_url} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-neutral-100 shadow-sm relative" style={{ zIndex: 3 - idx }} />
                           ) : (
                             <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center shadow-sm relative" style={{ zIndex: 3 - idx }}>
                               <Package className="w-3 h-3 text-neutral-400" />
                             </div>
                           ))}
                           {order.items.length > 3 && (
                             <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600 shadow-sm relative z-0">
                               +{order.items.length - 3}
                             </div>
                           )}
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-1.5 block">{order.items.length} {t.items}</span>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <span className="font-semibold text-neutral-900">{order.total_mad} MAD</span>
                        {order.items.some(i => i.attributes?.note) && (
                          <span className="block text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded mt-1.5 w-fit">Has Notes</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.order_status}
                            onChange={async (e) => {
                              const nextStatus = e.target.value;
                              await updateAmanaMilestone(order.id, {
                                status: order.amana_delivery_status,
                                location: shopFallback?.merchant_city || '',
                                note: `order status changed to ${nextStatus}`,
                                order_status: nextStatus,
                                skip_history: true
                              });
                              const dbOrders = activeShop ? await fetchOrders(activeShop.id) : [];
                              setOrders(dbOrders as Order[]);
                            }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none appearance-none capitalize transition-colors ${getStatusColor(order.order_status)}`}
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.55rem auto', paddingRight: '2rem' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="returned">Returned</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-top pt-4">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                            className="bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shadow-sm group-hover:border-neutral-300 flex items-center gap-1.5 ml-auto"
                        >
                            <Navigation className="w-3 h-3" />
                            {t.trackShipment}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
          </>
        ) : (
          <div className="space-y-4">
            {uniqueClients.map((client, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-neutral-300">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-neutral-900">{client.name}</h3>
                  <div className="text-sm text-neutral-500 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {client.city}</span>
                    <span className="flex items-center gap-1">📞 {client.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-sm text-neutral-600 bg-neutral-50 px-6 py-3 rounded-lg border border-neutral-100">
                  <div className="text-center">
                    <p className="font-bold text-black text-base">{client.order_count}</p>
                    <p className="text-xs uppercase tracking-wider mt-0.5">Orders</p>
                  </div>
                  <div className="w-px h-8 bg-neutral-200"></div>
                  <div className="text-center">
                    <p className="font-bold text-black text-base">{client.total_spent} <span className="text-xs text-neutral-500">MAD</span></p>
                    <p className="text-xs uppercase tracking-wider mt-0.5">Total Spent</p>
                  </div>
                </div>
              </div>
            ))}
            {uniqueClients.length === 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden p-8 text-center text-neutral-500">
                <h3 className="font-bold text-lg text-black mb-2">No Clients Yet</h3>
                <p className="text-sm">When you receive orders, your clients will automatically appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>

        {/* View 2: The Detailed Order Drawer (Sheet) */}
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

                {/* Logistics Timeline */}
                <Card>
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <History className="w-4 h-4" />
                            {t.historyTitle}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              placeholder="AM...MA" 
                              value={manualTrackingNum} 
                              onChange={(e) => setManualTrackingNum(e.target.value)} 
                              className="w-[140px] border border-neutral-200 p-1.5 text-xs bg-white rounded focus:border-neutral-400 focus:outline-none" 
                            />
                            <button onClick={() => handleSaveTracking(manualTrackingNum)} className="bg-black text-white px-3 py-1.5 text-xs rounded font-semibold hover:bg-neutral-800 transition-colors">
                                Save
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-5">
                        {selectedOrder.amana_history.filter((log, index, self) => index === self.findIndex((t) => (t.status === log.status && t.timestamp === log.timestamp))).map((log, index) => (
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
                                            <div className="mt-2 flex flex-col gap-1.5">
                                                {item.attributes.note && (
                                                    <div className="flex items-start gap-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-2.5 py-1.5">
                                                        <span className="shrink-0 mt-0.5">✏️</span>
                                                        <span><span className="font-semibold">{item.customization_instructions || 'Sur commande'}:</span> {item.attributes.note}</span>
                                                    </div>
                                                )}
                                                {Object.entries(item.attributes).filter(([k]) => k !== 'note').length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {Object.entries(item.attributes).filter(([k]) => k !== 'note').map(([key, val]) => (
                                                            <span key={key} className="text-[10px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                                                                <span className="font-semibold capitalize">{key}:</span> {String(val)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
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
                {selectedOrder.order_status === 'pending' && (
                    <button
                        onClick={() => setConfirmingStatusOrder({ order: selectedOrder, nextStatus: 'confirmed' })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-2.5 text-sm font-bold rounded-lg transition-colors"
                    >
                        Mark as Confirmed
                    </button>
                )}
                {selectedOrder.order_status === 'confirmed' && (
                    <button
                        onClick={() => setConfirmingStatusOrder({ order: selectedOrder, nextStatus: 'shipped' })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-bold rounded-lg transition-colors"
                    >
                        Mark as Shipped
                    </button>
                )}
                {selectedOrder.order_status === 'shipped' && (
                    <button
                        onClick={() => setConfirmingStatusOrder({ order: selectedOrder, nextStatus: 'delivered' })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-sm font-bold rounded-lg transition-colors"
                    >
                        Mark as Delivered
                    </button>
                )}
                {selectedOrder.order_status !== 'cancelled' && selectedOrder.order_status !== 'delivered' && (
                    <button
                        onClick={() => setConfirmingStatusOrder({ order: selectedOrder, nextStatus: 'cancelled' })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 text-sm font-bold rounded-lg transition-colors"
                    >
                        Cancel Order
                    </button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* (Label Modal removed) */}

      {/* MODAL 2: SMS Verification Trigger */}
      {verifyingPhoneOrder && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full p-6 space-y-5">
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

      {/* MODAL 3: Confirm Status Change */}
      {confirmingStatusOrder && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
              <h3 className="font-bold text-lg text-neutral-900 capitalize">
                {lang === 'fr' ? 'Confirmer le statut' : lang === 'ar' ? 'تأكيد الحالة' : 'Confirm Status Change'}
              </h3>
              <button onClick={() => setConfirmingStatusOrder(null)} className="text-neutral-400 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-neutral-600">
              {lang === 'fr' ? 'Êtes-vous sûr de vouloir marquer cette commande comme' : lang === 'ar' ? 'هل أنت متأكد من تغيير الحالة إلى' : 'Are you sure you want to mark this order as'} <strong className="capitalize text-black">{confirmingStatusOrder.nextStatus}</strong>? {lang === 'fr' ? 'Cette action est irréversible.' : 'This action cannot be reversed.'}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmingStatusOrder(null)}
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmStatus(confirmingStatusOrder.nextStatus)}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
