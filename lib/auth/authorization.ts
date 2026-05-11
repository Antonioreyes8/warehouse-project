/**
 * File: lib/authorization.ts
 * Purpose: Centralized authorization logic for artist access control.
 *
 * Responsibilities:
 *   - Check if a Supabase authenticated user is allowed access
 *   - Query "authorized_artists" allowlist table
 *   - Provide reusable auth guard function across app
 *
 * Key Concepts:
 *   - Separation of concerns (auth logic not inside UI components)
 *   - Allowlist-based access control (manual admin approval system)
 *   - Supabase queries for verification
 *
 * How It Fits:
 *   - Used in protected pages like /artists/profile
 *   - Replaces repeated isEmailAuthorized calls in components
 */

import { supabase } from "../supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Strategy Pattern: Authorization Strategies
 * Each strategy implements a different approach to checking artist authorization
 */
interface AuthorizationStrategy {
	execute(email: string): Promise<boolean>;
}

class PrimaryTableStrategy implements AuthorizationStrategy {
	async execute(email: string): Promise<boolean> {
		const { data, error } = await supabase
			.from("authorized_artists")
			.select("email")
			.ilike("email", email)
			.maybeSingle();

		return !error && !!data;
	}
}

class FallbackTableStrategy implements AuthorizationStrategy {
	async execute(email: string): Promise<boolean> {
		const { data, error } = await supabase
			.from("authorized")
			.select("email")
			.ilike("email", email)
			.maybeSingle();

		return !error && !!data;
	}
}

class LegacyTableStrategy implements AuthorizationStrategy {
	async execute(email: string): Promise<boolean> {
		const { data, error } = await supabase
			.from("allowed_users")
			.select("email")
			.ilike("email", email)
			.maybeSingle();

		return !error && !!data;
	}
}

/**
 * Authorization Service using Strategy Pattern
 * Tries multiple authorization strategies in order of preference
 */
class AuthorizationService {
	private strategies: AuthorizationStrategy[] = [
		new PrimaryTableStrategy(),
		new FallbackTableStrategy(),
		new LegacyTableStrategy(),
	];

	async isAuthorized(user: User): Promise<boolean> {
		if (!user?.email) return false;

		const normalizedEmail = user.email.trim().toLowerCase();

		// Try each strategy until one succeeds
		for (const strategy of this.strategies) {
			try {
				const authorized = await strategy.execute(normalizedEmail);
				if (authorized) return true;
			} catch (error) {
				// Log error but continue to next strategy
				console.warn("Authorization strategy failed:", error);
			}
		}

		return false;
	}
}

// Singleton instance for the application
const authorizationService = new AuthorizationService();

/**
 * Checks whether a user is authorized as an artist.
 *
 * Uses Strategy Pattern with multiple fallback approaches for maximum compatibility
 * during database schema evolution.
 *
 * @param user - Supabase authenticated user
 * @returns true if authorized, false otherwise
 */
export async function isArtistAuthorized(user: User): Promise<boolean> {
	return authorizationService.isAuthorized(user);
}
