'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockChats, mockProducts } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  product_context?: {
    product_id: string;
    title: string;
    price: number;
    image_url?: string;
  };
}

interface ChatRoom {
  id: string;
  shop_id: string;
  shop_name: string;
  buyer_id: string;
  buyer_name: string;
  messages: Message[];
}

export default function StatelessInbox({ currentUserId = 'b1', lang = 'en' }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Load initial chat rooms
  useEffect(() => {
    // Inject mock details into initial state
    const formattedRooms = mockChats.map((chat) => {
      const messagesWithImages = chat.messages.map((msg) => {
        if (msg.product_context) {
          const prod = mockProducts.find((p) => p.id === msg.product_context?.product_id);
          return {
            ...msg,
            product_context: {
              ...msg.product_context,
              image_url: prod?.media_gallery[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=80&h=80&fit=crop',
            },
          };
        }
        return msg;
      });
      return {
        ...chat,
        messages: messagesWithImages,
      };
    });

    setRooms(formattedRooms);
    if (formattedRooms.length > 0) {
      setActiveRoomId(formattedRooms[0].id);
    }
  }, []);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  // Manual async pull representing HTTP POST/GET poll requests (no websockets)
  const refreshInbox = async () => {
    setIsRefreshing(true);
    // Simulate query overhead
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // In a live system, this runs a stateless fetch:
    // fetch(`/api/messages?userId=${currentUserId}`)
    
    // For local simulation, we can add a mock system message if it's the first refresh
    setRooms((prevRooms) => {
      return prevRooms.map((room) => {
        const hasAlert = room.messages.some((m) => m.id === 'system_alert_refresh');
        if (hasAlert) return room;
        
        return {
          ...room,
          messages: [
            ...room.messages,
            {
              id: 'system_alert_refresh',
              sender_id: 'system',
              message: 'system confirmation: amana courier pickup scheduled for order AM918273645MA.',
              created_at: new Date().toISOString(),
            },
          ],
        };
      });
    });
    setIsRefreshing(false);
  };

  // Stateless message post pipeline simulation
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeRoomId) return;

    setIsSending(true);
    const textToSend = replyText;
    setReplyText('');

    // Simulate backend payload compression & latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newMessage: Message = {
      id: Math.random().toString(),
      sender_id: currentUserId,
      message: textToSend,
      created_at: new Date().toISOString(),
    };

    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === activeRoomId) {
          return {
            ...room,
            messages: [...room.messages, newMessage],
          };
        }
        return room;
      })
    );

    setIsSending(false);

    // Simulate seller automated response 1 second later (since it is a two-sided simulation)
    setTimeout(() => {
      const sellerReply: Message = {
        id: Math.random().toString(),
        sender_id: 'seller_owner',
        message: 'thank you for your message. we are packing your item. tracking details are attached to your orders dashboard.',
        created_at: new Date().toISOString(),
      };
      
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id === activeRoomId) {
            return {
              ...room,
              messages: [...room.messages, sellerReply],
            };
          }
          return room;
        })
      );
    }, 1200);
  };

  // Translation mapping
  const labels: Record<string, Record<string, string>> = {
    en: {
      inboxTitle: "inbox messages",
      refreshBtn: "refresh inbox",
      noRooms: "no messages available.",
      typingPlaceholder: "type your reply...",
      sendBtn: "send reply",
      senderYou: "you",
      discussingItem: "discussing item:",
      viewListing: "view listing",
      manualSyncText: "stateless connection: press refresh to query updates.",
      refreshConvBtn: "refresh conversation",
    },
    fr: {
      inboxTitle: "messagerie",
      refreshBtn: "actualiser la boîte",
      noRooms: "aucun message disponible.",
      typingPlaceholder: "écrivez votre réponse...",
      sendBtn: "envoyer",
      senderYou: "vous",
      discussingItem: "concerne l'article :",
      viewListing: "voir la fiche",
      manualSyncText: "liaison sans état : actualisez manuellement pour recevoir.",
      refreshConvBtn: "actualiser la discussion",
    },
    ar: {
      inboxTitle: "صندوق الرسائل",
      refreshBtn: "تحديث الصندوق",
      noRooms: "لا توجد رسائل.",
      typingPlaceholder: "اكتب ردك هنا...",
      sendBtn: "إرسال الرد",
      senderYou: "أنت",
      discussingItem: "بخصوص السلعة:",
      viewListing: "عرض السلعة",
      manualSyncText: "اتصال غير مستمر: اضغط على تحديث لجلب الرسائل الجديدة.",
      refreshConvBtn: "تحديث المحادثة",
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 border border-black bg-white min-h-[580px]">
      {/* Left Column: Thread Selector */}
      <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-black flex flex-col justify-between bg-neutral-50">
        <div className="p-4 border-b border-black flex items-center justify-between bg-white">
          <h2 className="text-lg font-serif font-bold lowercase">{t.inboxTitle}</h2>
          <button
            onClick={refreshInbox}
            disabled={isRefreshing}
            className="border border-black px-2 py-1 text-[10px] font-mono hover:bg-neutral-50 disabled:opacity-55 active:bg-neutral-200 transition-colors cursor-pointer rounded-none"
          >
            {isRefreshing ? '⌛ ...' : `🔄 ${t.refreshBtn}`}
          </button>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-black max-h-[480px]">
          {rooms.length === 0 ? (
            <div className="p-6 text-center text-neutral-400 font-mono text-[10px] lowercase">
              {t.noRooms}
            </div>
          ) : (
            rooms.map((room) => {
              const lastMsg = room.messages[room.messages.length - 1];
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left p-4 flex flex-col gap-1 transition-colors duration-100 rounded-none cursor-pointer ${
                    activeRoomId === room.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm lowercase">{room.shop_name}</span>
                    {lastMsg && (
                      <span className={`text-[9px] font-mono ${activeRoomId === room.id ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  {lastMsg && (
                    <p className={`text-xs font-mono truncate w-full ${activeRoomId === room.id ? 'text-neutral-300' : 'text-neutral-600'} lowercase`}>
                      {lastMsg.sender_id === currentUserId ? `${t.senderYou}: ` : ''}
                      {lastMsg.message}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Sync Info Footer */}
        <div className="p-3 border-t border-black bg-neutral-100 font-mono text-[9px] text-neutral-500 leading-tight lowercase">
          ℹ️ {t.manualSyncText}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div className="md:col-span-8 flex flex-col justify-between min-h-[480px] bg-white">
        {activeRoom ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-black flex justify-between items-center bg-white font-mono text-xs lowercase">
              <div>
                <span className="font-serif font-bold text-base block text-black">{activeRoom.shop_name}</span>
                <span className="text-[10px] text-neutral-400">buyer node: {activeRoom.buyer_name}</span>
              </div>
              <button
                onClick={refreshInbox}
                className="border border-black px-2 py-1 text-[10px] hover:bg-neutral-50 active:bg-neutral-200 rounded-none"
              >
                🔄 {t.refreshConvBtn}
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] bg-neutral-50">
              {activeRoom.messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                const isSystem = msg.sender_id === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="border border-yellow-600 bg-yellow-50 text-yellow-800 text-[10px] font-mono px-3 py-1.5 max-w-md text-center lowercase">
                        ⚠️ {msg.message}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-md space-y-2">
                      {/* Product context card integration */}
                      {msg.product_context && (
                        <div className="border border-black bg-white p-3 flex gap-3 text-left shadow-flat-sm rounded-none">
                          {msg.product_context.image_url && (
                            <div className="w-10 h-10 border border-black overflow-hidden bg-neutral-100 flex-shrink-0">
                              <img src={msg.product_context.image_url} alt="product context" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 font-mono text-[10px] lowercase flex flex-col justify-between">
                            <div>
                              <span className="text-neutral-400 block">{t.discussingItem}</span>
                              <span className="font-bold text-neutral-800 line-clamp-1">{msg.product_context.title}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-1">
                              <span className="font-bold">{msg.product_context.price} MAD</span>
                              <Link
                                href={`/${lang}/listing/${msg.product_context.product_id}/discuss`}
                                className="underline hover:text-neutral-600 font-bold"
                              >
                                {t.viewListing}
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bubble Text */}
                      <div
                        className={`p-3 border border-black font-mono text-xs lowercase ${
                          isMe
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.message}</p>
                        <span className={`block text-[8px] text-right mt-1.5 ${isMe ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Editor Form */}
            <form onSubmit={handleSendMessage} className="border-t border-black p-4 bg-white flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t.typingPlaceholder}
                disabled={isSending}
                className="flex-1 border border-black px-4 py-3 text-xs font-mono focus:outline-none focus:ring-0 placeholder-neutral-400 rounded-none bg-neutral-50"
              />
              <button
                type="submit"
                disabled={isSending || !replyText.trim()}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-mono tracking-widest px-6 py-3 border border-black uppercase disabled:opacity-40 transition-colors rounded-none"
              >
                {isSending ? '...' : t.sendBtn}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-neutral-400 lowercase">
            select a thread to view chat logs.
          </div>
        )}
      </div>
    </div>
  );
}
