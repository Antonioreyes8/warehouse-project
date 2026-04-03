// Reuse the CauseSectionType we defined earlier
import { CauseSectionType } from "./causeSection";

// Media type
export type Media = {
	type: "image" | "video";
	src: string;
};

// Collaborator type
export type Collaborator = {
	name: string;
	role?:
		| "Performers"
		| "Organizers"
		| "Preparation"
		| "Media"
		| "Non-Performative Artists"
		| "Technical Production";
	slug?: string;
	username?: string;
};

// Project type
export type Project = {
	slug: string;
	title: string;
	date: string;
	img: string; // Poster
	description: string;
	causeSection?: CauseSectionType; // Now includes optional sources
	collaboratorsSection?: Collaborator[];
	recapSection?: Media[]; // Can stay empty if using dynamic fetch
	sources?: { title: string; url: string }[]; // Optional legacy field if needed
};
export const projects: Project[] = [
	{
		slug: "project-I",
		title: "I.",
		date: "September 25'",
		img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster1.jpg",
		description: "Details about Project I",
		causeSection: {
			text: `Project I focused on bringing awareness to our community and engaging participants in meaningful activities. At its core, the initiative was designed to highlight the importance of environmental sustainability, a cause that continues to impact both present and future generations. By concentrating on small, actionable steps, the project aimed to show that collective effort can lead to significant and lasting change.

The project began with a series of awareness campaigns centered around everyday habits and how they contribute to larger environmental challenges. These campaigns included informational sessions, digital outreach, and interactive workshops that encouraged participants to reflect on their own behaviors. Rather than overwhelming individuals with large-scale problems, the focus remained on practical solutions—such as reducing waste, conserving energy, and supporting local sustainability efforts. This approach made the cause more accessible and relatable, helping participants feel empowered rather than discouraged.

Engagement was a key priority throughout the project. To foster meaningful participation, activities were designed to be both educational and hands-on. Community members were invited to take part in neighborhood clean-up events, recycling drives, and collaborative projects like creating community gardens. These experiences not only reinforced the importance of environmental responsibility but also built a sense of shared purpose among participants. By working together, individuals were able to see the immediate impact of their efforts, which helped sustain motivation and interest.

In addition to physical activities, the project emphasized dialogue and reflection. Open discussions were organized where participants could share their perspectives, challenges, and ideas for improvement. This created an inclusive environment where everyone felt heard and valued. It also allowed for the exchange of diverse viewpoints, leading to more creative and effective solutions. The project recognized that lasting change often begins with conversation, and by facilitating these discussions, it helped strengthen community connections.`,
			sources: [
				{
					title: "Environmental Awareness and Sustainability",
					url: "https://www.nationalgeographic.com/environment/article/environmental-awareness",
				},
				{
					title: "Community Engagement Strategies",
					url: "https://www.un.org/en/academic-impact/community-engagement",
				},
				{
					title: "Sustainable Living Tips",
					url: "https://www.epa.gov/sustainability/learn-about-sustainability",
				},
				{
					title: "Importance of Environmental Education",
					url: "https://www.sciencedaily.com/news/earth_climate/environmental_education/",
				},
			],
		},
		collaboratorsSection: [
			// Performers
			{ name: "Ethan Carter", role: "Performers" },
			{ name: "Sophia Martinez", role: "Performers" },
			{ name: "Isabella Rodriguez", role: "Performers" },
			{ name: "Amelia Walker", role: "Performers" },
			{ name: "Harper King", role: "Performers" },
			{ name: "Abigail Nguyen", role: "Performers" },
			{ name: "Aiden Perez", role: "Performers" },
			{ name: "Ella Roberts", role: "Performers" },
			{ name: "Scarlett Parker", role: "Performers" },

			// Organizers
			{ name: "Liam Anderson", role: "Organizers" },
			{ name: "Mason Hernandez", role: "Organizers" },
			{ name: "Benjamin Hall", role: "Organizers" },
			{ name: "Elijah Wright", role: "Organizers" },
			{ name: "Daniel Hill", role: "Organizers" },
			{ name: "Logan Turner", role: "Organizers" },
			{ name: "Sebastian Evans", role: "Organizers" },
			{ name: "Wyatt Sanchez", role: "Organizers" },
			{ name: "Gabriel Cook", role: "Organizers" },
			{ name: "Antonio Reyes", role: "Organizers", username: "antonioreyes" },
			{ name: "Julian Cox", role: "Organizers" },

			// Preparation
			{ name: "Olivia Thompson", role: "Preparation" },
			{ name: "Mia Clark", role: "Preparation" },
			{ name: "Charlotte Allen", role: "Preparation" },
			{ name: "Evelyn Scott", role: "Preparation" },
			{ name: "Emily Flores", role: "Preparation" },
			{ name: "Avery Phillips", role: "Preparation" },
			{ name: "Grace Edwards", role: "Preparation" },
			{ name: "Victoria Morris", role: "Preparation" },
			{ name: "Hannah Morgan", role: "Preparation" },

			// Media
			{ name: "Noah Garcia", role: "Media" },
			{ name: "James Lewis", role: "Media" },
			{ name: "Lucas Young", role: "Media" },
			{ name: "Alexander Torres", role: "Media" },
			{ name: "Jackson Campbell", role: "Media" },
			{ name: "Carter Collins", role: "Media" },
			{ name: "Jayden Rogers", role: "Media" },

			// Technical Production
			{ name: "Tyler Brooks", role: "Technical Production" },
			{ name: "Jordan Kim", role: "Technical Production" },
			{ name: "Alex Rivera", role: "Technical Production" },
			{ name: "Cameron Diaz", role: "Technical Production" },
			{ name: "Riley Foster", role: "Technical Production" },

			// Non-Performative Artists
			{ name: "Avery Stone", role: "Non-Performative Artists" },
			{ name: "Jamie Cruz", role: "Non-Performative Artists" },
			{ name: "Taylor Brooks", role: "Non-Performative Artists" },
			{ name: "Rowan Blake", role: "Non-Performative Artists" },
		],
		recapSection: [], // <-- will populate dynamically from Supabase
	},
	{
		slug: "project-II",
		title: "II.",
		date: "January 26'",
		img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster2.png",
		description: "Details about Project II",
		causeSection: {
			text: `Project I focused on bringing awareness to our community and engaging participants in meaningful activities. At its core, the initiative was designed to highlight the importance of environmental sustainability, a cause that continues to impact both present and future generations. By concentrating on small, actionable steps, the project aimed to show that collective effort can lead to significant and lasting change.

The project began with a series of awareness campaigns centered around everyday habits and how they contribute to larger environmental challenges. These campaigns included informational sessions, digital outreach, and interactive workshops that encouraged participants to reflect on their own behaviors. Rather than overwhelming individuals with large-scale problems, the focus remained on practical solutions—such as reducing waste, conserving energy, and supporting local sustainability efforts. This approach made the cause more accessible and relatable, helping participants feel empowered rather than discouraged.

Engagement was a key priority throughout the project. To foster meaningful participation, activities were designed to be both educational and hands-on. Community members were invited to take part in neighborhood clean-up events, recycling drives, and collaborative projects like creating community gardens. These experiences not only reinforced the importance of environmental responsibility but also built a sense of shared purpose among participants. By working together, individuals were able to see the immediate impact of their efforts, which helped sustain motivation and interest.

In addition to physical activities, the project emphasized dialogue and reflection. Open discussions were organized where participants could share their perspectives, challenges, and ideas for improvement. This created an inclusive environment where everyone felt heard and valued. It also allowed for the exchange of diverse viewpoints, leading to more creative and effective solutions. The project recognized that lasting change often begins with conversation, and by facilitating these discussions, it helped strengthen community connections.`,
			sources: [
				{
					title: "Environmental Awareness and Sustainability",
					url: "https://www.nationalgeographic.com/environment/article/environmental-awareness",
				},
				{
					title: "Community Engagement Strategies",
					url: "https://www.un.org/en/academic-impact/community-engagement",
				},
				{
					title: "Sustainable Living Tips",
					url: "https://www.epa.gov/sustainability/learn-about-sustainability",
				},
				{
					title: "Importance of Environmental Education",
					url: "https://www.sciencedaily.com/news/earth_climate/environmental_education/",
				},
			],
		},
		collaboratorsSection: [
			// Performers
			{ name: "Ethan Carter", role: "Performers" },
			{ name: "Sophia Martinez", role: "Performers" },
			{ name: "Isabella Rodriguez", role: "Performers" },
			{ name: "Amelia Walker", role: "Performers" },
			{ name: "Harper King", role: "Performers" },
			{ name: "Abigail Nguyen", role: "Performers" },

			// Organizers
			{ name: "Liam Anderson", role: "Organizers" },
			{ name: "Mason Hernandez", role: "Organizers" },
			{ name: "Benjamin Hall", role: "Organizers" },
			{ name: "Elijah Wright", role: "Organizers" },
			{ name: "Daniel Hill", role: "Organizers" },
			{ name: "Logan Turner", role: "Organizers" },
			{ name: "Sebastian Evans", role: "Organizers" },
			{ name: "Wyatt Sanchez", role: "Organizers" },
			{ name: "Gabriel Cook", role: "Organizers" },
			{ name: "Anthony Bailey", role: "Organizers" },

			// Preparation
			{ name: "Olivia Thompson", role: "Preparation" },
			{ name: "Mia Clark", role: "Preparation" },
			{ name: "Charlotte Allen", role: "Preparation" },
			{ name: "Evelyn Scott", role: "Preparation" },
			{ name: "Emily Flores", role: "Preparation" },
			{ name: "Avery Phillips", role: "Preparation" },
			{ name: "Grace Edwards", role: "Preparation" },
			{ name: "Victoria Morris", role: "Preparation" },

			// Media
			{ name: "Noah Garcia", role: "Media" },
			{ name: "James Lewis", role: "Media" },
			{ name: "Lucas Young", role: "Media" },
			{ name: "Alexander Torres", role: "Media" },
			{ name: "Jackson Campbell", role: "Media" },
			{ name: "Carter Collins", role: "Media" },
			{ name: "Jayden Rogers", role: "Media" },
			{ name: "Isaac Bell", role: "Media" },

			// Technical Production
			{ name: "Tyler Brooks", role: "Technical Production" },
			{ name: "Jordan Kim", role: "Technical Production" },
			{ name: "Alex Rivera", role: "Technical Production" },
			{ name: "Cameron Diaz", role: "Technical Production" },
			{ name: "Riley Foster", role: "Technical Production" },

			// Non-Performative Artists
			{ name: "Avery Stone", role: "Non-Performative Artists" },
			{ name: "Jamie Cruz", role: "Non-Performative Artists" },
			{ name: "Taylor Brooks", role: "Non-Performative Artists" },
			{ name: "Rowan Blake", role: "Non-Performative Artists" },
			{ name: "Dakota Hayes", role: "Non-Performative Artists" },
		],
		recapSection: [], // <-- dynamic fetch
	},
	{
		slug: "project-III",
		title: "III.",
		date: "May 26'",
		img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/black_img.jpg",
		description: "Project III focused on community outreach and workshops.",
		causeSection: {
			text: `Project I focused on bringing awareness to our community and engaging participants in meaningful activities. At its core, the initiative was designed to highlight the importance of environmental sustainability, a cause that continues to impact both present and future generations. By concentrating on small, actionable steps, the project aimed to show that collective effort can lead to significant and lasting change.

The project began with a series of awareness campaigns centered around everyday habits and how they contribute to larger environmental challenges. These campaigns included informational sessions, digital outreach, and interactive workshops that encouraged participants to reflect on their own behaviors. Rather than overwhelming individuals with large-scale problems, the focus remained on practical solutions—such as reducing waste, conserving energy, and supporting local sustainability efforts. This approach made the cause more accessible and relatable, helping participants feel empowered rather than discouraged.

Engagement was a key priority throughout the project. To foster meaningful participation, activities were designed to be both educational and hands-on. Community members were invited to take part in neighborhood clean-up events, recycling drives, and collaborative projects like creating community gardens. These experiences not only reinforced the importance of environmental responsibility but also built a sense of shared purpose among participants. By working together, individuals were able to see the immediate impact of their efforts, which helped sustain motivation and interest.

In addition to physical activities, the project emphasized dialogue and reflection. Open discussions were organized where participants could share their perspectives, challenges, and ideas for improvement. This created an inclusive environment where everyone felt heard and valued. It also allowed for the exchange of diverse viewpoints, leading to more creative and effective solutions. The project recognized that lasting change often begins with conversation, and by facilitating these discussions, it helped strengthen community connections.
`,
			sources: [
				{
					title: "Environmental Awareness and Sustainability",
					url: "https://www.nationalgeographic.com/environment/article/environmental-awareness",
				},
				{
					title: "Community Engagement Strategies",
					url: "https://www.un.org/en/academic-impact/community-engagement",
				},
				{
					title: "Sustainable Living Tips",
					url: "https://www.epa.gov/sustainability/learn-about-sustainability",
				},
				{
					title: "Importance of Environmental Education",
					url: "https://www.sciencedaily.com/news/earth_climate/environmental_education/",
				},
			],
		},
		collaboratorsSection: [
			// Performers
			{ name: "Ethan Carter", role: "Performers" },
			{ name: "Sophia Martinez", role: "Performers" },
			{ name: "Isabella Rodriguez", role: "Performers" },
			{ name: "Amelia Walker", role: "Performers" },
			{ name: "Harper King", role: "Performers" },
			{ name: "Abigail Nguyen", role: "Performers" },

			// Organizers
			{ name: "Liam Anderson", role: "Organizers" },
			{ name: "Mason Hernandez", role: "Organizers" },
			{ name: "Benjamin Hall", role: "Organizers" },
			{ name: "Elijah Wright", role: "Organizers" },
			{ name: "Daniel Hill", role: "Organizers" },
			{ name: "Logan Turner", role: "Organizers" },
			{ name: "Sebastian Evans", role: "Organizers" },
			{ name: "Wyatt Sanchez", role: "Organizers" },
			{ name: "Gabriel Cook", role: "Organizers" },
			{ name: "Anthony Bailey", role: "Organizers" },

			// Preparation
			{ name: "Olivia Thompson", role: "Preparation" },
			{ name: "Mia Clark", role: "Preparation" },
			{ name: "Charlotte Allen", role: "Preparation" },
			{ name: "Evelyn Scott", role: "Preparation" },
			{ name: "Emily Flores", role: "Preparation" },
			{ name: "Avery Phillips", role: "Preparation" },
			{ name: "Grace Edwards", role: "Preparation" },
			{ name: "Victoria Morris", role: "Preparation" },

			// Media
			{ name: "Noah Garcia", role: "Media" },
			{ name: "James Lewis", role: "Media" },
			{ name: "Lucas Young", role: "Media" },
			{ name: "Alexander Torres", role: "Media" },
			{ name: "Jackson Campbell", role: "Media" },
			{ name: "Carter Collins", role: "Media" },
			{ name: "Jayden Rogers", role: "Media" },
			{ name: "Isaac Bell", role: "Media" },

			// Technical Production
			{ name: "Tyler Brooks", role: "Technical Production" },
			{ name: "Jordan Kim", role: "Technical Production" },
			{ name: "Alex Rivera", role: "Technical Production" },
			{ name: "Cameron Diaz", role: "Technical Production" },
			{ name: "Riley Foster", role: "Technical Production" },

			// Non-Performative Artists
			{ name: "Avery Stone", role: "Non-Performative Artists" },
			{ name: "Jamie Cruz", role: "Non-Performative Artists" },
			{ name: "Taylor Brooks", role: "Non-Performative Artists" },
			{ name: "Rowan Blake", role: "Non-Performative Artists" },
			{ name: "Dakota Hayes", role: "Non-Performative Artists" },
		],
		recapSection: [], // <-- dynamic fetch
	},
];
