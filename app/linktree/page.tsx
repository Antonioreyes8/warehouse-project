import styles from "./linktree.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faFolder,
	faLink,
	faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

const aboutlinks = [
	{ title: "Manifesto", url: "/manifesto", icon: faFolder },
];

const contactlinks = [
	{
		title: "Application",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSc0Tp1bWgY8WFA_bSfUcB0zr-i36YX3UZIeUikCoGd10MlD_A/viewform?usp=dialog",
		icon: faHome,
	},
];

const sociallinks = [
	{
		title: "Instagram",
		url: "https://www.instagram.com/diaspora.sound",
		icon: faLink,
	},
];

export default function LinksPage() {
	const handleShare = (url: string) => {
		navigator.clipboard.writeText(window.location.origin + url);
		alert("Link copied!");
	};

	const renderLinks = (links: any[]) =>
		links.map((link, i) => (
			<div key={i} className={styles.linkRow}>
				<a href={link.url} className={styles.link}>
					<span className={styles.left}>
						<FontAwesomeIcon icon={link.icon} />
						{link.title}
					</span>
				</a>

				<button
					className={styles.share}
					onClick={() => handleShare(link.url)}
				>
					<FontAwesomeIcon icon={faShareNodes} />
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

				<p className={styles.subtitle}>Social</p>
				<div className={styles.links}>{renderLinks(sociallinks)}</div>
			</div>
		</div>
	);
}