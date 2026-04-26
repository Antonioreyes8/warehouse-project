/**
 * File: app/projects/causeSection.tsx
 * Purpose: Renders the contextual "why" behind a project, including optional source links.
 * Responsibilities:
 *   - Display the cause narrative text
 *   - Render references/sources when provided
 *   - Gracefully hide section if no cause content exists
 * Key Concepts:
 *   - Optional props and early-return null rendering
 *   - Multi-paragraph formatting from newline-delimited text
 * Dependencies:
 *   - project.module.css
 * How It Fits:
 *   - Provides social/political context that complements project media and collaborator lists
 */

import styles from "./project.module.css";
import type { CauseSectionType, Source } from "@/lib/projects/types";

// Component receives only causeSection prop
export default function CauseSection({
	causeSection,
}: {
	causeSection?: CauseSectionType;
}) {
	// Visibility gate
	// If cause data is omitted for a project, skip rendering this section entirely.
	if (!causeSection) return null;

	return (
		<section className={styles.causeSection}>
			<h2>The Cause</h2>

			{/* Paragraph formatting
          Editors can write long cause text with blank lines between paragraphs.
          Splitting on double newlines preserves readability without hardcoding markup.
      */}
			{causeSection.text.split("\n\n").map((p, i) => (
				<p key={i} style={{ marginBottom: "16px" }}>
					{p}
				</p>
			))}

			{/* Optional source list
          Encourages transparent citation while keeping UI clean when no links exist.
      */}
			{causeSection.sources && causeSection.sources.length > 0 && (
				<div style={{ marginTop: "24px" }}>
					<h3>Sources</h3>
					<ul>
						{causeSection.sources.map((source: Source, i: number) => (
							<li key={i}>
								<a href={source.url} target="_blank" rel="noopener noreferrer">
									{source.title}
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
