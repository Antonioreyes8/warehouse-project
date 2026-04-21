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

export type ArtistWorkInput = {
	id?: number;
	title?: string | null;
	description?: string | null;
	medium?: string | null;
	image_url?: string | null;
	link_url?: string | null;
	sort_order?: number;
};

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

export async function syncArtistWorks(
	profileId: string | number,
	works: ArtistWorkInput[],
): Promise<{ success: boolean; error?: string }> {
	try {
		// Normalize and keep only meaningful rows.
		const normalizedWorks = works
			.map((work, index) => ({
				id: work.id,
				title: work.title?.trim() || null,
				description: work.description?.trim() || null,
				medium: work.medium?.trim() || null,
				image_url: work.image_url?.trim() || null,
				link_url: work.link_url?.trim() || null,
				sort_order: work.sort_order ?? index,
			}))
			.filter(
				(work) =>
					Boolean(work.title) ||
					Boolean(work.description) ||
					Boolean(work.medium) ||
					Boolean(work.image_url) ||
					Boolean(work.link_url),
			);

		const { data: existingRows, error: existingRowsError } = await supabase
			.from("artist_works")
			.select("id")
			.eq("profile_id", profileId);

		if (existingRowsError) {
			console.error("Error fetching existing artist works:", existingRowsError);
			return { success: false, error: existingRowsError.message };
		}

		const existingIds = (existingRows ?? []).map((row) => row.id);
		const keptIds = normalizedWorks
			.map((work) => work.id)
			.filter((id): id is number => typeof id === "number");

		if (normalizedWorks.length > 0) {
			const worksToUpdate = normalizedWorks.filter(
				(work): work is typeof work & { id: number } =>
					typeof work.id === "number",
			);
			const worksToInsert = normalizedWorks.filter(
				(work) => typeof work.id !== "number",
			);

			if (worksToUpdate.length > 0) {
				const updatePayload = worksToUpdate.map((work) => ({
					id: work.id,
					profile_id: profileId,
					title: work.title,
					description: work.description,
					image_url: work.image_url,
					link_url: work.link_url,
					sort_order: work.sort_order,
				}));

				const { error: upsertError } = await supabase
					.from("artist_works")
					.upsert(updatePayload, { onConflict: "id" });

				if (upsertError) {
					console.error("Error upserting artist works:", upsertError);
					return { success: false, error: upsertError.message };
				}
			}

			if (worksToInsert.length > 0) {
				const insertPayload = worksToInsert.map((work) => ({
					profile_id: profileId,
					title: work.title,
					description: work.description,
					image_url: work.image_url,
					link_url: work.link_url,
					sort_order: work.sort_order,
				}));

				const { error: insertError } = await supabase
					.from("artist_works")
					.insert(insertPayload);

				if (insertError) {
					console.error("Error inserting artist works:", insertError);
					return { success: false, error: insertError.message };
				}
			}
		}

		const idsToDelete = existingIds.filter((id) => !keptIds.includes(id));
		if (idsToDelete.length > 0) {
			const { error: deleteError } = await supabase
				.from("artist_works")
				.delete()
				.eq("profile_id", profileId)
				.in("id", idsToDelete);

			if (deleteError) {
				console.error("Error deleting removed artist works:", deleteError);
				return { success: false, error: deleteError.message };
			}
		}

		return { success: true };
	} catch (error) {
		console.error("Unexpected error syncing artist works:", error);
		return { success: false, error: "Unexpected error occurred" };
	}
}
