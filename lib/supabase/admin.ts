/**
 * File: lib/supabase/admin.ts
 * Purpose: Service-role Supabase client for privileged, server-only admin operations.
 *
 * Responsibilities:
 *   - Initialize a Supabase client authenticated with the service_role key
 *   - Guarantee this module can never be imported into a client bundle
 *
 * Key Concepts:
 *   - The service_role key bypasses Row Level Security entirely, so it must
 *     never be exposed to the browser. The `server-only` import below makes
 *     any accidental import from a "use client" file fail at build time.
 *
 * Dependencies:
 *   - @supabase/supabase-js
 *   - SUPABASE_SERVICE_ROLE_KEY env var (server-only, not NEXT_PUBLIC_-prefixed)
 *
 * How It Fits:
 *   - Used exclusively by lib/admin/* functions, called from Route Handlers
 *     and server components under app/api/admin and app/dashboard/admin
 */

import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | undefined;

export function getSupabaseAdmin() {
	if (supabaseAdmin) return supabaseAdmin;

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error("Supabase URL or service role key missing!");
	}

	// Service-role client bypasses RLS; auth session persistence is irrelevant here.
	supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
	return supabaseAdmin;
}
