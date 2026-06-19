'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AutoPublisher() {
  useEffect(() => {
    const runPublish = async () => {
      // Temporarily valid until 2026-06-19T15:14:18+01:00
      const deadline = new Date('2026-06-19T15:14:18+01:00').getTime();
      if (Date.now() > deadline) return;

      if (localStorage.getItem('auto_published_to_db') === 'true') return;

      const sessionRaw = localStorage.getItem('afus_session_user');
      if (!sessionRaw) return;

      try {
        const session = JSON.parse(sessionRaw);
        
        // 1. Publish Store
        let realShopId = session.shop?.id;
        const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
        
        if (session.role === 'seller' && session.shop) {
          if (!isUUID(realShopId)) {
            // Need to insert shop
            const { data: shopData, error: shopError } = await supabase
              .from('shops')
              .insert({
                owner_id: session.id, // User ID should be a UUID if logged in via Supabase
                name: session.shop.name,
                slug: session.shop.slug || session.shop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
                merchant_city: session.shop.merchant_city || 'Marrakech',
                pickup_address_street: session.shop.pickup_address_street || 'Marrakech',
                ice_number: session.shop.ice_number || '123456789012345',
                is_verified: true,
              })
              .select()
              .single();
              
            if (!shopError && shopData) {
              realShopId = shopData.id;
              // Update session with real shop ID
              session.shop = shopData;
              localStorage.setItem('afus_session_user', JSON.stringify(session));
            }
          }
        }

        // 2. Publish Products
        if (realShopId && isUUID(realShopId)) {
          const productsRaw = localStorage.getItem('local_products');
          if (productsRaw) {
            const localProducts = JSON.parse(productsRaw);
            if (Array.isArray(localProducts)) {
              for (const p of localProducts) {
                // Ignore if already published (if it has a UUID id)
                if (isUUID(p.id)) continue;
                
                // Fallback category if needed. Ensure it's a UUID or just don't set if not allowed,
                // but products require category_id. The local products might have "cat_1" etc.
                let catId = p.category_id;
                // If catId is not UUID, try to fetch a default category or let it fail gracefully
                if (!isUUID(catId)) {
                  const { data: catData } = await supabase.from('categories').select('id').limit(1).single();
                  if (catData) {
                    catId = catData.id;
                  } else {
                    continue; // skip if we can't find a valid category
                  }
                }

                await supabase.from('products').insert({
                  shop_id: realShopId,
                  category_id: catId,
                  title_translations: p.title_translations || { en: 'Product', fr: 'Produit', ar: 'منتج' },
                  description_translations: p.description_translations || { en: '', fr: '', ar: '' },
                  slug_translations: p.slug_translations || { en: 'product-' + Math.floor(Math.random() * 1000) },
                  base_price_mad: p.base_price_mad || 0,
                  media_gallery: p.media_gallery || ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop'],
                  stock_quantity: p.stock_quantity || 1,
                  is_active: true,
                });
              }
            }
          }
        }

        // Mark as published
        localStorage.setItem('auto_published_to_db', 'true');
      } catch (err) {
        console.error('Auto publish failed:', err);
      }
    };

    runPublish();
  }, []);

  return null;
}
