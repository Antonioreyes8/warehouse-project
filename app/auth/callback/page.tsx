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
				const code = url.searchParams.get("code");

				if (code) {
					const { error } = await supabase.auth.exchangeCodeForSession(code);
					if (error) {
						throw error;
					}
				}

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

				setMessage(
					"Sign-in could not be completed. Redirecting back to login...",
				);
				router.replace("/login");
			} catch (error) {
				if (!active) {
					return;
				}

				const errorMessage =
					error instanceof Error ? error.message : "Unexpected sign-in error";
				setMessage(`${errorMessage}. Redirecting back to login...`);
				router.replace("/login");
			}
		};

		finishSignIn();

		return () => {
			active = false;
		};
	}, [router]);

	return <div>{message}</div>;
}
