/**
 * File: app/guidelines/page.tsx
 * Purpose: Renders community guidelines that define behavior and participation expectations.
 * Responsibilities:
 *   - Present guidelines content in a dedicated route
 *   - Keep policy content easy to find and link publicly
 * Key Concepts:
 *   - App Router route composition
 *   - Content isolation through section components
 * Dependencies:
 *   - GuidelinesSection component
 * How It Fits:
 *   - Provides the shared standards that support event safety and community trust
 */

import GuidelinesSection from "@/app/guidelines/guidelinesSection";

// Guidelines page component
// Wraps the section in a semantic main element for accessibility and layout consistency
export default function GuidelinesPage() {
	return (
		<main>
			<GuidelinesSection />
		</main>
	);
}
