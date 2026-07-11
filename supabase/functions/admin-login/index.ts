// supabase/functions/admin-login/index.ts
// Server-side admin authentication. Replaces the old client-side check
// that had a hardcoded email/password visible directly in the shipped
// React bundle (src/pages/admin/AdminLogin.jsx) and, separately, was
// calling the student phone/OTP login function with the wrong
// arguments — which meant it always failed silently and never actually
// set the admin session flag.
//
// Credentials are compared here, server-side only, against Edge
// Function secrets that are never sent to the browser. On success,
// issues a signed JWT using the same signing key as student auth
// (reusing _shared/jwt.ts), so admin sessions are verifiable the same
// way. userId is fixed to 'admin' so verifyJWT + a userId check is
// enough to gate admin routes.

import { signJWT } from '../_shared/jwt.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { email, password } = await req.json();

    const expectedEmail = Deno.env.get('ADMIN_EMAIL');
    const expectedPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!expectedEmail || !expectedPassword) {
      // Fail closed, not open — if secrets aren't configured, nobody
      // gets in, rather than falling back to some default credential.
      return jsonResponse({ error: 'Admin login is not configured.' }, 503);
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      return jsonResponse({ error: 'Invalid admin credentials.' }, 401);
    }

    const jwt = await signJWT(
      { userId: 'admin', phone: 'ADMIN', sessionVersion: 1, deviceId: 'admin-panel' },
      1 // admin sessions expire in 1 day, not 30 — shorter-lived by design
    );

    return jsonResponse({ success: true, jwt });
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
