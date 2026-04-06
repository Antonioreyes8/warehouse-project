/**
 * File: app/contact/page.tsx
 * Purpose: Renders the contact page with form section.
 * Responsibilities:
 *   - Display contact form component
 * Key Concepts:
 *   - Next.js page component
 * Dependencies:
 *   - ContactSection component
 * How It Fits:
 *   - Handles /contact route
 */

import ContactSection from "@/app/contact/contactSection";

export default function ContactPage() {
	return (
		<main>
			<ContactSection />
		</main>
	);
}
