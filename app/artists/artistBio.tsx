import styles from "./artist-bio.module.css";

interface ArtistBioProps {
	bio?: string | null;
}

function hasText(value: unknown): boolean {
	if (value === null || value === undefined) return false;
	return String(value).trim().length > 0;
}

export default function ArtistBio({ bio }: ArtistBioProps) {
	if (!hasText(bio)) return null;

	return (
		<div className={styles.bioContainer}>
			<h3>Bio:</h3>
			<p>{bio}</p>
		</div>
	);
}
