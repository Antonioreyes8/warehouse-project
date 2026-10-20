alter table public.ticket_orders
	add column if not exists ticket_email_sent_at timestamptz,
	add column if not exists ticket_email_id text;
