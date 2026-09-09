/**
 * File: lib/supabase/client.ts
 * Purpose: Initializes and exports the Supabase client for database and storage interactions.
 * Responsibilities:
 *   - Set up Supabase client with environment variables
 *   - Validate required environment variables
 *   - Export singleton client instance
 * Key Concepts:
 *   - Environment variable configuration
 *   - Supabase client initialization
 * Dependencies:
 *   - @supabase/ssr
 *   - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
 * How It Fits:
 *   - Provides a shared browser-safe Supabase client used throughout app and lib modules
 */

import { createBrowserClient } from "@supabase/ssr";

// Environment variable validation section
// Ensures required Supabase credentials are available before client creation.
// Early throw makes misconfiguration obvious during development/deployment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Supabase URL or anon key missing!");
}

// Client initialization and export
// Creates a singleton client instance to avoid recreating connections/config repeatedly.
// This client is safe to use in browser contexts with public anon credentials.
//
// createBrowserClient (not plain createClient) is required here: it syncs the
//   session into cookies as well as localStorage, which is what lets
//   lib/supabase/server.ts (used by /api/admin/* and app/dashboard/admin) see
//   the logged-in user server-side. The plain browser client only writes
//   localStorage, so server-side session checks would always see "logged out".
//
// auth.flowType: 'pkce' – explicitly opt into PKCE so the code verifier is always
//   written to storage before the OAuth redirect.  Without this, some builds of
//   @supabase/auth-js can fall back to implicit flow, which skips verifier storage.
// auth.persistSession: true – ensures the session and verifier survive full-page
//   navigation cycles.  Critical on mobile browsers (iOS Safari, Samsung Internet)
//   where storage can be lazily cleared between page loads.
// auth.detectSessionInUrl: false – the callback page (app/auth/callback/page.tsx)
//   explicitly calls exchangeCodeForSession() itself. Leaving auto-detection on
//   causes both that automatic pass and the manual call to race for the same
//   PKCE code, and supabase-js serializes them via a browser lock — if the
//   automatic pass hangs, the manual call (and the whole sign-in page) hangs
//   with it, forever. Only one path should ever process the code.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		flowType: "pkce",
		persistSession: true,
		detectSessionInUrl: false,
	},
});
