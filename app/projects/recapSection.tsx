/**
 * File: app/projects/recapSection.tsx
 * Purpose: Displays project recap media (images/videos) in a responsive grid.
 * Responsibilities:
 *   - Render image and video items from normalized media data
 *   - Provide fallback copy when no recap content exists
 * Key Concepts:
 *   - Conditional rendering by media type
 *   - Lightweight media gallery composition
 * Dependencies:
 *   - Media type from project data
 *   - project.module.css
 * How It Fits:
 *   - Serves as the project's evidence/archive section after descriptive context
 */

import { Media } from "./data";
import styles from "./project.module.css";

export default function RecapSection({
	recapSection,
}: {
	recapSection?: Media[];
}) {
	// Recap rendering strategy
	// If recap media exists, render a mixed image/video grid;
	// otherwise show a simple empty-state message.
	return (
		<section className={styles.recapSection}>
			<h2>Recap</h2>

			{recapSection?.length ? (
				<div className={styles.recapGrid}>
					{recapSection.map((item, i) => (
						<div key={item.src} className={styles.recapItem}>
							{/* Media type switch
                  item.type is prepared upstream so the section can stay focused on display.
              */}
							{item.type === "image" ? (
								<img src={item.src} alt={`Recap ${i + 1}`} loading="lazy" />
							) : (
								<video controls playsInline>
									<source src={item.src} />
								</video>
							)}
						</div>
					))}
				</div>
			) : (
				<p>No recap items yet.</p>
			)}
		</section>
	);
}
