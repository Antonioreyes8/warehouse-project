/**
 * File: lib/supabaseClient.ts
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
 *   - Provides the central database connection used by data fetching functions in lib/ and route components in app/
 */

import { createClient } from "@supabase/supabase-js";

// Environment variable validation section
// Ensures required Supabase credentials are available before client creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Supabase URL or anon key missing!");
}

// Client initialization and export
// Creates a singleton Supabase client instance for the entire application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
