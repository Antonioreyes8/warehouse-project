// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { projects, Project } from "../data";
import { getProjectMedia } from "@/lib/getProjectMedia";

import CauseSection from "./../causeSection";
import CollaboratorsSection from "./../collaboratorsSection";
import RecapSection from "./../recapSection";

import styles from "../project.module.css";

interface ProjectPageProps {
  params: Promise<{ slug: string }> | { slug: string }; // may be Promise
}

export default async function ProjectPage(props: ProjectPageProps) {
  // await in case params is a Promise
  const { params } = props;
  const resolvedParams = params instanceof Promise ? await params : params;

  const { slug } = resolvedParams;

  // Find project
  const project = projects.find((p): p is Project => p.slug === slug);
  if (!project) return notFound();

  // Fetch recap media dynamically from Supabase
  const recapMedia = await getProjectMedia(slug);

  return (
    <main className={styles.projectMain}>
      <h1>{project.title}</h1>
      <img src={project.img} alt={project.title} className={styles.projectPoster} />
      <p>
        <strong>Date:</strong> {project.date}
      </p>
      <p>{project.description}</p>

      <CauseSection causeSection={project.causeSection} />
      <CollaboratorsSection collaboratorsSection={project.collaboratorsSection} />
      <RecapSection recapSection={recapMedia} />
    </main>
  );
}