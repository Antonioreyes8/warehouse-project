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
// Provides persistent navigation, external community links, and location metadata.
// This footer is intentionally content-heavy so users can access key routes from any page.
export default function Footer() {
	return (
		<footer className="footer">
			{/* Left column
			    Contains internal navigation plus program/action links used frequently by visitors.
			*/}
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
						<Link
							href="https://docs.google.com/forms/d/e/1FAIpQLSc0Tp1bWgY8WFA_bSfUcB0zr-i36YX3UZIeUikCoGd10MlD_A/viewform?usp=header"
							className="link"
						>
							Join the team
						</Link>
					</p>
					<p>
						<Link href="/linktree" className="link">
							Linktree
						</Link>
					</p>
					<br />
					<p>
						<Link href="/login" className="link">
							Artist Login
						</Link>
					</p>
					<br />
					<p>Denton, Texas</p>
					<p>The Warehouse Project © 2026</p>
				</div>
			</div>
			{/* Right column
			    Reserved for future content blocks (newsletter, social, legal, etc.).
			*/}
			<div className="footer_right"></div>
		</footer>
	);
}
