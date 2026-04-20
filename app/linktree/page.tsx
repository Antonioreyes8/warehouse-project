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
import {
	faPaperPlane,
	faHeart,
	faQuestion,
	faCircleExclamation,
	faStar,
	faCrown,
} from "@fortawesome/free-solid-svg-icons";

type LinkItem = {
	title: string;
	url: string;
	icon: IconProp;
};

// Content config section
// Link groups are defined as data to keep rendering logic minimal and easy to maintain.
const aboutlinks: LinkItem[] = [
	{ title: "Manifesto", url: "/manifesto", icon: faHeart },
	{
		title: "Community Guidelines",
		url: "/guidelines",
		icon: faCrown,
	},
	{ title: "FAQ", url: "/FAQ", icon: faQuestion },
];

const contactlinks: LinkItem[] = [
	{
		title: "Application to join",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSc0Tp1bWgY8WFA_bSfUcB0zr-i36YX3UZIeUikCoGd10MlD_A/viewform?usp=dialog",
		icon: faStar,
	},
	{
		title: "Tip line",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSfTwTgewINwYUD3gcaODLd3x_MQkMU30CfUNmlpeT9bvzZR5g/viewform?usp=dialog",
		icon: faCircleExclamation,
	},
];

const sociallinks: LinkItem[] = [
	{
		title: "Instagram",
		url: "https://www.instagram.com/diaspora.sound",
		icon: faInstagram,
	},
];

export default function LinksPage() {
	// Share helper section
	// Copies either full external links or an absolute URL for internal routes.
	const handleShare = (url: string) => {
		const fullUrl = url.startsWith("http") ? url : window.location.origin + url;

		navigator.clipboard.writeText(fullUrl);
		alert("Link copied!");
	};

	// List rendering helper
	// Converts each LinkItem into a consistently styled row with link and share controls.
	const renderLinks = (links: LinkItem[]) =>
		links.map((link, i) => (
			<div key={i} className={styles.linkRow}>
				<a href={link.url} className={styles.link}>
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

				<p className={styles.subtitle}>About</p>
				<div className={styles.links}>{renderLinks(aboutlinks)}</div>

				<p className={styles.subtitle}>Forms</p>
				<div className={styles.links}>{renderLinks(contactlinks)}</div>

				<p className={styles.subtitle}>Socials</p>
				<div className={styles.links}>{renderLinks(sociallinks)}</div>
			</div>
		</div>
	);
}
