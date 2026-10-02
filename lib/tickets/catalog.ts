import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type TicketEvent = {
	id: number;
	slug: string;
	title: string;
	description: string;
	image: string;
	eventDate: string;
	eventDateLabel: string;
	price: number;
	maxTicketsPerOrder: number;
};

export async function getTicketEvents(): Promise<TicketEvent[]> {
	const { data, error } = await getSupabaseAdmin()
		.from("projects")
		.select(
			"id, slug, title, description, img, event_date, ticket_price, max_tickets_per_order",
		)
		.gt("ticket_price", 0)
		.not("event_date", "is", null)
		.gt("event_date", new Date().toISOString())
		.order("event_date", { ascending: true });

	if (error) {
		console.error("Error loading ticket events:", error);
		return [];
	}

	return (data ?? []).flatMap((row) => {
		const id = Number(row.id);
		const price = Number(row.ticket_price);
		const maxTicketsPerOrder = Number(row.max_tickets_per_order);
		const eventDate = row.event_date;
		if (
			!Number.isSafeInteger(id) ||
			!row.slug ||
			!row.title ||
			!row.img ||
			!eventDate ||
			!Number.isFinite(price) ||
			price <= 0 ||
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
				maxTicketsPerOrder,
			},
		];
	});
}
