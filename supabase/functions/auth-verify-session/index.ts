// supabase/functions/auth-verify-session/index.ts
// FIXED: queries PROFILES, not "users" (table never existed in real DB)
// GET-style check: does the JWT's session_version match what's in the DB?
// Called by client directly, or by Cloudflare Worker as a fallback when KV cache is cold.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { verifyJWT } from '../_shared/jwt.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return jsonResponse({ valid: false, error: 'Missing Authorization header' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return jsonResponse({ valid: false, error: 'Invalid or expired JWT' }, 401);
    }

    // ── FIX: was supabase.from('users'), real table is 'profiles' ──────
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('session_version, account_status')
      .eq('id', decoded.userId)
      .maybeSingle();

    if (error || !profile) {
      return jsonResponse({ valid: false, error: 'User not found' }, 401);
    }

    if (profile.account_status === 'locked') {
      return jsonResponse({ valid: false, error: 'Account locked', locked: true }, 403);
    }

    const valid = profile.session_version === decoded.sessionVersion;

    return jsonResponse({
      valid,
      current_session_version: profile.session_version,
    });
  } catch (err) {
    console.error('Session verification error:', err);
    return jsonResponse({ valid: false, error: 'Verification failed' }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}