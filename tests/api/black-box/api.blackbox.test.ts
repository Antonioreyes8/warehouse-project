import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockMaybeSingle,
	mockSelect,
	mockEq,
	resetSupabaseMocks,
} from "../../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import {
	getArtistByUsername,
	getArtistByUserId,
	getArtistByEmail,
	isEmailAuthorized,
} from "@/lib/artists/queries";
import {
	updateArtistProfile,
	deleteArtistProfile,
} from "@/lib/artists/mutations";
import { isArtistAuthorized } from "@/lib/auth/authorization";

const artist = {
	id: "42",
	name: "Antonio Reyes",
	username: "antonioreyes",
	bio: "Bio",
	avatar_url: null,
	email: "f2arc.8@gmail.com",
};

beforeEach(() => {
	resetSupabaseMocks();
});

describe("API Black-Box: Artist Queries", () => {
	it("returns a profile by username", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: artist, error: null });
		await expect(getArtistByUsername("antonioreyes")).resolves.toEqual(artist);
	});

	it("returns a profile by user id", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: artist, error: null });
		await expect(getArtistByUserId("42")).resolves.toEqual(artist);
	});

	it("returns a profile by email (case-insensitive)", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: artist, error: null });
		await expect(getArtistByEmail("F2ARC.8@GMAIL.COM")).resolves.toEqual(
			artist,
		);
	});

	it("returns false for unauthorized email", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await expect(isEmailAuthorized("none@example.com")).resolves.toBe(false);
	});

	it("returns true for authorized email", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { email: "f2arc.8@gmail.com" },
			error: null,
		});
		await expect(isEmailAuthorized("f2arc.8@gmail.com")).resolves.toBe(true);
	});
});

describe("API Black-Box: Artist Mutations", () => {
	it("updates a profile successfully", async () => {
		mockSelect.mockResolvedValueOnce({ data: [{ id: 42 }], error: null });
		await expect(
			updateArtistProfile(42, "f2arc.8@gmail.com", {
				name: "Updated Name",
				based_in: "Denton, TX",
			}),
		).resolves.toEqual({ success: true });
	});

	it("returns not-found when no row can be updated", async () => {
		mockSelect
			.mockResolvedValueOnce({ data: [], error: null })
			.mockResolvedValueOnce({ data: [], error: null });

		await expect(
			updateArtistProfile("999", "none@example.com", { name: "X" }),
		).resolves.toEqual({
			success: false,
			error: "No matching profile row found to update",
		});
	});

	it("deletes a profile successfully", async () => {
		mockEq.mockResolvedValueOnce({ error: null });
		await expect(deleteArtistProfile("42")).resolves.toEqual({ success: true });
	});
});

describe("API Black-Box: Authorization", () => {
	it("authorizes user with allowlisted email", async () => {
		mockMaybeSingle
			.mockResolvedValueOnce({
				data: null,
				error: { message: "missing table" },
			})
			.mockResolvedValueOnce({
				data: null,
				error: { message: "missing table" },
			})
			.mockResolvedValueOnce({
				data: { email: "f2arc.8@gmail.com" },
				error: null,
			});

		await expect(
			isArtistAuthorized({
				id: "uid-1",
				email: "f2arc.8@gmail.com",
			} as unknown as User),
		).resolves.toBe(true);
	});

	it("blocks user without email", async () => {
		await expect(
			isArtistAuthorized({ id: "uid-1" } as unknown as User),
		).resolves.toBe(false);
	});

	it("blocks user when no allowlist table returns a match", async () => {
		mockMaybeSingle.mockResolvedValue({ data: null, error: null });
		await expect(
			isArtistAuthorized({
				id: "uid-1",
				email: "none@example.com",
			} as unknown as User),
		).resolves.toBe(false);
	});
});
