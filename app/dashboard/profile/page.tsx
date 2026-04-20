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
import Image from "next/image";
import styles from "./profile.module.css";

const STATUS_OPTIONS = [
	"Open for Work",
	"Available for Commissions",
	"Available for Collaborations",
	"Not Currently Available",
	"On Hiatus",
	"Student",
	"Other",
];

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getFileExtension(fileName: string): string {
	// Filename helper
	// Preserves extension when available for easier debugging/storage inspection.
	const parts = fileName.split(".");
	if (parts.length < 2) return "jpg";
	return parts[parts.length - 1].toLowerCase();
}

function calculateAgeFromBirthDate(birthDate: string): string {
	// Display-only age helper
	// Age is derived from birthday at render time and not stored as a source-of-truth field.
	if (!birthDate) return "";

	const birth = new Date(birthDate);
	if (Number.isNaN(birth.getTime())) return "";

	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age -= 1;
	}

	return age >= 0 ? String(age) : "";
}

export default function ArtistProfilePage() {
	// Component state section
	// - user/artist/authorized/loading control route protection and data readiness.
	// - editing/saving/avatarUploading drive UI modes and button disable states.
	// - message provides user feedback for save/upload outcomes.
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [artist, setArtist] = useState<Artist | null>(null);
	const [authorized, setAuthorized] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [avatarUploading, setAvatarUploading] = useState(false);
	const [message, setMessage] = useState("");

	const [formData, setFormData] = useState({
		// Form state mirrors editable profile columns.
		// avatar_url is included so uploaded image URL can be previewed before final save.
		name: "",
		username: "",
		bio: "",
		avatar_url: "",
		birthday: "",
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
		// Auth + profile bootstrap section
		// This establishes three layers before rendering editable UI:
		// 1) Auth session exists
		// 2) Email is allowlisted
		// 3) Profile row exists
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				// No active session: this is a protected route, so redirect to login.
				router.push("/login");
				return;
			}

			setUser(session.user);

			if (!session.user.email) {
				// Session without email cannot be allowlist-checked safely.
				setAuthorized(false);
				setLoading(false);
				return;
			}

			// Allowlist check
			// Uses normalized email query to gate dashboard access.
			const emailAuth = await isEmailAuthorized(session.user.email);
			setAuthorized(emailAuth);

			if (emailAuth) {
				// Profile lookup strategy
				// profiles.id is bigint in this project, while auth user id is UUID.
				// We fetch by email to avoid id-type mismatch issues.
				const profile = await getArtistByEmail(session.user.email);
				if (profile) {
					setArtist(profile);
					// Hydrate form with existing values so edit mode starts with current data.
					setFormData({
						name: profile.name || "",
						username: profile.username || "",
						bio: profile.bio || "",
						avatar_url: profile.avatar_url || "",
						birthday: profile.birthday || "",
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
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		// Generic form input handler
		// Keeps all text/select/textarea fields synchronized with local form state.
		const { name, value } = e.target;

		if (name === "birthday") {
			setFormData((prev) => ({
				...prev,
				birthday: value,
			}));
			return;
		}

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		// Save lifecycle section
		// Persists the entire editable profile payload and then re-reads profile for consistency.
		if (!artist) return;

		setSaving(true);
		setMessage("");

		const payload = {
			...formData,
		};

		const result = await updateArtistProfile(
			artist.id,
			artist.email ?? null,
			payload,
		);

		if (result.success) {
			setMessage("Profile updated successfully!");
			setEditing(false);
			// Refresh profile after write
			// Re-fetch ensures UI reflects canonical DB values after triggers/defaults.
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

	const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// Avatar upload lifecycle
		// 1) validate type/size
		// 2) upload to storage path scoped by auth user id
		// 3) generate public URL
		// 4) stage URL in formData (final persistence occurs on Save Changes)
		const file = e.target.files?.[0];

		if (!file || !user) {
			return;
		}

		if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
			// File type guard keeps accepted media predictable and compatible with image components.
			setMessage("Please upload a JPG, PNG, or WEBP image.");
			e.target.value = "";
			return;
		}

		if (file.size > MAX_AVATAR_SIZE_BYTES) {
			// Size guard prevents oversized uploads and improves storage/network behavior.
			setMessage("Please upload an image smaller than 5MB.");
			e.target.value = "";
			return;
		}

		setAvatarUploading(true);
		setMessage("Uploading profile picture...");

		const extension = getFileExtension(file.name);
		// Per-user storage path strategy
		// Folder prefix by auth uid supports clean ownership policies in Supabase Storage RLS.
		const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

		const { error: uploadError } = await supabase.storage
			.from(AVATAR_BUCKET)
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: true,
				contentType: file.type,
			});

		if (uploadError) {
			// Upload failure is surfaced directly so policy/config errors are visible to the user.
			setMessage(`Failed to upload image: ${uploadError.message}`);
			setAvatarUploading(false);
			e.target.value = "";
			return;
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

		// Stage uploaded URL into form state.
		// User still controls final commit by clicking Save Changes.
		setFormData((prev) => ({
			...prev,
			avatar_url: publicUrl,
		}));

		setMessage("Profile picture uploaded. Click Save Changes to keep it.");
		setAvatarUploading(false);
		e.target.value = "";
	};

	const handleCancel = () => {
		// Cancel behavior
		// Restores form to current profile snapshot and exits edit mode without persisting changes.
		if (artist) {
			setFormData({
				name: artist.name || "",
				username: artist.username || "",
				bio: artist.bio || "",
				avatar_url: artist.avatar_url || "",
				birthday: artist.birthday || "",
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
		// Sign-out section
		// Ends Supabase session and returns user to public home page.
		await supabase.auth.signOut();
		router.push("/");
	};

	if (loading) {
		// Loading gate
		// Prevents unauthorized/profile checks from flashing intermediate UI states.
		return <div className={styles.loading}>Loading...</div>;
	}

	if (!authorized) {
		// Authorization gate
		// User has a session but does not pass allowlist rules.
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
		// Profile existence gate
		// Allowlisted users still need a profile row before they can edit dashboard data.
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

	const greetingName =
		artist.name?.trim().split(" ")[0] || user?.email?.split("@")[0] || "Artist";

	// Main render section
	// - editing=true shows form controls
	// - editing=false shows read-only preview and public page link
	// - message feedback appears at bottom after actions
	return (
		<div className={styles.profileContainer}>
			<header className={styles.profileHeader}>
				<div className={styles.profileIntro}>
					<h1 className={styles.profileTitle}>My Artist Profile</h1>
					<p className={styles.profileGreeting}>
						Hi {greetingName}! Welcome to your artist dashboard, here you can
						see all the info publicly displayed. Thank you for being part of our
						community! Please use take advantage of this space and share your
						work !
					</p>
				</div>
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
								<div className={`${styles.formGroup} ${styles.fullWidth}`}>
									<label className={styles.formLabel} htmlFor="avatar_upload">
										Profile Picture
									</label>
									<div className={styles.avatarField}>
										{formData.avatar_url ? (
											<Image
												src={formData.avatar_url}
												alt={`${artist.name || "Artist"} profile picture`}
												width={120}
												height={120}
												className={styles.avatarImage}
											/>
										) : (
											<div className={styles.avatarPlaceholder}>
												No image uploaded
											</div>
										)}
										<div className={styles.avatarControls}>
											<input
												type="file"
												id="avatar_upload"
												accept="image/png,image/jpeg,image/webp"
												onChange={handleAvatarUpload}
												disabled={avatarUploading || saving}
												className={styles.formInput}
											/>
											<p className={styles.avatarHelpText}>
												Max 5MB. Supported formats: JPG, PNG, WEBP.
											</p>
										</div>
									</div>
								</div>
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
									<label className={styles.formLabel} htmlFor="birthday">
										Birth Date
									</label>
									<input
										type="date"
										id="birthday"
										name="birthday"
										value={formData.birthday}
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
								<div className={styles.formGroup}>
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
								<div className={styles.formGroup}>
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
									<select
										id="status"
										name="status"
										value={formData.status}
										onChange={handleInputChange}
										className={styles.formInput}
									>
										<option value="">Select status</option>
										{STATUS_OPTIONS.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
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
								disabled={saving || avatarUploading}
							>
								{avatarUploading
									? "Uploading..."
									: saving
										? "Saving..."
										: "Save Changes"}
							</button>
						</div>
					</>
				) : (
					<>
						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Basic Information</h2>
							<div className={styles.formGrid}>
								<div className={styles.fullWidth}>
									<div className={styles.avatarDisplayRow}>
										<strong>Profile Picture:</strong>
										{artist.avatar_url ? (
											<Image
												src={artist.avatar_url}
												alt={`${artist.name || "Artist"} profile picture`}
												width={120}
												height={120}
												className={styles.avatarImage}
											/>
										) : (
											"Not set"
										)}
									</div>
								</div>
								<div>
									<strong>Name:</strong> {artist.name}
								</div>
								<div>
									<strong>Username:</strong> {artist.username}
								</div>
								<div>
									<strong>Age:</strong>{" "}
									{calculateAgeFromBirthDate(artist.birthday || "") ||
										"Not set"}
								</div>
								<div>
									<strong>Birth Date:</strong> {artist.birthday || "Not set"}
								</div>
								<div>
									<strong>Based In:</strong> {artist.based_in || "Not set"}
								</div>
								<div>
									<strong>Mediums:</strong> {artist.mediums || "Not set"}
								</div>
								<div>
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
