import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockMaybeSingle,
	mockSelect,
	mockEq,
	mockIlike,
	mockUpdate,
	mockDelete,
	resetSupabaseMocks,
} from "../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import { getArtistByUsername, isEmailAuthorized } from "@/lib/artists/queries";
import {
	updateArtistProfile,
	deleteArtistProfile,
} from "@/lib/artists/mutations";
import { isArtistAuthorized } from "@/lib/auth/authorization";

// This file contains integration tests for artist profile workflows.
// Integration testing: Tests the interaction between multiple functions and components as a system.
// These tests verify end-to-end flows, such as profile creation, update, and authorization checks.
// While still using mocks, they test the combination of queries, mutations, and authorization logic.

const mockUser = {
	id: "user-123",
	email: "f2arc.8@gmail.com",
} as User;

const mockProfile = {
	id: "42",
	name: "Antonio Reyes",
	username: "antonioreyes",
	bio: "Artist bio",
	email: "f2arc.8@gmail.com",
};

beforeEach(() => {
	resetSupabaseMocks();
});

describe("Integration: Artist Profile Flow", () => {
	// Integration test: Tests the complete flow of checking authorization and retrieving profile.
	it("allows authorized user to access their profile", async () => {
		// Mock authorization check
		mockMaybeSingle
			.mockResolvedValueOnce({
				data: { email: "f2arc.8@gmail.com" },
				error: null,
			})
			// Mock profile retrieval
			.mockResolvedValueOnce({ data: mockProfile, error: null });

		// First check if user is authorized
		const authorized = await isArtistAuthorized(mockUser);
		expect(authorized).toBe(true);

		// Then retrieve their profile
		const profile = await getArtistByUsername("antonioreyes");
		expect(profile).toEqual(mockProfile);
	});

	it("prevents unauthorized user from profile operations", async () => {
		// Mock failed authorization
		mockMaybeSingle.mockResolvedValue({
			data: null,
			error: { message: "not found" },
		});

		const authorized = await isArtistAuthorized(mockUser);
		expect(authorized).toBe(false);

		// Should not be able to update profile
		mockSelect.mockResolvedValueOnce({ data: [], error: null });
		const updateResult = await updateArtistProfile(
			"user-123",
			"f2arc.8@gmail.com",
			{ name: "Test" },
		);
		expect(updateResult.success).toBe(false);
	});

	it("handles profile update and verification flow", async () => {
		// Mock successful update
		mockSelect.mockResolvedValueOnce({ data: [{ id: 42 }], error: null });

		const updateResult = await updateArtistProfile(42, "f2arc.8@gmail.com", {
			name: "Updated Name",
			bio: "Updated bio",
		});
		expect(updateResult.success).toBe(true);

		// Mock retrieval to verify update
		mockMaybeSingle.mockResolvedValueOnce({
			data: { ...mockProfile, name: "Updated Name", bio: "Updated bio" },
			error: null,
		});

		const updatedProfile = await getArtistByUsername("antonioreyes");
		expect(updatedProfile).not.toBeNull();
		expect(updatedProfile!.name).toBe("Updated Name");
		expect(updatedProfile!.bio).toBe("Updated bio");
	});

	it("manages profile deletion workflow", async () => {
		// Mock successful deletion
		mockEq.mockResolvedValueOnce({ error: null });

		const deleteResult = await deleteArtistProfile("42");
		expect(deleteResult.success).toBe(true);

		// Mock subsequent retrieval to confirm deletion
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		const profile = await getArtistByUsername("antonioreyes");
		expect(profile).toBeNull();
	});
});
