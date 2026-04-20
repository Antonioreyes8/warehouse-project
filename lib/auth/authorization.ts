/**
 * File: lib/authorization.ts
 * Purpose: Centralized authorization logic for artist access control.
 *
 * Responsibilities:
 *   - Check if a Supabase authenticated user is allowed access
 *   - Query "authorized_artists" allowlist table
 *   - Provide reusable auth guard function across app
 *
 * Key Concepts:
 *   - Separation of concerns (auth logic not inside UI components)
 *   - Allowlist-based access control (manual admin approval system)
 *   - Supabase queries for verification
 *
 * How It Fits:
 *   - Used in protected pages like /artists/profile
 *   - Replaces repeated isEmailAuthorized calls in components
 */

import { supabase } from "../supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Checks whether a user is authorized as an artist.
 *
 * Logic:
 *   - Takes Supabase authenticated user
 *   - Checks their email against "authorized_artists" table
 *
 * Returns:
 *   - true → user has access
 *   - false → user is blocked
 */
export async function isArtistAuthorized(user: User): Promise<boolean> {
	if (!user?.email) return false;
	const normalizedEmail = user.email.trim().toLowerCase();
	const allowlistTables = ["authorized_artists", "authorized", "allowed_users"];

	for (const tableName of allowlistTables) {
		const { data, error } = await supabase
			.from(tableName)
			.select("email")
			.ilike("email", normalizedEmail)
			.maybeSingle();

		if (!error && data) {
			return true;
		}
	}

	return false;
}
