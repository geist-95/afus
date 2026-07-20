'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  // Use the client ID from env or fallback to the one seen in the screenshots
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '376383056769-2jifvdsfcpk38uhpqa3oiqeqq4gtjei4.apps.googleusercontent.com';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
