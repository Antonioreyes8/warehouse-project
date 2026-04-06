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

import { Artist } from "../../lib/getArtists";
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
}

export default function AboutSection({ profile }: AboutSectionProps) {
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
				<h2>{profile.name}</h2>
				<p>@{profile.username} (He/Him)</p>
			</div>
			{/* Main content area with info and bio */}
			<div className={styles.infoandlinksContainer}>
				{/* Personal information in two columns */}
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
						<h3>Ethnic background:</h3>
						<p>Hispanic/Latino</p>
						<br></br>

						<h3>Contact:</h3>
						<p>tony@surco.studio</p>
						<br></br>

						<h3>Status:</h3>
						<p>Open for work</p>
						<br></br>

						<h3>Member since:</h3>
						<p>May 2025</p>
					</div>
				</div>
				{/* Bio section */}
				<div className={styles.bioContainer}>
					<h3>Bio:</h3>
					{profile.bio && <p>{profile.bio}</p>}
				</div>
			</div>
			{/* Social links section */}
			<div className={styles.linksContainer}>
				{profile.instagram && (
					<a
						href={`https://instagram.com/${profile.instagram}`}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faInstagram} size="6x" />
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
						<FontAwesomeIcon icon={faYoutube} size="6x" />
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
						<FontAwesomeIcon icon={faPatreon} size="6x" />
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
						<FontAwesomeIcon icon={faFacebook} size="6x" />
					</a>
				)}
				{profile.tik_tok && (
					<a
						href={`https://tiktok.com/@${profile.tik_tok}`}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					>
						<FontAwesomeIcon icon={faTiktok} size="6x" />
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
						<FontAwesomeIcon icon={faEtsy} size="6x" />
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
						<FontAwesomeIcon icon={faGlobe} size="6x" />
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
						<FontAwesomeIcon icon={faSoundcloud} size="6x" />
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
						<FontAwesomeIcon icon={faBandcamp} size="6x" />
					</a>
				)}
			</div>
		</section>
	);
}
