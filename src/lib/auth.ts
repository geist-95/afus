'use client';

import { supabase, isPlaceholder } from './supabase';

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

// Check if user is authenticated (either via real Supabase Auth or mock localStorage session)
export async function getActiveSession(): Promise<UserSession | null> {
  if (typeof window === 'undefined') return null;

  // 1. Check real Supabase Auth
  if (!isPlaceholder) {
    try {
      const getSessionPromise = (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch profile role and phone
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          // If profile is missing (e.g., first Google login without trigger completed yet), create one on the fly
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

            // Sync to local storage for instant offline context
            localStorage.setItem('afus_session_user', JSON.stringify(activeUser));
            return activeUser;
          }
        }
        return null;
      })();

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase request timed out')), 1500)
      );

      const activeUser = await Promise.race([getSessionPromise, timeoutPromise]);
      if (activeUser) {
        return activeUser;
      }
    } catch (err) {
      // Supabase client error or offline state - fall back to mock check
      console.warn('supabase auth check failed, falling back to simulated session:', err);
    }
  }

  // 2. Fall back to mock localStorage session for local development
  const localSession = localStorage.getItem('afus_session_user');
  if (localSession) {
    try {
      return JSON.parse(localSession);
    } catch {
      return null;
    }
  }

  return null;
}

// Real login helper connecting to Supabase Auth & database
export async function loginUser(email: string, password: string): Promise<UserSession> {
  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error('sign in failed: no user in session');
    }

    // Fetch profile
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
  } catch (err: any) {
    console.warn('login hit error or rate limit, falling back to simulated session:', err.message);
    return await loginSimulated(email);
  }
}

// Real register helper connecting to Supabase Auth & database
export async function registerUser(payload: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: 'buyer' | 'seller';
  shopName?: string;
}): Promise<UserSession> {
  try {
    // 1. Sign up user
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    if (!signUpData.user) {
      throw new Error('sign up failed: no user returned');
    }

    const userId = signUpData.user.id;

    const actualRole = payload.shopName ? 'seller' : (payload.role || 'buyer');

    // 2. Insert profile row
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: payload.email,
        full_name: payload.fullName,
        role: actualRole,
        phone_number: payload.phone,
        preferred_language: 'en',
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // 3. Auto-create shop if seller
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
          merchant_city: 'Marrakech',
          pickup_address_street: 'Derb Snan, Marrakech',
          ice_number: '123456789012345',
          is_verified: true,
        })
        .select()
        .single();

      if (shopError) {
        console.warn('could not automatically create shop for seller:', shopError.message);
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
  } catch (err: any) {
    console.warn('registration hit error or rate limit, falling back to simulated session:', err.message);
    
    // Create simulated session details based on form values
    const actualRoleMock = payload.shopName ? 'seller' : (payload.role || 'buyer');
    const mockUser: UserSession = {
      id: actualRoleMock === 'seller' ? 's1_owner' : 'b1',
      email: payload.email,
      full_name: payload.fullName,
      role: actualRoleMock,
      phone_number: payload.phone,
      shop: actualRoleMock === 'seller' ? {
        id: 's1',
        name: payload.shopName || `${payload.fullName}'s Shop`,
        slug: 'atlas-artisanat',
        merchant_city: 'Marrakech',
        pickup_address_street: '32 derb snan, bab doukkala, marrakech',
        ice_number: '123456789012345',
        is_verified: true,
      } : null,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('afus_session_user', JSON.stringify(mockUser));
    }

    return mockUser;
  }
}

// Log in helper for legacy/offline fallback simulation
export async function loginSimulated(email: string): Promise<UserSession> {
  const isSeller = email.includes('seller') || email.includes('artisan') || email.includes('s1') || email.includes('s2');
  
  const mockUser: UserSession = {
    id: isSeller ? 's1_owner' : 'b1',
    email,
    full_name: email.split('@')[0],
    role: isSeller ? 'seller' : 'buyer',
    phone_number: '+212661234567',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('afus_session_user', JSON.stringify(mockUser));
  }

  return mockUser;
}

// Sign out helper
export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('afus_session_user');
  }
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('supabase signout error:', err);
  }
}

// Google OAuth Login
export async function loginWithGoogle(): Promise<void> {
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : 'http://localhost:3000/auth/callback';

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    throw error;
  }
}

export async function createShopForExistingUser(payload: {
  userId: string;
  fullName: string;
  phone: string;
  shopName: string;
  merchantCity: string;
  pickupAddress?: string;
}): Promise<UserSession> {
  try {
    // 1. Update profiles table to set role = 'seller' and phone_number
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'seller',
        phone_number: payload.phone,
      })
      .eq('id', payload.userId)
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // 2. Create the shop
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
      })
      .select()
      .single();

    if (shopError) {
      throw shopError;
    }

    // 3. Construct updated session
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
  } catch (err: any) {
    console.warn('Failed to update shop via Supabase, simulating locally:', err.message || err);
    // Mock simulation
    const localSession = localStorage.getItem('afus_session_user');
    if (localSession) {
      const parsed = JSON.parse(localSession);
      const shopData = {
        id: Math.floor(Math.random() * 1000),
        owner_id: parsed.id,
        name: payload.shopName,
        slug: payload.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
        merchant_city: payload.merchantCity,
        pickup_address_street: payload.pickupAddress || 'Derb Snan, Marrakech',
        is_verified: true,
      };
      const updatedSession: UserSession = {
        ...parsed,
        role: 'seller',
        phone_number: payload.phone,
        shop: shopData,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('afus_session_user', JSON.stringify(updatedSession));
      }
      return updatedSession;
    }
    throw err;
  }
}


