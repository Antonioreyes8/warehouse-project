/**
 * File: app/artists/[slug]/page.tsx
 * Purpose: Renders individual artist profile pages using dynamic routing.
 * Responsibilities:
 *   - Resolve username slug parameter
 *   - Fetch artist data from Supabase
 *   - Render artist profile or placeholder
 * Key Concepts:
 *   - Next.js dynamic routes for artists
 *   - Server component with database fetching
 *   - Fallback UI for missing profiles
 * Dependencies:
 *   - getArtistByUsername function
 *   - AboutSection component
 * How It Fits:
 *   - Handles /artists/[slug] routes to display artist information
 */

import AboutSection from "../aboutSection";
import { getArtistByUsername } from "../../../lib/artists/queries";

interface ArtistPageProps {
	params: Promise<{ slug: string }> | { slug: string };
}

/**
 * Description: Server component that renders an artist profile page based on the slug parameter.
 * Parameters:
 *   - props: ArtistPageProps - Contains the params with slug
 * Returns:
 *   - JSX.Element - The artist profile or placeholder message
 * Side Effects:
 *   - None
 * Concepts Used:
 *   - Async parameter resolution, database querying
 */
export default async function ArtistPage(props: ArtistPageProps) {
	// Parameter resolution section
	// Handles Promise params and trims whitespace from slug
	const { params } = props;
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;
	const profile = await getArtistByUsername(slug.trim());

	// Profile rendering section
	// Shows profile if found, otherwise displays placeholder
	if (!profile) {
		return <div>This artist hasn’t created their page yet.</div>;
	}

	return <AboutSection profile={profile} />;
}
