/**
 * File: tests/lib/auth/authorization.test.ts
 * Tests for: lib/auth/authorization.ts
 *
 * Covers:
 *   - isArtistAuthorized → authorized / not authorized / no email / DB error
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockFrom,
	mockIlike,
	mockMaybeSingle,
	resetSupabaseMocks,
} from "../../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import { isArtistAuthorized } from "@/lib/auth/authorization";

/** Minimal User stub — only fields the function uses */
function makeUser(email: string | null): User {
	return { id: "uuid-123", email: email ?? undefined } as User;
}

beforeEach(() => {
	resetSupabaseMocks();
});

describe("isArtistAuthorized", () => {
	it("returns true when user email is in the allowlist", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { email: "f2arc.8@gmail.com" },
			error: null,
		});

		const result = await isArtistAuthorized(makeUser("f2arc.8@gmail.com"));

		expect(result).toBe(true);
	});

	it("returns false when user email is not in the allowlist", async () => {
		mockMaybeSingle.mockResolvedValue({ data: null, error: null });

		const result = await isArtistAuthorized(makeUser("random@example.com"));

		expect(result).toBe(false);
	});

	it("returns false immediately when user has no email", async () => {
		const result = await isArtistAuthorized(makeUser(null));

		expect(result).toBe(false);
		expect(mockFrom).not.toHaveBeenCalled();
	});

	it("normalizes email to lowercase before querying", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { email: "f2arc.8@gmail.com" },
			error: null,
		});

		await isArtistAuthorized(makeUser("F2ARC.8@GMAIL.COM"));

		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
	});

	it("continues to next table on DB error and returns false if all fail", async () => {
		// All table queries return an error
		mockMaybeSingle.mockResolvedValue({
			data: null,
			error: { message: "table not found" },
		});

		const result = await isArtistAuthorized(makeUser("f2arc.8@gmail.com"));

		expect(result).toBe(false);
	});
});
