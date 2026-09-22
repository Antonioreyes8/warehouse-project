/**
 * File: app/layout.tsx
 * Purpose: Root layout wrapper for all routes in the application.
 * Responsibilities:
 *   - Apply global styles and icon setup exactly once
 *   - Render shared shell components (Header/Footer)
 *   - Handle route-specific shell behavior (hide footer on link hub)
 * Key Concepts:
 *   - App Router root layout composition
 *   - Client-side pathname checks for conditional UI chrome
 *   - FontAwesome CSS configuration to avoid duplicate style injection
 * Dependencies:
 *   - Header, Footer, global CSS, FontAwesome config
 * How It Fits:
 *   - Establishes the global frame every page is rendered inside
 */

"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import "./home/home.module.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "../lib/ui/icons";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";

// FontAwesome setup section
config.autoAddCss = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const hideFooter = pathname === "/linktree";

	useEffect(() => {
		// Supabase redirects OAuth errors to the project's configured Site URL,
		// which can land on any page (not /auth/callback) if that setting is
		// misconfigured. Forward stray error params to /login so they're handled.
		if (pathname === "/auth/callback" || pathname === "/login") return;

		const params = new URLSearchParams(window.location.search);
		if (params.has("error")) {
			router.replace(`/login?${params.toString()}`);
		}
	}, [pathname, router]);

	return (
		<html lang="en" data-scroll-behavior="smooth">
			<head>
				{/* Google Analytics */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-6P7ELV8Z82"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-6P7ELV8Z82');
					`}
				</Script>

				<link rel="icon" href="/icon.svg" type="image/svg+xml" />
			</head>

			<body>
				<Header />
				<main>{children}</main>
				{!hideFooter && <Footer />}
			</body>
		</html>
	);
}
