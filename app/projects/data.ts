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
	role: string;
	category?: "Performers" | "Organizers" | "Preparation" | "Media" | "Other";
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

In addition to physical activities, the project emphasized dialogue and reflection. Open discussions were organized where participants could share their perspectives, challenges, and ideas for improvement. This created an inclusive environment where everyone felt heard and valued. It also allowed for the exchange of diverse viewpoints, leading to more creative and effective solutions. The project recognized that lasting change often begins with conversation, and by facilitating these discussions, it helped strengthen community connections.

Another important aspect of the project was collaboration with local organizations and volunteers. Partnerships played a significant role in expanding the reach and effectiveness of the initiative. By working with schools, small businesses, and community groups, the project was able to tap into existing networks and resources. This not only increased participation but also ensured that the efforts were aligned with the specific needs and priorities of the community.

The impact of the project extended beyond the immediate activities. Participants reported a greater awareness of their environmental footprint and a stronger commitment to making sustainable choices in their daily lives. Many also expressed a renewed sense of responsibility toward their community, recognizing that their actions, no matter how small, could contribute to a larger positive outcome. This shift in mindset was one of the most meaningful outcomes of the project.

Ultimately, the project demonstrated that raising awareness is most effective when it is paired with action. By combining education, engagement, and collaboration, it created an experience that was both impactful and memorable. It served as a reminder that meaningful change does not require grand gestures; rather, it begins with informed individuals who are willing to take small but consistent steps toward a better future. Through this initiative, the community was not only informed about environmental issues but also inspired to become active participants in addressing them.`,
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
			{ name: "Ethan Carter", role: "Performers" },
			{ name: "Sophia Martinez", role: "Performers" },
			{ name: "Liam Anderson", role: "Organizers" },
			{ name: "Olivia Thompson", role: "Preparation" },
			{ name: "Noah Garcia", role: "Media" },
			{ name: "Isabella Rodriguez", role: "Performers" },
			{ name: "Mason Hernandez", role: "Organizers" },
			{ name: "Mia Clark", role: "Preparation" },
			{ name: "James Lewis", role: "Media" },
			{ name: "Amelia Walker", role: "Performers" },
			{ name: "Benjamin Hall", role: "Organizers" },
			{ name: "Charlotte Allen", role: "Preparation" },
			{ name: "Lucas Young", role: "Media" },
			{ name: "Harper King", role: "Performers" },
			{ name: "Elijah Wright", role: "Organizers" },
			{ name: "Evelyn Scott", role: "Preparation" },
			{ name: "Alexander Torres", role: "Media" },
			{ name: "Abigail Nguyen", role: "Performers" },
			{ name: "Daniel Hill", role: "Organizers" },
			{ name: "Emily Flores", role: "Preparation" },
			{ name: "Aiden Perez", role: "Performers" },
			{ name: "Ella Roberts", role: "Performers" },
			{ name: "Logan Turner", role: "Organizers" },
			{ name: "Avery Phillips", role: "Preparation" },
			{ name: "Jackson Campbell", role: "Media" },
			{ name: "Scarlett Parker", role: "Performers" },
			{ name: "Sebastian Evans", role: "Organizers" },
			{ name: "Grace Edwards", role: "Preparation" },
			{ name: "Carter Collins", role: "Media" },
			{ name: "Chloe Stewart", role: "Performers" },
			{ name: "Wyatt Sanchez", role: "Organizers" },
			{ name: "Victoria Morris", role: "Preparation" },
			{ name: "Jayden Rogers", role: "Media" },
			{ name: "Lily Reed", role: "Performers" },
			{ name: "Gabriel Cook", role: "Organizers" },
			{ name: "Hannah Morgan", role: "Preparation" },
			{ name: "Isaac Bell", role: "Media" },
			{ name: "Natalie Murphy", role: "Performers" },
			{ name: "Anthony Bailey", role: "Organizers" },
			{ name: "Zoey Rivera", role: "Preparation" },
			{ name: "Dylan Cooper", role: "Media" },
			{ name: "Leah Richardson", role: "Performers" },
			{ name: "Julian Cox", role: "Organizers" },
			{ name: "Audrey Howard", role: "Preparation" },
			{ name: "Grayson Ward", role: "Media" },
			{ name: "Savannah Peterson", role: "Performers" },
			{ name: "Matthew Gray", role: "Organizers" },
			{ name: "Brooklyn Ramirez", role: "Preparation" },
			{ name: "Joseph James", role: "Media" },
			{ name: "Bella Watson", role: "Performers" },
			{ name: "David Brooks", role: "Organizers" },
			{ name: "Claire Kelly", role: "Preparation" },
			{ name: "Samuel Sanders", role: "Media" },
			{ name: "Skylar Price", role: "Performers" },
			{ name: "Owen Bennett", role: "Organizers" },
			{ name: "Lucy Wood", role: "Preparation" },
			{ name: "Caleb Barnes", role: "Media" },
			{ name: "Anna Ross", role: "Performers" },
			{ name: "Nathan Henderson", role: "Organizers" },
			{ name: "Samantha Coleman", role: "Preparation" },
			{ name: "Aaron Jenkins", role: "Media" },
			{ name: "Kinsley Perry", role: "Performers" },
			{ name: "Christian Powell", role: "Organizers" },
			{ name: "Madeline Long", role: "Preparation" },
			{ name: "Eli Patterson", role: "Media" },
			{ name: "Paisley Hughes", role: "Performers" },
			{ name: "Jonathan Flores", role: "Organizers" },
			{ name: "Allison Washington", role: "Preparation" },
			{ name: "Ryan Butler", role: "Media" },
			{ name: "Naomi Simmons", role: "Performers" },
			// ... continue filling 10 per category
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

In addition to physical activities, the project emphasized dialogue and reflection. Open discussions were organized where participants could share their perspectives, challenges, and ideas for improvement. This created an inclusive environment where everyone felt heard and valued. It also allowed for the exchange of diverse viewpoints, leading to more creative and effective solutions. The project recognized that lasting change often begins with conversation, and by facilitating these discussions, it helped strengthen community connections.

Another important aspect of the project was collaboration with local organizations and volunteers. Partnerships played a significant role in expanding the reach and effectiveness of the initiative. By working with schools, small businesses, and community groups, the project was able to tap into existing networks and resources. This not only increased participation but also ensured that the efforts were aligned with the specific needs and priorities of the community.

The impact of the project extended beyond the immediate activities. Participants reported a greater awareness of their environmental footprint and a stronger commitment to making sustainable choices in their daily lives. Many also expressed a renewed sense of responsibility toward their community, recognizing that their actions, no matter how small, could contribute to a larger positive outcome. This shift in mindset was one of the most meaningful outcomes of the project.

Ultimately, the project demonstrated that raising awareness is most effective when it is paired with action. By combining education, engagement, and collaboration, it created an experience that was both impactful and memorable. It served as a reminder that meaningful change does not require grand gestures; rather, it begins with informed individuals who are willing to take small but consistent steps toward a better future. Through this initiative, the community was not only informed about environmental issues but also inspired to become active participants in addressing them.`,
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
			{ name: "Ethan Carter", role: "Performers" },
			{ name: "Sophia Martinez", role: "Performers" },
			{ name: "Liam Anderson", role: "Organizers" },
			{ name: "Olivia Thompson", role: "Preparation" },
			{ name: "Noah Garcia", role: "Media" },
			{ name: "Isabella Rodriguez", role: "Performers" },
			{ name: "Mason Hernandez", role: "Organizers" },
			{ name: "Mia Clark", role: "Preparation" },
			{ name: "James Lewis", role: "Media" },
			{ name: "Amelia Walker", role: "Performers" },
			{ name: "Benjamin Hall", role: "Organizers" },
			{ name: "Charlotte Allen", role: "Preparation" },
			{ name: "Lucas Young", role: "Media" },
			{ name: "Harper King", role: "Performers" },
			{ name: "Elijah Wright", role: "Organizers" },
			{ name: "Evelyn Scott", role: "Preparation" },
			{ name: "Alexander Torres", role: "Media" },
			{ name: "Abigail Nguyen", role: "Performers" },
			{ name: "Daniel Hill", role: "Organizers" },
			{ name: "Emily Flores", role: "Preparation" },
			{ name: "Aiden Perez", role: "Performers" },
			{ name: "Ella Roberts", role: "Performers" },
			{ name: "Logan Turner", role: "Organizers" },
			{ name: "Avery Phillips", role: "Preparation" },
			{ name: "Jackson Campbell", role: "Media" },
			{ name: "Scarlett Parker", role: "Performers" },
			{ name: "Sebastian Evans", role: "Organizers" },
			{ name: "Grace Edwards", role: "Preparation" },
			{ name: "Carter Collins", role: "Media" },
			{ name: "Chloe Stewart", role: "Performers" },
			{ name: "Wyatt Sanchez", role: "Organizers" },
			{ name: "Victoria Morris", role: "Preparation" },
			{ name: "Jayden Rogers", role: "Media" },
			{ name: "Lily Reed", role: "Performers" },
			{ name: "Gabriel Cook", role: "Organizers" },
			{ name: "Hannah Morgan", role: "Preparation" },
			{ name: "Isaac Bell", role: "Media" },
			{ name: "Natalie Murphy", role: "Performers" },
			{ name: "Anthony Bailey", role: "Organizers" },
			{ name: "Zoey Rivera", role: "Preparation" },
			{ name: "Dylan Cooper", role: "Media" },
			{ name: "Leah Richardson", role: "Performers" },
			{ name: "Julian Cox", role: "Organizers" },
			{ name: "Audrey Howard", role: "Preparation" },
			{ name: "Grayson Ward", role: "Media" },
			{ name: "Savannah Peterson", role: "Performers" },
			{ name: "Matthew Gray", role: "Organizers" },
			{ name: "Brooklyn Ramirez", role: "Preparation" },
			{ name: "Joseph James", role: "Media" },
			{ name: "Bella Watson", role: "Performers" },
			{ name: "David Brooks", role: "Organizers" },
			{ name: "Claire Kelly", role: "Preparation" },
			{ name: "Samuel Sanders", role: "Media" },
			{ name: "Skylar Price", role: "Performers" },
			{ name: "Owen Bennett", role: "Organizers" },
			{ name: "Lucy Wood", role: "Preparation" },
			{ name: "Caleb Barnes", role: "Media" },
			{ name: "Anna Ross", role: "Performers" },
			{ name: "Nathan Henderson", role: "Organizers" },
			{ name: "Samantha Coleman", role: "Preparation" },
			{ name: "Aaron Jenkins", role: "Media" },
			{ name: "Kinsley Perry", role: "Performers" },
			{ name: "Christian Powell", role: "Organizers" },
			{ name: "Madeline Long", role: "Preparation" },
			{ name: "Eli Patterson", role: "Media" },
			{ name: "Paisley Hughes", role: "Performers" },
			{ name: "Jonathan Flores", role: "Organizers" },
			{ name: "Allison Washington", role: "Preparation" },
			{ name: "Ryan Butler", role: "Media" },
			{ name: "Naomi Simmons", role: "Performers" },
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

