/**
 * File: app/api/admin/whoami/route.ts
 * Purpose: Lightweight endpoint for client components to check superadmin status.
 *
 * How It Fits:
 *   - Used by app/dashboard/profile/page.tsx to conditionally show the admin nav link
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/authorization";

export async function GET() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ isAdmin: false });
	}

	return NextResponse.json({ isAdmin: await isSuperAdmin(user, supabase) });
}
