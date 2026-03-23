import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { projects } from "../projects/data";

export default function ProjectsSection() {
  return (
    <section id="projects" className={styles.projects_section}>
      <div className={styles.projects_container}>
        <h2>PROJECTS</h2>

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