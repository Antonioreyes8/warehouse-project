import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
	PermanentTicketEventError,
	processTicketPaymentEvent,
} from "@/lib/tickets/fulfillment";
import { getStripe } from "@/lib/tickets/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
	const signature = request.headers.get("stripe-signature");
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!signature || !webhookSecret) {
		return NextResponse.json(
			{ error: "Webhook is not configured" },
			{ status: 400 },
		);
	}

	let event: Stripe.Event;
	try {
		event = getStripe().webhooks.constructEvent(
			await request.text(),
			signature,
			webhookSecret,
		);
	} catch {
		return NextResponse.json(
			{ error: "Invalid Stripe signature" },
			{ status: 400 },
		);
	}

	if (
		(event.type === "checkout.session.completed" ||
			event.type === "checkout.session.async_payment_succeeded") &&
		event.data.object.mode === "payment"
	) {
		try {
			await processTicketPaymentEvent(event.data.object.id, event.id);
		} catch (paymentError) {
			if (paymentError instanceof PermanentTicketEventError) {
				console.error("Discarding invalid Stripe ticket event", paymentError);
				return NextResponse.json({ received: true });
			}
			console.error("Could not fulfill Stripe ticket event", paymentError);
			return NextResponse.json(
				{ error: "Payment processing is temporarily unavailable" },
				{ status: 503 },
			);
		}
	}

	return NextResponse.json({ received: true });
}
