/**
 * File: middleware.ts
 * Purpose: Keeps Supabase auth cookies refreshed on every request.
 *
 * Responsibilities:
 *   - Refresh the session token and rewrite updated cookies onto the response
 *
 * Key Concepts:
 *   - Required when using @supabase/ssr: server components/Route Handlers can
 *     read cookies but cannot write them, so a refreshed session has nowhere
 *     to be persisted without middleware doing it on the response.
 *
 * How It Fits:
 *   - Runs before every request; keeps app/dashboard/admin and app/api/admin/*
 *     server-side session checks working across token refreshes.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	let response = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					response = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// Touches the session so an expired access token gets refreshed and the
	// new cookies are attached to the response before it reaches the client.
	await supabase.auth.getUser();

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
