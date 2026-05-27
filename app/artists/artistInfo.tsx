import { Artist } from "../../lib/artists/queries";
import styles from "./artist-info.module.css";

interface ArtistInfoProps {
	profile: Artist;
}

function hasText(value: unknown): boolean {
	if (value === null || value === undefined) return false;
	return String(value).trim().length > 0;
}

export default function ArtistInfo({ profile }: ArtistInfoProps) {
	const age = hasText(profile.birthday)
		? (() => {
			const birth = new Date(profile.birthday as string);
			if (Number.isNaN(birth.getTime())) return null;
			const today = new Date();
			let value = today.getFullYear() - birth.getFullYear();
			const monthDiff = today.getMonth() - birth.getMonth();

			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
				value -= 1;
			}

			return value >= 0 ? String(value) : null;
		})()
		: null;

	const hasBasedIn = hasText(profile.based_in);
	const hasMediums = hasText(profile.mediums);
	const hasPastProjects = hasText(profile.past_projects);
	const hasEthnicBackground = hasText(profile.ethnic_background);
	const hasContact = hasText(profile.contact);
	const hasStatus = hasText(profile.status);
	const hasMemberSince = hasText(profile.member_since);

	const hasLeftColumn = Boolean(age || hasBasedIn || hasMediums || hasPastProjects);
	const hasRightColumn = Boolean(hasEthnicBackground || hasContact || hasStatus || hasMemberSince);
	if (!hasLeftColumn && !hasRightColumn) return null;

	return (
		<div className={styles.infoContainer}>
			{hasLeftColumn && (
				<div className={`${styles.leftColumn} ${!hasRightColumn ? styles.singleColumn : ""}`}>
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
	);
}
