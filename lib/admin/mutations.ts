/**
 * File: lib/admin/mutations.ts
 * Purpose: Privileged write operations for the superadmin dashboard.
 *
 * Responsibilities:
 *   - Invite/revoke collaborator access
 *   - Suspend/reinstate accounts (soft, app-level restriction only)
 *   - Change account roles, guarding against removing the last admin
 *   - Record every action to admin_audit_log
 *
 * Dependencies:
 *   - lib/supabase/admin.ts (service-role client, server-only)
 *
 * How It Fits:
 *   - Called from app/api/admin/* Route Handlers after an isSuperAdmin check
 */

import "server-only";
import { supabaseAdmin } from "../supabase/admin";
import type { AccountRole, AccountStatus } from "./queries";

export type MutationResult = { success: boolean; error?: string };

async function logAction(
	actorEmail: string,
	action: string,
	targetEmail: string,
	details?: Record<string, unknown>,
): Promise<void> {
	const { error } = await supabaseAdmin.from("admin_audit_log").insert({
		actor_email: actorEmail,
		action,
		target_email: targetEmail,
		details: details ?? null,
	});

	if (error) {
		// Audit logging failures shouldn't block the underlying action, but must be visible.
		console.error("Error writing admin audit log:", error);
	}
}

export async function inviteCollaborator(
	actorEmail: string,
	input: {
		email: string;
		role?: AccountRole;
	},
): Promise<MutationResult> {
	const normalizedEmail = input.email.trim().toLowerCase();
	if (!normalizedEmail) {
		return { success: false, error: "Email is required" };
	}

	const { error } = await supabaseAdmin.from("allowed_users").insert({
		email: normalizedEmail,
		role: input.role ?? "artist",
		invited_by: actorEmail,
	});

	if (error) {
		console.error("Error inviting collaborator:", error);
		return { success: false, error: error.message };
	}

	await logAction(actorEmail, "grant_access", normalizedEmail, {
		role: input.role ?? "artist",
	});
	return { success: true };
}

export async function setAccountStatus(
	actorEmail: string,
	targetEmail: string,
	status: AccountStatus,
): Promise<MutationResult> {
	const normalizedEmail = targetEmail.trim().toLowerCase();

	const { error } = await supabaseAdmin
		.from("allowed_users")
		.update({ account_status: status })
		.ilike("email", normalizedEmail);

	if (error) {
		console.error("Error updating account status:", error);
		return { success: false, error: error.message };
	}

	await logAction(
		actorEmail,
		status === "suspended" ? "suspend" : "reinstate",
		normalizedEmail,
	);
	return { success: true };
}

export async function changeRole(
	actorEmail: string,
	targetEmail: string,
	role: AccountRole,
): Promise<MutationResult> {
	const normalizedEmail = targetEmail.trim().toLowerCase();

	// Guard against demoting the last remaining admin.
	if (role !== "admin") {
		const { data: admins, error: adminsError } = await supabaseAdmin
			.from("allowed_users")
			.select("email")
			.eq("role", "admin");

		if (adminsError) {
			console.error("Error checking remaining admins:", adminsError);
			return { success: false, error: adminsError.message };
		}

		const otherAdmins = (admins ?? []).filter(
			(row) => row.email.toLowerCase() !== normalizedEmail,
		);
		if (otherAdmins.length === 0 && (admins ?? []).length > 0) {
			return {
				success: false,
				error: "Cannot remove the last remaining admin",
			};
		}
	}

	const { error } = await supabaseAdmin
		.from("allowed_users")
		.update({ role })
		.ilike("email", normalizedEmail);

	if (error) {
		console.error("Error changing account role:", error);
		return { success: false, error: error.message };
	}

	await logAction(actorEmail, "role_change", normalizedEmail, { role });
	return { success: true };
}

export async function revokeAccess(
	actorEmail: string,
	targetEmail: string,
): Promise<MutationResult> {
	const normalizedEmail = targetEmail.trim().toLowerCase();

	const { error } = await supabaseAdmin
		.from("allowed_users")
		.delete()
		.ilike("email", normalizedEmail);

	if (error) {
		console.error("Error revoking access:", error);
		return { success: false, error: error.message };
	}

	await logAction(actorEmail, "revoke_access", normalizedEmail);
	return { success: true };
}
