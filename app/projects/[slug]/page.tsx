import { projects } from "../data";
import { notFound } from "next/navigation";

// Make the function async
export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  // If params is async (new App Router behavior), await it
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);

  if (!project) return notFound();

  return (
    <main style={{ maxWidth: "768px", margin: "0 auto", padding: "48px 24px" }}>
      <h1>{project.title}</h1>
      <img
        src={project.img}
        alt={project.title}
        style={{ width: "100%", height: "auto", marginBottom: "16px" }}
      />
      <p><strong>Date:</strong> {project.date}</p>
      <p>{project.description}</p>
    </main>
  );
}