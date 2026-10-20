import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
	const sessionId = new URL(request.url).searchParams.get("session_id");
	if (!sessionId || !/^cs_[A-Za-z0-9_]{10,250}$/.test(sessionId)) {
		return NextResponse.json(
			{ error: "A valid Checkout session is required" },
			{ status: 400 },
		);
	}

	const { data: order, error } = await getSupabaseAdmin()
		.from("ticket_orders")
		.select("ticket_email_sent_at")
		.eq("checkout_session_id", sessionId)
		.maybeSingle();

	if (error) {
		console.error("Could not check ticket email status:", error);
		return NextResponse.json(
			{ error: "Could not check ticket email status" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ sent: Boolean(order?.ticket_email_sent_at) });
}
