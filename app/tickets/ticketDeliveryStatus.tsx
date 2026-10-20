"use client";

import { useEffect, useState } from "react";
import styles from "./ticket-page.module.css";

type DeliveryStatus = "checking" | "sent" | "waiting" | "error";

export default function TicketDeliveryStatus({
	sessionId,
}: {
	sessionId: string;
}) {
	const [status, setStatus] = useState<DeliveryStatus>("checking");
	const [retry, setRetry] = useState(0);

	useEffect(() => {
		let cancelled = false;

		async function checkDelivery() {
			setStatus("checking");
			for (let attempt = 0; attempt < 30; attempt += 1) {
				if (attempt > 0) {
					await new Promise((resolve) => window.setTimeout(resolve, 2000));
				}
				if (cancelled) return;

				try {
					const response = await fetch(
						`/api/tickets/email-status?session_id=${encodeURIComponent(sessionId)}`,
						{ cache: "no-store" },
					);
					if (!response.ok) throw new Error("Could not check ticket email status");
					const result = (await response.json()) as { sent?: boolean };
					if (result.sent) {
						setStatus("sent");
						return;
					}
				} catch {
					setStatus("error");
					return;
				}
			}

			if (!cancelled) setStatus("waiting");
		}

		void checkDelivery();
		return () => {
			cancelled = true;
		};
	}, [sessionId, retry]);

	return (
		<div className={styles.deliveryStatus} role="status" aria-live="polite">
			{status === "checking" && (
				<p>Payment received. Waiting for your ticket email to be sent…</p>
			)}
			{status === "sent" && (
				<p>
					Your ticket email has been sent. Check your inbox and spam folder.
				</p>
			)}
			{status === "waiting" && (
				<>
					<p>
						Your payment was received, but the email is still processing.
						Please check your inbox shortly.
					</p>
					<button type="button" onClick={() => setRetry((value) => value + 1)}>
						Check email status again
					</button>
				</>
			)}
			{status === "error" && (
				<>
					<p>
						We couldn’t confirm the ticket email yet. Your payment may still be
						processing.
					</p>
					<button type="button" onClick={() => setRetry((value) => value + 1)}>
						Retry status check
					</button>
				</>
			)}
		</div>
	);
}
