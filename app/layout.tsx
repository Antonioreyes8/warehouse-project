/**
 * File: app/layout.tsx
 * Purpose: Defines the root layout structure for the entire Next.js application.
 * Responsibilities:
 *   - Import global styles and component styles
 *   - Render Header, main content, and Footer
 *   - Set HTML document structure
 * Key Concepts:
 *   - Next.js App Router layout pattern
 *   - Global CSS imports for styling
 * Dependencies:
 *   - Header and Footer components
 *   - Global CSS files (globals.css, home.module.css, etc.)
 * How It Fits:
 *   - Wraps all pages in the app directory with consistent header/footer and global styles
 */

// app/layout.tsx
// Import section for components and styles
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import "./home/home.module.css";
import "./components/components.css";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '../lib/icons'

config.autoAddCss = false

// Root layout component
// Provides the HTML structure and global layout for all pages
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
