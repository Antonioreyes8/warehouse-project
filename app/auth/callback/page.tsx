"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./callback.module.css";

type CallbackState =
	| { status: "loading" }
	| { status: "error"; message: string };

export default function AuthCallbackPage() {
	const router = useRouter();
	const [state, setState] = useState<CallbackState>({ status: "loading" });

	useEffect(() => {
		let active = true;

		const finishSignIn = async () => {
			try {
				const url = new URL(window.location.href);

				// Check for an OAuth-level error returned by the provider (e.g. Google
				// denied access, consent not granted, or account not in scope).
				// These arrive as ?error= and ?error_description= query params.
				const oauthError = url.searchParams.get("error");
				if (oauthError) {
					const description =
						url.searchParams.get("error_description") ?? oauthError;
					throw new Error(description.replace(/\+/g, " "));
				}

				const code = url.searchParams.get("code");

				if (code) {
					const { error } = await supabase.auth.exchangeCodeForSession(code);
					if (error) {
						throw error;
					}
				}

				// detectSessionInUrl:true may have already exchanged the code before
				// this effect ran — getSession() picks up that result.
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!active) return;

				if (session) {
					// Success — navigate straight to dashboard, no message shown.
					router.replace("/dashboard/profile");
					return;
				}

				// No session and no explicit error — something unexpected happened.
				if (active) {
					setState({
						status: "error",
						message: "Sign-in could not be completed. Please try again.",
					});
					setTimeout(() => {
						if (active) router.replace("/login");
					}, 3000);
				}
			} catch (error) {
				if (!active) return;

				const errorMessage =
					error instanceof Error ? error.message : "Unexpected sign-in error";

				setState({ status: "error", message: errorMessage });
				setTimeout(() => {
					if (active) router.replace("/login");
				}, 3000);
			}
		};

		finishSignIn();

		return () => {
			active = false;
		};
	}, [router]);

	return (
		<div className={styles.wrap}>
			{state.status === "loading" ? (
				<div className={styles.loadingCard}>
					<div className={styles.spinner} />
					<p className={styles.loadingText}>Signing you in…</p>
				</div>
			) : (
				<div className={styles.errorCard}>
					<p className={styles.errorLabel}>Sign-in failed</p>
					<h2 className={styles.errorTitle}>Something went wrong</h2>
					<p className={styles.errorMessage}>{state.message}</p>
					<p className={styles.redirectNote}>Redirecting back to login…</p>
				</div>
			)}
		</div>
	);
}
