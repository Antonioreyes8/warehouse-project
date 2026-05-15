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
						For us artistic expression is far from neutral, it's a form of
						resistence. We use our spaces to hold solidarity with oppressed
						communities and give a voice to marginalized communities. Our main
						objective is to set an initiative to focus on the often less
						represented voices within our community.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						Unification, healing, and empowerment.
					</p>

					<p className={styles.text}>
						Our mission is to redistribute influence within our community and
						empower those who have been systemically marginalized.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						Respect is an active choice.
					</p>

					<p className={styles.text}>
						We believe art and artist are inseparable. The art you support
						exists within a broader context, one that is often abstracted or
						erased. We believe we have a responsibility to be clear about who
						and what we support. Who makes the art we consume and how do we feel
						about the art we consume?
					</p>

					<p className={styles.text}>
						Take an effort to reject your biases, put yourself in the context of
						another. It's often times those closest to us that we forget to make an effort for.
					</p>

					<p className={`${styles.text} ${styles.emphasis}`}>
						Support local art
					</p>
				</div>
			</div>
		</section>
	);
}
