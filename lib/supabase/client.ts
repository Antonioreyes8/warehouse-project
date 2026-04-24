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
 *   - @supabase/supabase-js library
 *   - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
 * How It Fits:
 *   - Provides a shared browser-safe Supabase client used throughout app and lib modules
 */

import { createClient } from "@supabase/supabase-js";

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
// auth.flowType: 'pkce' – explicitly opt into PKCE so the code verifier is always
//   written to localStorage before the OAuth redirect.  Without this, some builds of
//   @supabase/auth-js can fall back to implicit flow, which skips verifier storage.
// auth.persistSession: true – ensures the session and verifier survive full-page
//   navigation cycles.  Critical on mobile browsers (iOS Safari, Samsung Internet)
//   where storage can be lazily cleared between page loads.
// auth.detectSessionInUrl: true – lets the client parse the ?code= param on the
//   callback page automatically, so the exchange happens even if the useEffect fires
//   after the client has already started processing the URL.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		flowType: "pkce",
		persistSession: true,
		detectSessionInUrl: true,
	},
});
