import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
	const guard = await requireSuperAdmin();
	if (!guard.authorized) return guard.response;

	const supabase = getSupabaseAdmin();
	const { data: orders, error: ordersError } = await supabase
		.from("ticket_orders")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(100);

	if (ordersError) {
		console.error("Error listing ticket orders:", ordersError);
		return NextResponse.json(
			{ error: "Could not load ticket orders" },
			{ status: 500 },
		);
	}

	const orderIds = (orders ?? []).map((order) => order.id);
	if (orderIds.length === 0) return NextResponse.json({ orders: [] });

	const { data: tickets, error: ticketsError } = await supabase
		.from("tickets")
		.select(
			"id, order_id, project_id, ticket_code, status, user_email, issued_at",
		)
		.in("order_id", orderIds);

	if (ticketsError) {
		console.error("Error listing issued tickets:", ticketsError);
		return NextResponse.json(
			{ error: "Could not load issued tickets" },
			{ status: 500 },
		);
	}

	const ticketsByOrder = new Map<string, typeof tickets>();
	for (const ticket of tickets ?? []) {
		const grouped = ticketsByOrder.get(ticket.order_id) ?? [];
		grouped.push(ticket);
		ticketsByOrder.set(ticket.order_id, grouped);
	}

	return NextResponse.json({
		orders: (orders ?? []).map((order) => ({
			...order,
			tickets: ticketsByOrder.get(order.id) ?? [],
		})),
	});
}
