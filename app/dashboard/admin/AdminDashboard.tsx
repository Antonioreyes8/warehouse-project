/**
 * File: app/dashboard/admin/AdminDashboard.tsx
 * Purpose: Client UI for managing collaborator accounts.
 *
 * Responsibilities:
 *   - List allowlisted accounts with role/status
 *   - Invite new collaborators
 *   - Suspend/reinstate, change role, and revoke access
 *
 * Dependencies:
 *   - app/api/admin/accounts routes
 *
 * How It Fits:
 *   - Rendered by the server-guarded app/dashboard/admin/page.tsx
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

type AccountRole = "admin" | "artist";
type AccountStatus = "active" | "suspended";

type AdminAccountRow = {
	email: string;
	role: AccountRole;
	account_status: AccountStatus;
	invited_by: string | null;
	invited_at: string | null;
	profile_username: string | null;
	profile_name: string | null;
};

export default function AdminDashboard() {
	const [accounts, setAccounts] = useState<AdminAccountRow[]>([]);
	const [error, setError] = useState("");
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<AccountRole>("artist");

	async function loadAccounts() {
		const res = await fetch("/api/admin/accounts");
		if (!res.ok) {
			const data = await res.json().catch(() => null);
			setError(data?.error ?? "Failed to load accounts");
			return;
		}
		const data = await res.json();
		setAccounts(data.accounts ?? []);
	}

	useEffect(() => {
		loadAccounts();
	}, []);

	async function handleInvite(event: React.FormEvent) {
		event.preventDefault();
		setError("");

		const res = await fetch("/api/admin/accounts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
		});

		if (!res.ok) {
			const data = await res.json();
			setError(data.error ?? "Failed to invite collaborator");
			return;
		}

		setInviteEmail("");
		setInviteRole("artist");
		await loadAccounts();
	}

	async function patchAccount(
		email: string,
		body: { accountStatus?: AccountStatus; role?: AccountRole },
	) {
		setError("");
		const res = await fetch(
			`/api/admin/accounts/${encodeURIComponent(email)}`,
			{
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			},
		);

		if (!res.ok) {
			const data = await res.json();
			setError(data.error ?? "Action failed");
			return;
		}

		await loadAccounts();
	}

	async function handleRevoke(email: string) {
		if (!confirm(`Revoke access for ${email}? This cannot be undone.`)) return;

		setError("");
		const res = await fetch(
			`/api/admin/accounts/${encodeURIComponent(email)}`,
			{
				method: "DELETE",
			},
		);

		if (!res.ok) {
			const data = await res.json();
			setError(data.error ?? "Failed to revoke access");
			return;
		}

		await loadAccounts();
	}

	return (
		<div className={styles.adminContainer}>
			<div className={styles.adminHeader}>
				<h1 className={styles.adminTitle}>Admin</h1>
				<Link href="/dashboard/profile">Back to profile</Link>
			</div>

			{error && <p className={styles.errorText}>{error}</p>}

			<form className={styles.inviteForm} onSubmit={handleInvite}>
				<input
					type="email"
					placeholder="Email"
					value={inviteEmail}
					onChange={(e) => setInviteEmail(e.target.value)}
					required
				/>
				<select
					value={inviteRole}
					onChange={(e) => setInviteRole(e.target.value as AccountRole)}
				>
					<option value="artist">Artist</option>
					<option value="admin">Admin</option>
				</select>
				<button type="submit">Give access</button>
			</form>

            <p className={styles.scrollHint}>Swipe to see more →</p>
            <div className={styles.tableScroll}>
			<table className={styles.accountsTable}>
				<thead>
					<tr>
						<th>Email</th>
						<th>Name</th>
						<th>Profile</th>
						<th>Role</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{accounts.map((account) => (
						<tr key={account.email}>
							<td>{account.email}</td>
							<td>{account.profile_name || "—"}</td>
							<td>
								{account.profile_username ? (
									<Link href={`/artists/${account.profile_username}`}>
										{account.profile_username}
									</Link>
								) : (
									"—"
								)}
							</td>
							<td>{account.role}</td>
							<td
								className={
									account.account_status === "suspended"
										? styles.statusSuspended
										: styles.statusActive
								}
							>
								{account.account_status}
							</td>
							<td>
								{account.account_status === "active" ? (
									<button
										className={styles.actionButton}
										onClick={() =>
											patchAccount(account.email, {
												accountStatus: "suspended",
											})
										}
									>
										Suspend
									</button>
								) : (
									<button
										className={styles.actionButton}
										onClick={() =>
											patchAccount(account.email, { accountStatus: "active" })
										}
									>
										Reinstate
									</button>
								)}
								<button
									className={styles.actionButton}
									onClick={() =>
										patchAccount(account.email, {
											role: account.role === "admin" ? "artist" : "admin",
										})
									}
								>
									{account.role === "admin" ? "Demote" : "Make admin"}
								</button>
								<button
									className={`${styles.actionButton} ${styles.revokeButton}`}
									onClick={() => handleRevoke(account.email)}
								>
									Revoke
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
        </div>
	);
}
