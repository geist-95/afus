'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  IconSearch,
  IconSend,
  IconPaperclip,
  IconDotsVertical,
  IconCheck,
  IconChecks,
  IconPhone,
  IconVideo,
  IconMessage2,
  IconEdit
} from '@tabler/icons-react';
import { getDictionary } from '@/lib/i18n';

// Mock Data
type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
};

type Conversation = {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
};

interface MessagesClientProps {
  lang: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [];

export default function MessagesClient({ lang }: MessagesClientProps) {
  const t = getDictionary(lang).messages;
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConvId) {
        return {
          ...conv,
          lastMessage: inputText,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    setInputText('');
  };

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    // Mark as read
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col font-sans -m-6 md:-m-8">
      <div className="flex h-full bg-white overflow-hidden rounded-xl border border-neutral-200 shadow-sm m-6 md:m-8">

        {/* Left Sidebar (Conversation List) */}
        <div className="w-full md:w-80 lg:w-96 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
          {/* Header */}
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 rounded-t-xl">
            <div className="relative max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={t.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`w-full text-left p-4 flex items-start gap-3 border-b border-neutral-100 hover:bg-neutral-100 transition-colors ${activeConvId === conv.id ? 'bg-primary/5 hover:bg-primary/5' : ''}`}
              >
                <div className="relative shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-neutral-900' : 'font-medium text-neutral-800'}`}>
                      {conv.name}
                    </h3>
                    <span className="text-[10px] text-neutral-500 shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-neutral-800' : 'text-neutral-500'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="shrink-0 mt-1">
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-none">
                      {conv.unreadCount}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Main Chat Area */}
        {activeConv ? (
          <div className="hidden md:flex flex-1 flex-col bg-white">
            {/* Chat Header */}
            <div className="h-auto p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={activeConv.avatar} alt={activeConv.name} className="w-10 h-10 rounded-full object-cover" />
                  {activeConv.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{t.title}</h1>
                  <p className="text-sm text-neutral-500 mt-1">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <IconEdit className="w-4 h-4" />
                  {t.newMessage}
                </button>
                <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                  <IconDotsVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
              <div className="space-y-6">
                {activeConv.messages.map((msg, index) => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm shadow-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-neutral-400 font-medium">{msg.timestamp}</span>
                        {isMe && (
                          msg.status === 'read' ? (
                            <IconChecks className="w-3.5 h-3.5 text-blue-500" />
                          ) : msg.status === 'delivered' ? (
                            <IconChecks className="w-3.5 h-3.5 text-neutral-400" />
                          ) : (
                            <IconCheck className="w-3.5 h-3.5 text-neutral-400" />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-neutral-100 rounded-full px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white border border-transparent focus-within:border-primary/30 transition-all">
                <button type="button" className="p-2 text-neutral-400 hover:text-primary transition-colors rounded-full shrink-0">
                  <IconPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-neutral-800 placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-primary text-white rounded-full shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <IconSend className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-[#FAFAFA]">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3 border border-neutral-100">
                <IconMessage2 className="w-6 h-6 text-neutral-400" />
              </div>
              <h4 className="text-neutral-900 font-bold mb-1">{t.noMessages}</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
