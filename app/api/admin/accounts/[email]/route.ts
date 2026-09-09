/**
 * File: app/api/admin/accounts/[email]/route.ts
 * Purpose: Update or revoke a single allowlisted account.
 *
 * Responsibilities:
 *   - PATCH: change account_status ("active"/"suspended") and/or role ("admin"/"artist")
 *   - DELETE: revoke access entirely (removes the allowed_users row)
 *
 * How It Fits:
 *   - Backs the per-row action buttons in app/dashboard/admin/AdminDashboard.tsx
 */

import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/guard";
import {
	setAccountStatus,
	changeRole,
	revokeAccess,
} from "@/lib/admin/mutations";

type RouteParams = { params: Promise<{ email: string }> | { email: string } };

async function resolveEmail(params: RouteParams["params"]): Promise<string> {
	const resolved = params instanceof Promise ? await params : params;
	return decodeURIComponent(resolved.email);
}

export async function PATCH(request: Request, { params }: RouteParams) {
	const guard = await requireSuperAdmin();
	if (!guard.authorized) return guard.response;

	const targetEmail = await resolveEmail(params);
	const body = await request.json();
	const { accountStatus, role } = body ?? {};

	if (
		accountStatus &&
		accountStatus !== "active" &&
		accountStatus !== "suspended"
	) {
		return NextResponse.json(
			{ error: "Invalid account status" },
			{ status: 400 },
		);
	}
	if (role && role !== "admin" && role !== "artist") {
		return NextResponse.json({ error: "Invalid role" }, { status: 400 });
	}

	if (accountStatus) {
		const result = await setAccountStatus(
			guard.actorEmail,
			targetEmail,
			accountStatus,
		);
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}
	}

	if (role) {
		const result = await changeRole(guard.actorEmail, targetEmail, role);
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}
	}

	return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
	const guard = await requireSuperAdmin();
	if (!guard.authorized) return guard.response;

	const targetEmail = await resolveEmail(params);
	const result = await revokeAccess(guard.actorEmail, targetEmail);

	if (!result.success) {
		return NextResponse.json({ error: result.error }, { status: 400 });
	}

	return NextResponse.json({ success: true });
}
