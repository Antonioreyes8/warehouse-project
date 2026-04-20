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

// Header component
// Displays a consistent title bar across the full application shell.
// Keeping this component intentionally simple avoids route-specific logic in global chrome.
export default function Header() {
	return (
		<header>
			<div className="Header">
				<h1 className="title">The Warehouse Project</h1>
			</div>
		</header>
	);
}
