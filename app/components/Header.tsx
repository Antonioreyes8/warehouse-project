/**
 * File: app/components/Header.tsx
 * Purpose: Renders the site header with the main title and navigation.
 * Responsibilities:
 *   - Display the application title
 *   - Provide persistent global branding at the top of every route
 *   - Apply shared header styling
 * Key Concepts:
 *   - React functional component
 *   - CSS className for styling
 * Dependencies:
 *   - Global CSS for header styles
 * How It Fits:
 *   - Used in layout.tsx to provide consistent navigation/branding across all pages
 */

"use client";

import Link from "next/link";
import styles from "./header.module.css";

// Header component
// Displays a consistent title bar across the full application shell.
// Keeping this component intentionally simple avoids route-specific logic in global chrome.
export default function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<h1 className={styles.title}>
					<Link href="/" className={styles.titleLink}>
						The Diaspora project
					</Link>
				</h1>
			</div>
		</header>
	);
}