Another important aspect of the project was collaboration with local organizations and volunteers. Partnerships played a significant role in expanding the reach and effectiveness of the initiative. By working with schools, small businesses, and community groups, the project was able to tap into existing networks and resources. This not only increased participation but also ensured that the efforts were aligned with the specific needs and priorities of the community.

The impact of the project extended beyond the immediate activities. Participants reported a greater awareness of their environmental footprint and a stronger commitment to making sustainable choices in their daily lives. Many also expressed a renewed sense of responsibility toward their community, recognizing that their actions, no matter how small, could contribute to a larger positive outcome. This shift in mindset was one of the most meaningful outcomes of the project.

Ultimately, the project demonstrated that raising awareness is most effective when it is paired with action. By combining education, engagement, and collaboration, it created an experience that was both impactful and memorable. It served as a reminder that meaningful change does not require grand gestures; rather, it begins with informed individuals who are willing to take small but consistent steps toward a better future. Through this initiative, the community was not only informed about environmental issues but also inspired to become active participants in addressing them.`,
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
			{ name: "Ethan Carter", role: "Performers" },
			{ name: "Sophia Martinez", role: "Performers" },
			{ name: "Liam Anderson", role: "Organizers" },
			{ name: "Olivia Thompson", role: "Preparation" },
			{ name: "Noah Garcia", role: "Media" },
			{ name: "Isabella Rodriguez", role: "Performers" },
			{ name: "Mason Hernandez", role: "Organizers" },
			{ name: "Mia Clark", role: "Preparation" },
			{ name: "James Lewis", role: "Media" },
			{ name: "Amelia Walker", role: "Performers" },
			{ name: "Benjamin Hall", role: "Organizers" },
			{ name: "Charlotte Allen", role: "Preparation" },
			{ name: "Lucas Young", role: "Media" },
			{ name: "Harper King", role: "Performers" },
			{ name: "Elijah Wright", role: "Organizers" },
			{ name: "Evelyn Scott", role: "Preparation" },
			{ name: "Alexander Torres", role: "Media" },
			{ name: "Abigail Nguyen", role: "Performers" },
			{ name: "Daniel Hill", role: "Organizers" },
			{ name: "Emily Flores", role: "Preparation" },
			{ name: "Aiden Perez", role: "Performers" },
			{ name: "Ella Roberts", role: "Performers" },
			{ name: "Logan Turner", role: "Organizers" },
			{ name: "Avery Phillips", role: "Preparation" },
			{ name: "Jackson Campbell", role: "Media" },
			{ name: "Scarlett Parker", role: "Performers" },
			{ name: "Sebastian Evans", role: "Organizers" },
			{ name: "Grace Edwards", role: "Preparation" },
			{ name: "Carter Collins", role: "Media" },
			{ name: "Chloe Stewart", role: "Performers" },
			{ name: "Wyatt Sanchez", role: "Organizers" },
			{ name: "Victoria Morris", role: "Preparation" },
			{ name: "Jayden Rogers", role: "Media" },
			{ name: "Lily Reed", role: "Performers" },
			{ name: "Gabriel Cook", role: "Organizers" },
			{ name: "Hannah Morgan", role: "Preparation" },
			{ name: "Isaac Bell", role: "Media" },
			{ name: "Natalie Murphy", role: "Performers" },
			{ name: "Anthony Bailey", role: "Organizers" },
			{ name: "Zoey Rivera", role: "Preparation" },
			{ name: "Dylan Cooper", role: "Media" },
			{ name: "Leah Richardson", role: "Performers" },
			{ name: "Julian Cox", role: "Organizers" },
			{ name: "Audrey Howard", role: "Preparation" },
			{ name: "Grayson Ward", role: "Media" },
			{ name: "Savannah Peterson", role: "Performers" },
			{ name: "Matthew Gray", role: "Organizers" },
			{ name: "Brooklyn Ramirez", role: "Preparation" },
			{ name: "Joseph James", role: "Media" },
			{ name: "Bella Watson", role: "Performers" },
			{ name: "David Brooks", role: "Organizers" },
			{ name: "Claire Kelly", role: "Preparation" },
			{ name: "Samuel Sanders", role: "Media" },
			{ name: "Skylar Price", role: "Performers" },
			{ name: "Owen Bennett", role: "Organizers" },
			{ name: "Lucy Wood", role: "Preparation" },
			{ name: "Caleb Barnes", role: "Media" },
			{ name: "Anna Ross", role: "Performers" },
			{ name: "Nathan Henderson", role: "Organizers" },
			{ name: "Samantha Coleman", role: "Preparation" },
			{ name: "Aaron Jenkins", role: "Media" },
			{ name: "Kinsley Perry", role: "Performers" },
			{ name: "Christian Powell", role: "Organizers" },
			{ name: "Madeline Long", role: "Preparation" },
			{ name: "Eli Patterson", role: "Media" },
			{ name: "Paisley Hughes", role: "Performers" },
			{ name: "Jonathan Flores", role: "Organizers" },
			{ name: "Allison Washington", role: "Preparation" },
			{ name: "Ryan Butler", role: "Media" },
			{ name: "Naomi Simmons", role: "Performers" },
		],
		recapSection: [], // <-- dynamic fetch
	},
];
