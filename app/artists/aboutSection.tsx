/**
 * File: app/artists/aboutSection.tsx
 * Purpose: Compose the artist profile sections into a single public profile layout.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
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
import { Artist } from "../../lib/artists/queries";
import styles from "./about-section.module.css";
import ArtistHeader from "./artistHeader";
import ArtistInfo from "./artistInfo";
import ArtistBio from "./artistBio";
import ArtistHotTakes from "./artistHotTakes";

interface AboutSectionProps {
	profile: Artist;
}

function normalizeSocialUrl(
	value: string | null | undefined,
	domain: string,
): string | null {
	if (!value || !value.trim()) return null;

	let input = value.trim();
	if (input.includes(`${domain}/http`)) {
		input = input.split(`${domain}/`).pop() || input;
	}

	if (input.startsWith("http")) return input;

	const cleanHandle = input.startsWith("@") ? input.slice(1) : input;
	return `https://www.${domain}/${cleanHandle}`;
}

function normalizeExternalUrl(value?: string | null): string | null {
	if (!value?.trim()) return null;

	const trimmedValue = value.trim();
	return trimmedValue.startsWith("http")
		? trimmedValue
		: `https://${trimmedValue}`;
}

export default function AboutSection({ profile }: AboutSectionProps) {
	const socialItems = [
		{ val: profile.instagram, dom: "instagram.com", icon: faInstagram },
		{ val: profile.youtube, dom: "youtube.com", icon: faYoutube },
		{ val: profile.patreon, dom: "patreon.com", icon: faPatreon },
		{ val: profile.facebook, dom: "facebook.com", icon: faFacebook },
		{ val: profile.tik_tok, dom: "tiktok.com", icon: faTiktok },
		{ val: profile.etsy, dom: "etsy.com", icon: faEtsy },
		{ val: profile.soundcloud, dom: "soundcloud.com", icon: faSoundcloud },
		{ val: profile.bandcamp, dom: "bandcamp.com", icon: faBandcamp },
	];

	const socialLinks = socialItems
		.map((social, i) => {
			const url = normalizeSocialUrl(social.val, social.dom);
			return url ? (
				<a
					key={i}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.socialLink}
				>
					<FontAwesomeIcon icon={social.icon} />
				</a>
			) : null;
		})
		.filter(Boolean);

	if (profile.personal_website) {
		socialLinks.push(
			<a
				key="website"
				href={normalizeExternalUrl(profile.personal_website)!}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.socialLink}
			>
				<FontAwesomeIcon icon={faGlobe} />
			</a>,
		);
	}

	return (
		<section className={styles.aboutSection}>
			<div className={styles.profileTop}>
				<ArtistHeader profile={profile} />
				<div className={styles.detailsGrid}>
					<ArtistInfo profile={profile} />
					<ArtistBio bio={profile.bio} />
				</div>
			</div>

			{socialLinks.length > 0 && (
				<div className={styles.socialRow}>{socialLinks}</div>
			)}

			<ArtistHotTakes hotTakes={profile.hot_takes} />
		</section>
	);
}
