import { use } from 'react';
import StatelessInbox from '@/components/messaging/stateless-inbox';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function InboxPage({ params }: PageProps) {
  const { lang } = use(params);

  return (
    <div className="space-y-6">
      <div className="border-b border-black pb-2">
        <h1 className="text-3xl font-serif font-bold tracking-tight lowercase text-black">
          inbox messenger
        </h1>
        <p className="font-mono text-xs text-neutral-500 lowercase mt-1">
          stateless direct communication channel with craft guilds
        </p>
      </div>
      
      <StatelessInbox currentUserId="b1" lang={lang} />
    </div>
  );
}
