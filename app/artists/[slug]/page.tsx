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
import Image from "next/image";
import styles from "../artists.module.css";
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

function normalizeExternalUrl(value?: string | null): string | null {
	if (!value?.trim()) return null;

	const trimmedValue = value.trim();
	return trimmedValue.startsWith("http://") ||
		trimmedValue.startsWith("https://")
		? trimmedValue
		: `https://${trimmedValue}`;
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
		return (
			<div className={styles.emptyStateWrap}>
				<section className={styles.emptyStateCard}>
					<p className={styles.emptyStateEyebrow}>Artist Profile</p>
					<h1 className={styles.emptyStateTitle}>Page not set up yet</h1>
					<p className={styles.emptyStateText}>
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
		<div className={styles.artistPage}>
			<AboutSection profile={profile} works={[]} />
			{visibleWorks.length > 0 && (
				<section className={styles.worksSection}>
					<h2 className={styles.workHeading}>Works</h2>
					<div className={styles.workList}>
						{visibleWorks.map((work) => {
							const workLinkUrl = normalizeExternalUrl(work.link_url);

							return (
								<div className={styles.workSection} key={work.id}>
									<div className={styles.workInner}>
										<div className={styles.workArtwork}>
											{work.image_url ? (
												workLinkUrl ? (
													<a
														href={workLinkUrl}
														target="_blank"
														rel="noopener noreferrer"
														className={styles.workImageLink}
													>
														<Image
															src={work.image_url}
															alt={`${profile.name} featured work`}
															width={320}
															height={320}
															className={styles.workImage}
														/>
													</a>
												) : (
													<Image
														src={work.image_url}
														alt={`${profile.name} featured work`}
														width={320}
														height={320}
														className={styles.workImage}
													/>
												)
											) : null}
										</div>
										<div className={styles.workCopy}>
											<div className={styles.workRow}>
												<h3>Title:</h3>
												<p>{work.title || "Untitled"}</p>
											</div>{" "}
											{hasText(work.medium) && (
												<div className={styles.workRow}>
													<h3>Medium:</h3>
													<p>{work.medium}</p>
												</div>
											)}{" "}
											<div className={styles.workRow}>
												<h3>Description:</h3>
												<p>
													{hasText(work.description) ? work.description : "—"}
												</p>
											</div>
											{workLinkUrl && (
												<a
													href={workLinkUrl}
													target="_blank"
													rel="noopener noreferrer"
													className={styles.workLink}
												>
													View Work
												</a>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</section>
			)}
		</div>
	);
}
