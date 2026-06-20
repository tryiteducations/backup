// supabase/functions/auth-recover-account/index.ts
// FIXED: queries PROFILES, not "users" (table never existed in real DB)
// Verifies security answers (mother's name, alt phone, hometown).
// On success, flags next step as re-verify (Truecaller/WhatsApp/SMS) — does NOT
// directly issue a JWT, since identity must still be re-proven via phone ownership.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
import { upstash } from '../_shared/upstash.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const deviceId = req.headers.get('x-device-id') ?? 'unknown';
    const { phone, mothersName, altPhone, hometown } = await req.json();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // ── FIX: was supabase.from('users'), real table is 'profiles' ──────
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, security_questions')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (error || !profile) {
      await flagSOS(cleanPhone, deviceId, 'recovery_user_not_found');
      return jsonResponse({ error: 'User not found' }, 401);
    }

    if (!profile.security_questions) {
      return jsonResponse({ error: 'No security questions on file for this account' }, 400);
    }

    const questions = profile.security_questions as { q1: string; q2: string; q3: string };

    const q1Match = await bcrypt.compare(mothersName.toLowerCase().trim(), questions.q1);
    const q2Match = await bcrypt.compare(altPhone.trim(), questions.q2);
    const q3Match = await bcrypt.compare(hometown.toLowerCase().trim(), questions.q3);

    if (!q1Match || !q2Match || !q3Match) {
      await flagSOS(cleanPhone, deviceId, 'recovery_failed_security_answers', profile.id);

      await supabase.from('audit_log').insert({
        user_id: profile.id,
        event: 'recovery_failed',
        details: { reason: 'security_answers_mismatch', deviceId },
      });

      return jsonResponse({ error: 'Security answers do not match' }, 401);
    }

    // All 3 correct — issue a short-lived recovery token. This does NOT log the
    // user in; it lets the client skip straight to a fresh Truecaller/WhatsApp/SMS
    // verification without re-asking the questions if that step is also reached
    // within 10 minutes.
    const recoveryToken = crypto.randomUUID();
    await upstash.setex(`recovery:${profile.id}`, 10 * 60, recoveryToken);

    await supabase.from('audit_log').insert({
      user_id: profile.id,
      event: 'recovery_security_answers_verified',
      details: { deviceId },
    });

    return jsonResponse({
      success: true,
      recoveryToken,
      nextStep: 'reverify_phone', // client should now run Truecaller → WhatsApp → SMS waterfall
    });
  } catch (err) {
    console.error('Recovery error:', err);
    return jsonResponse({ error: 'Recovery failed' }, 500);
  }
});

async function flagSOS(phone: string, deviceId: string, reason: string, userId?: string) {
  try {
    await supabase.from('admin_alerts').insert({
      user_id: userId ?? null,
      alert_type: reason,
      details: { phone, deviceId },
      status: 'open',
    });
  } catch (e) {
    console.error('Flag SOS failed:', e);
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}