/**
 * File: app/projects/[slug]/page.tsx
 * Purpose: Renders individual project pages using dynamic routing.
 * Responsibilities:
 *   - Resolve dynamic slug parameter
 *   - Fetch project data and media
 *   - Render project components
 * Key Concepts:
 *   - Next.js dynamic routes
 *   - Server component with async data fetching
 *   - Parameter resolution for App Router
 * Dependencies:
 *   - projects data, getProjectMedia function
 *   - CauseSection, CollaboratorsSection, RecapSection components
 * How It Fits:
 *   - Handles /projects/[slug] routes to display project details
 */

// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getProjectMedia } from "@/lib/projects/media";
import { getProjectBySlug } from "@/lib/projects/queries";

import CauseSection from "./../causeSection";
import CollaboratorsSection from "./../collaboratorsSection";
import RecapSection from "./../recapSection";

import styles from "../project.module.css";

interface ProjectPageProps {
	params: Promise<{ slug: string }> | { slug: string }; // may be Promise
}

/**
 * Description: Server component that renders a project page based on the slug parameter.
 * Parameters:
 *   - props: ProjectPageProps - Contains the params with slug
 * Returns:
 *   - JSX.Element - The rendered project page or notFound
 * Side Effects:
 *   - Calls notFound() if project doesn't exist
 * Concepts Used:
 *   - Async parameter resolution, dynamic data fetching
 */
export default async function ProjectPage(props: ProjectPageProps) {
	// Parameter resolution section
	// Handles both Promise and direct params for Next.js compatibility
	const { params } = props;
	const resolvedParams = params instanceof Promise ? await params : params;

	const { slug } = resolvedParams;

	// Project lookup section
	// Finds the project in Supabase or returns 404
	const project = await getProjectBySlug(slug);
	if (!project) return notFound();

	// Media fetching section
	// Dynamically loads recap media from Supabase Storage
	const recapMedia = await getProjectMedia(slug);

	// Render section
	// Composes the project page with header, sections, and media
	return (
		<main className={styles.projectMain}>
			<h1>{project.title}</h1>
			<img
				src={project.img}
				alt={project.title}
				className={styles.projectPoster}
			/>
			<p>
				<strong>Date:</strong> {project.date}
			</p>
			<p>{project.description}</p>

			<CauseSection causeSection={project.causeSection} />
			<CollaboratorsSection
				collaboratorsSection={project.collaboratorsSection}
			/>
			<RecapSection recapSection={recapMedia} />
		</main>
	);
}
