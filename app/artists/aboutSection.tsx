/**
 * File: app/artists/aboutSection.tsx
 * Purpose: Renders the artist profile section with bio, info, and links.
 * Responsibilities:
 *   - Display artist avatar, name, username
 *   - Show personal info in columns
 *   - Render bio and social links
 * Key Concepts:
 *   - React component with props
 *   - Next.js Image component for optimization
 *   - CSS Modules for styling
 * Dependencies:
 *   - Artist type, styles from artists.module.css
 * How It Fits:
 *   - Used in artist pages to display profile information
 */

import { Artist, type ArtistWork } from "../../lib/artists/queries";
import styles from "./artists.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faInstagram,
	faYoutube,
	faPatreon,
	faFacebook,
	faTiktok,
	faEtsy,
	faSoundcloud,
	faBandcamp,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

// AboutSection component
// Displays comprehensive artist profile information in a bento-style layout
// Props: profile (Artist object with all profile data)
interface AboutSectionProps {
	profile: Artist;
	works: ArtistWork[];
}

function calculateAgeFromBirthday(
	birthday: string | null | undefined,
): string | null {
	// Birthday-derived age helper
	// Age is a computed display value only. We return null when birthday is missing/invalid
	// so the UI can omit the row entirely instead of showing placeholder text.
	if (!birthday) return null;
	const birth = new Date(birthday);
	if (Number.isNaN(birth.getTime())) return null;

	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age -= 1;
	}

	return age >= 0 ? String(age) : null;
}

function hasText(value: unknown): boolean {
	// Defensive text check helper
	// Some profile fields can come through as non-string types (for example database casts).
	// This helper prevents runtime crashes and ensures visibility checks stay reliable.
	if (value === null || value === undefined) {
		return false;
	}

	if (typeof value === "string") {
		return value.trim().length > 0;
	}

	return String(value).trim().length > 0;
}

function normalizeExternalUrl(value?: string | null): string | null {
	if (!value?.trim()) return null;

	const trimmedValue = value.trim();
	return trimmedValue.startsWith("http://") ||
		trimmedValue.startsWith("https://")
		? trimmedValue
		: `https://${trimmedValue}`;
}

