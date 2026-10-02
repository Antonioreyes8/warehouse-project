import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/tickets/stripe";

export class PermanentTicketEventError extends Error {}

export async function processTicketPaymentEvent(
	checkoutSessionId: string,
	stripeEventId: string,
) {
	const stripe = getStripe();
	const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
	if (session.mode !== "payment") {
		throw new PermanentTicketEventError(
			`Checkout session ${session.id} is not a payment session`,
		);
	}
	if (session.payment_status !== "paid") return;

	let cartItems: Array<{ p: number; q: number; c: number }>;
	try {
		cartItems = JSON.parse(session.metadata?.cart_items ?? "") as Array<{
			p: number;
			q: number;
			c: number;
		}>;
	} catch {
		throw new PermanentTicketEventError(
			`Checkout session ${session.id} has invalid cart metadata`,
		);
	}
	const userEmail = (session.customer_details?.email ?? session.customer_email)
		?.trim()
		.toLowerCase();
	const firstName = session.custom_fields
		?.find((field) => field.key === "first_name")
		?.text?.value?.trim();
	const lastName = session.custom_fields
		?.find((field) => field.key === "last_name")
		?.text?.value?.trim();
	const paymentIntentId =
		typeof session.payment_intent === "string"
			? session.payment_intent
			: session.payment_intent?.id;

	if (
		!Array.isArray(cartItems) ||
		cartItems.length < 1 ||
		cartItems.length > 5 ||
		cartItems.some(
			(item) =>
				!Number.isSafeInteger(item.p) ||
				!Number.isInteger(item.q) ||
				item.q < 1 ||
				!Number.isSafeInteger(item.c) ||
				item.c < 1,
		) ||
		!userEmail ||
		!firstName ||
		!lastName ||
		!paymentIntentId ||
		!session.amount_total
	) {
		throw new PermanentTicketEventError(
			`Checkout session ${session.id} has invalid ticket metadata`,
		);
	}

	const supabase = getSupabaseAdmin();
	const { data: result, error } = await supabase.rpc(
		"fulfill_paid_ticket_order",
		{
			p_checkout_session_id: session.id,
			p_stripe_event_id: stripeEventId,
			p_payment_intent_id: paymentIntentId,
			p_cart_items: cartItems,
			p_user_email: userEmail,
			p_amount_total: session.amount_total,
			p_currency: session.currency,
		},
	);

	if (error) throw error;
	if (result !== "capacity_exceeded") {
		const { data: order, error: orderError } = await supabase
			.from("ticket_orders")
			.select("id")
			.eq("checkout_session_id", session.id)
			.single();
		if (orderError) throw orderError;

		const { error: ticketError } = await supabase
			.from("tickets")
			.update({ first_name: firstName, last_name: lastName })
			.eq("order_id", order.id);
		if (ticketError) throw ticketError;
	}
	if (result === "capacity_exceeded") {
		const refund = await stripe.refunds.create(
			{ payment_intent: paymentIntentId },
			{ idempotencyKey: `ticket-capacity-refund-${session.id}` },
		);
		const { error: updateError } = await supabase
			.from("ticket_orders")
			.update({
				status: "refunded",
				stripe_refund_id: refund.id,
				updated_at: new Date().toISOString(),
			})
			.eq("checkout_session_id", session.id);
		if (updateError) throw updateError;
	}
}
