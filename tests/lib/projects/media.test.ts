import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockList, mockFromStorage } = vi.hoisted(() => {
	const mockList = vi.fn();
	const mockFromStorage = vi.fn(() => ({ list: mockList }));
	return { mockList, mockFromStorage };
});

vi.mock("@/lib/supabase/client", () => ({
	supabase: {
		storage: {
			from: mockFromStorage,
		},
	},
}));

import { getProjectMedia } from "@/lib/projects/media";

beforeEach(() => {
	vi.clearAllMocks();
	process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
});

describe("getProjectMedia", () => {
	it("returns [] when Supabase list returns an error", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockList.mockResolvedValueOnce({
			data: null,
			error: { message: "bucket unavailable" },
		});

		const result = await getProjectMedia("project-slug");

		expect(result).toEqual([]);
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("maps files into image/video media records with public URLs", async () => {
		mockList.mockResolvedValueOnce({
			data: [{ name: "recap-1.jpg" }, { name: "recap-2.MP4" }],
			error: null,
		});

		const result = await getProjectMedia("launch-night");

		expect(mockFromStorage).toHaveBeenCalledWith("projects");
		expect(mockList).toHaveBeenCalledWith("launch-night", {
			limit: 100,
			sortBy: { column: "name", order: "asc" },
		});
		expect(result).toEqual([
			{
				type: "image",
				src: "https://example.supabase.co/storage/v1/object/public/projects/launch-night/recap-1.jpg",
			},
			{
				type: "video",
				src: "https://example.supabase.co/storage/v1/object/public/projects/launch-night/recap-2.MP4",
			},
		]);
	});

	it("returns [] when storage returns an empty array", async () => {
		mockList.mockResolvedValueOnce({ data: [], error: null });

		const result = await getProjectMedia("empty-project");

		expect(result).toEqual([]);
	});
});
