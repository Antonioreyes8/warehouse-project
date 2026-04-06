/**
 * File: app/components/Footer.tsx
 * Purpose: Renders the site footer with navigation links and site information.
 * Responsibilities:
 *   - Display navigation links to main sections
 *   - Show site location and copyright
 * Key Concepts:
 *   - Next.js Link component for client-side navigation
 *   - CSS classes for layout
 * Dependencies:
 *   - Next.js Link
 *   - Global CSS for footer styles
 * How It Fits:
 *   - Used in layout.tsx for consistent footer across pages
 */

import Link from "next/link";

// Footer component
// Provides navigation and site information in the footer
export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer_left">
				<div>
					<p>
						<Link href="/" className="link">
							Home
						</Link>
					</p>
					<p>
						<Link href="/manifesto" className="link">
							Manifesto
						</Link>
					</p>
					<p>Financial Hub</p>
					<p>
						<Link href="/guidelines" className="link">
							Community Guidelines
						</Link>
					</p>
					<p>
						<Link href="/FAQ" className="link">
							FAQ
						</Link>
					</p>
					<p>
						<Link href="/contact" className="link">
							Contact
						</Link>
					</p>
					<br />
					<p>Denton, Texas</p>
					<p>The Warehouse Project © 2026</p>
				</div>
			</div>

			<div className="footer_right"></div>
		</footer>
	);
}
