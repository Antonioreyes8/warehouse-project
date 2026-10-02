import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects/queries";
import TicketCheckout from "../ticketCheckout";
import styles from "../ticket-page.module.css";

export default async function TicketPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const event = await getProjectBySlug(slug);
	if (!event) notFound();

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
					{event.id && event.ticketPrice ? (
						<TicketCheckout
							projectId={event.id}
							price={event.ticketPrice}
							maxTicketsPerOrder={event.maxTicketsPerOrder ?? 5}
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
