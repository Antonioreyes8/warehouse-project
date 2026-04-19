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

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		// Check if user is already logged in
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				router.push("/artists/profile");
			}
		};
		checkUser();

		// Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && session) {
				router.push("/artists/profile");
			}
		});

		return () => subscription.unsubscribe();
	}, [router]);

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setMessage("");

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/artists/profile`,
				},
			});

			if (error) {
				setMessage("Error signing in: " + error.message);
			}
		} catch {
			setMessage("Unexpected error occurred");
		} finally {
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
