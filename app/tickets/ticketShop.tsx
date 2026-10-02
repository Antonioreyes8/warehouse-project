"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import type { TicketEvent } from "@/lib/tickets/catalog";
import styles from "./ticket-shop.module.css";

type CartLine = { eventId: number; quantity: number };

const CART_STORAGE_KEY = "ticket-shop-cart-v1";
const money = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export default function TicketShop({ events }: { events: TicketEvent[] }) {
	const [cart, setCart] = useState<CartLine[]>([]);
	const [cartReady, setCartReady] = useState(false);
	const [error, setError] = useState("");
	const [checkingOut, setCheckingOut] = useState(false);
	const eventById = new Map(events.map((event) => [event.id, event]));
	const cartLines = cart.flatMap((line) => {
		const event = eventById.get(line.eventId);
		return event ? [{ ...line, event }] : [];
	});
	const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
	const total = cartLines.reduce(
		(sum, line) => sum + line.event.price * line.quantity,
		0,
	);

	useEffect(() => {
		const restoreCart = window.setTimeout(() => {
			try {
				const saved = localStorage.getItem(CART_STORAGE_KEY);
				if (saved) {
					const parsed = JSON.parse(saved) as CartLine[];
					setCart(
						parsed.filter(
							(line) =>
								events.some((event) => event.id === line.eventId) &&
								Number.isInteger(line.quantity) &&
								line.quantity >= 1 &&
								line.quantity <=
									(events.find((event) => event.id === line.eventId)
										?.maxTicketsPerOrder ?? 0),
						),
					);
				}
			} catch {
				localStorage.removeItem(CART_STORAGE_KEY);
			}
			setCartReady(true);
		}, 0);
		return () => window.clearTimeout(restoreCart);
	}, [events]);

	useEffect(() => {
		if (cartReady) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	}, [cart, cartReady]);

	function addEvent(eventId: number) {
		setError("");
		const event = eventById.get(eventId);
		if (!event) return;
		const existingQuantity =
			cart.find((line) => line.eventId === eventId)?.quantity ?? 0;
		if (existingQuantity >= event.maxTicketsPerOrder) {
			setError(
				`The limit for ${event.title} is ${event.maxTicketsPerOrder} tickets.`,
			);
			return;
		}
		setCart((current) => {
			const existing = current.find((line) => line.eventId === eventId);
			if (!existing) return [...current, { eventId, quantity: 1 }];
			return current.map((line) =>
				line.eventId === eventId
					? {
							...line,
							quantity: Math.min(event.maxTicketsPerOrder, line.quantity + 1),
						}
					: line,
			);
		});
	}

	function updateQuantity(eventId: number, quantity: number) {
		const event = eventById.get(eventId);
		if (!event) return;
		if (quantity > event.maxTicketsPerOrder) {
			setError(
				`The limit for ${event.title} is ${event.maxTicketsPerOrder} tickets.`,
			);
			return;
		}
		setError("");
		setCart((current) =>
			quantity < 1
				? current.filter((line) => line.eventId !== eventId)
				: current.map((line) =>
						line.eventId === eventId ? { ...line, quantity } : line,
					),
		);
	}

	async function startCheckout() {
		if (cartLines.length === 0) return;
		setCheckingOut(true);
		setError("");
		try {
			const response = await fetch("/api/tickets/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: cartLines.map(({ event, quantity }) => ({
						projectId: event.id,
						quantity,
					})),
				}),
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
			setCheckingOut(false);
		}
	}

	function scrollToCart() {
		document.getElementById("ticket-cart")?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	return (
		<div className={styles.shop}>
			<div className={styles.shopLayout}>
				<section className={styles.catalog} aria-labelledby="shop-title">
					<header className={styles.catalogHeader}>
						<p className={styles.kicker}>Events</p>
						<h1 id="shop-title">Upcoming events</h1>
						<p className={styles.intro}>
							Add tickets to your cart and check out securely. Ticket limits
							vary by event.
						</p>
					</header>

					{events.length ? (
						<div className={styles.eventGrid}>
							{events.map((event) => {
								const quantity =
									cart.find((line) => line.eventId === event.id)?.quantity ?? 0;
								return (
									<article className={styles.eventCard} key={event.id}>
										<a
											className={styles.posterLink}
											href={`/tickets/${event.slug}`}
											aria-label={`View details for ${event.title}`}
										>
											<Image
												className={styles.poster}
												src={event.image}
												alt={event.title}
												width={720}
												height={540}
												unoptimized
											/>
										</a>
										<div className={styles.cardBody}>
											<p className={styles.eventDate}>{event.eventDateLabel}</p>
											<h2>{event.title}</h2>
											<p className={styles.description}>{event.description}</p>
											<div className={styles.cardFooter}>
												<p className={styles.price}>
													{money.format(event.price)}
												</p>
												<button
													className={styles.addButton}
													type="button"
													onClick={() => addEvent(event.id)}
													disabled={quantity >= event.maxTicketsPerOrder}
													aria-label={`Add ${event.title} ticket to cart`}
													title={
														quantity >= event.maxTicketsPerOrder
															? `Event limit is ${event.maxTicketsPerOrder} tickets`
															: "Add to cart"
													}
												>
													{quantity ? `Added ${quantity}` : "Add to cart"}
													<span aria-hidden="true">+</span>
												</button>
											</div>
										</div>
									</article>
								);
							})}
						</div>
					) : (
						<p className={styles.emptyCatalog}>
							No upcoming events are on sale right now.
						</p>
					)}
				</section>

				<aside
					className={styles.cartPanel}
					id="ticket-cart"
					aria-labelledby="cart-title"
				>
					<div className={styles.cartHeading}>
						<h2 id="cart-title">Your cart</h2>
						<span>
							{cartCount} {cartCount === 1 ? "ticket" : "tickets"}
						</span>
					</div>

					{cartLines.length ? (
						<ul className={styles.cartItems}>
							{cartLines.map(({ event, quantity }) => (
								<li className={styles.cartItem} key={event.id}>
									<div className={styles.cartItemMain}>
										<div>
											<h3>{event.title}</h3>
											<p>{money.format(event.price)} each</p>
										</div>
										<strong>{money.format(event.price * quantity)}</strong>
									</div>
									<div className={styles.quantityControls}>
										<button
											type="button"
											aria-label={`Remove one ${event.title} ticket`}
											onClick={() => updateQuantity(event.id, quantity - 1)}
										>
											−
										</button>
										<span>{quantity}</span>
										<button
											type="button"
											aria-label={`Add one ${event.title} ticket`}
											disabled={quantity >= event.maxTicketsPerOrder}
											onClick={() => updateQuantity(event.id, quantity + 1)}
										>
											+
										</button>
										<button
											className={styles.removeButton}
											type="button"
											aria-label={`Remove ${event.title} from cart`}
											onClick={() => updateQuantity(event.id, 0)}
										>
											Remove
										</button>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className={styles.emptyCart}>
							Your cart is empty. Add an event to get started.
						</p>
					)}

					<div className={styles.cartTotal}>
						<span>Subtotal</span>
						<strong>{money.format(total)}</strong>
					</div>
					<p className={styles.taxNote}>
						Taxes, if applicable, are calculated at checkout.
					</p>
					{error && (
						<p className={styles.error} role="alert">
							{error}
						</p>
					)}
					<button
						className={styles.checkoutButton}
						type="button"
						disabled={!cartLines.length || checkingOut}
						onClick={startCheckout}
					>
						{checkingOut ? "Opening secure checkout..." : "Checkout"}
					</button>
					<p className={styles.secureNote}>Secure payment through Stripe</p>
				</aside>
			</div>

			<button
				className={styles.mobileCartButton}
				type="button"
				onClick={scrollToCart}
				aria-label={`Go to cart, ${cartCount} tickets`}
				title="Go to cart"
			>
				<FontAwesomeIcon icon={faCartShopping} />
				{cartCount > 0 && <span>{cartCount}</span>}
			</button>
		</div>
	);
}
