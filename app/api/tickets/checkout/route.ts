import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/tickets/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
	let body: { projectId?: unknown; quantity?: unknown; items?: unknown };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	const rawItems =
		body.items ??
		(body.projectId !== undefined
			? [{ projectId: body.projectId, quantity: body.quantity ?? 1 }]
			: null);
	if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 5) {
		return NextResponse.json(
			{ error: "Add between 1 and 5 different events to your cart" },
			{ status: 400 },
		);
	}
	const items = rawItems.map((rawItem) => {
		const item = rawItem as { projectId?: unknown; quantity?: unknown };
		return {
			projectId: Number(item?.projectId),
			quantity: Number(item?.quantity),
		};
	});
	const projectIds = items.map((item) => item.projectId);
	if (
		items.some(
			(item) =>
				!Number.isSafeInteger(item.projectId) ||
				item.projectId < 1 ||
				!Number.isSafeInteger(item.quantity) ||
				item.quantity < 1,
		) ||
		new Set(projectIds).size !== projectIds.length
	) {
		return NextResponse.json(
			{ error: "Invalid event or quantity." },
			{ status: 400 },
		);
	}

	const { data: projects, error } = await getSupabaseAdmin()
		.from("projects")
		.select(
			"id, title, slug, img, ticket_price, event_date, capacity, max_tickets_per_order",
		)
		.in("id", projectIds);

	if (error) {
		return NextResponse.json(
			{ error: "Could not load event" },
			{ status: 500 },
		);
	}
	if (!projects || projects.length !== items.length) {
		return NextResponse.json(
			{ error: "One or more events could not be found" },
			{ status: 404 },
		);
	}

	const projectById = new Map(
		projects.map((project) => [Number(project.id), project]),
	);
	const checkoutItems = items.map((item) => {
		const project = projectById.get(item.projectId);
		const unitAmount = Math.round(Number(project?.ticket_price) * 100);
		return { ...item, project, unitAmount };
	});
	if (
		checkoutItems.some(
			(item) =>
				!item.project?.slug ||
				!Number.isSafeInteger(item.unitAmount) ||
				item.unitAmount < 1 ||
				!item.project.event_date ||
				new Date(item.project.event_date).getTime() <= Date.now(),
		)
	) {
		return NextResponse.json(
			{ error: "One or more events are not available for ticket sales" },
			{ status: 400 },
		);
	}
	if (
		checkoutItems.some(
			(item) => item.quantity > Number(item.project?.max_tickets_per_order),
		)
	) {
		return NextResponse.json(
			{ error: "Ticket quantity exceeds the limit for this event" },
			{ status: 400 },
		);
	}

	const { data: soldTickets, error: ticketsError } = await getSupabaseAdmin()
		.from("tickets")
		.select("project_id")
		.in("project_id", projectIds)
		.in("status", ["paid", "issued", "checked_in"]);

	if (ticketsError) {
		console.error("Could not check ticket availability", ticketsError);
		return NextResponse.json(
			{ error: "Could not check ticket availability" },
			{ status: 500 },
		);
	}

	const soldByProjectId = new Map<number, number>();
	for (const ticket of soldTickets ?? []) {
		const projectId = Number(ticket.project_id);
		soldByProjectId.set(projectId, (soldByProjectId.get(projectId) ?? 0) + 1);
	}

	if (
		checkoutItems.some((item) => {
			const capacity = item.project?.capacity;
			if (capacity === null || capacity === undefined) return false;
			const remaining =
				Number(capacity) - (soldByProjectId.get(item.projectId) ?? 0);
			return !Number.isSafeInteger(Number(capacity)) || item.quantity > remaining;
		})
	) {
		return NextResponse.json(
			{
				error:
					"Not enough tickets remain for one or more events. Refresh the page and update your cart.",
			},
			{ status: 409 },
		);
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
	if (!siteUrl) {
		return NextResponse.json(
			{ error: "Ticket checkout is not configured" },
			{ status: 503 },
		);
	}

	try {
		const firstProject = checkoutItems[0].project;
		const session = await getStripe().checkout.sessions.create({
			mode: "payment",
			allow_promotion_codes: true,
			managed_payments: { enabled: false },
			customer_creation: "always",
			custom_fields: [
				{
					key: "first_name",
					label: { type: "custom", custom: "First name" },
					type: "text",
					optional: false,
				},
				{
					key: "last_name",
					label: { type: "custom", custom: "Last name" },
					type: "text",
					optional: false,
				},
			],
			line_items: checkoutItems.map((item) => ({
				price_data: {
					currency: "usd",
					product_data: {
						name: `${item.project!.title} ticket`,
						...(item.project!.img?.startsWith("https://")
							? { images: [item.project!.img] }
							: {}),
					},
					unit_amount: item.unitAmount,
				},
				quantity: item.quantity,
			})),
			metadata: {
				cart_items: JSON.stringify(
					checkoutItems.map((item) => ({
						p: item.projectId,
						q: item.quantity,
						c: item.unitAmount,
					})),
				),
			},
			success_url: `${siteUrl}/tickets/${firstProject!.slug}?ticket=success&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${siteUrl}/tickets/${firstProject!.slug}?ticket=cancelled`,
		});

		return NextResponse.json({ checkoutUrl: session.url });
	} catch (checkoutError) {
		console.error("Stripe checkout creation failed", checkoutError);
		return NextResponse.json(
			{ error: "Could not start checkout" },
			{ status: 502 },
		);
	}
}
