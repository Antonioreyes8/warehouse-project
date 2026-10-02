/**
 * File: app/home/projectsSection.tsx
 * Purpose: Renders the projects grid section on the home page.
 */

import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { getProjects } from "@/lib/projects/queries";

export default async function ProjectsSection() {
	const projects = await getProjects();

	return (
		<section id="projects" className={styles.projectsSection}>
			<div className={styles.projectsContainer}>
				<h2>PROJECTS</h2>
				<p className={styles.instruction}>Select a project</p>

				<div className={styles.projectsGrid}>
					{projects
						.filter((project) => project.visibilityStatus !== "hidden")
						.map((project) => {
							const CoverImage = (
								<Image
									src={project.img}
									alt={`${project.title} cover`}
									width={700}
									height={1050}
									sizes="(max-width: 1024px) 92vw, (max-width: 1400px) 30vw, 420px"
									style={{ width: "100%", height: "auto" }}
									unoptimized
								/>
							);
							const CardContent = (
								<>
									<h3>{project.title}</h3>
									{CoverImage}
									<p className={styles.projectDate}>{project.dateLabel}</p>
								</>
							);

							if (project.visibilityStatus === "cover_only") {
								return (
									<article
										key={project.slug}
										className={`${styles.projectCard} ${styles.lockedCard}`}
										aria-label={`${project.title}, page coming soon`}
									>
										{CardContent}
									</article>
								);
							}

							return (
								<Link
									href={`/projects/${project.slug}`}
									key={project.slug}
									className={styles.projectCard}
								>
									{CardContent}
								</Link>
							);
						})}
				</div>
			</div>
		</section>
	);
}
