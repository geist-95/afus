import React from 'react';
import { MessageSquare } from 'lucide-react';

export default async function MessagesPage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="border-b border-neutral-200 bg-white px-6 py-4 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-neutral-800">
          Messages
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Communicate directly with your buyers regarding their orders.
        </p>
      </div>

      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px] w-full max-w-3xl shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">No new messages</h3>
          <p className="text-sm text-neutral-500 max-w-sm mt-2">
            You don't have any unread messages from buyers at the moment. When buyers contact you, their messages will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
