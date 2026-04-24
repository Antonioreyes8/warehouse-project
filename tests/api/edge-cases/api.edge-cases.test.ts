import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockMaybeSingle,
	mockSelect,
	mockEq,
	mockIlike,
	resetSupabaseMocks,
} from "../../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import { getArtistByEmail, isEmailAuthorized } from "@/lib/artists/queries";
import {
	updateArtistProfile,
	deleteArtistProfile,
} from "@/lib/artists/mutations";
import { isArtistAuthorized } from "@/lib/auth/authorization";

beforeEach(() => {
	resetSupabaseMocks();
});

describe("API Edge Cases: email normalization and blanks", () => {
	it("trims whitespace in getArtistByEmail", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await getArtistByEmail("   F2ARC.8@gmail.com   ");
		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
	});

	it("handles empty email authorization check safely", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		await expect(isEmailAuthorized("   ")).resolves.toBe(false);
	});
});

describe("API Edge Cases: mutation fallbacks and failures", () => {
	it("returns DB error when id update fails immediately", async () => {
		mockSelect.mockResolvedValueOnce({
			data: null,
			error: { message: "id update blocked" },
		});

		await expect(
			updateArtistProfile(42, "f2arc.8@gmail.com", { name: "x" }),
		).resolves.toEqual({
			success: false,
			error: "id update blocked",
		});
	});

	it("returns DB error when email fallback update fails", async () => {
		mockSelect.mockResolvedValueOnce({
			data: null,
			error: { message: "email update blocked" },
		});

		await expect(
			updateArtistProfile("not-numeric", "f2arc.8@gmail.com", { name: "x" }),
		).resolves.toEqual({
			success: false,
			error: "email update blocked",
		});
	});

	it("returns generic error on thrown delete failure", async () => {
		mockEq.mockRejectedValueOnce(new Error("network down"));
		await expect(deleteArtistProfile("42")).resolves.toEqual({
			success: false,
			error: "Unexpected error occurred",
		});
	});
});

describe("API Edge Cases: authorization loops", () => {
	it("returns false when all allowlist table checks return errors", async () => {
		mockMaybeSingle.mockResolvedValue({
			data: null,
			error: { message: "table unavailable" },
		});
		await expect(
			isArtistAuthorized({
				id: "uid-1",
				email: "f2arc.8@gmail.com",
			} as unknown as User),
		).resolves.toBe(false);
	});
});
