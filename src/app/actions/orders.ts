"use server";

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function notifyOrderAcceptedServer(orderId: string, lang: string = 'en') {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, buyer_id, customer_name, total_mad')
      .eq('id', orderId)
      .single();

    if (error || !order || !order.buyer_id) {
      return { success: false, reason: "No buyer ID or order not found" };
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', order.buyer_id)
      .single();

    if (profile && profile.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const subject = lang === 'fr' ? 'Votre commande est confirmée ! 🎉' :
                      lang === 'ar' ? 'تم تأكيد طلبك ! 🎉' :
                      'Your order is confirmed ! 🎉';

      const text1 = lang === 'fr' ? 'Bonne nouvelle ! L\'artisan a accepté votre commande.' :
                    lang === 'ar' ? 'أخبار جيدة! لقد قبل الحرفي طلبك.' :
                    'Good news! The artisan has accepted your order.';
                    
      const text2 = lang === 'fr' ? 'Vous pouvez suivre l\'état de votre commande depuis votre espace client.' :
                    lang === 'ar' ? 'يمكنك تتبع حالة طلبك من مساحة العميل الخاصة بك.' :
                    'You can track the status of your order from your customer area.';
                    
      const buttonText = lang === 'fr' ? 'Suivre ma commande' :
                         lang === 'ar' ? 'تتبع طلبي' :
                         'Track my order';

      // We use localhost for dev and the actual domain for prod.
      // We'll just hardcode localhost if there's no NEXT_PUBLIC_SITE_URL, or use the variable.
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Afus <onboarding@resend.dev>',
        to: profile.email,
        subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h1 style="color: #663399; margin-bottom: 10px;">${subject}</h1>
            <p style="font-size: 16px; color: #333;">Bonjour ${order.customer_name},</p>
            <p style="font-size: 16px; color: #333;">${text1}</p>
            <p style="font-size: 16px; color: #333;">${text2}</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${siteUrl}/${lang}/orders" style="display: inline-block; background-color: #663399; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">${buttonText}</a>
            </div>
          </div>
        `
      });
      return { success: true };
    }
    return { success: false, reason: "No email or missing resend key" };
  } catch (e: any) {
    console.error("notifyOrderAcceptedServer error:", e);
    return { success: false, error: e.message };
  }
}
