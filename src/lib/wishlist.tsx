'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WishlistItem {
  id: string;
  title: string;
  price_mad: number;
  image: string;
  shop_name: string;
  slug: string;
  numeric_id: number;
  lang: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  totalItems: number;
}

const defaultContext: WishlistContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isWishlisted: () => false,
  toggle: () => {},
  totalItems: 0,
};

const WishlistContext = createContext<WishlistContextType>(defaultContext);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('afus_wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to parse wishlist', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('afus_wishlist', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isWishlisted = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isWishlisted, toggle, totalItems }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * Returns wishlist context. Safe to call anywhere — returns a no-op default
 * if used outside WishlistProvider (avoids hard crashes during SSR/hydration).
 */
export function useWishlist(): WishlistContextType {
  return useContext(WishlistContext);
}
