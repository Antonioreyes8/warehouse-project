/**
 * File: app/components/Header.tsx
 * Purpose: Renders the site header with the main title.
 * Responsibilities:
 *   - Display the application title
 *   - Apply header styling
 * Key Concepts:
 *   - React functional component
 *   - CSS className for styling
 * Dependencies:
 *   - Global CSS for header styles
 * How It Fits:
 *   - Used in layout.tsx to provide consistent navigation/branding across all pages
 */

// Header component
// Displays the main site title in the header
export default function Header() {
	return (
		<header>
			<div className="Header">The Warehouse Project</div>
		</header>
	);
}
