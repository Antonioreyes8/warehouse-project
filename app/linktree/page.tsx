import styles from "./linktree.module.css";

const aboutlinks = [{ title: "Manifesto", url: "/manifesto" }];
const contactlinks = [
	{
		title: "Application",
		url: "/https://docs.google.com/forms/d/e/1FAIpQLSc0Tp1bWgY8WFA_bSfUcB0zr-i36YX3UZIeUikCoGd10MlD_A/viewform?usp=dialog",
	},
];

export default function LinksPage() {
	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1 className={styles.title}>The Warehouse Project LinkTree</h1>
				<p className={styles.subtitle}>About us</p>

				<div className={styles.links}>
					{aboutlinks.map((aboutlink, i) => (
						<a key={i} href={aboutlink.url} className={styles.link}>
							{aboutlink.title}
						</a>
					))}
				</div>

				<p className={styles.subtitle}>Contact forms</p>

				<div className={styles.links}>
					{contactlinks.map((contactlink, i) => (
						<a key={i} href={contactlink.url} className={styles.link}>
							{contactlink.title}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
