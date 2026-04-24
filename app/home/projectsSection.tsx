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
import { projects } from "../projects/data";

// ProjectsSection component
// Displays the home-page project catalog from static project metadata.
// This section is data-driven: adding/removing entries in projects data updates this grid automatically.
export default function ProjectsSection() {
	return (
		<section id="projects" className={styles.projectsSection}>
			<div className={styles.projectsContainer}>
				<h2>PROJECTS</h2>
				{/* Project card mapping
				    - Uses slug as the stable key and route target.
				    - Keeps each card simple: title, visual, date.
				    - Image-only link creates a clear visual click target while preserving text readability.
				*/}
				<div className={styles.projectsGrid}>
					{projects.map((project) => (
						<div className={styles.projectCard} key={project.slug}>
							<h3>{project.title}</h3>

							{/* Visual navigation target */}
							<Link href={`/projects/${project.slug}`}>
								<Image
									src={project.img}
									alt={project.title}
									width={300}
									height={450}
									style={{ width: "100%", height: "auto", cursor: "pointer" }}
									unoptimized
								/>
							</Link>

							<p>{project.date}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
