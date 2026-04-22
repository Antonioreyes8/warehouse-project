/**
 * File: tests/lib/artists/works-queries.test.ts
 * Tests for: lib/artists/queries.ts — getArtistWorksByProfileId
 *
 * Covers:
 *   - Returns ordered works array when found
 *   - Returns empty array when no works exist
 *   - Returns empty array and logs error on DB failure
 *   - Queries artist_works table with correct profile_id filter
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	mockSupabase,
	mockFrom,
	mockSelect,
	mockEq,
	resetSupabaseMocks,
} from "../../__mocks__/supabase";

vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import { getArtistWorksByProfileId } from "@/lib/artists/queries";

const fakeWorks = [
	{
		id: 1,
		profile_id: "profile-1",
		title: "Untitled No. 1",
		description: "A painting",
		medium: "Oil on canvas",
		image_url: "https://example.com/img1.jpg",
		link_url: null,
		sort_order: 0,
		created_at: "2025-01-01T00:00:00Z",
		updated_at: "2025-01-01T00:00:00Z",
	},
	{
		id: 2,
		profile_id: "profile-1",
		title: "Untitled No. 2",
		description: "A sculpture",
		medium: "Bronze",
		image_url: null,
		link_url: "https://example.com/work2",
		sort_order: 1,
		created_at: "2025-02-01T00:00:00Z",
		updated_at: "2025-02-01T00:00:00Z",
	},
];

// getArtistWorksByProfileId uses: select("*").eq(...).order(...).order(...)
// The shared mock doesn't wire `.order()`, so we override mockEq to return
// a chain that supports order calls resolving to the final promise.
function wireOrderChain(resolveValue: { data: unknown; error: unknown }) {
	const orderFn = vi.fn();
	// second .order() returns the final promise
	orderFn.mockReturnValueOnce({
		order: vi.fn().mockResolvedValueOnce(resolveValue),
	});
	return orderFn;
}

beforeEach(() => {
	resetSupabaseMocks();
});

describe("getArtistWorksByProfileId", () => {
	it("returns the artist works when found", async () => {
		const orderInner = vi.fn().mockResolvedValueOnce({
			data: fakeWorks,
			error: null,
		});
		const orderOuter = vi.fn().mockReturnValueOnce({ order: orderInner });
		mockEq.mockReturnValueOnce({ order: orderOuter });

		const result = await getArtistWorksByProfileId("profile-1");

		expect(mockFrom).toHaveBeenCalledWith("artist_works");
		expect(mockSelect).toHaveBeenCalledWith("*");
		expect(mockEq).toHaveBeenCalledWith("profile_id", "profile-1");
		expect(result).toEqual(fakeWorks);
	});

	it("returns empty array when no works exist", async () => {
		const orderInner = vi.fn().mockResolvedValueOnce({ data: [], error: null });
		const orderOuter = vi.fn().mockReturnValueOnce({ order: orderInner });
		mockEq.mockReturnValueOnce({ order: orderOuter });

		const result = await getArtistWorksByProfileId("profile-1");

		expect(result).toEqual([]);
	});

	it("returns empty array when data is null", async () => {
		const orderInner = vi
			.fn()
			.mockResolvedValueOnce({ data: null, error: null });
		const orderOuter = vi.fn().mockReturnValueOnce({ order: orderInner });
		mockEq.mockReturnValueOnce({ order: orderOuter });

		const result = await getArtistWorksByProfileId("profile-1");

		expect(result).toEqual([]);
	});

	it("returns empty array and logs error on DB failure", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const orderInner = vi
			.fn()
			.mockResolvedValueOnce({ data: null, error: { message: "DB error" } });
		const orderOuter = vi.fn().mockReturnValueOnce({ order: orderInner });
		mockEq.mockReturnValueOnce({ order: orderOuter });

		const result = await getArtistWorksByProfileId("profile-1");

		expect(result).toEqual([]);
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("passes numeric profile id correctly", async () => {
		const orderInner = vi.fn().mockResolvedValueOnce({ data: [], error: null });
		const orderOuter = vi.fn().mockReturnValueOnce({ order: orderInner });
		mockEq.mockReturnValueOnce({ order: orderOuter });

		await getArtistWorksByProfileId(42);

		expect(mockEq).toHaveBeenCalledWith("profile_id", 42);
	});

	it("orders by sort_order ascending then created_at ascending", async () => {
		const orderInner = vi.fn().mockResolvedValueOnce({ data: [], error: null });
		const orderOuter = vi.fn().mockReturnValueOnce({ order: orderInner });
		mockEq.mockReturnValueOnce({ order: orderOuter });

		await getArtistWorksByProfileId("profile-1");

		expect(orderOuter).toHaveBeenCalledWith("sort_order", { ascending: true });
		expect(orderInner).toHaveBeenCalledWith("created_at", { ascending: true });
	});
});
