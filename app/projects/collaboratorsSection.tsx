/**
 * File: app/projects/collaboratorsSection.tsx
 * Purpose: Renders project collaborators grouped by role with links to artist profiles.
 * Responsibilities:
 *   - Display collaborators in role-based categories
 *   - Keep output deterministic through custom role ordering
 *   - Provide links to each collaborator's public artist page
 * Key Concepts:
 *   - Grouping arrays into keyed records
 *   - Stable role ordering and alphabetical sorting inside each group
 * Dependencies:
 *   - Collaborator type from project data
 *   - project.module.css and Next.js Link
 * How It Fits:
 *   - Connects projects to people and drives cross-navigation to artist profiles
 */

import type { Collaborator } from "@/lib/projects/types";
import styles from "./project.module.css";
import Link from "next/link";

export default function CollaboratorsSection({
	collaboratorsSection,
}: {
	collaboratorsSection?: Collaborator[];
}) {
	// Empty-state behavior
	// Projects can be published before collaborator metadata is finalized.
	if (!collaboratorsSection || collaboratorsSection.length === 0) {
		return (
			<section className={styles.collaboratorsSection}>
				<h2>Collaborators</h2>
				<p>No collaborators added yet.</p>
			</section>
		);
	}

	// Grouping phase
	// Transform flat collaborator list into role buckets for sectional rendering.
	const grouped: Record<string, Collaborator[]> = {};
	collaboratorsSection.forEach((collab) => {
		const role = collab.role || "Other";
		if (!grouped[role]) grouped[role] = [];
		grouped[role].push(collab);
	});

	// Role display order
	// Explicit ordering keeps presentation consistent with program priorities.
	const roleOrder = [
		"Artists",
		"Organizers",
		"Preparation",
		"Media",
		"Technical Production",
	];

	const sortedRoles = roleOrder.filter((role) => grouped[role]);

	// Render grouped collaborator cards
	// Names are sorted alphabetically within each role for scanability.
	return (
		<section className={styles.collaboratorsSection}>
			<h2>Collaborators</h2>

			{sortedRoles.map((role) => (
				<div key={role} className={styles.collaboratorsCategory}>
					<h3>{role}</h3>
					<div className={styles.collaboratorsGrid}>
						{grouped[role]
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((person, i) => (
								<div key={i} className={styles.collaboratorName}>
									<Link href={`/artists/${person.username}`}>
										{person.name}
									</Link>
								</div>
							))}
					</div>
				</div>
			))}
		</section>
	);
}
