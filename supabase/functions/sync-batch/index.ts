// supabase/functions/sync-batch/index.ts
// FIXED: updates/reads PROFILES, not "users" (table never existed in real DB)
// Receives batched local transactions (coin balance, scores, etc), validates
// monotonic sequence_number to block database-rollback replay attacks,
// verifies per-transaction HMAC signature, writes atomically.
//
// Every security mechanism (replay detection, signature verification,
// admin_alerts flagging) is UNCHANGED — this is purely the table rename.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { verifyJWT } from '../_shared/jwt.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface IncomingTx {
  sequence_number: number;
  key: string;
  value: unknown;
  signature: string;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return jsonResponse({ error: 'Missing JWT' }, 401);

    const decoded = await verifyJWT(authHeader.split(' ')[1]);
    if (!decoded) return jsonResponse({ error: 'Invalid JWT' }, 401);

    const userId = decoded.userId;
    const deviceId = req.headers.get('x-device-id') ?? decoded.deviceId;
    const { transactions } = (await req.json()) as { transactions: IncomingTx[] };

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return jsonResponse({ error: 'No transactions provided' }, 400);
    }

    // Get last known synced sequence number for this user
    const { data: lastTx } = await supabase
      .from('transaction_log')
      .select('sequence_number')
      .eq('user_id', userId)
      .eq('synced', true)
      .order('sequence_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastKnownSeq = lastTx?.sequence_number ?? 0;

    // Validate each transaction: sequence strictly increasing + signature valid
    for (const tx of transactions) {
      if (tx.sequence_number <= lastKnownSeq) {
        console.warn(`REPLAY ATTACK: user ${userId} sent seq ${tx.sequence_number}, last known ${lastKnownSeq}`);

        await supabase.from('admin_alerts').insert({
          user_id: userId,
          alert_type: 'replay_attack',
          details: {
            device_id: deviceId,
            attempted_sequence: tx.sequence_number,
            last_known_sequence: lastKnownSeq,
            key: tx.key,
          },
          status: 'open',
        });

        return jsonResponse(
          {
            error: 'Sequence validation failed',
            reason: 'sequence_replay_detected',
            details: `Attempted sequence ${tx.sequence_number}, expected > ${lastKnownSeq}`,
            user_flagged: true,
          },
          409
        );
      }

      const expectedSig = await hmacSign(
        `${tx.key}:${JSON.stringify(tx.value)}:${tx.sequence_number}`,
        `${userId}:tata:sign`
      );

      if (!constantTimeCompare(expectedSig, tx.signature)) {
        console.warn(`SIGNATURE MISMATCH: user ${userId} seq ${tx.sequence_number}`);

        await supabase.from('admin_alerts').insert({
          user_id: userId,
          alert_type: 'tamper_detected',
          details: { device_id: deviceId, reason: 'signature_mismatch', sequence: tx.sequence_number },
          status: 'open',
        });

        return jsonResponse({ error: 'Signature validation failed', reason: 'tamper_detected', user_flagged: true }, 401);
      }
    }

    // All validated — insert atomically.
    const rows = transactions.map((tx) => ({
      user_id: userId,
      sequence_number: tx.sequence_number,
      key: tx.key,
      value: tx.value,
      signature: tx.signature,
      synced: true,
      synced_at: new Date().toISOString(),
    }));

    const { error: insertErr } = await supabase
      .from('transaction_log')
      .upsert(rows, { onConflict: 'user_id,sequence_number' });

    if (insertErr) throw insertErr;

    // ── FIX: was supabase.from('users'), real table is 'profiles' ──────
    await supabase
      .from('profiles')
      .update({ last_sync_timestamp: new Date().toISOString() })
      .eq('id', userId);

    await supabase.from('audit_log').insert({
      user_id: userId,
      event: 'batch_sync_success',
      details: {
        device_id: deviceId,
        transaction_count: transactions.length,
        sequence_range: `${lastKnownSeq + 1} to ${Math.max(...transactions.map((t) => t.sequence_number))}`,
      },
    });

    // ── FIX: was supabase.from('users'), real table is 'profiles' ──────
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('session_version')
      .eq('id', userId)
      .maybeSingle();

    return jsonResponse({
      success: true,
      count: transactions.length,
      new_session_version: profileRow?.session_version,
    });
  } catch (err) {
    console.error('Batch sync error:', err);
    return jsonResponse({ error: 'Batch sync failed', message: String(err) }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}