// supabase/functions/send-otp/index.ts
// Sends a real OTP via Fast2SMS (fast2sms.com) - chosen specifically because it
// does NOT require GST registration to sign up, unlike Exotel which needs GST
// to provision a telecom virtual number. This is an outbound-send model (small
// real cost per SMS, ~₹0.35 via the 'otp' route), unlike the original reverse-SMS
// design which was free but required Exotel's GST-gated virtual number.
//
// Populates the SAME Redis key (`verify:sms:{phone}`) that auth-register already
// checks - so no changes were needed to the verification/login logic at all.

import { upstash } from '../_shared/upstash.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit numeric
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { phone } = await req.json();
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!/^\d{10}$/.test(cleanPhone)) {
      return jsonResponse({ error: 'Invalid phone number' }, 400);
    }

    if (!FAST2SMS_API_KEY) {
      return jsonResponse({ error: 'SMS provider not configured yet - set FAST2SMS_API_KEY in Supabase Edge Function secrets.' }, 503);
    }

    const otp = generateOtp();

    // Fast2SMS OTP route - real API, verified against current docs before writing this
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&variables_values=${otp}&route=otp&numbers=${cleanPhone}`;
    const smsResponse = await fetch(url, { method: 'GET', headers: { 'cache-control': 'no-cache' } });
    const smsResult = await smsResponse.json();

    if (!smsResult.return) {
      console.error('Fast2SMS send failed:', smsResult);
      return jsonResponse({ error: 'Could not send OTP - please try again.' }, 502);
    }

    // Store under the same key auth-register already checks - 5 minute expiry
    await upstash.setex(`verify:sms:${cleanPhone}`, 5 * 60, otp);

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return jsonResponse({ error: 'Unexpected error sending OTP.' }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