export default function AboutSection({ profile, works }: AboutSectionProps) {
	// Visibility state section
	// These booleans implement "artist controls what is public":
	// if a field has no meaningful value, we do not render that row at all.
	const age = calculateAgeFromBirthday(profile.birthday);

	const hasBasedIn = hasText(profile.based_in);
	const hasMediums = hasText(profile.mediums);
	const hasPastProjects = hasText(profile.past_projects);
	const hasEthnicBackground = hasText(profile.ethnic_background);
	const hasContact = hasText(profile.contact);
	const hasStatus = hasText(profile.status);
	const hasMemberSince = hasText(profile.member_since);
	const visibleWorks = works.filter(
		(work) =>
			hasText(work.image_url) ||
			hasText(work.title) ||
			hasText(work.description),
	);

	const hasLeftColumn = Boolean(
		age || hasBasedIn || hasMediums || hasPastProjects,
	);
	const hasRightColumn = Boolean(
		hasEthnicBackground || hasContact || hasStatus || hasMemberSince,
	);
	const hasAnyInfo = hasLeftColumn || hasRightColumn;

	return (
		<section className={styles.aboutSection}>
			{/* Header block
			    - Avatar is optional and rendered only when present.
			    - Name/username remain visible as the primary profile identity.
			*/}
			<div className={styles.headerContainer}>
				{profile.avatar_url && (
					<Image
						src={profile.avatar_url}
						alt={profile.name}
						width={100}
						height={100}
					/>
				)}
				<h2>{profile.name}</h2>
				<p>@{profile.username}</p>
			</div>
			{/* Main content area with info and bio */}
			<div className={styles.infoandlinksContainer}>
				{/* Personal information block
				    - Entire block hides when no info fields exist.
				    - Each column is conditionally rendered only if it has at least one row.
				    - This avoids empty placeholders and keeps layout intentional.
				*/}
				{hasAnyInfo && (
					<div className={styles.infoContainer}>
						{hasLeftColumn && (
							<div
								className={`${styles.leftColumn} ${!hasRightColumn ? styles.singleColumn : ""}`}
							>
								{age && (
									<div className={styles.infoRow}>
										<h3>Age:</h3>
										<p>{age}</p>
									</div>
								)}
								{hasBasedIn && (
									<div className={styles.infoRow}>
										<h3>Based in:</h3>
										<p>{profile.based_in}</p>
									</div>
								)}
								{hasMediums && (
									<div className={styles.infoRow}>
										<h3>Mediums:</h3>
										<p>{profile.mediums}</p>
									</div>
								)}
								{hasPastProjects && (
									<div className={styles.infoRow}>
										<h3>Past Projects:</h3>
										<p>{profile.past_projects}</p>
									</div>
								)}
							</div>
						)}

						{hasRightColumn && (
							<div className={styles.rightColumn}>
								{hasEthnicBackground && (
									<div className={styles.infoRow}>
										<h3>Ethnic background:</h3>
										<p>{profile.ethnic_background}</p>
									</div>
								)}
								{hasContact && (
									<div className={styles.infoRow}>
										<h3>Contact:</h3>
										<p>{profile.contact}</p>
									</div>
								)}
								{hasStatus && (
									<div className={styles.infoRow}>
										<h3>Status:</h3>
										<p>{profile.status}</p>
									</div>
								)}
								{hasMemberSince && (
									<div className={styles.infoRow}>
										<h3>Member since:</h3>
										<p>{profile.member_since}</p>
									</div>
								)}
							</div>
						)}
					</div>
				)}
				{/* Bio section
				    - Bio is optional content.
				    - Hidden entirely when empty so artist pages never show "Not provided" text.
				*/}
				{hasText(profile.bio) && (
					<div className={styles.bioContainer}>
						<h3>Bio:</h3>
						<p>{profile.bio}</p>
					</div>
				)}
			</div>
			{/* Social links section
			    - Every icon is conditional.
			    - We normalize URLs so artists can paste either full links or handle-like values.
			*/}
			<div className={styles.linksContainer}>
				{profile.instagram && (
					<a
						href={`https://instagram.com/${profile.instagram}`}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faInstagram} size="4x" />
					</a>
				)}
				{profile.youtube && (
					<a
						href={
							profile.youtube.startsWith("http")
								? profile.youtube
								: `https://youtube.com/${profile.youtube}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faYoutube} size="4x" />
					</a>
				)}
				{profile.patreon && (
					<a
						href={
							profile.patreon.startsWith("http")
								? profile.patreon
								: `https://patreon.com/${profile.patreon}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faPatreon} size="4x" />
					</a>
				)}
				{profile.facebook && (
					<a
						href={
							profile.facebook.startsWith("http")
								? profile.facebook
								: `https://facebook.com/${profile.facebook}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faFacebook} size="4x" />
					</a>
				)}
				{profile.tik_tok && (
					<a
						href={`https://tiktok.com/@${profile.tik_tok}`}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faTiktok} size="4x" />
					</a>
				)}
				{profile.etsy && (
					<a
						href={
							profile.etsy.startsWith("http")
								? profile.etsy
								: `https://etsy.com/shop/${profile.etsy}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faEtsy} size="4x" />
					</a>
				)}
				{profile.personal_website && (
					<a
						href={
							profile.personal_website.startsWith("http")
								? profile.personal_website
								: `https://${profile.personal_website}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faGlobe} size="4x" />
					</a>
				)}
				{profile.soundcloud && (
					<a
						href={
							profile.soundcloud.startsWith("http")
								? profile.soundcloud
								: `https://soundcloud.com/${profile.soundcloud}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faSoundcloud} size="4x" />
					</a>
				)}
				{profile.bandcamp && (
					<a
						href={
							profile.bandcamp.startsWith("http")
								? profile.bandcamp
								: `https://bandcamp.com/${profile.bandcamp}`
						}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faBandcamp} size="4x" />
					</a>
				)}
			</div>
			{visibleWorks.length > 0 && (
				<div className={styles.workList}>
					{visibleWorks.map((work) => {
						const workLinkUrl = normalizeExternalUrl(work.link_url);

						return (
							<div className={styles.workSection} key={work.id}>
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
									<h3>{work.title || "Featured Work"}</h3>
									{hasText(work.description) && <p>{work.description}</p>}
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
						);
					})}
				</div>
			)}
		</section>
	);
}
