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

import { usePathname } from "next/navigation";
import Script from "next/script";

// FontAwesome setup section
config.autoAddCss = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const hideFooter = pathname === "/linktree";

	return (
		<html lang="en">
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
			</head>

			<body>
				<Header />
				<main>{children}</main>
				{!hideFooter && <Footer />}
			</body>
		</html>
	);
}