import React from 'react';
import MessagesClient from './MessagesClient';

export default async function MessagesPage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return <MessagesClient lang={lang} />;
}
