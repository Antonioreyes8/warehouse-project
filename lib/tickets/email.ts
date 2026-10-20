import "server-only";
import { Resend } from "resend";
import QRCode from "qrcode";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (character) => {
		switch (character) {
			case "&":
				return "&amp;";
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case '"':
				return "&quot;";
			case "'":
				return "&#39;";
			default:
				return character;
		}
	});
}

function formatEventDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new Error("Ticket event has an invalid date");
	}

	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "full",
		timeZone: "UTC",
	}).format(date);
}

export async function sendOrderTicketsEmail(orderId: string) {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.RESEND_FROM_EMAIL;
	if (!apiKey || !from) {
		throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL must be configured");
	}

	const supabase = getSupabaseAdmin();
	const { data: order, error: orderError } = await supabase
		.from("ticket_orders")
		.select("id, user_email, ticket_email_sent_at")
		.eq("id", orderId)
		.single();

	if (orderError) throw orderError;
	if (!order.user_email) throw new Error("Ticket order is missing a recipient email");
	if (order.ticket_email_sent_at) return;

	const { data: tickets, error: ticketsError } = await supabase
		.from("tickets")
		.select("project_id, ticket_code, qr_token, first_name, last_name, status")
		.eq("order_id", orderId)
		.eq("status", "issued")
		.order("project_id", { ascending: true })
		.order("ticket_code", { ascending: true });

	if (ticketsError) throw ticketsError;
	if (!tickets?.length) {
		throw new Error(`Ticket order ${orderId} has no issued tickets to email`);
	}

	const projectIds = [...new Set(tickets.map((ticket) => Number(ticket.project_id)))];
	const { data: projects, error: projectsError } = await supabase
		.from("projects")
		.select("id, title, event_date, img")
		.in("id", projectIds);

	if (projectsError) throw projectsError;

	const projectsById = new Map(
		(projects ?? []).map((project) => [Number(project.id), project]),
	);
	const ticketDetails = await Promise.all(
		tickets.map(async (ticket, index) => {
			const project = projectsById.get(Number(ticket.project_id));
			const firstName = ticket.first_name?.trim();
			const lastName = ticket.last_name?.trim();
			if (
				!project?.title ||
				!ticket.ticket_code ||
				!ticket.qr_token ||
				!firstName ||
				!lastName
			) {
				throw new Error(
					`Ticket order ${orderId} has incomplete ticket details`,
				);
			}

			return {
				title: project.title,
				date: project.event_date ? formatEventDate(project.event_date) : null,
				poster:
					typeof project.img === "string" &&
					project.img.startsWith("https://")
						? project.img
						: null,
				firstName,
				lastName,
				code: ticket.ticket_code,
				qrContentId: `ticket-qr-${index + 1}`,
				qrImage: await QRCode.toBuffer(ticket.qr_token, {
					type: "png",
					width: 240,
					margin: 2,
					errorCorrectionLevel: "M",
				}),
			};
		}),
	);
	const eventTitles = [...new Set(ticketDetails.map((ticket) => ticket.title))];
	const subject =
		eventTitles.length === 1
			? `Your tickets for ${eventTitles[0]}`
			: "Your Diaspora Project event tickets";
	const buyerNames = [
		...new Set(
			ticketDetails.map(
				(ticket) => `${ticket.firstName} ${ticket.lastName}`,
			),
		),
	];
	if (buyerNames.length !== 1) {
		throw new Error(`Ticket order ${orderId} has inconsistent ticket holder names`);
	}
	const buyerName = buyerNames[0];

	const ticketsByEvent = new Map<string, typeof ticketDetails>();
	for (const ticket of ticketDetails) {
		const eventTickets = ticketsByEvent.get(ticket.title) ?? [];
		eventTickets.push(ticket);
		ticketsByEvent.set(ticket.title, eventTickets);
	}
	const htmlEvents = [...ticketsByEvent.entries()]
		.map(([title, eventTickets]) => {
			const event = eventTickets[0];
			const poster = event.poster
				? `<img src="${escapeHtml(event.poster)}" alt="${escapeHtml(title)} event poster" width="600" style="display:block;width:100%;max-width:600px;height:auto;margin:12px 0;border-radius:8px">`
				: "";
			const htmlEventTickets = eventTickets
				.map(
					(ticket) => `<li style="margin:0 0 16px;padding:16px;border:1px solid #ddd;border-radius:8px">
						<p style="margin:0 0 8px"><strong>Admit one — ${escapeHtml(buyerName)}</strong></p>
						<p style="margin:8px 0 4px">Show this QR code at the event:</p>
						<img src="cid:${ticket.qrContentId}" alt="Ticket QR code for ${escapeHtml(buyerName)}" width="180" height="180" style="display:block;width:180px;height:180px">
						<p style="margin:8px 0 0">Ticket code: <strong>${escapeHtml(ticket.code)}</strong></p>
					</li>`,
				)
				.join("");

			return `<section style="margin:28px 0">
				<h2 style="font-size:20px;margin:0">${escapeHtml(title)}</h2>
				${event.date ? `<p style="margin:6px 0">${escapeHtml(event.date)}</p>` : ""}
				${poster}
				<ul style="padding:0;list-style:none">${htmlEventTickets}</ul>
			</section>`;
		})
		.join("");
	const textEvents = [...ticketsByEvent.entries()]
		.map(([title, eventTickets]) => {
			const event = eventTickets[0];
			return [
				title,
				event.date,
				`All tickets are issued under ${buyerName}.`,
				...eventTickets.map((ticket) => `Admit one — ${buyerName}\nTicket code: ${ticket.code}`),
			]
				.filter(Boolean)
				.join("\n");
		})
		.join("\n\n");

	const resend = new Resend(apiKey);
	const { data, error } = await resend.emails.send(
		{
			from,
			to: order.user_email,
			subject,
			attachments: ticketDetails.map((ticket) => ({
				filename: `${ticket.qrContentId}.png`,
				content: ticket.qrImage,
				contentType: "image/png",
				contentId: ticket.qrContentId,
			})),
			html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1c1c1c">
				<h1 style="font-size:24px">Your tickets are ready</h1>
				<p>Thank you for supporting The Diaspora Project. All tickets are issued under <strong>${escapeHtml(buyerName)}</strong>. Each ticket admits one person; present its QR code at the event.</p>
				${htmlEvents}
			</div>`,
			text: `Your tickets are ready\n\nThank you for supporting The Diaspora Project. All tickets are issued under ${buyerName}. Each ticket admits one person; present its QR code at the event.\n\n${textEvents}`,
		},
		{ idempotencyKey: `ticket-order-${orderId}` },
	);

	if (error) {
		throw new Error(`Resend could not send ticket email: ${error.message}`);
	}
	if (!data?.id) throw new Error("Resend returned no ticket email ID");

	const { error: updateError } = await supabase
		.from("ticket_orders")
		.update({
			ticket_email_sent_at: new Date().toISOString(),
			ticket_email_id: data.id,
			updated_at: new Date().toISOString(),
		})
		.eq("id", orderId)
		.is("ticket_email_sent_at", null);

	if (updateError) throw updateError;
}
