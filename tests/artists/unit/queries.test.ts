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
import { isArtistAuthorized } from "@/lib/auth/authorization";

beforeEach(() => {
	resetSupabaseMocks();
});

describe("API White-Box: queries.ts behavior", () => {
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
});

describe("API White-Box: mutations.ts fallback logic", () => {
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
	it("tries authorized_artists, then authorized, then allowed_users", async () => {
		mockMaybeSingle
			.mockResolvedValueOnce({ data: null, error: { message: "missing" } })
			.mockResolvedValueOnce({ data: null, error: { message: "missing" } })
			.mockResolvedValueOnce({
				data: { email: "f2arc.8@gmail.com" },
				error: null,
			});

		await isArtistAuthorized({
			id: "uid-1",
			email: "f2arc.8@gmail.com",
		} as unknown as User);

		expect(mockFrom).toHaveBeenNthCalledWith(1, "authorized_artists");
		expect(mockFrom).toHaveBeenNthCalledWith(2, "authorized");
		expect(mockFrom).toHaveBeenNthCalledWith(3, "allowed_users");
	});
});
