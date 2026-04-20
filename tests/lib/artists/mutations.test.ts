/**
 * File: tests/lib/artists/mutations.test.ts
 * Tests for: lib/artists/mutations.ts
 *
 * Covers:
 *   - updateArtistProfile → success / DB error / unexpected throw
 *   - deleteArtistProfile → success / DB error / unexpected throw
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	mockSupabase,
	mockFrom,
	mockUpdate,
	mockDelete,
	mockIlike,
	mockEq,
	mockSelect,
	resetSupabaseMocks,
} from "../../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import {
	updateArtistProfile,
	deleteArtistProfile,
} from "@/lib/artists/mutations";

beforeEach(() => {
	resetSupabaseMocks();
});

// ─── updateArtistProfile ─────────────────────────────────────────────────────

describe("updateArtistProfile", () => {
	it("returns success when update-by-id succeeds", async () => {
		mockSelect.mockResolvedValueOnce({ data: [{ id: 42 }], error: null });

		const result = await updateArtistProfile(42, "f2arc.8@gmail.com", {
			name: "New Name",
			bio: "Updated bio",
		});

		expect(mockFrom).toHaveBeenCalledWith("profiles");
		expect(mockUpdate).toHaveBeenCalledWith({
			name: "New Name",
			bio: "Updated bio",
		});
		expect(mockEq).toHaveBeenCalledWith("id", 42);
		expect(result).toEqual({ success: true });
	});

	it("falls back to email when id update affects zero rows", async () => {
		mockSelect
			.mockResolvedValueOnce({ data: [], error: null })
			.mockResolvedValueOnce({ data: [{ id: 1 }], error: null });

		const result = await updateArtistProfile("999", "F2ARC.8@GMAIL.COM", {
			name: "Test",
		});

		expect(mockIlike).toHaveBeenCalledWith("email", "f2arc.8@gmail.com");
		expect(result).toEqual({ success: true });
	});

	it("returns not-found error when both id and email affect zero rows", async () => {
		mockSelect
			.mockResolvedValueOnce({ data: [], error: null })
			.mockResolvedValueOnce({ data: [], error: null });

		const result = await updateArtistProfile("999", "none@example.com", {
			name: "Test",
		});

		expect(result).toEqual({
			success: false,
			error: "No matching profile row found to update",
		});
	});

	it("returns error message when DB id update fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockSelect.mockResolvedValueOnce({
			data: null,
			error: { message: "update failed" },
		});

		const result = await updateArtistProfile(42, "f2arc.8@gmail.com", {
			name: "Test",
		});

		expect(result).toEqual({ success: false, error: "update failed" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("returns generic error on unexpected throw", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockSelect.mockRejectedValueOnce(new Error("network down"));

		const result = await updateArtistProfile(42, "f2arc.8@gmail.com", {
			name: "Test",
		});

		expect(result).toEqual({
			success: false,
			error: "Unexpected error occurred",
		});
		consoleSpy.mockRestore();
	});
});

// ─── deleteArtistProfile ─────────────────────────────────────────────────────

describe("deleteArtistProfile", () => {
	it("returns success when delete succeeds", async () => {
		mockEq.mockResolvedValueOnce({ error: null });

		const result = await deleteArtistProfile("42");

		expect(mockFrom).toHaveBeenCalledWith("profiles");
		expect(mockDelete).toHaveBeenCalled();
		expect(mockEq).toHaveBeenCalledWith("id", "42");
		expect(result).toEqual({ success: true });
	});

	it("returns error message when DB delete fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockEq.mockResolvedValueOnce({ error: { message: "delete failed" } });

		const result = await deleteArtistProfile("42");

		expect(result).toEqual({ success: false, error: "delete failed" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("returns generic error on unexpected throw", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockEq.mockRejectedValueOnce(new Error("crash"));

		const result = await deleteArtistProfile("42");

		expect(result).toEqual({
			success: false,
			error: "Unexpected error occurred",
		});
		consoleSpy.mockRestore();
	});
});
