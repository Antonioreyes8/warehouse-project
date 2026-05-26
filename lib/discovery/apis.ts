/**
 * File: lib/discovery/apis.ts
 * Purpose: Small Supabase-backed helpers for the discovery quiz data.
 * Responsibilities:
 *  - Save and load an artist's hot-takes JSON on their profile row
 *  - Normalize input by stripping unanswered/null answers
 */

import { supabase } from "../supabase/client";

/**
 * Saves hot-takes for a given profile id. Removes null/undefined answers before
 * persisting so that unanswered questions are not stored.
 */
export async function saveArtistHotTakes(
	profileId: string,
	hotTakes: Record<string, boolean | null | undefined>,
) {
	const payload: Record<string, boolean> = Object.fromEntries(
		Object.entries(hotTakes).filter(
			([, v]) => v !== null && v !== undefined,
		) as [string, boolean][],
	);

	const { data, error } = await supabase
		.from("profiles")
		.update({ hot_takes: payload })
		.eq("id", profileId)
		.select()
		.maybeSingle();

	if (error) {
		console.error("Error saving hot takes:", error);
		return null;
	}

	return data;
}

/**
 * Fetches only the `hot_takes` column for a profile.
 */
export async function getArtistHotTakes(profileId: string) {
	const { data, error } = await supabase
		.from("profiles")
		.select("hot_takes")
		.eq("id", profileId)
		.maybeSingle();

	if (error) {
		console.error("Error loading hot takes:", error);
		return null;
	}

	return data?.hot_takes ?? null;
}

/**
 * Fetches minimal artist rows for discovery matching: id, name, bio, hot_takes.
 * Returns an array of objects with those fields. If an error occurs, returns []
 */
export async function fetchDiscoveryArtists() {
	const { data, error } = await supabase
		.from("profiles")
		.select("id, name, username, bio, hot_takes");

	if (error) {
		console.error("Error fetching discovery artists:", error);
		return [];
	}

	return (data ?? []) as Array<{
		id: string;
		name?: string | null;
		username?: string | null;
		bio?: string | null;
		hot_takes?: Record<string, boolean> | null;
	}>;
}
