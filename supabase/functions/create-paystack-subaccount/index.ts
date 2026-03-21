// Supabase Edge Function: create-paystack-subaccount
// Runs on Deno. Called after a venue is registered to create
// a Paystack subaccount so the owner can receive automatic payouts.
//
// Deploy with:
//   supabase functions deploy create-paystack-subaccount --no-verify-jwt
//
// Required Supabase secrets (set via Supabase dashboard → Edge Functions → Secrets):
//   PAYSTACK_SECRET_KEY  — your Paystack secret key (sk_test_... or sk_live_...)
//   SUPABASE_URL         — auto-provided by Supabase
//   SUPABASE_SERVICE_ROLE_KEY — auto-provided by Supabase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { venue_id, business_name, bank_code, account_number } = await req.json();

    if (!venue_id || !business_name || !bank_code || !account_number) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecret) {
      return new Response(
        JSON.stringify({ error: 'Paystack secret key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Paystack subaccount
    const paystackRes = await fetch('https://api.paystack.co/subaccount', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name,
        settlement_bank: bank_code,
        account_number,
        percentage_charge: 10, // platform keeps 10%, owner gets 90%
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || !paystackData.data?.subaccount_code) {
      console.error('Paystack subaccount creation failed:', paystackData);
      return new Response(
        JSON.stringify({ error: paystackData.message ?? 'Paystack subaccount creation failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subaccountCode = paystackData.data.subaccount_code;

    // Save the subaccount code back to the venues table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error: updateError } = await supabase
      .from('venues')
      .update({ paystack_subaccount_code: subaccountCode })
      .eq('id', venue_id);

    if (updateError) {
      console.error('Failed to save subaccount code:', updateError);
      // Still return success — subaccount was created, admin can manually enter code
    }

    return new Response(
      JSON.stringify({ success: true, subaccount_code: subaccountCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
