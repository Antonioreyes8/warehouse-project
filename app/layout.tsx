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

// FontAwesome setup section
// Disables auto CSS injection because styles are imported manually above.
config.autoAddCss = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Route-aware shell behavior section
	// The linktree page intentionally hides footer to keep a compact, mobile-friendly hub.
	const pathname = usePathname();

	const hideFooter = pathname === "/linktree";

	// Root application shell
	// Header is always shown, footer is conditional, and child route content is injected in <main>.
	return (
		<html lang="en">
			<body>
				<Header />
				<main>{children}</main>
				{!hideFooter && <Footer />}
			</body>
		</html>
	);
}
