/**
 * File: lib/admin/guard.ts
 * Purpose: Shared superadmin authorization guard for admin Route Handlers.
 *
 * Responsibilities:
 *   - Resolve the current session user server-side
 *   - Reject requests from non-authenticated or non-admin users
 *
 * Dependencies:
 *   - lib/supabase/server.ts (cookie-bound session client)
 *   - lib/auth/authorization.ts (role check)
 *
 * How It Fits:
 *   - Called at the top of every app/api/admin/* Route Handler
 */

import "server-only";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "../supabase/server";
import { isSuperAdmin } from "../auth/authorization";

type GuardResult =
	| { authorized: true; user: User; actorEmail: string }
	| { authorized: false; response: NextResponse };

export async function requireSuperAdmin(): Promise<GuardResult> {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return {
			authorized: false,
			response: NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 },
			),
		};
	}

	if (!(await isSuperAdmin(user, supabase)) || !user.email) {
		return {
			authorized: false,
			response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
		};
	}

	return {
		authorized: true,
		user,
		actorEmail: user.email.trim().toLowerCase(),
	};
}
