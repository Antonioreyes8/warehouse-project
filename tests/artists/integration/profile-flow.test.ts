import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockFrom,
	mockSelect,
	mockEq,
	mockIlike,
	mockMaybeSingle,
	resetSupabaseMocks,
} from "../../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import {
	getArtistByEmail,
	getArtistByUserId,
	isEmailAuthorized,
} from "@/lib/artists/queries";
import { updateArtistProfile } from "@/lib/artists/mutations";
import { isArtistAuthorized } from "@/lib/auth/authorization";

const artist = {
	id: "42",
	email: "f2arc.8@gmail.com",
	name: "Antonio Reyes",
	username: "antonioreyes",
};

beforeEach(() => {
	resetSupabaseMocks();
});

describe("API Integration Tests", () => {
	it("authorizes an artist and updates their profile by numeric id", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { email: artist.email },
			error: null,
		});

		const authorized = await isArtistAuthorized({
			id: "uid-1",
			email: artist.email,
		} as User);

		expect(authorized).toBe(true);
		expect(mockFrom).toHaveBeenCalledWith("authorized_artists");

		mockSelect.mockResolvedValueOnce({ data: [{ id: 42 }], error: null });

		await expect(
			updateArtistProfile(artist.id, artist.email, { name: "Updated Artist" }),
		).resolves.toEqual({ success: true });

		expect(mockEq).toHaveBeenCalledWith("id", 42);
	});

	it("falls back to email-based profile update and performs case-insensitive lookup", async () => {
		mockSelect
			.mockResolvedValueOnce({ data: [], error: null })
			.mockResolvedValueOnce({ data: [{ id: 42 }], error: null });
		const result = await updateArtistProfile("999", artist.email, {
			name: "Fallback Update",
		});

		expect(result).toEqual({ success: true });
		expect(mockIlike).toHaveBeenCalledWith("email", artist.email.toLowerCase());
	});

	it("retrieves an artist profile by email using case-insensitive matching", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: artist, error: null });

		await expect(getArtistByEmail("  F2ARC.8@GMAIL.COM  ")).resolves.toEqual(
			artist,
		);
		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
	});

	it("returns false when an unauthorized email is checked", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		await expect(isEmailAuthorized("none@example.com")).resolves.toBe(false);
	});

	it("retrieves a profile by user id and validates query chaining", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: artist, error: null });

		await expect(getArtistByUserId("42")).resolves.toEqual(artist);
		expect(mockEq).toHaveBeenCalledWith("id", "42");
	});
});
