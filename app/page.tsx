/**
 * File: app/page.tsx
 * Purpose: Renders the home page of the application, combining rules and projects sections.
 * Responsibilities:
 *   - Import and render home page sections
 *   - Serve as the root page route
 * Key Concepts:
 *   - Next.js page component pattern
 *   - Component composition
 * Dependencies:
 *   - RulesSection and ProjectsSection components
 * How It Fits:
 *   - Entry point for the home route, displaying introductory content and project listings
 */

import ProjectsSection from "@/app/home/projectsSection";
import HeroSection from "@/app/home/heroSection";

// Home page component
// Composes the main sections of the landing page
export default function HomePage() {
	return (
		<>
			<HeroSection />
			<ProjectsSection />
		</>
	);
}
