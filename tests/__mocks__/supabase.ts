/**
 * File: tests/__mocks__/supabase.ts
 * Purpose: Shared Vitest mock for the Supabase client.
 *
 * Usage:
 *   vi.mock("@/lib/supabase/client", () => ({ supabase: mockSupabase }));
 *
 * Each test can override the chain return values using:
 *   mockFrom.mockReturnValueOnce(...)  — for one-off overrides
 *   or reassign mockMaybeSingle / mockUpdate / mockDelete directly.
 */

import { vi } from "vitest";

// Individual operation stubs — reassign these per-test as needed
export const mockMaybeSingle = vi.fn();
export const mockUpdate = vi.fn();
export const mockDelete = vi.fn();
export const mockSelect = vi.fn();
export const mockEq = vi.fn();
export const mockIlike = vi.fn();
export const mockFrom = vi.fn();

// Wire up the chainable query builder
mockIlike.mockReturnValue({ maybeSingle: mockMaybeSingle, select: mockSelect });
mockEq.mockReturnValue({
	maybeSingle: mockMaybeSingle,
	ilike: mockIlike,
	select: mockSelect,
});
mockSelect.mockReturnValue({ eq: mockEq, ilike: mockIlike });
mockUpdate.mockReturnValue({ ilike: mockIlike, eq: mockEq });
mockDelete.mockReturnValue({ eq: mockEq, ilike: mockIlike });
mockFrom.mockReturnValue({
	select: mockSelect,
	update: mockUpdate,
	delete: mockDelete,
});

export const mockSupabase = {
	from: mockFrom,
};

/** Call this in beforeEach to reset all mocks between tests. */
export function resetSupabaseMocks() {
	vi.clearAllMocks();

	mockIlike.mockReturnValue({
		maybeSingle: mockMaybeSingle,
		select: mockSelect,
	});
	mockEq.mockReturnValue({
		maybeSingle: mockMaybeSingle,
		ilike: mockIlike,
		select: mockSelect,
	});
	mockSelect.mockReturnValue({ eq: mockEq, ilike: mockIlike });
	mockUpdate.mockReturnValue({ ilike: mockIlike, eq: mockEq });
	mockDelete.mockReturnValue({ eq: mockEq, ilike: mockIlike });
	mockFrom.mockReturnValue({
		select: mockSelect,
		update: mockUpdate,
		delete: mockDelete,
	});
}
