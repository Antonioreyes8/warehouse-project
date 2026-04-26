/**
 * File: lib/projects/media.ts
 * Purpose: Fetches media files (images/videos) for project recaps from Supabase Storage.
 * Responsibilities:
 *   - Query Supabase Storage for files in project folders
 *   - Transform file data into Media objects
 *   - Handle errors gracefully
 * Key Concepts:
 *   - Supabase Storage API
 *   - File type detection via regex
 *   - URL construction for public access
 * Dependencies:
 *   - lib/supabase/client.ts
 *   - Media type from lib/projects/types.ts
 *   - Supabase projects storage bucket
 * How It Fits:
 *   - Used by project dynamic pages to hydrate recap sections at request time
 */

import { supabase } from "@/lib/supabase/client";
import type { Media } from "@/lib/projects/types";

/**
 * Description: Retrieves all media files for a project from Supabase Storage and transforms them into Media objects.
 * Parameters:
 *   - slug: string - The project slug used as the storage folder name
 * Returns:
 *   - Promise<Media[]> - Array of media objects with type and source URL
 * Side Effects:
 *   - Logs errors to console if storage query fails
 * Concepts Used:
 *   - Supabase Storage list operation, regex pattern matching for file types
 */
export async function getProjectMedia(slug: string): Promise<Media[]> {
	// Storage folder convention
	// Each project's recap files live under bucket "projects" in a folder named by slug.
	const { data, error } = await supabase.storage
		.from("projects") // bucket name
		.list(slug, {
			// folder = project slug
			limit: 100,
			sortBy: { column: "name", order: "asc" },
		});

	if (error) {
		console.error("Supabase error fetching recap images:", error);
		return [];
	}

	// Transformation phase
	// Convert storage objects into UI-ready media descriptors with a best-effort
	// type check based on common video extensions.
	return data.map((file) => ({
		type: file.name.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
		src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${slug}/${file.name}`,
	}));
}
