import { Artist } from "../../lib/getArtists";
import styles from "./artists.module.css";
import Image from "next/image";

export default function AboutSection({ profile }: { profile: Artist }) {
	return (
		<section className={styles.aboutSection}>
			<div className={styles.headerContainer}>
				{profile.avatar_url && (
					<Image
						src={profile.avatar_url}
						alt={profile.name}
						width={100}
						height={100}
					/>
				)}
				<h1>{profile.name}</h1>
				<p>@{profile.username} (He/Him)</p>
			</div>
			<div className={styles.infoandlinksContainer}>
				<div className={styles.infoContainer}>
					<div className={styles.leftColumn}>
						<h3>Age:</h3>
						<p>25</p>
						<br></br>

						<h3>Based in:</h3>
						<p>Denton, Tx</p>
						<br></br>

						<h3>Mediums:</h3>
						<p>Performance, Installation, Video</p>
						<br></br>

						<h3>Past Projects:</h3>
						<p>Warehouse Project, Solo Show at XYZ Gallery</p>
						<br></br>
					</div>

					<div className={styles.rightColumn}>
                        <h3>Ethnicity</h3>
						<p>Hispanic/Latino</p>
						<br></br>

						<h3>Contact</h3>
						<p>tony@surco.studio</p>
						<br></br>

						<h3>Status</h3>
						<p>Open to work</p>
						<br></br>

						<h3>Member since</h3>
						<p>May 2025</p>
					</div>
				</div>
				<div className={styles.bioContainer}>
					<h3>Bio:</h3>
					{profile.bio && <p>{profile.bio}</p>}
				</div>
			</div>
			<div className={styles.linksContainer}>
				{<p>Instagram: @{profile.instagram}</p>}
				<p>Youtube: </p>
				<p>Facebook: </p>
				<p>Portfolio Website: </p>
			</div>
		</section>
	);
}
