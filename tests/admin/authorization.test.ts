/**
 * File: tests/admin/authorization.test.ts
 * Purpose: Unit tests for role/superadmin helpers in lib/auth/authorization.ts.
 */
import { beforeEach, describe, expect, it } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
	mockSupabase,
	mockMaybeSingle,
	resetSupabaseMocks,
} from "../__mocks__/supabase";

import { vi } from "vitest";
vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));

import { getUserRole, isSuperAdmin } from "@/lib/auth/authorization";

beforeEach(() => {
	resetSupabaseMocks();
});

describe("getUserRole", () => {
	it("returns null for a user with no email", async () => {
		const user = { id: "1" } as User;
		expect(await getUserRole(user)).toBeNull();
	});

	it("returns null when the account is not allowlisted", async () => {
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
		const user = { id: "1", email: "nobody@example.com" } as User;
		expect(await getUserRole(user)).toBeNull();
	});

	it("returns null when the account is suspended", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: "admin", account_status: "suspended" },
			error: null,
		});
		const user = { id: "1", email: "admin@example.com" } as User;
		expect(await getUserRole(user)).toBeNull();
	});

	it("defaults to artist role when role column is null", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: null, account_status: "active" },
			error: null,
		});
		const user = { id: "1", email: "artist@example.com" } as User;
		expect(await getUserRole(user)).toBe("artist");
	});

	it("returns admin for an active admin account", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: "admin", account_status: "active" },
			error: null,
		});
		const user = { id: "1", email: "admin@example.com" } as User;
		expect(await getUserRole(user)).toBe("admin");
	});
});

describe("isSuperAdmin", () => {
	it("returns true only for active admin accounts", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: "admin", account_status: "active" },
			error: null,
		});
		const user = { id: "1", email: "admin@example.com" } as User;
		expect(await isSuperAdmin(user)).toBe(true);
	});

	it("returns false for artist accounts", async () => {
		mockMaybeSingle.mockResolvedValueOnce({
			data: { role: "artist", account_status: "active" },
			error: null,
		});
		const user = { id: "1", email: "artist@example.com" } as User;
		expect(await isSuperAdmin(user)).toBe(false);
	});

	it("returns false when the lookup throws", async () => {
		mockMaybeSingle.mockRejectedValueOnce(new Error("connection failed"));
		const user = { id: "1", email: "admin@example.com" } as User;
		expect(await isSuperAdmin(user)).toBe(false);
	});
});
