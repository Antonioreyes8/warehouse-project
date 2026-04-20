/**
 * File: lib/supabase/server.ts
 * Purpose: Creates a server-side Supabase client bound to Next.js request cookies.
 * Responsibilities:
 *   - Initialize @supabase/ssr client with project credentials
 *   - Bridge cookie reads/writes between Supabase auth and Next.js headers API
 * Key Concepts:
 *   - Server-side auth session propagation via cookies
 *   - Request-scoped client creation
 * Dependencies:
 *   - @supabase/ssr
 *   - next/headers cookies API
 * How It Fits:
 *   - Used by server-side auth-aware flows where browser client APIs are unavailable
 */

import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
	// Cookie store retrieval
	// In modern Next.js this call is async in server contexts, so it must be awaited.
	const cookieStore = await cookies();

	// SSR client wiring
	// get/set/remove handlers allow Supabase auth helpers to read and persist session cookies
	// through the framework's request/response pipeline.
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					cookieStore.set({ name, value, ...options });
				},
				remove(name: string, options: CookieOptions) {
					cookieStore.set({ name, value: "", ...options });
				},
			},
		},
	);
}
