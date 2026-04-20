/**
 * File: lib/getArtists.ts
 * Purpose: Defines the Artist type and provides functions to fetch artist data from Supabase.
 * Responsibilities:
 *   - Define Artist data structure
 *   - Fetch artist profile by username from database
 * Key Concepts:
 *   - TypeScript type definitions for data models
 *   - Asynchronous data fetching from Supabase
 *   - Error handling in database queries
 * Dependencies:
 *   - supabaseClient.ts for database connection
 *   - Supabase profiles table
 * How It Fits:
 *   - Used by artist profile pages in app/artists/ to retrieve and display artist information
 */

import { supabase } from "../supabase/client";

// Type definitions section
// Defines the structure of artist data as stored in Supabase
export type Artist = {
	id: string;
	name: string;
	username: string;
	bio: string | null;
	avatar_url: string | null;
	age?: string | null;
	based_in?: string | null;
	mediums?: string | null;
	past_projects?: string | null;
	ethnic_background?: string | null;
	contact?: string | null;
	status?: string | null;
	member_since?: string | null;
	instagram?: string | null;
	youtube?: string | null;
	patreon?: string | null;
	facebook?: string | null;
	tik_tok?: string | null;
	etsy?: string | null;
	personal_website?: string | null;
	soundcloud?: string | null;
	bandcamp?: string | null;
	email?: string | null;
};

/**
 * Description: Fetches a single artist profile from the Supabase profiles table by username.
 * Parameters:
 *   - username: string - The unique username identifier for the artist
 * Returns:
 *   - Promise<Artist | null> - The artist data if found, null if not found or error
 * Side Effects:
 *   - Logs errors to console if query fails
 * Concepts Used:
 *   - Supabase query builder, async/await for database operations
 */
export async function getArtistByUsername(
	username: string,
): Promise<Artist | null> {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", username)
		.maybeSingle();

	if (error) {
		console.error("Error fetching artist:", error);
		return null;
	}

	return data;
}

/**
 * Description: Fetches an artist profile by Supabase auth user ID.
 * Parameters:
 *   - userId: string - The Supabase auth user ID
 * Returns:
 *   - Promise<Artist | null> - The artist data if found, null if not found or error
 * Side Effects:
 *   - Logs errors to console if query fails
 * Concepts Used:
 *   - Supabase query builder for authenticated user data
 */
export async function getArtistByUserId(
	userId: string,
): Promise<Artist | null> {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.maybeSingle();

	if (error) {
		console.error("Error fetching artist by user ID:", error);
		return null;
	}

	return data;
}

/**
 * Description: Fetches an artist profile by email.
 * Parameters:
 *   - email: string - The artist's email
 * Returns:
 *   - Promise<Artist | null> - The artist data if found, null if not found or error
 */
export async function getArtistByEmail(email: string): Promise<Artist | null> {
	const normalizedEmail = email.trim().toLowerCase();

	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.ilike("email", normalizedEmail)
		.maybeSingle();

	if (error) {
		console.error("Error fetching artist by email:", error);
		return null;
	}

	return data;
}

/**
 * Description: Checks if an email is authorized for artist access.
 * Parameters:
 *   - email: string - The email to check
 * Returns:
 *   - Promise<boolean> - True if the email is authorized, false otherwise
 * Side Effects:
 *   - Logs errors to console if query fails
 * Concepts Used:
 *   - Supabase query to check authorization status
 */
export async function isEmailAuthorized(email: string): Promise<boolean> {
	const normalizedEmail = email.trim().toLowerCase();

	const { data, error } = await supabase
		.from("allowed_users")
		.select("email")
		.ilike("email", normalizedEmail)
		.maybeSingle();

	if (error) {
		console.error("Error checking email authorization:", error);
		return false;
	}

	return !!data;
}
