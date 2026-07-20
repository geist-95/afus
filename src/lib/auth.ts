'use client';

import { supabase } from './supabase';

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  role: 'buyer' | 'seller' | 'admin';
  phone_number: string;
  avatar_url?: string | null;
  email_notifications_orders?: boolean;
  email_notifications_messages?: boolean;
  shop?: any;
}

export async function getActiveSession(): Promise<UserSession | null> {
  if (typeof window === 'undefined') return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (!profile) {
        const fallbackName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
        const fallbackAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email!,
            full_name: fallbackName,
            role: 'buyer',
            phone_number: '',
            avatar_url: fallbackAvatar,
            preferred_language: 'en',
          })
          .select()
          .single();
          
        if (newProfile) {
          profile = newProfile;
        } else {
          console.error('Failed to auto-create profile for user:', insertError);
        }
      }
        
      if (profile) {
        let shop = null;
        if (profile.role === 'seller') {
          const { data: shopData } = await supabase
            .from('shops')
            .select('*')
            .eq('owner_id', profile.id)
            .single();
          shop = shopData;
        }

        const activeUser: UserSession = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          phone_number: profile.phone_number,
          avatar_url: profile.avatar_url,
          email_notifications_orders: profile.email_notifications_orders,
          email_notifications_messages: profile.email_notifications_messages,
          shop,
        };

        // Standard cache to prevent loading flashes
        localStorage.setItem('afus_session_user', JSON.stringify(activeUser));
        return activeUser;
      }
    }
  } catch (err) {
    console.error('Failed to get active session from Supabase:', err);
  }

  return null;
}

export async function loginUser(email: string, password: string): Promise<UserSession> {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!session?.user) throw new Error('sign in failed: no user in session');

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileErr || !profile) {
    throw profileErr || new Error('profile not found in database');
  }

  let shop = null;
  if (profile.role === 'seller') {
    const { data: shopData } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', profile.id)
      .single();
    shop = shopData;
  }

  const userSession: UserSession = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    phone_number: profile.phone_number,
    avatar_url: profile.avatar_url,
    email_notifications_orders: profile.email_notifications_orders,
    email_notifications_messages: profile.email_notifications_messages,
    shop,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('afus_session_user', JSON.stringify(userSession));
  }

  return userSession;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: 'buyer' | 'seller';
  shopName?: string;
  logoUrl?: string;
  merchantCity?: string;
  pickupAddress?: string;
}): Promise<UserSession> {
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : undefined;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { emailRedirectTo: redirectTo },
  });

  if (signUpError) throw signUpError;
  if (!signUpData.user) throw new Error('sign up failed: no user returned');

  if (signUpData.session) {
    await supabase.auth.setSession(signUpData.session);
  }

  const userId = signUpData.user.id;
  const actualRole = payload.shopName ? 'seller' : (payload.role || 'buyer');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: payload.email,
      full_name: payload.fullName,
      role: actualRole,
      phone_number: payload.phone,
      preferred_language: 'en',
    })
    .select()
    .single();

  if (profileError) throw profileError;

  let shop = null;
  if (actualRole === 'seller') {
    const finalShopName = payload.shopName || `${payload.fullName}'s Shop`;
    const shopSlug = finalShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .insert({
        owner_id: userId,
        name: finalShopName,
        slug: shopSlug,
        merchant_city: payload.merchantCity || 'Marrakech',
        pickup_address_street: payload.pickupAddress || 'Derb Snan, Marrakech',
        ice_number: '123456789012345',
        is_verified: true,
        logo_url: payload.logoUrl,
      })
      .select()
      .single();

    if (shopError) {
      console.error('could not automatically create shop for seller:', shopError);
      throw shopError;
    } else {
      shop = shopData;
    }
  }

  const userSession: UserSession = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    phone_number: profile.phone_number,
    shop,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('afus_session_user', JSON.stringify(userSession));
  }

  return userSession;
}

export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('afus_session_user');
  }
  await supabase.auth.signOut();
}

export async function loginWithGoogle(): Promise<void> {
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : 'http://localhost:3000/auth/callback';

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error) throw error;
}

export async function loginWithGoogleToken(idToken: string): Promise<UserSession> {
  const { data: { session }, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) throw error;
  if (!session?.user) throw new Error('sign in failed: no user in session');

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileErr || !profile) {
    throw profileErr || new Error('profile not found in database');
  }

  let shop = null;
  if (profile.role === 'seller') {
    const { data: shopData } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', profile.id)
      .single();
    shop = shopData;
  }

  const userSession: UserSession = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    phone_number: profile.phone_number,
    avatar_url: profile.avatar_url,
    email_notifications_orders: profile.email_notifications_orders,
    email_notifications_messages: profile.email_notifications_messages,
    shop,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('afus_session_user', JSON.stringify(userSession));
  }

  return userSession;
}

export async function createShopForExistingUser(payload: {
  userId: string;
  fullName: string;
  phone: string;
  shopName: string;
  merchantCity: string;
  pickupAddress?: string;
  logoUrl?: string;
}): Promise<UserSession> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      role: 'seller',
      phone_number: payload.phone,
    })
    .eq('id', payload.userId)
    .select()
    .single();

  if (profileError) throw profileError;

  const finalShopName = payload.shopName;
  const shopSlug = finalShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
  const { data: shopData, error: shopError } = await supabase
    .from('shops')
    .insert({
      owner_id: payload.userId,
      name: finalShopName,
      slug: shopSlug,
      merchant_city: payload.merchantCity || 'Marrakech',
      pickup_address_street: payload.pickupAddress || 'Derb Snan, Marrakech',
      ice_number: '123456789012345',
      is_verified: true,
      logo_url: payload.logoUrl,
    })
    .select()
    .single();

  if (shopError) throw shopError;

  const userSession: UserSession = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    phone_number: profile.phone_number,
    avatar_url: profile.avatar_url,
    email_notifications_orders: profile.email_notifications_orders,
    email_notifications_messages: profile.email_notifications_messages,
    shop: shopData,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('afus_session_user', JSON.stringify(userSession));
  }

  return userSession;
}
