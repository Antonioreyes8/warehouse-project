// app/projects/page.tsx (or wherever your Projects component lives)
import Image from "next/image";
import styles from "./home.module.css"; // 1. Import the styles object

export default function ProjectsSection() {
    const projects = [
        {
            title: "I.",
            desc: "September 25'",
            img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster1.jpg",
        },
        {
            title: "II.",
            desc: "January 26'",
            img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster2.png",
        },
        {
            title: "III.",
            desc: "May 26'",
            img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/black_img.jpg",
        },
    ];

    return (
        /* 2. Replace strings with the styles object property */
        <section id="projects" className={styles.projects_section}>
            <div className={styles.projects_container}>
                <h2>PROJECTS</h2>
                <div className={styles.projects_grid}>
                    {projects.map((project, index) => (
                        <div className={styles.project_card} key={index}>
                            <h3>{project.title}</h3>
                            <Image
                                src={project.img}
                                alt={project.title}
                                width={300} // Increased base width for better quality
                                height={450}
                                style={{ width: "100%", height: "auto" }} // Responsive approach
                                unoptimized
                            />
                            <p>{project.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}