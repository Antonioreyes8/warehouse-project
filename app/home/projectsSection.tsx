/**
 * File: app/home/projectsSection.tsx
 * Purpose: Renders the projects grid section on the home page.
 * Responsibilities:
 *   - Display list of projects in a grid
 *   - Link to individual project pages
 * Key Concepts:
 *   - React component mapping over data
 *   - Next.js Link and Image for navigation and optimization
 * Dependencies:
 *   - projects data, home.module.css styles
 * How It Fits:
 *   - Part of the home page to showcase available projects
 */

import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { getProjects } from "@/lib/projects/queries";

// ProjectsSection component
// Displays the home-page project catalog from static project metadata.
// This section is data-driven: adding/removing entries in projects data updates this grid automatically.
export default async function ProjectsSection() {
	const projects = await getProjects();

	return (
		<section id="projects" className={styles.projectsSection}>
			<div className={styles.projectsContainer}>
				<h2>PROJECTS</h2>
				{/* Lighter tone instruction to guide the user */}
				<p className={styles.instruction}>
					Select a project
				</p>

				<div className={styles.projectsGrid}>
					{projects.map((project) => (
						<Link
							href={`/projects/${project.slug}`}
							key={project.slug}
							className={styles.projectCard}
						>
							<h3>{project.title}</h3>

							<div className={styles.imageWrapper}>
								<Image
									src={project.img}
									alt={project.title}
									width={700}
									height={1050}
									sizes="(max-width: 1024px) 92vw, (max-width: 1400px) 30vw, 420px"
									style={{ width: "100%", height: "auto" }}
									unoptimized
								/>
							</div>

							<p className={styles.projectDate}>{project.date}</p>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
