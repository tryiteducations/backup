// supabase/functions/admin-unlock-user/index.ts
// FIXED: updates PROFILES, not "users" (table never existed in real DB)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (token !== Deno.env.get('ADMIN_TOKEN')) {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  try {
    const { userId } = await req.json();
    if (!userId) return jsonResponse({ error: 'Missing userId' }, 400);

    // ── FIX: was supabase.from('users'), real table is 'profiles' ──────
    const { error } = await supabase
      .from('profiles')
      .update({ pin_attempts: 0, pin_locked_until: null, account_status: 'active' })
      .eq('id', userId);

    if (error) throw error;

    await supabase.from('audit_log').insert({
      user_id: userId,
      event: 'admin_unlock',
      details: { adminAction: true },
    });

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Admin unlock error:', err);
    return jsonResponse({ error: 'Failed to unlock user' }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}