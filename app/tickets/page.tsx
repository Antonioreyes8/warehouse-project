import TicketShop from "./ticketShop";
import { getTicketEvents } from "@/lib/tickets/catalog";

export default async function TicketsPage() {
	const events = await getTicketEvents();
	return <TicketShop events={events} />;
}
