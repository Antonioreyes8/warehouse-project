import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const COUNTED_TICKET_STATUSES = ["paid", "issued", "checked_in"];

export async function getAvailableTicketCount(
	projectId: number,
	capacity: number | null,
): Promise<number | null> {
	if (capacity === null) return null;
	if (!Number.isSafeInteger(projectId) || projectId < 1) {
		throw new Error("Invalid project ID for ticket availability");
	}
	if (!Number.isSafeInteger(capacity) || capacity < 0) {
		throw new Error("Invalid event capacity");
	}

	const { count, error } = await getSupabaseAdmin()
		.from("tickets")
		.select("id", { count: "exact", head: true })
		.eq("project_id", projectId)
		.in("status", COUNTED_TICKET_STATUSES);

	if (error) {
		console.error("Error counting event tickets:", error);
		throw error;
	}

	return Math.max(0, capacity - (count ?? 0));
}
