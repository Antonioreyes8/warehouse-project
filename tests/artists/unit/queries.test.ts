/**
 * File: tests/artists/unit/queries.test.ts
 * Purpose: White-box unit tests for artist query helpers.
 * Responsibilities:
 *   - Validate internal query logic and database parameter construction
 *   - Catch regressions in artist retrieval functions
 * Key Concepts:
 *   - Mocked Supabase query builder chain
 *   - Verification of correct table and filter usage
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockFrom,
	mockSelect,
	mockEq,
	mockIlike,
	mockUpdate,
	mockDelete,
	mockMaybeSingle,
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
import {
	getUserRole,
	isArtistAuthorized,
	isSuperAdmin,
} from "@/lib/auth/authorization";

beforeEach(() => {
	resetSupabaseMocks();
});

// This file contains white-box unit tests for API functions.
// White-box testing: Tests the internal implementation details, method calls, and code paths.
// These are unit tests (isolated function testing with mocked dependencies), verifying the correct database queries and logic flow.

describe("API White-Box: queries.ts behavior", () => {
	// White-box unit test: Verifies the exact database query structure for username lookup.
	it("targets profiles.username when fetching by username", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await getArtistByUsername("antonioreyes");

		expect(mockFrom).toHaveBeenCalledWith("profiles");
		expect(mockSelect).toHaveBeenCalledWith("*");
		expect(mockEq).toHaveBeenCalledWith("username", "antonioreyes");
	});

	it("targets profiles.id when fetching by user id", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await getArtistByUserId("42");
		expect(mockEq).toHaveBeenCalledWith("id", "42");
	});

	it("normalizes email before ilike in getArtistByEmail", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await getArtistByEmail("  F2ARC.8@GMAIL.COM  ");
		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
	});

	it("checks allowed_users table in isEmailAuthorized", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await isEmailAuthorized("f2arc.8@gmail.com");
		expect(mockFrom).toHaveBeenCalledWith("allowed_users");
	});

	it("returns null when profile lookups fail", async () => {
		mockMaybeSingle
			.mockResolvedValueOnce({ data: null, error: { message: "query failed" } })
			.mockResolvedValueOnce({ data: null, error: { message: "query failed" } })
			.mockResolvedValueOnce({
				data: null,
				error: { message: "query failed" },
			});

		await expect(getArtistByUsername("artist")).resolves.toBeNull();
		await expect(getArtistByUserId("uid-1")).resolves.toBeNull();
		await expect(getArtistByEmail("artist@example.com")).resolves.toBeNull();
	});

	it("rejects email authorization when the database errors or account is suspended", async () => {
		mockMaybeSingle
			.mockResolvedValueOnce({ data: null, error: { message: "query failed" } })
			.mockResolvedValueOnce({
				data: { email: "artist@example.com", account_status: "suspended" },
				error: null,
			});

		await expect(isEmailAuthorized("artist@example.com")).resolves.toBe(false);
		await expect(isEmailAuthorized("artist@example.com")).resolves.toBe(false);
	});
});

describe("API White-Box: mutations.ts fallback logic", () => {
	// White-box unit test: Verifies the fallback mechanism from ID to email update.
	it("tries id update first, then email fallback if id returns no rows", async () => {
		mockSelect
			.mockResolvedValueOnce({ data: [], error: null })
			.mockResolvedValueOnce({ data: [{ id: 1 }], error: null });

		await updateArtistProfile("not-a-number", "f2arc.8@gmail.com", {
			name: "A",
		});

		expect(mockUpdate).toHaveBeenCalled();
		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
	});

	it("uses numeric id in eq when id can be parsed", async () => {
		mockSelect.mockResolvedValueOnce({ data: [{ id: 42 }], error: null });
		await updateArtistProfile("42", "f2arc.8@gmail.com", { name: "A" });
		expect(mockEq).toHaveBeenCalledWith("id", 42);
	});

	it("targets profiles.id for deletion", async () => {
		mockEq.mockResolvedValueOnce({ error: null });
		await deleteArtistProfile("42");
		expect(mockDelete).toHaveBeenCalled();
		expect(mockEq).toHaveBeenCalledWith("id", "42");
	});
});

describe("API White-Box: authorization.ts table order", () => {
	// White-box unit test: Verifies allowed_users is the single source of authorization truth.
	it("checks allowed_users and rejects suspended accounts", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: "artist", account_status: "suspended" },
			error: null,
		});

		const result = await isArtistAuthorized({
			id: "uid-1",
			email: "f2arc.8@gmail.com",
		} as unknown as User);

		expect(mockFrom).toHaveBeenNthCalledWith(1, "allowed_users");
		expect(result).toBe(false);
	});

	it("defaults an active allowlisted user with no role to artist", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: null, account_status: "active" },
			error: null,
		});

		await expect(
			getUserRole({
				id: "uid-1",
				email: " Artist@Example.com ",
			} as unknown as User),
		).resolves.toBe("artist");
		expect(mockIlike).toHaveBeenCalledWith("email", "artist@example.com");
	});

	it("recognizes admins and rejects artists as superadmins", async () => {
		mockMaybeSingle
			.mockResolvedValueOnce({
				data: { role: "admin", account_status: "active" },
				error: null,
			})
			.mockResolvedValueOnce({
				data: { role: "artist", account_status: "active" },
				error: null,
			});

		const admin = { id: "admin-1", email: "admin@example.com" } as User;
		const artist = { id: "artist-1", email: "artist@example.com" } as User;

		await expect(isSuperAdmin(admin)).resolves.toBe(true);
		await expect(isSuperAdmin(artist)).resolves.toBe(false);
	});
});
