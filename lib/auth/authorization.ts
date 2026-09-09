/**
 * File: lib/auth/authorization.ts
 * Purpose: Centralized authorization logic for artist access control.
 *
 * Responsibilities:
 *   - Check if a Supabase authenticated user is allowed access
 *   - Query the allowlist table for authorization, role, and account status
 *   - Provide reusable auth guards across the app (artist access, superadmin access)
 *
 * Key Concepts:
 *   - Separation of concerns (auth logic outside UI components)
 *   - Allowlist-based access control (manual admin approval system)
 *   - Supabase query error resilience
 *
 * How It Fits:
 *   - Used in protected pages like /dashboard/profile and /dashboard/admin
 *   - Replaces repeated isEmailAuthorized calls in components
 */

import { supabase } from "../supabase/client";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export type UserRole = "admin" | "artist";

type AllowedUserRow = {
	role: UserRole | null;
	account_status: "active" | "suspended" | null;
};

// allowed_users is the only allowlist table in the schema; kept as a single
// lookup rather than multiple fallback strategies for tables that don't exist.
// Accepts an explicit client so server-side callers (Route Handlers, server
// components) can pass their cookie-bound server client instead of the
// browser client, which relies on `document` and cannot run server-side.
async function fetchAllowedUserRow(
	email: string,
	client: SupabaseClient = supabase,
): Promise<AllowedUserRow | null> {
	try {
		const { data, error } = await client
			.from("allowed_users")
			.select("role, account_status")
			.ilike("email", email)
			.maybeSingle();

		if (error) {
			console.warn("Authorization lookup failed:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.warn("Authorization lookup failed:", error);
		return null;
	}
}

/**
 * Checks whether a user is authorized as an artist (allowlisted and active).
 * @param user - Supabase authenticated user
 * @param client - Supabase client to query with (defaults to the browser client)
 * @returns true if authorized, false otherwise
 */
export async function isArtistAuthorized(
	user: User,
	client?: SupabaseClient,
): Promise<boolean> {
	if (!user?.email?.trim()) return false;

	const row = await fetchAllowedUserRow(
		user.email.trim().toLowerCase(),
		client,
	);
	return !!row && row.account_status !== "suspended";
}

/**
 * Returns the allowlisted user's role, or null if not allowlisted/suspended.
 * @param user - Supabase authenticated user
 * @param client - Supabase client to query with (defaults to the browser client)
 */
export async function getUserRole(
	user: User,
	client?: SupabaseClient,
): Promise<UserRole | null> {
	if (!user?.email?.trim()) return null;

	const row = await fetchAllowedUserRow(
		user.email.trim().toLowerCase(),
		client,
	);
	if (!row || row.account_status === "suspended") return null;

	return row.role ?? "artist";
}

/**
 * Checks whether a user has superadmin access.
 * @param user - Supabase authenticated user
 */
export async function isSuperAdmin(
	user: User,
	client?: SupabaseClient,
): Promise<boolean> {
	return (await getUserRole(user, client)) === "admin";
}
