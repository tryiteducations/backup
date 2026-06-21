// supabase/functions/auth-register/index.ts
// Registration endpoint: validates verification token, creates/updates user, issues JWT
//
// FIXED: previous version queried a 'users' table that doesn't exist in this
// project's schema (real table is 'profiles', linked to auth.users via FK).
// New users are now created via supabase.auth.admin.createUser() — this
// creates the auth.users row, which fires the existing handle_new_user()
// trigger to auto-create the matching profiles row. We never insert into
// profiles directly for new signups.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { upstash } from '../_shared/upstash.ts';
import { signJWT } from '../_shared/jwt.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // service_role bypasses RLS, Edge Function only
  { auth: { autoRefreshToken: false, persistSession: false } }
);

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const deviceId = req.headers.get('x-device-id');
    if (!deviceId) {
      return jsonResponse({ error: 'Missing X-Device-ID header' }, 400);
    }

    const { phone, method, token, state } = await req.json();

    // Validate phone format (10 digit India)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^\d{10}$/.test(cleanPhone)) {
      return jsonResponse({ error: 'Invalid phone number' }, 400);
    }

    // Validate method
    if (!['truecaller', 'whatsapp', 'sms'].includes(method)) {
      return jsonResponse({ error: 'Invalid verification method' }, 400);
    }

    // WhatsApp toggle (env flag, can disable instantly without redeploy logic)
    if (method === 'whatsapp' && Deno.env.get('ENABLE_WHATSAPP') !== 'true') {
      return jsonResponse({ error: 'WhatsApp verification currently unavailable, please use SMS or Truecaller' }, 503);
    }

    // Verify token from Upstash (set by the respective webhook/callback)
    const redisKey = `verify:${method}:${cleanPhone}`;
    const storedToken = await upstash.get(redisKey);

    if (!storedToken || storedToken !== token) {
      return jsonResponse({ error: 'Verification token invalid or expired' }, 401);
    }

    // One-time use: delete immediately
    await upstash.del(redisKey);

    // Check if a profile already exists for this phone
    const { data: existingProfile, error: lookupErr } = await supabase
      .from('profiles')
      .select('id, session_version')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (lookupErr) throw lookupErr;

    let userId: string;
    let sessionVersion: number;

    if (existingProfile) {
      // Existing user logging in on a (possibly new) device → bump session_version
      sessionVersion = (existingProfile.session_version ?? 1) + 1;
      userId = existingProfile.id;

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          session_version: sessionVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateErr) throw updateErr;

      // Track this device in the devices table
      await supabase.from('devices').insert({
        user_id: userId,
        device_id: deviceId,
        session_version: sessionVersion,
        last_login: new Date().toISOString(),
        is_active: true,
      });
    } else {
      // New user — create the auth.users row via admin API.
      // No email, no password. handle_new_user() trigger fires automatically
      // and creates the matching profiles row (with email=null, tryit_id
      // built from state metadata or falling back to 'PH').
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        phone: `+91${cleanPhone}`,
        phone_confirm: true,
        user_metadata: { state: state ?? null },
      });

      if (createErr) throw createErr;
      if (!created?.user) throw new Error('User creation returned no user object');

      userId = created.user.id;
      sessionVersion = 1;

      // Set phone + session_version on the auto-created profiles row
      // (handle_new_user() only sets id/email/tryit_id, not our new columns)
      const { error: profileUpdateErr } = await supabase
        .from('profiles')
        .update({
          phone: cleanPhone,
          session_version: sessionVersion,
          account_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileUpdateErr) throw profileUpdateErr;

      await supabase.from('devices').insert({
        user_id: userId,
        device_id: deviceId,
        session_version: sessionVersion,
        last_login: new Date().toISOString(),
        is_active: true,
      });
    }

    // Issue our own JWT (used by Edge Functions/client for our custom auth
    // logic — separate from Supabase's own session tokens, which we don't use)
    const jwt = await signJWT({ userId, phone: cleanPhone, sessionVersion, deviceId });

    // Cache JWT in Upstash (optional quick-lookup cache, 30 day TTL)
    await upstash.setex(`jwt:${userId}:${deviceId}`, 30 * 24 * 60 * 60, jwt);

    // Audit log (fire and forget, don't block response on failure)
    supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        event: existingProfile ? 'login' : 'registration',
        details: { method, deviceId },
      })
      .then(() => {})
      .catch(() => {});

    return jsonResponse({
      success: true,
      jwt,
      session_version: sessionVersion,
      userId,
    });
  } catch (err) {
    console.error('Registration error:', err);
    // err may be a structured Supabase error object (message/code/details
    // properties) rather than a plain Error — String(err) on those produces
    // the unhelpful "[object Object]". Pull out real fields if present.
    const errObj = err as Record<string, unknown>;
    const debugInfo = {
      message: errObj?.message ?? String(err),
      code: errObj?.code,
      details: errObj?.details,
      hint: errObj?.hint,
      name: errObj?.name,
    };
    return jsonResponse({ error: 'Registration failed', message: JSON.stringify(debugInfo) }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}