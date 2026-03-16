import Image from "next/image";

export default function ProjectsSection() {
	const projects = [
		{
			title: "I. Party At The Warehouse",
			desc: "September 25'",
			img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster1.jpg",
		},
		{
			title: "II. Party At The Warehouse: Masquerade",
			desc: "January 26'",
			img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster2.png",
		},
		{
			title: "III. Coming Soon",
			desc: "May 26'",
			img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/black_img.jpg",
		},
	];

	return (
		<section id="projects" className="projects_section">
			<div className="projects_container">
				<h2>Projects</h2>
				<div className="projects_grid">
					{projects.map((project, index) => (
						<div className="project_card" key={index}>
							<Image
								src={project.img}
								alt={project.title}
								width={100}
								height={250}
								style={{ width: "200px", height: "auto" }}
								unoptimized
							/>
							<h3>{project.title}</h3>
							<p>{project.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
