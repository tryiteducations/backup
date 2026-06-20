// supabase/functions/admin-users/index.ts
// FIXED: queries PROFILES, not "users" (table never existed in real DB)
// 360° user view for admin dashboard. Auth: simple bearer token match against
// ADMIN_TOKEN secret (fine for a solo-dev launch; swap for proper admin roles
// + RLS once you have a team).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

function checkAdminAuth(req: Request): boolean {
  const token = req.headers.get('authorization')?.split(' ')[1];
  return token === Deno.env.get('ADMIN_TOKEN');
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (!checkAdminAuth(req)) {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // Single user detail view (devices + recent audit log)
    if (userId) {
      // ── FIX: was supabase.from('users'), real table is 'profiles' ────
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('id, phone, account_status, session_version, pin_attempts, pin_locked_until, name, email, plan, role, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr || !profile) return jsonResponse({ error: 'User not found' }, 404);

      const { data: auditLog } = await supabase
        .from('audit_log')
        .select('event, details, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      return jsonResponse({ user: profile, auditLog: auditLog ?? [] });
    }

    // Paginated user list
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '50');
    const offset = (page - 1) * limit;

    // ── FIX: was supabase.from('users'), real table is 'profiles' ──────
    const { data: profiles, count, error } = await supabase
      .from('profiles')
      .select('id, phone, account_status, name, email, plan, role, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return jsonResponse({ total: count, page, limit, users: profiles });
  } catch (err) {
    console.error('Admin users error:', err);
    return jsonResponse({ error: 'Failed to fetch users' }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}