// supabase/functions/admin-login/index.ts
// Simple PIN-based admin gate. No JWT signing, no RSA keys, no Redis —
// deliberately minimal because there are zero real users on the
// platform yet, so a lightweight server-side check is the right amount
// of effort right now. The PIN is checked here, server-side only,
// against a Supabase secret — never hardcoded in shipped client code.
//
// NOTE FOR LATER: once real users exist, this should be upgraded to a
// properly signed session (the RSA JWT setup in _shared/jwt.ts, or an
// HMAC token) so a captured token can't just be replayed indefinitely.
// Today's version issues a token that encodes its own expiry but isn't
// cryptographically signed — acceptable while this gates nothing but
// your own internal tooling, not acceptable once it gates real student
// or institution data at scale.

import { corsHeaders, handleCors } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { pin } = await req.json();

    const expectedPin = Deno.env.get('ADMIN_PIN');
    if (!expectedPin) {
      // Fail closed — if the secret isn't configured, nobody gets in.
      return jsonResponse({ error: 'Admin login is not configured.' }, 503);
    }

    if (pin !== expectedPin) {
      return jsonResponse({ error: 'Incorrect PIN.' }, 401);
    }

    // Simple expiring token — NOT cryptographically signed. Fine for a
    // single internal admin with no real user data at stake yet (see
    // note above for when to upgrade this).
    const payload = {
      marker: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    const token = btoa(JSON.stringify(payload));

    return jsonResponse({ success: true, token });
  } catch (err) {
    console.error('Admin login error:', err);
    return jsonResponse({ error: 'Admin login failed.' }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
