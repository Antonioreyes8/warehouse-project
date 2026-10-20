import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAvailableTicketCount } from "@/lib/tickets/availability";

export type TicketEvent = {
	id: number;
	slug: string;
	title: string;
	description: string;
	image: string;
	eventDate: string;
	eventDateLabel: string;
	price: number;
	availableTickets: number | null;
	maxTicketsPerOrder: number;
};

export async function getTicketEvents(): Promise<TicketEvent[]> {
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase
		.from("projects")
		.select(
			"id, slug, title, description, img, event_date, ticket_price, capacity, max_tickets_per_order",
		)
		.gt("ticket_price", 0)
		.not("event_date", "is", null)
		.gt("event_date", new Date().toISOString())
		.order("event_date", { ascending: true });

	if (error) {
		console.error("Error loading ticket events:", error);
		return [];
	}

	const rows = data ?? [];
	let availableByProjectId: Map<number, number | null>;
	try {
		availableByProjectId = new Map(
			await Promise.all(
				rows.map(async (row) => {
					const id = Number(row.id);
					const capacity = row.capacity === null ? null : Number(row.capacity);
					return [
						id,
						await getAvailableTicketCount(id, capacity),
					] as const;
				}),
			),
		);
	} catch {
		return [];
	}

	return rows.flatMap((row) => {
		const id = Number(row.id);
		const price = Number(row.ticket_price);
		const maxTicketsPerOrder = Number(row.max_tickets_per_order);
		const capacity = row.capacity === null ? null : Number(row.capacity);
		const eventDate = row.event_date;
		if (
			!Number.isSafeInteger(id) ||
			!row.slug ||
			!row.title ||
			!row.img ||
			!eventDate ||
			!Number.isFinite(price) ||
			price <= 0 ||
			(capacity !== null &&
				(!Number.isSafeInteger(capacity) || capacity < 0)) ||
			!Number.isSafeInteger(maxTicketsPerOrder) ||
			maxTicketsPerOrder < 1
		) {
			return [];
		}

		return [
			{
				id,
				slug: row.slug,
				title: row.title,
				description: row.description ?? "",
				image: row.img,
				eventDate,
				eventDateLabel: new Date(eventDate).toLocaleDateString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
					year: "numeric",
				}),
				price,
				availableTickets: availableByProjectId.get(id) ?? null,
				maxTicketsPerOrder,
			},
		];
	});
}
