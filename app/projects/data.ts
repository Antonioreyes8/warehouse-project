/**
 * File: app/projects/data.ts
 * Purpose: Defines data types and static project data for the application.
 * Responsibilities:
 *   - Define TypeScript types for Media, Collaborator, Project
 *   - Export the baseline static project catalog used across routes
 *   - Provide strongly typed content contracts for project sub-sections
 * Key Concepts:
 *   - TypeScript type definitions
 *   - Static data storage for projects
 *   - Hybrid data model (static metadata + dynamic recap media)
 * Dependencies:
 *   - CauseSectionType from causeSection.tsx
 * How It Fits:
 *   - Acts as the source of truth for project routing metadata, titles, dates, collaborators,
 *     and cause narratives while recap media is fetched dynamically from Supabase Storage
 */

// Reuse the CauseSectionType we defined earlier
import { CauseSectionType } from "./causeSection";

// Type definitions section
// Defines the data structures used throughout the projects feature

// Media type
export type Media = {
	type: "image" | "video";
	src: string;
};

// Collaborator type
export type Collaborator = {
	name: string;
	role?:
		| "Artists"
		| "Organizers"
		| "Preparation"
		| "Media"
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
	recapSection?: Media[]; // Optional local fallback; generally populated by dynamic storage fetch
	sources?: { title: string; url: string }[]; // Optional legacy field if needed
};

// Static project data section
// Contains project metadata and narrative content used to build project pages.
// Recap media arrays are intentionally left empty because recap assets are loaded
// at runtime from Supabase Storage via project slug folders.
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
			// Artists
			{ name: "Santi", role: "Artists" },
			{ name: "Uriel Espinosa", role: "Artists" },
			{ name: "Matteo Espinosa", role: "Artists" },
			{ name: "Amy", role: "Artists" },
			{ name: "Diego Espino", role: "Artists", username: "diegoespino" },

			// Organizers
			{ name: "Uriel Espinosa", role: "Organizers" },
			{ name: "Diego Espino", role: "Organizers", username: "diegoespino" },
			{ name: "Antonio Reyes", role: "Organizers", username: "antonioreyes" },
			{ name: "Matteo Espinosa", role: "Organizers" },
			{ name: "America Elizalde", role: "Organizers" },

			// Preparation
			{ name: "Antonio Reyes", role: "Preparation", username: "antonioreyes" },
			{ name: "Diego Espino", role: "Preparation", username: "diegoespino" },

			// Media
			{ name: "Junior", role: "Media" },
			{ name: "Rafa", role: "Media" },
			{ name: "Antonio Reyes", role: "Media", username: "antonioreyes" },

			// Technical Production
			{ name: "Uriel Espinosa", role: "Technical Production" },
			{ name: "Matteo Espinosa", role: "Technical Production" },
			{ name: "Diego Espino", role: "Technical Production", username: "diegoespino" },

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
			// Artists

			{ name: "Amelia Walker", role: "Artists" },

			// Organizers
			{ name: "Gabriel Cook", role: "Organizers" },


			// Preparation
			{ name: "Avery Phillips", role: "Preparation" },

			// Media
			{ name: "Jayden Rogers", role: "Media" },

			// Technical Production
			{ name: "Alex Rivera", role: "Technical Production" },
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
			// Artists

			{ name: "Amelia Walker", role: "Artists" },

			// Organizers
			{ name: "Gabriel Cook", role: "Organizers" },


			// Preparation
			{ name: "Avery Phillips", role: "Preparation" },

			// Media
			{ name: "Jayden Rogers", role: "Media" },

			// Technical Production
			{ name: "Alex Rivera", role: "Technical Production" },
		],
		recapSection: [], // <-- dynamic fetch
	},
];
