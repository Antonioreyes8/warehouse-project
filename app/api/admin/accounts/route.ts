/**
 * File: app/api/admin/accounts/route.ts
 * Purpose: List allowlisted accounts and invite new collaborators.
 *
 * Responsibilities:
 *   - GET: return all accounts for the admin dashboard table
 *   - POST: invite a new collaborator (insert into allowed_users)
 *
 * How It Fits:
 *   - Backs app/dashboard/admin/AdminDashboard.tsx
 */

import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/guard";
import { listAccounts } from "@/lib/admin/queries";
import { inviteCollaborator } from "@/lib/admin/mutations";

export async function GET() {
	const guard = await requireSuperAdmin();
	if (!guard.authorized) return guard.response;

	const accounts = await listAccounts();
	return NextResponse.json({ accounts });
}

export async function POST(request: Request) {
	const guard = await requireSuperAdmin();
	if (!guard.authorized) return guard.response;

	const body = await request.json();
	const { email, role } = body ?? {};

	if (typeof email !== "string" || !email.trim()) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	const result = await inviteCollaborator(guard.actorEmail, { email, role });

	if (!result.success) {
		return NextResponse.json({ error: result.error }, { status: 400 });
	}

	return NextResponse.json({ success: true });
}
