/**
 * File: tests/lib/artists/queries.test.ts
 * Tests for: lib/artists/queries.ts
 *
 * Covers:
 *   - getArtistByUsername   → found / not found / DB error
 *   - getArtistByEmail      → found / not found / DB error
 *   - isEmailAuthorized     → authorized / not authorized / DB error
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
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
	getArtistByUsername,
	getArtistByEmail,
	isEmailAuthorized,
} from "@/lib/artists/queries";

const fakeArtist = {
	id: "1",
	name: "Test Artist",
	username: "testartist",
	bio: "A bio",
	avatar_url: null,
	email: "f2arc.8@gmail.com",
};

beforeEach(() => {
	resetSupabaseMocks();
});

// ─── getArtistByUsername ─────────────────────────────────────────────────────

describe("getArtistByUsername", () => {
	it("returns the artist when found", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: fakeArtist, error: null });

		const result = await getArtistByUsername("testartist");

		expect(mockFrom).toHaveBeenCalledWith("profiles");
		expect(mockSelect).toHaveBeenCalledWith("*");
		expect(mockEq).toHaveBeenCalledWith("username", "testartist");
		expect(result).toEqual(fakeArtist);
	});

	it("returns null when artist is not found", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		const result = await getArtistByUsername("nobody");

		expect(result).toBeNull();
	});

	it("returns null and logs error on DB failure", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockMaybeSingle.mockResolvedValueOnce({
			data: null,
			error: { message: "DB error" },
		});

		const result = await getArtistByUsername("testartist");

		expect(result).toBeNull();
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});

// ─── getArtistByEmail ────────────────────────────────────────────────────────

describe("getArtistByEmail", () => {
	it("returns the artist when found by email", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: fakeArtist, error: null });

		const result = await getArtistByEmail("F2ARC.8@GMAIL.COM");

		expect(mockFrom).toHaveBeenCalledWith("profiles");
		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
		expect(result).toEqual(fakeArtist);
	});

	it("returns null when email is not found", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		const result = await getArtistByEmail("unknown@example.com");

		expect(result).toBeNull();
	});

	it("returns null and logs error on DB failure", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockMaybeSingle.mockResolvedValueOnce({
			data: null,
			error: { message: "DB error" },
		});

		const result = await getArtistByEmail("f2arc.8@gmail.com");

		expect(result).toBeNull();
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});

// ─── isEmailAuthorized ───────────────────────────────────────────────────────

describe("isEmailAuthorized", () => {
	it("returns true when email is in allowed_users", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { email: "f2arc.8@gmail.com" },
			error: null,
		});

		const result = await isEmailAuthorized("f2arc.8@gmail.com");

		expect(mockFrom).toHaveBeenCalledWith("allowed_users");
		expect(result).toBe(true);
	});

	it("returns false when email is not found", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		const result = await isEmailAuthorized("stranger@example.com");

		expect(result).toBe(false);
	});

	it("normalizes email to lowercase before querying", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { email: "f2arc.8@gmail.com" },
			error: null,
		});

		await isEmailAuthorized("F2ARC.8@GMAIL.COM");

		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
	});

	it("returns false and logs error on DB failure", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockMaybeSingle.mockResolvedValueOnce({
			data: null,
			error: { message: "connection failed" },
		});

		const result = await isEmailAuthorized("f2arc.8@gmail.com");

		expect(result).toBe(false);
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});
