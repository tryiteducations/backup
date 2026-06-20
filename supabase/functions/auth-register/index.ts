// supabase/functions/auth-register/index.ts
// FIXED VERSION — corrects 2 bugs from the original:
//   BUG 1: queried/wrote to a "users" table that doesn't exist
//          (real table is "profiles", confirmed via 002_phone_auth_migration.sql)
//   BUG 2: directly INSERTed into profiles for new users — this violates
//          profiles.id's foreign key to auth.users(id) and would fail.
//          Correct flow: create the identity via supabase.auth.admin.createUser()
//          first (this auto-creates the profiles row via your existing
//          on_auth_user_created trigger), THEN update that row with our
//          phone-auth-specific fields.
//
// Registration endpoint: validates verification token, creates/updates user, issues JWT

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { upstash } from '../_shared/upstash.ts';
import { signJWT } from '../_shared/jwt.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // service_role bypasses RLS, Edge Function only
);

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const deviceId = req.headers.get('x-device-id');
    if (!deviceId) {
      return jsonResponse({ error: 'Missing X-Device-ID header' }, 400);
    }

    const { phone, method, token } = await req.json();

    // Validate phone format (10 digit India)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^\d{10}$/.test(cleanPhone)) {
      return jsonResponse({ error: 'Invalid phone number' }, 400);
    }

    // Validate method
    if (!['truecaller', 'whatsapp', 'sms'].includes(method)) {
      return jsonResponse({ error: 'Invalid verification method' }, 400);
    }

    // Check WhatsApp toggle (env flag, can disable instantly without redeploy logic)
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

    // ── FIX: query PROFILES, not "users" ────────────────────────────────
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, session_version')
      .eq('phone', cleanPhone)
      .maybeSingle();

    let userId: string;
    let sessionVersion: number;

    if (existingProfile) {
      // ── Existing user logging in on a (possibly new) device ──────────
      // bump session_version → this invalidates any other device's JWT,
      // exactly the multi-device-eviction behavior the original design wanted.
      sessionVersion = (existingProfile.session_version || 0) + 1;
      userId = existingProfile.id;

      // ── FIX: update PROFILES, not "users" ───────────────────────────
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          session_version: sessionVersion,
          device_id: deviceId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateErr) throw updateErr;

    } else {
      // ── NEW user — this is the structural fix ─────────────────────────
      // We CANNOT insert directly into profiles: profiles.id is a foreign
      // key into auth.users(id), which is Supabase's own internal auth
      // table. Inserting a profiles row with no matching auth.users row
      // violates that constraint and will fail.
      //
      // Correct flow: create the identity via the Admin API first. This
      // is a real, valid Supabase user with NO password and NO email
      // requirement — phone-only, exactly as designed. The moment this
      // succeeds, your existing on_auth_user_created trigger fires
      // automatically and creates the matching profiles row for us
      // (with the phone-safe tryit_id fallback logic already patched
      // into handle_new_user() in 002_phone_auth_migration.sql).
      sessionVersion = 1;

      const { data: newAuthUser, error: createErr } = await supabase.auth.admin.createUser({
        phone: `+91${cleanPhone}`,
        phone_confirm: true,           // we already verified via Truecaller/WhatsApp/SMS
        user_metadata: {
          phone: cleanPhone,
          registration_method: method,
        },
      });

      if (createErr || !newAuthUser?.user) {
        console.error('auth.admin.createUser failed:', createErr);
        throw createErr || new Error('Failed to create user identity');
      }

      userId = newAuthUser.user.id;

      // Small delay-free safety: the trigger fires synchronously on insert,
      // but we still explicitly UPDATE the row right after to set our
      // phone-auth-specific fields (phone, device_id, session_version,
      // account_status) since handle_new_user() only sets id/email/tryit_id.
      const { error: profileUpdateErr } = await supabase
        .from('profiles')
        .update({
          phone: cleanPhone,
          device_id: deviceId,
          session_version: sessionVersion,
          account_status: 'active',
        })
        .eq('id', userId);

      if (profileUpdateErr) {
        // Profile row should exist from the trigger — if this update fails,
        // surface it clearly rather than silently leaving an incomplete profile.
        console.error('Post-create profile update failed:', profileUpdateErr);
        throw profileUpdateErr;
      }
    }

    // Issue JWT
    const jwt = await signJWT({ userId, phone: cleanPhone, sessionVersion, deviceId });

    // Cache JWT in Upstash (optional quick-lookup cache, 30 day TTL)
    await upstash.setex(`jwt:${userId}:${deviceId}`, 30 * 24 * 60 * 60, jwt);

    // Audit log (fire and forget, don't block response on failure)
    // ── note: audit_log table already references user_id generically,
    //    no rename needed here, it was never pointed at "users" ──
    supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        event: 'registration',
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
    return jsonResponse({ error: 'Registration failed', message: String(err) }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}