/**
 * File: app/dashboard/admin/page.tsx
 * Purpose: Server-guarded entry point for the superadmin dashboard.
 *
 * Responsibilities:
 *   - Resolve the current session server-side and require superadmin role
 *   - Redirect non-admins back to their own dashboard
 *
 * How It Fits:
 *   - Route protection happens here in addition to the API-level guard in
 *     lib/admin/guard.ts, so the page itself can't be reached by non-admins.
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/authorization";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user || !(await isSuperAdmin(user, supabase))) {
		redirect("/dashboard/profile");
	}

	return <AdminDashboard />;
}
