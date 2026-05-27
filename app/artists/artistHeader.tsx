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
				{profile.avatar_url && (
					<Image
						src={profile.avatar_url}
						alt={profile.name || "Artist"}
						width={180}
						height={180}
						className={styles.avatar}
					/>
				)}

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
