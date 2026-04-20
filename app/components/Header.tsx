/**
 * File: app/components/Header.tsx
 * Purpose: Renders the site header with the main title and navigation.
 * Responsibilities:
 *   - Display the application title
 *   - Provide login link for artists
 *   - Apply header styling
 * Key Concepts:
 *   - React functional component
 *   - Next.js Link for navigation
 *   - CSS className for styling
 * Dependencies:
 *   - Global CSS for header styles
 *   - Next.js Link component
 * How It Fits:
 *   - Used in layout.tsx to provide consistent navigation/branding across all pages
 */

"use client";

// Header component
// Displays the main site title in the header with artist login link
export default function Header() {
	return (
		<header>
			<div className="Header">
				<h1 className="title">The Warehouse Project</h1>
			</div>
		</header>
	);
}
