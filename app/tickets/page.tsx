import TicketShop from "./ticketShop";
import { getTicketEvents } from "@/lib/tickets/catalog";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
	const events = await getTicketEvents();
	return <TicketShop events={events} />;
}
