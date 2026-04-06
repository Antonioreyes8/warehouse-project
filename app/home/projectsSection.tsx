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
// Displays a grid of project cards linking to detailed project pages
export default function ProjectsSection() {
	return (
		<section id="projects" className={styles.projects_section}>
			<div className={styles.projects_container}>
				<h2>PROJECTS</h2>
				{/* Projects grid section - Maps over project data to create clickable cards */}
				<div className={styles.projects_grid}>
					{projects.map((project) => (
						<div className={styles.project_card} key={project.slug}>
							<h3>{project.title}</h3>

							{/* Only the image is wrapped in the Link now */}
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
