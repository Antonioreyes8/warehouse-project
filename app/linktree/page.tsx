"use client";

import styles from "./linktree.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
	faPaperPlane,
	faHeart,
	faQuestion,
	faCircleExclamation,
	faStar,
	faCrown,
} from "@fortawesome/free-solid-svg-icons";

const aboutlinks = [
	{ title: "Manifesto", url: "/manifesto", icon: faHeart },
	{
		title: "Community Guidelines",
		url: "/guidelines",
		icon: faCrown,
	},
	{ title: "FAQ", url: "/FAQ", icon: faQuestion },
];

const contactlinks = [
	{
		title: "Application to join",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSc0Tp1bWgY8WFA_bSfUcB0zr-i36YX3UZIeUikCoGd10MlD_A/viewform?usp=dialog",
		icon: faStar,
	},
	{
		title: "Make anonymous tip",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSfTwTgewINwYUD3gcaODLd3x_MQkMU30CfUNmlpeT9bvzZR5g/viewform?usp=dialog",
		icon: faCircleExclamation,
	},
];

const sociallinks = [
	{
		title: "Instagram",
		url: "https://www.instagram.com/diaspora.sound",
		icon: faInstagram,
	},
];

export default function LinksPage() {
	const handleShare = (url: string) => {
		const fullUrl = url.startsWith("http") ? url : window.location.origin + url;

		navigator.clipboard.writeText(fullUrl);
		alert("Link copied!");
	};

	const renderLinks = (links: any[]) =>
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
