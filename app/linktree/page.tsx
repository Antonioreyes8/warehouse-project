/**
 * File: app/linktree/page.tsx
 * Purpose: Provides a curated link hub for project information, forms, and social channels.
 * Responsibilities:
 *   - Render categorized internal and external links
 *   - Offer one-click sharing via clipboard
 *   - Keep link updates centralized in typed arrays
 * Key Concepts:
 *   - Client component for clipboard and alert interactions
 *   - Typed link configuration with icon metadata
 * Dependencies:
 *   - FontAwesome icons
 *   - linktree.module.css styles
 * How It Fits:
 *   - Acts as a lightweight navigation hub optimized for mobile and social distribution
 */

"use client";

import styles from "./linktree.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
// import { faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"; // Example for future additions
import {
	faPaperPlane,
	faHeart,
	faQuestion,
	faCircleExclamation,
	faStar,
	faCrown,
	faCoins,
	faHome,
	faPeopleGroup,
	faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

type LinkItem = {
	title: string;
	url: string;
	icon: IconProp;
};

const aboutLinks: LinkItem[] = [
	{ title: "Check out the website", url: "/", icon: faHome },
	{ title: "Manifesto", url: "/manifesto", icon: faHeart },
	{ title: "Community Guidelines", url: "/guidelines", icon: faCrown },
	{ title: "Financial Breakdown", url: "/financial", icon: faCoins },
	{ title: "FAQ", url: "/FAQ", icon: faQuestion },
];

const contactLinks: LinkItem[] = [
	{
		title: "Join the movement !!!",
		url: "https://forms.gle/7qShMJE2fFR8DSar5",
		icon: faPeopleGroup,
	},
	{
		title: "Tip line",
		url: "https://forms.gle/zdE6ALdcdLsGzVYr6",
		icon: faCircleExclamation,
	},
    {
        title: "Participate in ICE investigation",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSeM7YdfM0-1d29ejPfDun8vYpO1pgwqtmbipIS2UTVOzGIpqA/viewform?usp=header",
        icon: faCircleExclamation,
    }
];

const socialLinks: LinkItem[] = [
	{
		title: "Instagram",
		url: "https://www.instagram.com/diasporaprojects/",
		icon: faInstagram,
	},
];

const RSVP_LINK: LinkItem = {
	title: "RSVP for Never Ending Summer",
	url: "https://partiful.com/e/GH91VqxHhmBn3zuxDuuz?",
	icon: faStar,
};

const donationLinks: LinkItem[] = [
	{
		title: "Cash App",
		url: "https://cash.app/$necioue",
		icon: faDollarSign,
	},
	{
		title: "Venmo",
		url: "https://venmo.com/u/Auzene",
		icon: faDollarSign,
	},
];

export default function LinksPage() {
	const handleShare = (url: string) => {
		const fullUrl = url.startsWith("http") ? url : window.location.origin + url;
		navigator.clipboard.writeText(fullUrl);
		alert("Link copied!");
	};

	const renderLinks = (links: LinkItem[]) =>
		links.map((link, i) => (
			<div key={i} className={styles.linkRow}>
				<a
					href={link.url}
					className={styles.link}
					target={link.url.startsWith("http") ? "_blank" : undefined}
					rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
				>
					<span className={styles.icon}>
						<FontAwesomeIcon icon={link.icon} />
					</span>
					<span className={styles.text}>{link.title}</span>
				</a>
				<button className={styles.share} onClick={() => handleShare(link.url)}>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</div>
		));

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1 className={styles.title}>LinkTree</h1>
				{/* Social Icons Section */}
				<div className={styles.socialHeader}>
					{socialLinks.map((social, i) => (
						<a
							key={i}
							href={social.url}
							className={styles.socialIcon}
							title={social.title}
							target="_blank"
							rel="noopener noreferrer"
						>
							<FontAwesomeIcon icon={social.icon} />
						</a>
					))}
				</div>
				<h3 className={styles.subtitle}>Events</h3>
				<div className={styles.links}>{renderLinks([RSVP_LINK])}</div>
				<h3 className={styles.subtitle}>Learn more</h3>
				<div className={styles.links}>{renderLinks(aboutLinks)}</div>
				<h3 className={styles.subtitle}>Donations</h3>
				<div className={styles.links}>{renderLinks(donationLinks)}</div>
				<h3 className={styles.subtitle}>Forms</h3>
				<div className={styles.links}>{renderLinks(contactLinks)}</div>
			</div>
		</div>
	);
}
