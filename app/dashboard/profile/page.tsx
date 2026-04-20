/**
 * File: app/artists/profile/page.tsx
 * Purpose: Combined profile view and edit page for authenticated artists.
 * Responsibilities:
 *   - Display artist profile with inline editing
 *   - Handle form submission to update profile
 *   - Check authentication and authorization
 * Key Concepts:
 *   - Protected route with auth checks
 *   - Inline editing with form state
 *   - Client-side session management
 * Dependencies:
 *   - supabaseClient for auth and data operations
 *   - getArtists functions for profile data
 *   - artistApi for update operations
 * How It Fits:
 *   - Main page artists see after login to manage their profile
 */

"use client";

import { supabase } from "@/lib/supabase/client";
import {
	getArtistByEmail,
	isEmailAuthorized,
	type Artist,
} from "@/lib/artists/queries";
import { updateArtistProfile } from "@/lib/artists/mutations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import styles from "./profile.module.css";

export default function ArtistProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [artist, setArtist] = useState<Artist | null>(null);
	const [authorized, setAuthorized] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		username: "",
		bio: "",
		age: "",
		based_in: "",
		mediums: "",
		past_projects: "",
		ethnic_background: "",
		contact: "",
		status: "",
		member_since: "",
		instagram: "",
		youtube: "",
		patreon: "",
		facebook: "",
		tik_tok: "",
		etsy: "",
		personal_website: "",
		soundcloud: "",
		bandcamp: "",
	});

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				router.push("/login");
				return;
			}

			setUser(session.user);

			if (!session.user.email) {
				setAuthorized(false);
				setLoading(false);
				return;
			}

			// Check if email is authorized
			const emailAuth = await isEmailAuthorized(session.user.email);
			setAuthorized(emailAuth);

			if (emailAuth) {
				// profiles.id is bigint so UUID lookup won't work — match by email instead
				const profile = await getArtistByEmail(session.user.email);
				if (profile) {
					setArtist(profile);
					setFormData({
						name: profile.name || "",
						username: profile.username || "",
						bio: profile.bio || "",
						age: profile.age || "",
						based_in: profile.based_in || "",
						mediums: profile.mediums || "",
						past_projects: profile.past_projects || "",
						ethnic_background: profile.ethnic_background || "",
						contact: profile.contact || "",
						status: profile.status || "",
						member_since: profile.member_since || "",
						instagram: profile.instagram || "",
						youtube: profile.youtube || "",
						patreon: profile.patreon || "",
						facebook: profile.facebook || "",
						tik_tok: profile.tik_tok || "",
						etsy: profile.etsy || "",
						personal_website: profile.personal_website || "",
						soundcloud: profile.soundcloud || "",
						bandcamp: profile.bandcamp || "",
					});
				}
			}

			setLoading(false);
		};

		checkAuth();
	}, [router]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (!artist) return;

		setSaving(true);
		setMessage("");

		const result = await updateArtistProfile(
			artist.id,
			artist.email ?? null,
			formData,
		);

		if (result.success) {
			setMessage("Profile updated successfully!");
			setEditing(false);
			// Refresh the artist data by email
			if (user?.email) {
				const updatedProfile = await getArtistByEmail(user.email);
				if (updatedProfile) {
					setArtist(updatedProfile);
				}
			}
		} else {
			setMessage(result.error || "Failed to update profile");
		}

		setSaving(false);
	};

	const handleCancel = () => {
		if (artist) {
			setFormData({
				name: artist.name || "",
				username: artist.username || "",
				bio: artist.bio || "",
				age: artist.age || "",
				based_in: artist.based_in || "",
				mediums: artist.mediums || "",
				past_projects: artist.past_projects || "",
				ethnic_background: artist.ethnic_background || "",
				contact: artist.contact || "",
				status: artist.status || "",
				member_since: artist.member_since || "",
				instagram: artist.instagram || "",
				youtube: artist.youtube || "",
				patreon: artist.patreon || "",
				facebook: artist.facebook || "",
				tik_tok: artist.tik_tok || "",
				etsy: artist.etsy || "",
				personal_website: artist.personal_website || "",
				soundcloud: artist.soundcloud || "",
				bandcamp: artist.bandcamp || "",
			});
		}
		setEditing(false);
		setMessage("");
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	if (loading) {
		return <div className={styles.loading}>Loading...</div>;
	}

	if (!authorized) {
		return (
			<div className={styles.unauthorized}>
				<h2>Access Denied</h2>
				<p>Your email ({user?.email}) is not authorized for artist access.</p>
				<p>Please contact the administrator to request access.</p>
				<button onClick={handleSignOut} className={styles.backButton}>
					Sign Out
				</button>
			</div>
		);
	}

	if (!artist) {
		return (
			<div className={styles.unauthorized}>
				<h2>Profile Not Found</h2>
				<p>Your artist profile hasn&apos;t been set up yet.</p>
				<p>Please contact the administrator to create your profile.</p>
				<button onClick={handleSignOut} className={styles.backButton}>
					Sign Out
				</button>
			</div>
		);
	}

	return (
		<div className={styles.profileContainer}>
			<header className={styles.profileHeader}>
				<h1 className={styles.profileTitle}>My Artist Profile</h1>
				<div>
					{!editing && (
						<button
							onClick={() => setEditing(true)}
							className={styles.viewPublicButton}
							style={{ marginRight: "1rem" }}
						>
							Edit Profile
						</button>
					)}
					<button onClick={handleSignOut} className={styles.signOutButton}>
						Sign Out
					</button>
				</div>
			</header>

			<main className={styles.profileContent}>
				{editing ? (
					<>
						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Basic Information</h2>
							<div className={styles.formGrid}>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="name">
										Name *
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										placeholder={artist.name || ""}
										onChange={handleInputChange}
										className={styles.formInput}
										required
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="username">
										Username *
									</label>
									<input
										type="text"
										id="username"
										name="username"
										value={formData.username}
										placeholder={artist.username || ""}
										onChange={handleInputChange}
										className={styles.formInput}
										required
									/>
								</div>
								<div className={`${styles.formGroup} ${styles.fullWidth}`}>
									<label className={styles.formLabel} htmlFor="bio">
										Bio
									</label>
									<textarea
										id="bio"
										name="bio"
										value={formData.bio}
										placeholder={artist.bio || ""}
										onChange={handleInputChange}
										className={styles.formTextarea}
										rows={4}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="age">
										Age
									</label>
									<input
										type="text"
										id="age"
										name="age"
										value={formData.age}
										placeholder={artist.age || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="based_in">
										Based In
									</label>
									<input
										type="text"
										id="based_in"
										name="based_in"
										value={formData.based_in}
										placeholder={artist.based_in || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={`${styles.formGroup} ${styles.fullWidth}`}>
									<label className={styles.formLabel} htmlFor="mediums">
										Mediums
									</label>
									<textarea
										id="mediums"
										name="mediums"
										value={formData.mediums}
										placeholder={artist.mediums || ""}
										onChange={handleInputChange}
										className={styles.formTextarea}
										rows={2}
									/>
								</div>
								<div className={`${styles.formGroup} ${styles.fullWidth}`}>
									<label className={styles.formLabel} htmlFor="past_projects">
										Past Projects
									</label>
									<textarea
										id="past_projects"
										name="past_projects"
										value={formData.past_projects}
										placeholder={artist.past_projects || ""}
										onChange={handleInputChange}
										className={styles.formTextarea}
										rows={2}
									/>
								</div>
								<div className={styles.formGroup}>
									<label
										className={styles.formLabel}
										htmlFor="ethnic_background"
									>
										Ethnic Background
									</label>
									<input
										type="text"
										id="ethnic_background"
										name="ethnic_background"
										value={formData.ethnic_background}
										placeholder={artist.ethnic_background || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="contact">
										Contact
									</label>
									<input
										type="text"
										id="contact"
										name="contact"
										value={formData.contact}
										placeholder={artist.contact || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="status">
										Status
									</label>
									<input
										type="text"
										id="status"
										name="status"
										value={formData.status}
										placeholder={artist.status || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="member_since">
										Member Since
									</label>
									<input
										type="text"
										id="member_since"
										name="member_since"
										value={formData.member_since}
										placeholder={artist.member_since || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
							</div>
						</div>

						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Social Links</h2>
							<div className={styles.formGrid}>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="instagram">
										Instagram
									</label>
									<input
										type="url"
										id="instagram"
										name="instagram"
										value={formData.instagram}
										placeholder={artist.instagram || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="youtube">
										YouTube
									</label>
									<input
										type="url"
										id="youtube"
										name="youtube"
										value={formData.youtube}
										placeholder={artist.youtube || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="patreon">
										Patreon
									</label>
									<input
										type="url"
										id="patreon"
										name="patreon"
										value={formData.patreon}
										placeholder={artist.patreon || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="facebook">
										Facebook
									</label>
									<input
										type="url"
										id="facebook"
										name="facebook"
										value={formData.facebook}
										placeholder={artist.facebook || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="tik_tok">
										TikTok
									</label>
									<input
										type="url"
										id="tik_tok"
										name="tik_tok"
										value={formData.tik_tok}
										placeholder={artist.tik_tok || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="etsy">
										Etsy
									</label>
									<input
										type="url"
										id="etsy"
										name="etsy"
										value={formData.etsy}
										placeholder={artist.etsy || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label
										className={styles.formLabel}
										htmlFor="personal_website"
									>
										Personal Website
									</label>
									<input
										type="url"
										id="personal_website"
										name="personal_website"
										value={formData.personal_website}
										placeholder={artist.personal_website || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="soundcloud">
										SoundCloud
									</label>
									<input
										type="url"
										id="soundcloud"
										name="soundcloud"
										value={formData.soundcloud}
										placeholder={artist.soundcloud || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
								<div className={styles.formGroup}>
									<label className={styles.formLabel} htmlFor="bandcamp">
										Bandcamp
									</label>
									<input
										type="url"
										id="bandcamp"
										name="bandcamp"
										value={formData.bandcamp}
										placeholder={artist.bandcamp || ""}
										onChange={handleInputChange}
										className={styles.formInput}
									/>
								</div>
							</div>
						</div>

						<div className={styles.buttonGroup}>
							<button
								onClick={handleCancel}
								className={styles.cancelButton}
								disabled={saving}
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className={styles.saveButton}
								disabled={saving}
							>
								{saving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</>
				) : (
					<>
						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Basic Information</h2>
							<div className={styles.formGrid}>
								<div>
									<strong>Name:</strong> {artist.name}
								</div>
								<div>
									<strong>Username:</strong> {artist.username}
								</div>
								<div>
									<strong>Age:</strong> {artist.age || "Not set"}
								</div>
								<div>
									<strong>Based In:</strong> {artist.based_in || "Not set"}
								</div>
								<div className={styles.fullWidth}>
									<strong>Mediums:</strong> {artist.mediums || "Not set"}
								</div>
								<div className={styles.fullWidth}>
									<strong>Past Projects:</strong>{" "}
									{artist.past_projects || "Not set"}
								</div>
								<div>
									<strong>Ethnic Background:</strong>{" "}
									{artist.ethnic_background || "Not set"}
								</div>
								<div>
									<strong>Contact:</strong> {artist.contact || "Not set"}
								</div>
								<div>
									<strong>Status:</strong> {artist.status || "Not set"}
								</div>
								<div>
									<strong>Member Since:</strong>{" "}
									{artist.member_since || "Not set"}
								</div>
								<div className={styles.fullWidth}>
									<strong>Bio:</strong> {artist.bio || "Not set"}
								</div>
							</div>
						</div>

						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Social Links</h2>
							<div className={styles.formGrid}>
								<div>
									<strong>Instagram:</strong>{" "}
									{artist.instagram ? (
										<a
											href={artist.instagram}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.instagram}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>YouTube:</strong>{" "}
									{artist.youtube ? (
										<a
											href={artist.youtube}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.youtube}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>Patreon:</strong>{" "}
									{artist.patreon ? (
										<a
											href={artist.patreon}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.patreon}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>Facebook:</strong>{" "}
									{artist.facebook ? (
										<a
											href={artist.facebook}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.facebook}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>TikTok:</strong>{" "}
									{artist.tik_tok ? (
										<a
											href={artist.tik_tok}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.tik_tok}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>Etsy:</strong>{" "}
									{artist.etsy ? (
										<a
											href={artist.etsy}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.etsy}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>Personal Website:</strong>{" "}
									{artist.personal_website ? (
										<a
											href={artist.personal_website}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.personal_website}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>SoundCloud:</strong>{" "}
									{artist.soundcloud ? (
										<a
											href={artist.soundcloud}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.soundcloud}
										</a>
									) : (
										"Not set"
									)}
								</div>
								<div>
									<strong>Bandcamp:</strong>{" "}
									{artist.bandcamp ? (
										<a
											href={artist.bandcamp}
											target="_blank"
											rel="noopener noreferrer"
										>
											{artist.bandcamp}
										</a>
									) : (
										"Not set"
									)}
								</div>
							</div>
						</div>

						<div className={styles.buttonGroup}>
							<Link
								href={`/artists/${artist.username}`}
								className={styles.viewPublicButton}
							>
								View Public Page
							</Link>
						</div>
					</>
				)}

				{message && (
					<p
						className={`${styles.message} ${message.includes("Error") || message.includes("Failed") ? styles.error : styles.success}`}
					>
						{message}
					</p>
				)}
			</main>
		</div>
	);
}
