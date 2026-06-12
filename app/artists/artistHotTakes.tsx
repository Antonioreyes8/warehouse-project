/**
 * File: app/artists/artistHotTakes.tsx
 * Purpose: Shows the artist's hot takes in a public-facing format.
 * Responsibilities:
 *   - Map saved quiz answers to question text
 *   - Render agree/disagree badges for each answered item
 * Key Concepts:
 *   - Conditional rendering when no hot takes are available
 *   - Uses shared quiz question definitions for consistency
 */
import { QUESTIONS } from "@/lib/discovery/questions";
import styles from "./artist-hot-takes.module.css";

type HotTakes = Record<string, boolean> | null | undefined;

interface ArtistHotTakesProps {
	hotTakes?: HotTakes;
}

export default function ArtistHotTakes({ hotTakes }: ArtistHotTakesProps) {
	const visibleQuestions = QUESTIONS.filter(
		(question) => hotTakes?.[question.id] !== undefined,
	);

	if (visibleQuestions.length === 0) return null;

	return (
		<div className={styles.hotTakesContainer}>
			<h3>Hot Takes:</h3>
			<div className={styles.hotTakesList}>
				{visibleQuestions.map((question) => (
					<div key={question.id} className={styles.hotTakeRow}>
						<p className={styles.hotTakeText}>{question.text}</p>
						<p className={styles.hotTakeResult}>
							{hotTakes?.[question.id] ? "Agree" : "Disagree"}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
