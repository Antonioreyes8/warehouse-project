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
import styles from "./footer.module.css";

// Footer component
// Provides persistent navigation, external community links, and location metadata.
// This footer is intentionally content-heavy so users can access key routes from any page.
export default function Footer() {
	return (
		<footer className={styles.footer}>
			{/* Left column
			    Contains internal navigation plus program/action links used frequently by visitors.
			*/}
			<div className={styles.left}>
				<div>
					<p>
						<Link href="/" className={styles.link}>
							Home
						</Link>
					</p>
					<p>
						<Link href="/manifesto" className={styles.link}>
							Manifesto
						</Link>
					</p>
					<p>
						<Link href="/financial" className={styles.link}>
						Financial Breakdown
						</Link>
					</p>
					<p>
						<Link href="/guidelines" className={styles.link}>
							Community Guidelines
						</Link>
					</p>
					<p>
						<Link href="/FAQ" className={styles.link}>
							FAQ
						</Link>
					</p>
					<p>
						<Link
							href="https://docs.google.com/forms/d/e/1FAIpQLSfTwTgewINwYUD3gcaODLd3x_MQkMU30CfUNmlpeT9bvzZR5g/viewform"
							className={styles.link}
						>
							Tip Line
						</Link>
					</p>
					<p>
						<Link href="/linktree" className={styles.link}>
							Linktree
						</Link>
					</p>
					<br />
										<p>
						<Link
							href="https://docs.google.com/forms/d/e/1FAIpQLSc0Tp1bWgY8WFA_bSfUcB0zr-i36YX3UZIeUikCoGd10MlD_A/viewform?usp=header"
							className={styles.link}
						>
							Join the movement
						</Link>
					</p>
					<p>
						<Link href="/login" className={styles.link}>
							Artist Portal
						</Link>
					</p>
					<br />
					<p>Denton, Texas</p>
					<p>The Diaspora Project © 2026</p>
				</div>
			</div>
			{/* Right column
			    Reserved for future content blocks (newsletter, social, legal, etc.).
			*/}
			<div className={styles.right}></div>
		</footer>
	);
}
