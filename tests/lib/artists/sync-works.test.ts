/**
 * File: tests/lib/artists/sync-works.test.ts
 * Tests for: lib/artists/mutations.ts — syncArtistWorks
 *
 * Covers:
 *   - Insert new works (no existing id)
 *   - Upsert existing works (with id)
 *   - Delete removed works
 *   - medium field included in insert and upsert payloads
 *   - Blank/empty works filtered out before sync
 *   - Error cases: existing rows fetch fails, upsert fails, insert fails, delete fails
 *   - Unexpected throw returns generic error
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncArtistWorks } from "@/lib/artists/mutations";

// ─── Mock factory helpers ─────────────────────────────────────────────────────
// Each test builds a tailored mock chain for supabase since syncArtistWorks
// uses upsert, insert, and delete().in() which the shared mock does not cover.

// mockFrom must be hoisted so it's available inside the vi.mock factory.
const { mockFrom, mockUpsert, mockInsert } = vi.hoisted(() => ({
	mockFrom: vi.fn(),
	mockUpsert: vi.fn(),
	mockInsert: vi.fn(),
}));

const mockIn = vi.fn();

function makeSelectChain(resolveValue: { data: unknown; error: unknown }) {
	const eqFn = vi.fn().mockResolvedValue(resolveValue);
	const selectFn = vi.fn().mockReturnValue({ eq: eqFn });
	return { select: selectFn, _eq: eqFn };
}

function makeDeleteChain(resolveValue: { error: unknown }) {
	const inFn = vi.fn().mockResolvedValue(resolveValue);
	const eqFn = vi.fn().mockReturnValue({ in: inFn });
	const deleteFn = vi.fn().mockReturnValue({ eq: eqFn });
	return { delete: deleteFn, _eq: eqFn, _in: inFn };
}

vi.mock("@/lib/supabase/client", () => ({
	supabase: { from: mockFrom },
}));

beforeEach(() => {
	vi.clearAllMocks();
	mockUpsert.mockReset();
	mockInsert.mockReset();
	mockIn.mockReset();
// mockFrom must be hoisted so it's available inside the vi.mock factory.
const { mockFrom, mockUpsert, mockInsert } = vi.hoisted(() => ({
	mockFrom: vi.fn(),
	mockUpsert: vi.fn(),
	mockInsert: vi.fn(),
}));

describe("syncArtistWorks — insert new works", () => {
	it("inserts works that have no id", async () => {
		// Call 1: select existing IDs → empty
		const selectChain = makeSelectChain({ data: [], error: null });
		// Call 2: insert new works
		mockInsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ insert: mockInsert });

		const result = await syncArtistWorks("profile-1", [
			{
				title: "Work A",
				sort_order: 0,
			},
		]);

		expect(result).toEqual({ success: true });
		expect(mockInsert).toHaveBeenCalledWith([
			expect.objectContaining({
				profile_id: "profile-1",
				title: "Work A",
				description: "Desc A",
				medium: "Oil on canvas",
			}),
		]);
	});

	it("includes medium in the insert payload", async () => {
		const selectChain = makeSelectChain({ data: [], error: null });
		mockInsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ insert: mockInsert });

		await syncArtistWorks("profile-1", [
			{ title: "Sculpture", medium: "Bronze", sort_order: 0 },
		]);

		const insertedPayload = mockInsert.mock.calls[0][0];
		expect(insertedPayload[0]).toMatchObject({ medium: "Bronze" });
	});

	it("trims whitespace from medium before inserting", async () => {
		const selectChain = makeSelectChain({ data: [], error: null });
		mockInsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ insert: mockInsert });

		await syncArtistWorks("profile-1", [
			{ title: "Print", medium: "  Screen print  ", sort_order: 0 },
		]);

		const insertedPayload = mockInsert.mock.calls[0][0];
		expect(insertedPayload[0].medium).toBe("Screen print");
	});
});

// ─── Upsert (update) path ─────────────────────────────────────────────────────

describe("syncArtistWorks — upsert existing works", () => {
	it("upserts works that have an id", async () => {
		const selectChain = makeSelectChain({ data: [{ id: 10 }], error: null });
		mockUpsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert });

		const result = await syncArtistWorks("profile-1", [
			{ id: 10, title: "Updated Work", medium: "Acrylic", sort_order: 0 },
		]);

		expect(result).toEqual({ success: true });
		expect(mockUpsert).toHaveBeenCalledWith(
			[
				expect.objectContaining({
					id: 10,
					profile_id: "profile-1",
					title: "Updated Work",
					medium: "Acrylic",
				}),
			],
			{ onConflict: "id" },
		);
	});

	it("includes medium in the upsert payload", async () => {
		const selectChain = makeSelectChain({ data: [{ id: 5 }], error: null });
		mockUpsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert });

		await syncArtistWorks("profile-1", [
			{ id: 5, title: "Photo", medium: "Digital photography", sort_order: 0 },
		]);

		const upsertPayload = mockUpsert.mock.calls[0][0];
		expect(upsertPayload[0]).toMatchObject({ medium: "Digital photography" });
	});
});

// ─── Mixed upsert + insert ────────────────────────────────────────────────────

describe("syncArtistWorks — mixed update and insert", () => {
	it("upserts existing works and inserts new works in the same sync", async () => {
		const selectChain = makeSelectChain({ data: [{ id: 1 }], error: null });
		mockUpsert.mockResolvedValueOnce({ error: null });
		mockInsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert })
			.mockReturnValueOnce({ insert: mockInsert });

		const result = await syncArtistWorks("profile-1", [
			{ id: 1, title: "Existing Work", medium: "Pastel", sort_order: 0 },
			{ title: "Brand New Work", medium: "Watercolor", sort_order: 1 },
		]);

		expect(result).toEqual({ success: true });
		expect(mockUpsert).toHaveBeenCalled();
		expect(mockInsert).toHaveBeenCalled();
	});
});

// ─── Delete path ──────────────────────────────────────────────────────────────

describe("syncArtistWorks — delete removed works", () => {
	it("deletes works that were in DB but not in the new list", async () => {
		// Two existing works in DB: ids 1 and 2. New list only keeps id 1.
		const selectChain = makeSelectChain({
			data: [{ id: 1 }, { id: 2 }],
			error: null,
		});
		mockUpsert.mockResolvedValueOnce({ error: null });
		const deleteChain = makeDeleteChain({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert })
			.mockReturnValueOnce(deleteChain);

		const result = await syncArtistWorks("profile-1", [
			{ id: 1, title: "Kept Work", sort_order: 0 },
		]);

		expect(result).toEqual({ success: true });
		expect(deleteChain._in).toHaveBeenCalledWith("id", [2]);
	});

	it("skips delete when no works were removed", async () => {
		const selectChain = makeSelectChain({ data: [{ id: 1 }], error: null });
		mockUpsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert });

		// mockFrom is called only twice (select + upsert), never for delete
		const result = await syncArtistWorks("profile-1", [
			{ id: 1, title: "Still Here", sort_order: 0 },
		]);

		expect(result).toEqual({ success: true });
		// delete path was not triggered
		expect(mockFrom).toHaveBeenCalledTimes(2);
	});
});

// ─── Filtering ────────────────────────────────────────────────────────────────

describe("syncArtistWorks — filtering blank works", () => {
	it("skips works that have no meaningful content", async () => {
		const selectChain = makeSelectChain({ data: [], error: null });

		mockFrom.mockReturnValueOnce(selectChain);

		const result = await syncArtistWorks("profile-1", [
			{ title: "", description: "", medium: "", image_url: "", link_url: "" },
		]);

		// No insert/upsert should be triggered for blank work
		expect(result).toEqual({ success: true });
		expect(mockFrom).toHaveBeenCalledTimes(1); // only the select
	});

	it("keeps a work if medium is the only non-blank field", async () => {
		const selectChain = makeSelectChain({ data: [], error: null });
		mockInsert.mockResolvedValueOnce({ error: null });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ insert: mockInsert });

		const result = await syncArtistWorks("profile-1", [
			{ title: "", medium: "Mixed media" },
		]);

		expect(result).toEqual({ success: true });
		expect(mockInsert).toHaveBeenCalled();
	});
});

// ─── Error cases ──────────────────────────────────────────────────────────────

describe("syncArtistWorks — error handling", () => {
	it("returns error when fetching existing rows fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const selectChain = makeSelectChain({
			data: null,
			error: { message: "connection refused" },
		});

		mockFrom.mockReturnValueOnce(selectChain);

		const result = await syncArtistWorks("profile-1", [
			{ title: "Some Work", sort_order: 0 },
		]);

		expect(result).toEqual({ success: false, error: "connection refused" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("returns error when upsert fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const selectChain = makeSelectChain({ data: [{ id: 7 }], error: null });
		mockUpsert.mockResolvedValueOnce({ error: { message: "upsert blocked" } });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert });

		const result = await syncArtistWorks("profile-1", [
			{ id: 7, title: "Work", sort_order: 0 },
		]);

		expect(result).toEqual({ success: false, error: "upsert blocked" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("returns error when insert fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const selectChain = makeSelectChain({ data: [], error: null });
		mockInsert.mockResolvedValueOnce({ error: { message: "insert blocked" } });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ insert: mockInsert });

		const result = await syncArtistWorks("profile-1", [
			{ title: "New Work", sort_order: 0 },
		]);

		expect(result).toEqual({ success: false, error: "insert blocked" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("returns error when delete fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const selectChain = makeSelectChain({
			data: [{ id: 3 }, { id: 4 }],
			error: null,
		});
		mockUpsert.mockResolvedValueOnce({ error: null });
		const deleteChain = makeDeleteChain({ error: { message: "delete failed" } });

		mockFrom
			.mockReturnValueOnce(selectChain)
			.mockReturnValueOnce({ upsert: mockUpsert })
			.mockReturnValueOnce(deleteChain);

		const result = await syncArtistWorks("profile-1", [
			{ id: 3, title: "Kept", sort_order: 0 },
		]);

		expect(result).toEqual({ success: false, error: "delete failed" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("returns generic error on unexpected throw", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockFrom.mockImplementationOnce(() => {
			throw new Error("crash");
		});

		const result = await syncArtistWorks("profile-1", [
			{ title: "Work", sort_order: 0 },
		]);

		expect(result).toEqual({ success: false, error: "Unexpected error occurred" });
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});
