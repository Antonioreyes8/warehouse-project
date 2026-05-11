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
 * Factory Pattern: Media Object Creation
 * Creates different types of media objects based on file extensions
 */
class MediaFactory {
	private static readonly VIDEO_EXTENSIONS = [
		"mp4",
		"mov",
		"avi",
		"mkv",
		"webm",
	];
	private static readonly IMAGE_EXTENSIONS = [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg",
	];

	static createMedia(fileName: string, projectSlug: string): Media {
		const extension = fileName.split(".").pop()?.toLowerCase() || "";

		if (this.VIDEO_EXTENSIONS.includes(extension)) {
			return {
				type: "video",
				src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${projectSlug}/${fileName}`,
			};
		}

		// Default to image for all other files (including unknown extensions)
		return {
			type: "image",
			src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${projectSlug}/${fileName}`,
		};
	}

	static isValidMediaFile(fileName: string): boolean {
		const extension = fileName.split(".").pop()?.toLowerCase() || "";
		return (
			this.VIDEO_EXTENSIONS.includes(extension) ||
			this.IMAGE_EXTENSIONS.includes(extension)
		);
	}
}

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
	// Use Factory Pattern to create appropriate Media objects based on file type
	return data
		.filter((file) => MediaFactory.isValidMediaFile(file.name))
		.map((file) => MediaFactory.createMedia(file.name, slug));
}
