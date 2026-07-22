import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: 'userId and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Antes se confiaba en userId/email tal cual llegaban del cliente, sin
    // verificar que la sesión que llama realmente sea ese usuario. Eso
    // permitía generar sesiones de Stripe Checkout con metadata.user_id
    // arbitrario. Validamos el token contra el propio Supabase Auth.
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user || user.id !== userId || user.email !== email) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePriceId = Deno.env.get('STRIPE_PRICE_ID');
    const appUrl = Deno.env.get('APP_URL') || 'https://helping-coach.vercel.app';

    if (!stripeSecretKey || !stripePriceId) {
      return new Response(JSON.stringify({ error: `Stripe not configured. KEY=${!!stripeSecretKey} PRICE=${!!stripePriceId}` }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      'customer_email': email,
      'payment_method_types[]': 'card',
      'line_items[0][price]': stripePriceId,
      'line_items[0][quantity]': '1',
      'mode': 'subscription',
      'success_url': `${appUrl}?payment=success`,
      'cancel_url': `${appUrl}?payment=cancelled`,
      'metadata[user_id]': userId,
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Stripe error: ${session.error?.message || JSON.stringify(session)}` }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Exception: ${error.message}` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
