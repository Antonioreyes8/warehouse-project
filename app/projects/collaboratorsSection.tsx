/**
 * File: app/projects/collaboratorsSection.tsx
 */

import styles from "./project.module.css";
import Link from "next/link";

type Collaborator = {
  role: string;
  name?: string;
  username?: string;
};

type NormalizedCollaborator = {
  role: string;
  displayName: string;
  slug: string;
};

export default function CollaboratorsSection({
  collaboratorsSection,
}: {
  collaboratorsSection?: Collaborator[];
}) {
  if (!collaboratorsSection?.length) {
    return (
      <section className={styles.collaboratorsSection}>
        <h2>Collaborators</h2>
        <p>No collaborators added yet.</p>
      </section>
    );
  }

  // Normalize into safe display format
  const normalized: NormalizedCollaborator[] = collaboratorsSection.map(
    (person, i) => {
      const displayName = person.name || "Unknown";

      const slug =
        person.username ||
        displayName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") ||
        `unknown-${i}`;

      return {
        role: person.role || "Other",
        displayName,
        slug,
      };
    }
  );

  // Group by role
  const grouped: Record<string, NormalizedCollaborator[]> = {};

  normalized.forEach((c) => {
    if (!grouped[c.role]) grouped[c.role] = [];
    grouped[c.role].push(c);
  });

  const roleOrder = [
    "Artists",
    "Organizers",
    "Preparation",
    "Media",
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
              .sort((a, b) =>
                a.displayName.localeCompare(b.displayName)
              )
              .map((person, i) => (
                <div
                  key={`${person.slug}-${i}`}
                  className={styles.collaboratorName}
                >
                  <Link href={`/artists/${person.slug}`}>
                    {person.displayName}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}