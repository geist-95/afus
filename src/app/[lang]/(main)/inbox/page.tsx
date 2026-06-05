import React, { use } from 'react';
import MessagesClient from '../../dashboard/messages/MessagesClient';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function InboxPage({ params }: PageProps) {
  const { lang } = use(params);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 min-h-[calc(100vh-80px)]">
      <MessagesClient lang={lang} />
    </div>
  );
}
