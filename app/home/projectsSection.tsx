import Image from "next/image";
import Link from "next/link"; // Import Link
import styles from "./home.module.css";

export default function ProjectsSection() {
    const projects = [
        {
            slug: "project-i", // Added slugs
            title: "I.",
            desc: "September 25'",
            img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster1.jpg",
        },
        {
            slug: "project-ii",
            title: "II.",
            desc: "January 26'",
            img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster2.png",
        },
        {
            slug: "project-iii",
            title: "III.",
            desc: "May 26'",
            img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/black_img.jpg",
        },
    ];

    return (
        <section id="projects" className={styles.projects_section}>
            <div className={styles.projects_container}>
                <h2>PROJECTS</h2>
                <div className={styles.projects_grid}>
                    {projects.map((project, index) => (
                        /* Wrap the card in a Link tag */
                        <Link href={`/projects/${project.slug}`} key={index} className={styles.project_link}>
                            <div className={styles.project_card}>
                                <h3>{project.title}</h3>
                                <Image
                                    src={project.img}
                                    alt={project.title}
                                    width={300}
                                    height={450}
                                    style={{ width: "100%", height: "auto" }}
                                    unoptimized
                                />
                                <p>{project.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}