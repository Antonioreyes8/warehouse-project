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
		description: "Use a clear picture so that people can recognize you.",
		hint: "Max 5MB. Formats: JPG, PNG, WEBP",
	},
	name: {
		label: "Name",
		description: "Your full name or the name you go by professionally.",
		hint: "Required field",
	},
	username: {
		label: "Username",
		description: "Your unique handle.",
		hint: "Required field",
	},
	bio: {
		label: "Bio",
		description:
			"Tell your story! Share how you got started, what inspires you, and what makes your work different.",
		hint: "",
	},
	birthday: {
		label: "Birth Date",
		description:
			"",
		hint: "",
	},
	basedIn: {
		label: "Based In",
		description:
			"Where you grew up or where you currently live.",
		hint: "City, region, or country",
	},
	mediums: {
		label: "Mediums",
		description: "What materials or techniques do you work with?",
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
			"Sharing your background helps the community celebrate diverse perspectives and promotes inclusive representation in art.",
		hint: "Optional",
	},
	contact: {
		label: "Contact",
		description: "How should people reach out to you?",
		hint: "can be Email or phone number",
	},
	status: {
		label: "Status",
		description:
			"Let the community know your current availability!",
		hint: "Choose your current availability status",
	},

	// Featured Work Section
	workImage: {
		label: "Work Image",
		description:
			"Upload an clear image of your work.",
		hint: "Optional. Max 5MB. Formats: JPG, PNG, WEBP",
	},
	workTitle: {
		label: "Work Title",
		description:
			"Give your work a meaningful title.",
		hint: "Example: 'Midnight Reflections' or 'Series #3'",
	},
	workMedium: {
		label: "Medium",
		description:
			"What materials or techniques did you use?",
		hint: "Example: 'Oil on canvas', 'Digital illustration', '3D render'",
	},
	workLink: {
		label: "Work Link",
		description:
			"Link to where people can puchase or learn more about this piece.",
		hint: "",
	},
	workDescription: {
		label: "Work Description",
		description:
			"What inspired it? What's the message? What should people know about this piece?",
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
