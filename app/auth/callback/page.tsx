"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
	const router = useRouter();
	const [message, setMessage] = useState("Completing sign-in...");

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
					// exchangeCodeForSession needs the PKCE verifier that was stored in
					// localStorage before the OAuth redirect.  On mobile browsers the
					// verifier can occasionally be missing (private mode, storage
					// throttling, etc.).  If the exchange fails we surface the real
					// reason instead of silently bouncing back to login.
					const { error } = await supabase.auth.exchangeCodeForSession(code);
					if (error) {
						throw error;
					}
				}

				// detectSessionInUrl:true (set in client.ts) may have already exchanged
				// the code before this effect ran.  Calling getSession() here picks up
				// that result so we never miss a successful sign-in.
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!active) {
					return;
				}

				if (session) {
					router.replace("/dashboard/profile");
					return;
				}

				// No session and no error from exchange – something unexpected happened.
				if (active) {
					setMessage("Sign-in could not be completed. Please try again.");
					// Give the user a moment to read the message before redirecting.
					setTimeout(() => {
						if (active) router.replace("/login");
					}, 2500);
				}
			} catch (error) {
				if (!active) {
					return;
				}

				const errorMessage =
					error instanceof Error ? error.message : "Unexpected sign-in error";

				// Surface the error so the user (and you in dev tools) can see it,
				// then redirect after a short pause instead of immediately navigating
				// away before the message is ever rendered.
				setMessage(`Sign-in failed: ${errorMessage}. Redirecting to login…`);
				setTimeout(() => {
					if (active) router.replace("/login");
				}, 2500);
			}
		};

		finishSignIn();

		return () => {
			active = false;
		};
	}, [router]);

	return <div>{message}</div>;
}
