import { Collaborator } from "./data";
import styles from "./project.module.css";
import Link from "next/link";

export default function CollaboratorsSection({
	collaboratorsSection,
}: {
	collaboratorsSection?: Collaborator[];
}) {
	if (!collaboratorsSection || collaboratorsSection.length === 0) {
		return (
			<section className={styles.collaboratorsSection}>
				<h2>Collaborators</h2>
				<p>No collaborators added yet.</p>
			</section>
		);
	}

	// Group by role
	const grouped: Record<string, Collaborator[]> = {};
	collaboratorsSection.forEach((collab) => {
		const role = collab.role || "Other";
		if (!grouped[role]) grouped[role] = [];
		grouped[role].push(collab);
	});

	// Custom order (better than alphabetical)
	const roleOrder = [
		"Performers",
		"Organizers",
		"Preparation",
		"Media",
		"Non-Performative Artists",
		"Technical Production",
	];

	const sortedRoles = roleOrder.filter((role) => grouped[role]);

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
