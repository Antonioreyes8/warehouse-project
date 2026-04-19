/**
 * File: lib/artistApi.ts
 * Purpose: API functions for artist profile operations.
 * Responsibilities:
 *   - Update artist profiles
 *   - Handle database operations for artists
 * Key Concepts:
 *   - Database CRUD operations
 *   - Error handling for API calls
 * Dependencies:
 *   - supabaseClient for database connection
 *   - Artist type from getArtists.ts
 * How It Fits:
 *   - Provides backend API functions for artist profile management
 */

import { supabase } from "./supabaseClient";
import type { Artist } from "./getArtists";

/**
 * Updates an artist profile in the database.
 * @param artistId - The ID of the artist to update
 * @param updates - The fields to update
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function updateArtistProfile(
	artistId: string,
	updates: Partial<Omit<Artist, "id" | "email">>,
): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await supabase
			.from("profiles")
			.update(updates)
			.eq("id", artistId);

		if (error) {
			console.error("Error updating artist profile:", error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Unexpected error updating profile:", error);
		return { success: false, error: "Unexpected error occurred" };
	}
}

/**
 * Creates a new artist profile (admin only).
 * @param profile - The profile data to create
 * @returns Promise<{ success: boolean; error?: string; data?: Artist }>
 */
export async function createArtistProfile(
	profile: Omit<Artist, "id">,
): Promise<{ success: boolean; error?: string; data?: Artist }> {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.insert(profile)
			.select()
			.single();

		if (error) {
			console.error("Error creating artist profile:", error);
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Unexpected error creating profile:", error);
		return { success: false, error: "Unexpected error occurred" };
	}
}

/**
 * Deletes an artist profile (admin only).
 * @param artistId - The ID of the artist to delete
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deleteArtistProfile(
	artistId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await supabase
			.from("profiles")
			.delete()
			.eq("id", artistId);

		if (error) {
			console.error("Error deleting artist profile:", error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Unexpected error deleting profile:", error);
		return { success: false, error: "Unexpected error occurred" };
	}
}
