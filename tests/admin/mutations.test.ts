/**
 * File: tests/admin/mutations.test.ts
 * Purpose: Unit tests for privileged admin write operations in lib/admin/mutations.ts.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

// "server-only" throws when imported outside a React Server Component bundler
// context (its default export is a throwing stub); stub it out for tests.
vi.mock("server-only", () => ({}));

const {
	mockInsert,
	mockUpdate,
	mockDelete,
	mockSelect,
	mockEq,
	mockIlike,
	mockFrom,
} = vi.hoisted(() => ({
	mockInsert: vi.fn(),
	mockUpdate: vi.fn(),
	mockDelete: vi.fn(),
	mockSelect: vi.fn(),
	mockEq: vi.fn(),
	mockIlike: vi.fn(),
	mockFrom: vi.fn(),
}));

function resetAdminMocks() {
	mockInsert.mockReset().mockResolvedValue({ error: null });
	mockUpdate.mockReset().mockReturnValue({ ilike: mockIlike });
	mockDelete.mockReset().mockReturnValue({ ilike: mockIlike });
	mockSelect.mockReset().mockReturnValue({ eq: mockEq });
	mockEq.mockReset().mockResolvedValue({ data: [], error: null });
	mockIlike.mockReset().mockResolvedValue({ error: null });
	mockFrom.mockReset().mockReturnValue({
		insert: mockInsert,
		update: mockUpdate,
		delete: mockDelete,
		select: mockSelect,
	});
}

vi.mock("@/lib/supabase/admin", () => ({
	supabaseAdmin: { from: mockFrom },
}));

import {
	inviteCollaborator,
	setAccountStatus,
	changeRole,
	revokeAccess,
} from "@/lib/admin/mutations";

beforeEach(() => {
	resetAdminMocks();
});

describe("inviteCollaborator", () => {
	it("inserts a new allowed_users row and logs the action", async () => {
		const result = await inviteCollaborator("admin@example.com", {
			email: "Collab@Example.com ",
			role: "artist",
		});

		expect(result.success).toBe(true);
		expect(mockFrom).toHaveBeenCalledWith("allowed_users");
		expect(mockInsert).toHaveBeenCalledWith(
			expect.objectContaining({ email: "collab@example.com", role: "artist" }),
		);
		expect(mockFrom).toHaveBeenCalledWith("admin_audit_log");
	});

	it("rejects an empty email", async () => {
		const result = await inviteCollaborator("admin@example.com", {
			email: "  ",
		});
		expect(result.success).toBe(false);
	});
});

describe("setAccountStatus", () => {
	it("updates account_status and logs the action", async () => {
		const result = await setAccountStatus(
			"admin@example.com",
			"artist@example.com",
			"suspended",
		);

		expect(result.success).toBe(true);
		expect(mockUpdate).toHaveBeenCalledWith({ account_status: "suspended" });
		expect(mockIlike).toHaveBeenCalledWith("email", "artist@example.com");
	});
});

describe("changeRole", () => {
	it("blocks demoting the last remaining admin", async () => {
		mockEq.mockResolvedValueOnce({
			data: [{ email: "admin@example.com" }],
			error: null,
		});

		const result = await changeRole(
			"admin@example.com",
			"admin@example.com",
			"artist",
		);

		expect(result.success).toBe(false);
		expect(mockUpdate).not.toHaveBeenCalled();
	});

	it("allows demoting when another admin remains", async () => {
		mockEq.mockResolvedValueOnce({
			data: [
				{ email: "admin@example.com" },
				{ email: "other-admin@example.com" },
			],
			error: null,
		});

		const result = await changeRole(
			"admin@example.com",
			"admin@example.com",
			"artist",
		);

		expect(result.success).toBe(true);
		expect(mockUpdate).toHaveBeenCalledWith({ role: "artist" });
	});
});

describe("revokeAccess", () => {
	it("deletes the allowed_users row and logs the action", async () => {
		const result = await revokeAccess(
			"admin@example.com",
			"artist@example.com",
		);

		expect(result.success).toBe(true);
		expect(mockDelete).toHaveBeenCalled();
		expect(mockIlike).toHaveBeenCalledWith("email", "artist@example.com");
	});
});
