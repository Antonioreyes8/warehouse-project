/**
 * File: lib/artists/profileFieldDescriptions.ts
 * Purpose: Provide helpful descriptions and hints for profile form fields
 * These guide artists through filling out their profiles with context on why each field matters
 * Descriptions are displayed only on the dashboard profile editing view
 */

export const PROFILE_FIELD_DESCRIPTIONS = {
	// Basic Information Section
	avatar: {
		label: "Profile Picture",
		description:
			"This is your artist identity! A clear profile picture helps collectors and collaborators recognize you. Choose an image that represents you professionally.",
		hint: "Max 5MB. Formats: JPG, PNG, WEBP",
	},
	name: {
		label: "Name",
		description:
			"Your full name or the name you go by professionally. This is how you'll be known to collectors and other artists in the community.",
		hint: "Required field",
	},
	username: {
		label: "Username",
		description:
			"A unique identifier for your public profile. Keep it memorable and professional—this is part of your artist brand.",
		hint: "Required field",
	},
	bio: {
		label: "Bio",
		description:
			"Tell your story! Share your artistic journey, what inspires you, and what makes your work unique. This is where you connect personally with your audience.",
		hint: "Share your artistic vision, experience, or unique perspective",
	},
	birthday: {
		label: "Birth Date",
		description:
			"Optional. Sharing your age helps the community understand your generational perspective and can be great for personalization.",
		hint: "Optional",
	},
	basedIn: {
		label: "Based In",
		description:
			"Where you're based geographically. This helps collectors find local artists and understand your cultural context.",
		hint: "City, region, or country",
	},
	mediums: {
		label: "Mediums",
		description:
			"What mediums do you work with? (e.g., Digital, Oil Painting, Sculpture, Photography, etc.) This helps collectors find work that matches their interests.",
		hint: "Examples: Digital art, Oil painting, Mixed media, Photography",
	},
	pastProjects: {
		label: "Past Projects",
		description:
			"Highlight significant projects or collaborations you've been part of. This establishes your credibility and experience in the art world.",
		hint: "List exhibitions, collaborations, or notable works",
	},
	ethnicBackground: {
		label: "Ethnic Background",
		description:
			"Optional. Sharing your background helps the community celebrate diverse perspectives and promotes inclusive representation in art.",
		hint: "Optional",
	},
	contact: {
		label: "Contact",
		description:
			"How should people reach out to you? (Email, phone, or preferred contact method) This is crucial for commissions and collaboration inquiries.",
		hint: "Email or phone number",
	},
	status: {
		label: "Status",
		description:
			"Let the community know your current availability! This helps manage expectations and directs inquiries to the right opportunities.",
		hint: "Choose your current availability status",
	},

	// Social Links Section
	instagram: {
		label: "Instagram",
		description:
			"Your Instagram profile is often where your portfolio lives. Link it here so collectors can see more of your work.",
		hint: "Full profile URL or @username",
	},
	youtube: {
		label: "YouTube",
		description:
			"Perfect for sharing process videos, tutorials, or behind-the-scenes content. Give collectors a deeper look at how you create.",
		hint: "Full channel URL",
	},
	patreon: {
		label: "Patreon",
		description:
			"Support your fan base with exclusive content and early access. Great for building a sustainable income stream.",
		hint: "Full Patreon profile URL",
	},
	facebook: {
		label: "Facebook",
		description:
			"Connect with your audience on social platforms. Many collectors use Facebook to stay updated on new releases.",
		hint: "Full profile or page URL",
	},
	tik_tok: {
		label: "TikTok",
		description:
			"Reach younger audiences with short-form content. Show your artistic process, trends, or tips to grow your fanbase.",
		hint: "Full TikTok profile URL",
	},
	etsy: {
		label: "Etsy",
		description:
			"If you sell work online, your Etsy shop is a direct way for collectors to purchase. Link it to drive sales.",
		hint: "Full Etsy shop URL",
	},
	personal_website: {
		label: "Personal Website",
		description:
			"Your ultimate destination for your complete portfolio and brand. This is where you have full creative control.",
		hint: "Full website URL",
	},
	soundcloud: {
		label: "SoundCloud",
		description:
			"For music artists or sound artists. Share your audio work and connect with listeners and collaborators.",
		hint: "Full SoundCloud profile URL",
	},
	bandcamp: {
		label: "Bandcamp",
		description:
			"Great for independent musicians and sound artists. Direct-to-fan sales and a creative community.",
		hint: "Full Bandcamp profile URL",
	},

	// Featured Work Section
	workImage: {
		label: "Work Image",
		description:
			"Upload an image of your work. This is the first thing people see—make it count! Clear, well-lit images show your work in the best light.",
		hint: "Optional. Max 5MB. Formats: JPG, PNG, WEBP",
	},
	workTitle: {
		label: "Work Title",
		description:
			"Give your work a meaningful title. It helps collectors understand the piece and makes your portfolio more professional.",
		hint: "Example: 'Midnight Reflections' or 'Series #3'",
	},
	workMedium: {
		label: "Medium",
		description:
			"What materials or techniques did you use? This gives collectors important context about the physical or technical nature of your work.",
		hint: "Example: 'Oil on canvas', 'Digital illustration', '3D render'",
	},
	workLink: {
		label: "Work Link",
		description:
			"Link to where collectors can view or purchase this work. Could be your website, a gallery link, or a marketplace.",
		hint: "Full URL to your work or where it can be found",
	},
	workDescription: {
		label: "Work Description",
		description:
			"Tell the story behind the work. What inspired it? What's the message? This emotional connection helps collectors appreciate and connect with your art.",
		hint: "Share the inspiration, process, or meaning behind this piece",
	},
};

/**
 * Get a single field's description by key
 * @param fieldKey - The key of the field (e.g., 'name', 'mediums')
 * @returns Object with label, description, and hint, or null if not found
 */
export function getFieldDescription(
	fieldKey: string,
): { label: string; description: string; hint: string } | null {
	const descriptions = PROFILE_FIELD_DESCRIPTIONS as Record<
		string,
		{ label: string; description: string; hint: string } | undefined
	>;
	return descriptions[fieldKey] || null;
}
