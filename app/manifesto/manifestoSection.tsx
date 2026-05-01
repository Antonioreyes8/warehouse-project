import styles from "./manifesto.module.css";

export default function ManifestoSection() {
	return (
		<section className={styles.section}>
			{/* Background Layers */}
			<div className={styles.aura}></div>
			<div className={styles.watermark}>Manifesto</div>

			{/* Foreground: Full-width Glass Canvas */}
			<div className={styles.glassCanvas}>
				{/* Centered Reading Column */}
				<div className={styles.textContent}>
					<h1 className={styles.mainTitle}>Our Manifesto</h1>

					<p className={`${styles.text} ${styles.dropCap}`}>
						We want to be part of a movement that reclaims social spaces from
						systems that extract, isolate, and commodify human expression. This
						is our chance to create change and to be part of something bigger
						than ourselves. Artistic expression is fundamental to unification,
						healing, and growth. We believe in the power of art to build
						community and to create meaningful change. We are committed to
						building a digital and ambulant space to function as the medium that
						grows alongside our community and acts as the vessel for artistic
						expression.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						We want to build a community that sees its members as real people.
					</p>

					<p className={styles.text}>
						Technofeudalism makes the path to an audience increasingly isolating
						and dehumanizing. At the same time, gentrification has dismantled
						many of the physical spaces where artists and subcultures once
						gathered. As creative work becomes shaped by market demands, art
						risks losing the freedom and meaning that give it power.
					</p>

					<p className={styles.text}>
						Our mission is to redistribute influence within our community and
						empower those who have been systemically marginalized.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						In this space, respect is not passive. It is an active choice.
					</p>

					<p className={styles.text}>
						We believe art and artist are inseparable. The art you support
						exists within a broader context, one that is often abstracted or
						erased. We believe we have a responsibility to be clear about who
						and what we support.
					</p>

					<p className={styles.text}>
						Neutrality and complicity allow harmful cycles to continue. In our
						effort to create change, we acknowledge our duty not only to be
						transparent and speak out, but to actively participate in the change
						we want to see.
					</p>
				</div>
			</div>
		</section>
	);
}
