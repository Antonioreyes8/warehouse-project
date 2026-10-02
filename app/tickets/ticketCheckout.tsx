"use client";

import { useState } from "react";
import styles from "./ticket-checkout.module.css";

export default function TicketCheckout({
	projectId,
	price,
	maxTicketsPerOrder,
}: {
	projectId: number;
	price: number;
	maxTicketsPerOrder: number;
}) {
	const [quantity, setQuantity] = useState(1);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function startCheckout() {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/tickets/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ projectId, quantity }),
			});
			const result = (await response.json()) as {
				checkoutUrl?: string;
				error?: string;
			};
			if (!response.ok || !result.checkoutUrl) {
				throw new Error(result.error || "Checkout could not be started.");
			}
			window.location.assign(result.checkoutUrl);
		} catch (checkoutError) {
			setError(
				checkoutError instanceof Error
					? checkoutError.message
					: "Checkout could not be started.",
			);
			setLoading(false);
		}
	}

	return (
		<section className={styles.ticketPurchase} aria-label="Ticket purchase">
			<div>
				<p className={styles.ticketLabel}>Tickets</p>
				<p className={styles.ticketPrice}>
					{new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(price)}
					<span> / each</span>
				</p>
			</div>
			<label className={styles.quantityLabel}>
				<span>Quantity</span>
				<select
					value={quantity}
					disabled={loading}
					onChange={(event) => setQuantity(Number(event.target.value))}
				>
					{Array.from(
						{ length: maxTicketsPerOrder },
						(_, index) => index + 1,
					).map((count) => (
						<option key={count} value={count}>
							{count}
						</option>
					))}
				</select>
			</label>
			<button
				className={styles.checkoutButton}
				type="button"
				disabled={loading}
				onClick={startCheckout}
			>
				{loading ? "Opening checkout..." : "Buy tickets"}
			</button>
			{error && (
				<p className={styles.checkoutError} role="alert">
					{error}
				</p>
			)}
		</section>
	);
}
