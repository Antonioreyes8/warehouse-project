/**
 * File: app/login/page.tsx
 * Purpose: Provides a login page for artists using Google OAuth via Supabase.
 * Responsibilities:
 *   - Render Google sign-in button
 *   - Handle OAuth flow and redirect after login
 * Key Concepts:
 *   - Client-side Supabase auth
 *   - OAuth provider integration
 * Dependencies:
 *   - supabaseClient for auth operations
 * How It Fits:
 *   - Entry point for artist authentication before accessing edit features
 */

"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		// Session pre-check section
		// If a valid session already exists, skip login UI and move user directly to dashboard.
		// This prevents "login page flash" for already authenticated users.
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				router.push("/dashboard/profile");
			}
		};
		checkUser();

		// Realtime auth listener section
		// OAuth can complete outside this component's initial render cycle.
		// Listening ensures the UI responds instantly when Supabase emits SIGNED_IN.
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && session) {
				router.push("/dashboard/profile");
			}
		});

		// Cleanup section
		// Prevents duplicate listeners and memory leaks during Fast Refresh/unmounts.
		return () => subscription.unsubscribe();
	}, [router]);

	const handleGoogleSignIn = async () => {
		// Submit lifecycle section
		// Reset message, lock button, and start OAuth flow.
		setLoading(true);
		setMessage("");

		try {
			// OAuth initiation section
			// redirectTo points back to the dashboard route after provider authentication.
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/dashboard/profile`,
				},
			});

			if (error) {
				// User-facing error handling
				// Keep the message explicit so auth configuration issues are easier to diagnose.
				setMessage("Error signing in: " + error.message);
			}
		} catch {
			// Catch-all safety
			// Handles unexpected runtime/network exceptions outside Supabase's returned error object.
			setMessage("Unexpected error occurred");
		} finally {
			// UI unlock
			// Re-enables button regardless of success/failure.
			setLoading(false);
		}
	};

	return (
		<div className={styles.loginContainer}>
			<div className={styles.loginCard}>
				<h2 className={styles.loginTitle}>Artist Login</h2>
				<p className={styles.loginDescription}>
					Sign in with your Google account to edit your artist profile
				</p>
				<button
					onClick={handleGoogleSignIn}
					disabled={loading}
					className={styles.loginButton}
				>
					{loading ? "Signing in..." : "Sign in with Google"}
				</button>
				{message && (
					<p
						className={`${styles.loginMessage} ${message.includes("Error") ? styles.error : styles.success}`}
					>
						{message}
					</p>
				)}
			</div>
		</div>
	);
}
