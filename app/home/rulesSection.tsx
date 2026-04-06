/**
 * File: app/home/rulesSection.tsx
 * Purpose: Renders the rules section with overlay on the home page.
 * Responsibilities:
 *   - Display event rules with background image
 *   - Overlay text on media
 * Key Concepts:
 *   - React component with image and overlay
 *   - CSS for positioning
 * Dependencies:
 *   - home.module.css styles
 * How It Fits:
 *   - Part of home page to communicate event guidelines
 */

import Image from "next/image";
import styles from "./home.module.css";

// RulesSection component
// Shows event rules overlaid on a background image
export default function RulesSection() {
	return (
		<section className={styles.rules_section}>
			{/* Media container with background image */}
			<div className={styles.rules_media}>
				<Image
					src="https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/party.gif"
					alt="Party"
					width={700}
					height={400}
					style={{ height: "auto", width: "100%" }}
					unoptimized
				/>
				{/* Overlay with rules list */}
				<div className={styles.rules_overlay}>
					<h3>BEFORE YOU COME</h3>
					<ol className={styles.rules_list}>
						<li>Be open to unfamiliar art</li>
						<li>Respect everybody</li>
						<li>Dress to express yourself</li>
						<li>You may be recorded</li>
						<li>Dance your heart out</li>
					</ol>
				</div>
			</div>
		</section>
	);
}
