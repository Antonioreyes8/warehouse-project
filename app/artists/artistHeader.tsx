/**
 * File: app/artists/artistHeader.tsx
 * Purpose: Displays the artist hero section with avatar, name, and username.
 * Responsibilities:
 *   - Render an artist profile image when available
 *   - Present artist name and social handle clearly
 * Key Concepts:
 *   - Image component rendering with accessibility alt text
 *   - Reusable presentational component for public artist page
 */
import Image from "next/image";
import { Artist } from "../../lib/artists/queries";
import styles from "./artist-header.module.css";

interface ArtistHeaderProps {
	profile: Artist;
}

export default function ArtistHeader({ profile }: ArtistHeaderProps) {
	return (
		<div className={styles.headerWrapper}>
			<div className={styles.headerContainer}>
				<div className={styles.avatarSection}>
					{profile.avatar_url && (
						<Image
							src={profile.avatar_url}
							alt={profile.name || "Artist"}
							width={180}
							height={180}
							className={styles.avatar}
						/>
					)}
				</div>

				<div className={styles.headerBody}>
					<div className={styles.headerCopy}>
						<h2 className={styles.name}>{profile.name}</h2>
						<p className={styles.handle}>@{profile.username}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
