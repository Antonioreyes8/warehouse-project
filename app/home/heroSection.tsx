/**
 * File: app/home/heroSection.tsx
 * Purpose: Renders the homepage hero banner with animated media.
 * Responsibilities:
 *   - Display the top-of-page visual introduction
 *   - Load the hero image via Next.js Image for optimized delivery
 * Key Concepts:
 *   - Responsive hero media presentation
 *   - Static image rendering without additional business logic
 */

import Image from "next/image";
import styles from "./home.module.css";

export default function HeroSection() {
	return (
		<section className={styles.heroSection}>
			<div className={styles.heroMedia}>
				<div className={styles.heroBackground}>
					<Image
						src="https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/party.gif"
						alt="Party"
						fill
						className={styles.heroImage}
						sizes="100vw"
						unoptimized
					/>
				</div>
			</div>
		</section>
	);
}
