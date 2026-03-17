import Image from "next/image";

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
		<section id="projects" className="projects_section">
			<div className="projects_container">
				<h2>PROJECTS</h2>
				<div className="projects_grid">
					{projects.map((project, index) => (
						<div className="project_card" key={index}>
							<h3>{project.title}</h3>
							<Image
								src={project.img}
								alt={project.title}
								width={100}
								height={250}
								style={{ width: "300px", height: "auto" }}
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
