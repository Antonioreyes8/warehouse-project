/**
 * File: app/artists/[slug]/page.tsx
 * Purpose: Load and compose a public artist page from its username route segment.
 * Key Decisions:
 *   - Resolve route params before querying because App Router params may be asynchronous.
 *   - Return a deliberate setup-pending state for missing profiles instead of treating every absence as a 404.
 *   - Hide work rows with no meaningful image, title, or description so empty records do not create blank cards.
 */

import AboutSection from "../aboutSection";
import ArtistWorks from "../artistWorks";
import pageStyles from "../page-layout.module.css";
import emptyStateStyles from "../empty-state.module.css";
import {
	getArtistByUsername,
	getArtistWorksByProfileId,
} from "../../../lib/artists/queries";

interface ArtistPageProps {
	params: Promise<{ slug: string }> | { slug: string };
}

function hasText(value: string | null | undefined): boolean {
	return Boolean(value?.trim());
}

export default async function ArtistPage(props: ArtistPageProps) {
	const { params } = props;
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;
	const profile = await getArtistByUsername(slug.trim());

	if (!profile) {
		return (
			<div className={emptyStateStyles.emptyStateWrap}>
				<section className={emptyStateStyles.emptyStateCard}>
					<p className={emptyStateStyles.emptyStateEyebrow}>Artist Profile</p>
					<h1 className={emptyStateStyles.emptyStateTitle}>
						Page not set up yet
					</h1>
					<p className={emptyStateStyles.emptyStateText}>
						This artist has not created their public page yet. Check back later
						for updates.
					</p>
				</section>
			</div>
		);
	}

	const works = await getArtistWorksByProfileId(profile.id);
	const visibleWorks = works.filter(
		(work) =>
			hasText(work.image_url) ||
			hasText(work.title) ||
			hasText(work.description),
	);

	return (
		<div className={pageStyles.artistPage}>
			<AboutSection profile={profile} />
			<ArtistWorks profile={profile} works={visibleWorks} />
		</div>
	);
}
