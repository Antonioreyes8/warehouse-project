/**
 * File: app/manifesto/page.tsx
 * Purpose: Renders the manifesto route with the project philosophy and core principles.
 * Responsibilities:
 *   - Load and display the manifesto content section
 *   - Provide a stable static route for the movement statement
 * Key Concepts:
 *   - Lightweight page composition in the App Router
 *   - Separation of route shell and content section
 * Dependencies:
 *   - ManifestoSection component
 * How It Fits:
 *   - Serves as the public-facing values page linked from navigation and link hub
 */

import ManifestoSection from "@/app/manifesto/manifestoSection";

// Manifesto page component
// Keeps route concerns simple and delegates all content rendering to ManifestoSection
export default function AboutPage() {
	return (
		<main>
			<ManifestoSection />
		</main>
	);
}
