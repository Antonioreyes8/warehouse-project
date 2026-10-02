# Ticket Payments Setup

Ticket checkout uses Stripe Checkout and fulfills paid orders from verified Stripe webhook events. The browser never writes ticket or payment rows.

## Assumptions

- Buyers do not need an account or Supabase session. Stripe Checkout collects the buyer's email for ticket delivery and receipts; this is contact information, not identity verification.
- Guest tickets have `user_id = NULL`; the verified Stripe Checkout email is stored as `user_email`.
- Each event has a configurable per-order ticket limit in `projects.max_tickets_per_order` (default: 5). A cart can contain up to 5 different events, with each event limited by its configured per-order maximum.
- Home project cards use `projects.visibility_status`: `visible` links to the project page, `cover_only` displays a faded non-clickable cover, and `hidden` is omitted.
- `projects.ticket_price` is denominated in USD.
- `projects.capacity` is the total allowed issued-ticket count. If a payment completes after the remaining capacity is consumed, the webhook issues an idempotent Stripe refund.

## Configure

The base ticket tables and per-event `projects.max_tickets_per_order` values should already be installed. To enable multi-event carts, apply `supabase/migrations/20261001000000_ticket_cart_upgrade.sql` in the Supabase SQL Editor. It adds a JSONB `ticket_order_items` column to `ticket_orders` and the cart-aware fulfillment function without changing project ticket limits. Keep Row Level Security enabled for `ticket_orders`; the webhook uses `SUPABASE_SERVICE_ROLE_KEY` and the function is executable only by `service_role`.

Set these server environment variables in the Next.js app:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Configure the Stripe webhook endpoint as `https://<site>/api/tickets/webhook` and subscribe it to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Use Stripe CLI forwarding to test locally. Paid events are fulfilled directly by the webhook; temporary processing failures return an error so Stripe retries delivery.

The event catalog and cart are at `/tickets`; individual event details remain at `/tickets/<project-slug>`. The project recap pages under `/projects/<project-slug>` are not part of ticket checkout. Guest checkout accepts up to 5 different events at `POST /api/tickets/checkout`, with each event limited by its `max_tickets_per_order` value; it does not require a Supabase session. Its JSON response contains `checkoutUrl`. Stripe collects the buyer email and first and last names in hosted checkout, and the webhook reads them from the verified Checkout Session before storing them with the issued tickets. Admin ticket orders are available from the protected `GET /api/admin/tickets` endpoint.

Stripe Checkout processes payment and collects contact details; it does not authenticate or verify a buyer's real-world identity. This ticket flow does not create or require customer accounts on this site. Add rate limiting and bot protections to the public checkout endpoint before production.

## Operational Notes

Stripe webhook delivery and the database function are idempotent by Checkout Session ID. Add rate limiting and bot protections to the public checkout endpoint before production.
