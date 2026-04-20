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

import { supabase } from "../supabase/client";
import type { Artist } from "./queries";

/**
 * Updates an artist profile in the database.
 * @param artistId - The ID of the artist to update
 * @param updates - The fields to update
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function updateArtistProfile(
	artistId: string | number,
	artistEmail: string | null,
	updates: Partial<Omit<Artist, "id" | "email">>,
): Promise<{ success: boolean; error?: string }> {
	try {
		const numericId = Number(artistId);

		if (Number.isFinite(numericId)) {
			const { data, error } = await supabase
				.from("profiles")
				.update(updates)
				.eq("id", numericId)
				.select("id");

			if (error) {
				console.error("Error updating artist profile by id:", error);
				return { success: false, error: error.message };
			}

			if (data && data.length > 0) {
				return { success: true };
			}
		}

		if (artistEmail?.trim()) {
			const { data, error } = await supabase
				.from("profiles")
				.update(updates)
				.ilike("email", artistEmail.trim().toLowerCase())
				.select("id");

			if (error) {
				console.error("Error updating artist profile by email:", error);
				return { success: false, error: error.message };
			}

			if (data && data.length > 0) {
				return { success: true };
			}
		}

		return {
			success: false,
			error: "No matching profile row found to update",
		};
	} catch (error) {
		console.error("Unexpected error updating profile:", error);
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
