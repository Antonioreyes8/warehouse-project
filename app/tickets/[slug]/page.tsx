import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects/queries";
import { getAvailableTicketCount } from "@/lib/tickets/availability";
import TicketCheckout from "../ticketCheckout";
import TicketDeliveryStatus from "../ticketDeliveryStatus";
import styles from "../ticket-page.module.css";

export default async function TicketPage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ ticket?: string; session_id?: string }>;
}) {
	const [{ slug }, query] = await Promise.all([params, searchParams]);
	const event = await getProjectBySlug(slug);
	if (!event) notFound();
	const availableTickets =
		event.id !== undefined && event.capacity !== undefined
			? await getAvailableTicketCount(event.id, event.capacity)
			: null;

	return (
		<main className={styles.ticketPage}>
			<article className={styles.eventCard}>
				<div className={styles.posterFrame}>
					<Image
						className={styles.eventPoster}
						src={event.img}
						alt={event.title}
						width={1200}
						height={800}
						unoptimized
						priority
					/>
				</div>
				<div className={styles.eventDetails}>
					<p className={styles.eventDate}>{event.dateLabel}</p>
					<h1 className={styles.eventTitle}>{event.title}</h1>
					<p className={styles.eventDescription}>{event.description}</p>
					{availableTickets !== null && (
						<p
							className={`${styles.availability} ${availableTickets === 0 ? styles.soldOut : ""}`}
							aria-live="polite"
						>
							{availableTickets === 0
								? "Sold out"
								: `${availableTickets} ${
										availableTickets === 1 ? "ticket" : "tickets"
									} left`}
						</p>
					)}
					{query.ticket === "success" && query.session_id && (
						<TicketDeliveryStatus sessionId={query.session_id} />
					)}
					{event.id && event.ticketPrice ? (
						<TicketCheckout
							projectId={event.id}
							price={event.ticketPrice}
							maxTicketsPerOrder={event.maxTicketsPerOrder ?? 5}
							availableTickets={availableTickets}
						/>
					) : (
						<p className={styles.notForSale}>
							Tickets are not available for this event.
						</p>
					)}
				</div>
			</article>
		</main>
	);
}
