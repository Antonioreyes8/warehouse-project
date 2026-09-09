/**
 * File: lib/admin/queries.ts
 * Purpose: Read-only data access for the superadmin dashboard.
 *
 * Responsibilities:
 *   - List allowlisted accounts joined with their public profile (if any)
 *   - Fetch recent admin audit log entries
 *
 * Dependencies:
 *   - lib/supabase/admin.ts (service-role client, server-only)
 *
 * How It Fits:
 *   - Called from app/api/admin/* Route Handlers, never directly from client components
 */

import "server-only";
import { supabaseAdmin } from "../supabase/admin";

export type AccountRole = "admin" | "artist";
export type AccountStatus = "active" | "suspended";

export type AdminAccountRow = {
	email: string;
	role: AccountRole;
	account_status: AccountStatus;
	invited_by: string | null;
	invited_at: string | null;
	profile_username: string | null;
	// From profiles.name; the artist's own display name, only set once they have a profile.
	profile_name: string | null;
};

export type AuditLogEntry = {
	id: number;
	created_at: string;
	actor_email: string;
	action: string;
	target_email: string;
	details: Record<string, unknown> | null;
};

/**
 * Lists every allowlisted account, joined with its public profile username if one exists.
 */
export async function listAccounts(): Promise<AdminAccountRow[]> {
	const { data: allowedUsers, error: allowedUsersError } = await supabaseAdmin
		.from("allowed_users")
		.select("email, role, account_status, invited_by, invited_at")
		.order("invited_at", { ascending: false });

	if (allowedUsersError) {
		console.error("Error listing allowed users:", allowedUsersError);
		return [];
	}

	const emails = (allowedUsers ?? []).map((row) => row.email);
	const { data: profiles, error: profilesError } = await supabaseAdmin
		.from("profiles")
		.select("email, username, name")
		.in("email", emails.length > 0 ? emails : [""]);

	if (profilesError) {
		console.error("Error fetching profiles for admin list:", profilesError);
	}

	const profileByEmail = new Map(
		(profiles ?? []).map((profile) => [profile.email?.toLowerCase(), profile]),
	);

	return (allowedUsers ?? []).map((row) => {
		const profile = profileByEmail.get(row.email.toLowerCase());
		return {
			...row,
			profile_username: profile?.username ?? null,
			profile_name: profile?.name ?? null,
		};
	});
}

/**
 * Fetches recent admin audit log entries, most recent first.
 */
export async function getAuditLog(limit = 100): Promise<AuditLogEntry[]> {
	const { data, error } = await supabaseAdmin
		.from("admin_audit_log")
		.select("id, created_at, actor_email, action, target_email, details")
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		console.error("Error fetching admin audit log:", error);
		return [];
	}

	return data ?? [];
}
