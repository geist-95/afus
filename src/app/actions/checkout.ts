"use server";

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function placeCODCheckoutServer(checkoutData: any) {
  try {
    const { data, error } = await supabaseAdmin.rpc('place_cod_checkout', {
      p_buyer_id: checkoutData.buyer_id || null,
      p_customer_name: checkoutData.customer_name,
      p_customer_phone: checkoutData.customer_phone,
      p_shipping_city: checkoutData.shipping_city,
      p_shipping_address: checkoutData.shipping_address,
      p_items: checkoutData.items,
    });
    
    if (error) {
      console.error("placeCODCheckoutServer error:", error);
      return { success: false, error: error.message };
    }
    
    // Notify shop owners
    if (data && data.order_ids && data.order_ids.length > 0) {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('id, shop_id, shops(owner_id)')
        .in('id', data.order_ids);

      if (orders) {
        for (const order of orders) {
          const shopData = Array.isArray(order.shops) ? order.shops[0] : order.shops;
          const ownerId = (shopData as any)?.owner_id;
          if (ownerId) {
            // 1. In-App Notification
            await supabaseAdmin.from('notifications').insert({
              recipient_id: ownerId,
              category: 'order_update',
              slug_route: `/fr/dashboard/orders`,
              message_translations: {
                en: "You have received a new order!",
                fr: "Vous avez reçu une nouvelle commande !",
                ar: "لقد تلقيت طلبًا جديدًا!"
              }
            });

            // 2. Email Notification
            if (process.env.RESEND_API_KEY) {
              try {
                const { data: profile } = await supabaseAdmin
                  .from('profiles')
                  .select('email, email_notifications_orders')
                  .eq('id', ownerId)
                  .single();

                if (profile && profile.email && profile.email_notifications_orders !== false) {
                  const resend = new Resend(process.env.RESEND_API_KEY);
                  await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'Afus <onboarding@resend.dev>',
                    to: profile.email,
                    subject: 'Nouvelle commande sur Afus ! 🎉',
                    html: `
                      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                        <h1 style="color: #663399; margin-bottom: 10px;">Félicitations !</h1>
                        <p style="font-size: 16px; color: #333;">Vous avez reçu une nouvelle commande !</p>
                        <p style="font-size: 16px; color: #333;">Veuillez vérifier votre tableau de bord pour préparer l'expédition Amana de cette commande et consulter les détails du client.</p>
                        <div style="margin-top: 30px; text-align: center;">
                          <a href="http://localhost:3000/fr/dashboard/orders" style="display: inline-block; background-color: #663399; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">Consulter la commande</a>
                        </div>
                      </div>
                    `
                  });
                }
              } catch (emailErr) {
                console.error("Failed to send Resend email:", emailErr);
              }
            }
          }
        }
      }
    }
    
    return { success: true, data };
  } catch (err: any) {
    console.error("placeCODCheckoutServer exception:", err);
    return { success: false, error: err.message };
  }
}
