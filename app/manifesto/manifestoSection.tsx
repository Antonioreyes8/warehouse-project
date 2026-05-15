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
						systems that extract, isolate, and commodify human expression. For
						us artistic expression is far from neutral, it's a form of
						resistence. We use our spaces to hold solidarity with oppressed
						communities and give a voice to marginalized communities. We are
						committed to building a digital and ambulant space. Our main
						objective is to set an initiative to focus on the often less
						represented voices within our community. We organize more than just
						events we curate experiences.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						Unification, healing, and empowerment.
					</p>

					<p className={styles.text}>
						As creative work becomes shaped by market demands, art risks losing
						the freedom and meaning that give it power. Our mission is to
						redistribute influence within our community and empower those who
						have been systemically marginalized. We want to use our space as an
						instrument for the voices in our communities and we believe in art
						as a powerful tool for social change.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						Respect is an active choice.
					</p>

					<p className={styles.text}>
						We believe art and artist are inseparable. The art you support
						exists within a broader context, one that is often abstracted or
						erased. Neutrality and complicity allow harmful cycles to continue.
						In our effort to create change, we acknowledge our duty not only to
						be transparent and speak out, but to actively participate in the
						change we want to see. Who makes the art we consume and how do we
						feel about the art we consume?
					</p>

					<p className={styles.text}>
						Take an effort to reject your biases, put yourself in the context of
						another. It's often times those closest to us that we forget to make
						an effort for.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						Support local art
					</p>
				</div>
			</div>
		</section>
	);
}
