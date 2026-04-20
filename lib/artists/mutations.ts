/**
 * File: lib/artists/mutations.ts
 * Purpose: API functions for artist profile operations.
 * Responsibilities:
 *   - Update profile rows with resilient id/email matching
 *   - Delete profile rows for administrative workflows
 *   - Return explicit success/error results for UI feedback
 * Key Concepts:
 *   - Database CRUD operations
 *   - Fallback query strategies for mixed id schemas
 *   - Structured error handling for API calls
 * Dependencies:
 *   - lib/supabase/client.ts for database connection
 *   - Artist type from lib/artists/queries.ts
 * How It Fits:
 *   - Central write layer used by dashboard edit/save actions
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
		// Primary update strategy
		// Try numeric id first for environments where profiles.id is bigint/integer.
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

		// Fallback update strategy
		// If id path does not update any rows, fallback to case-insensitive email match.
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

		// Explicit not-found outcome
		// Returning a clear message prevents false-positive "saved" UX states.
		return {
			success: false,
			error: "No matching profile row found to update",
		};
	} catch (error) {
		// Unexpected runtime catch
		// Keeps UI response consistent for unhandled exceptions.
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
		// Delete by id
		// Intended for admin-level flows where profile removal is required.
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
