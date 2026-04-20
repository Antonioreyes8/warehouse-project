/**
 * File: app/FAQ/page.tsx
 * Purpose: Renders the frequently asked questions route for visitors and artists.
 * Responsibilities:
 *   - Present FAQ content in a dedicated route
 *   - Centralize repeated support and onboarding answers
 * Key Concepts:
 *   - App Router page composition
 *   - Reusable section-driven content architecture
 * Dependencies:
 *   - FAQSection component
 * How It Fits:
 *   - Reduces repeated support questions and helps users self-serve common issues
 */

import FAQSection from "@/app/FAQ/faqSection";

// FAQ page component
// Uses a semantic main container and delegates all question rendering to FAQSection
export default function FAQPage() {
	return (
		<main>
			<FAQSection />
		</main>
	);
}
