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
	getArtistWorksByProfileId,
	isEmailAuthorized,
	type Artist,
	type ArtistWork,
} from "@/lib/artists/queries";
import {
	syncArtistWorks,
	updateArtistProfile,
	type ArtistWorkInput,
} from "@/lib/artists/mutations";
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
	"Student",
];

const AVATAR_BUCKET = "avatars";
const WORK_BUCKET = "works";
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

function getMemberSinceYear(createdAt?: string | null): string {
	// Display-only membership helper
	// Uses profile created_at as source of truth and returns only the year.
	if (!createdAt) return "";

	const createdDate = new Date(createdAt);
	if (Number.isNaN(createdDate.getTime())) return "";

	return String(createdDate.getFullYear());
}

function normalizeExternalUrl(value?: string | null): string {
	// Display helper for optional external links
	// Accepts full URLs or bare domains and normalizes to a clickable https URL.
	if (!value?.trim()) return "";

	const trimmedValue = value.trim();
	return trimmedValue.startsWith("http://") ||
		trimmedValue.startsWith("https://")
		? trimmedValue
		: `https://${trimmedValue}`;
}

type EditableWork = {
	id?: number;
	title: string;
	description: string;
	medium: string;
	image_url: string;
	link_url: string;
	sort_order: number;
};

type ArtistProfileFormData = {
	name: string;
	username: string;
	bio: string;
	avatar_url: string;
	birthday: string;
	based_in: string;
	mediums: string;
	past_projects: string;
	ethnic_background: string;
	contact: string;
	status: string;
	instagram: string;
	youtube: string;
	patreon: string;
	facebook: string;
	tik_tok: string;
	etsy: string;
	personal_website: string;
	soundcloud: string;
	bandcamp: string;
};

// Original creation problem:
// Repeated inline object construction for form hydration/reset and works payloads
// was spread across multiple handlers.
//
// Refactored creation approach (Simple Factory):
// Centralize object creation in one place so shape changes happen once.
const ArtistProfileFactory = {
	createEmptyFormData(): ArtistProfileFormData {
		return {
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
			instagram: "",
			youtube: "",
			patreon: "",
			facebook: "",
			tik_tok: "",
			etsy: "",
			personal_website: "",
			soundcloud: "",
			bandcamp: "",
		};
	},

	createFormDataFromArtist(artist: Artist): ArtistProfileFormData {
		return {
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
			instagram: artist.instagram || "",
			youtube: artist.youtube || "",
			patreon: artist.patreon || "",
			facebook: artist.facebook || "",
			tik_tok: artist.tik_tok || "",
			etsy: artist.etsy || "",
			personal_website: artist.personal_website || "",
			soundcloud: artist.soundcloud || "",
			bandcamp: artist.bandcamp || "",
		};
	},

	createProfileUpdatePayload(
		formData: ArtistProfileFormData,
	): Partial<Omit<Artist, "id" | "email">> {
		return {
			...formData,
		};
	},

	createWorksPayload(works: EditableWork[]): ArtistWorkInput[] {
		return works.map((work, index) => ({
			id: work.id,
			title: work.title,
			description: work.description,
			medium: work.medium,
			image_url: work.image_url,
			link_url: work.link_url,
			sort_order: index,
		}));
	},
};

function toEditableWorks(works: ArtistWork[]): EditableWork[] {
	return works.map((work, index) => ({
		id: work.id,
		title: work.title || "",
		description: work.description || "",
		medium: work.medium || "",
		image_url: work.image_url || "",
		link_url: work.link_url || "",
		sort_order: work.sort_order ?? index,
	}));
}

function createEmptyWork(sortOrder: number): EditableWork {
	return {
		title: "",
		description: "",
		medium: "",
		image_url: "",
		link_url: "",
		sort_order: sortOrder,
	};
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
	const [workUploading, setWorkUploading] = useState(false);
	const [artistWorks, setArtistWorks] = useState<EditableWork[]>([]);
	const [message, setMessage] = useState("");

	const [formData, setFormData] = useState<ArtistProfileFormData>(
		// Form state mirrors editable profile columns.
		// avatar_url is included so uploaded image URL can be previewed before final save.
		ArtistProfileFactory.createEmptyFormData(),
	);

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
					setFormData(ArtistProfileFactory.createFormDataFromArtist(profile));

					const works = await getArtistWorksByProfileId(profile.id);
					setArtistWorks(toEditableWorks(works));
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
		// Persists editable profile fields, then syncs the artist works collection.
		if (!artist) return;

		setSaving(true);
		setMessage("");

		const payload = ArtistProfileFactory.createProfileUpdatePayload(formData);

		const profileResult = await updateArtistProfile(
			artist.id,
			artist.email ?? null,
			payload,
		);

		if (!profileResult.success) {
			setMessage(profileResult.error || "Failed to update profile");
			setSaving(false);
			return;
		}

		const worksPayload = ArtistProfileFactory.createWorksPayload(artistWorks);

		const worksResult = await syncArtistWorks(artist.id, worksPayload);

		if (!worksResult.success) {
			setMessage(
				worksResult.error ||
					"Profile saved, but failed to save works. Please try again.",
			);
			setSaving(false);
			return;
		}

		setMessage("Profile updated successfully!");
		setEditing(false);

		if (user?.email) {
			const updatedProfile = await getArtistByEmail(user.email);
			if (updatedProfile) {
				setArtist(updatedProfile);
			}
		}

		const updatedWorks = await getArtistWorksByProfileId(artist.id);
		setArtistWorks(toEditableWorks(updatedWorks));

		setSaving(false);
	};

	const handleWorkFieldChange = (
		index: number,
		field: keyof Omit<EditableWork, "id" | "sort_order">,
		value: string,
	) => {
		setArtistWorks((prev) =>
			prev.map((work, workIndex) =>
				workIndex === index ? { ...work, [field]: value } : work,
			),
		);
	};

	const handleAddWork = () => {
		setArtistWorks((prev) => [...prev, createEmptyWork(prev.length)]);
	};

	const handleDeleteWork = (index: number) => {
		const shouldDelete = window.confirm(
			"Delete this work from your profile? Click Save Changes to make it permanent.",
		);

		if (!shouldDelete) {
			return;
		}

		setArtistWorks((prev) =>
			prev
				.filter((_, workIndex) => workIndex !== index)
				.map((work, nextIndex) => ({ ...work, sort_order: nextIndex })),
		);
		setMessage("Work removed from the form. Click Save Changes to confirm.");
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
			setMessage("Please upload a JPG, PNG, or WEBP image.");
			e.target.value = "";
			return;
		}

		if (file.size > MAX_AVATAR_SIZE_BYTES) {
			setMessage("Please upload an image smaller than 5MB.");
			e.target.value = "";
			return;
		}

		setAvatarUploading(true);
		setMessage("Uploading profile picture...");

		const extension = getFileExtension(file.name);
		const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

		const { error: uploadError } = await supabase.storage
			.from(AVATAR_BUCKET)
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: true,
				contentType: file.type,
			});

		if (uploadError) {
			setMessage(`Failed to upload image: ${uploadError.message}`);
			setAvatarUploading(false);
			e.target.value = "";
			return;
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

		setFormData((prev) => ({
			...prev,
			avatar_url: publicUrl,
		}));

		setMessage("Profile picture uploaded. Click Save Changes to keep it.");
		setAvatarUploading(false);
		e.target.value = "";
	};

	const handleWorkImageUpload = async (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		// Work image upload lifecycle
		// Mirrors avatar upload, but stores the asset in a dedicated works bucket.
		const file = e.target.files?.[0];

		if (!file || !user) {
			return;
		}

		if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
			setMessage("Please upload a JPG, PNG, or WEBP image.");
			e.target.value = "";
			return;
		}

		if (file.size > MAX_AVATAR_SIZE_BYTES) {
			setMessage("Please upload an image smaller than 5MB.");
			e.target.value = "";
			return;
		}

		setWorkUploading(true);
		setMessage("Uploading work image...");

		const extension = getFileExtension(file.name);
		const filePath = `${user.id}/work-${Date.now()}.${extension}`;

		const { error: uploadError } = await supabase.storage
			.from(WORK_BUCKET)
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: true,
				contentType: file.type,
			});

		if (uploadError) {
			setMessage(`Failed to upload work image: ${uploadError.message}`);
			setWorkUploading(false);
			e.target.value = "";
			return;
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(WORK_BUCKET).getPublicUrl(filePath);

		setArtistWorks((prev) =>
			prev.map((work, workIndex) =>
				workIndex === index ? { ...work, image_url: publicUrl } : work,
			),
		);

		setMessage("Work image uploaded. Click Save Changes to keep it.");
		setWorkUploading(false);
		e.target.value = "";
	};

	const handleCancel = () => {
		// Cancel behavior
		// Restores form to current profile snapshot and exits edit mode without persisting changes.
		if (artist) {
			setFormData(ArtistProfileFactory.createFormDataFromArtist(artist));

			const resetWorks = async () => {
				const works = await getArtistWorksByProfileId(artist.id);
				setArtistWorks(toEditableWorks(works));
			};

			void resetWorks();
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
	const memberSinceYear = getMemberSinceYear(artist.created_at);

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
				<div className={styles.headerActions}>
					{!editing && (
						<button
							onClick={() => setEditing(true)}
							className={styles.viewPublicButton}
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

						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Featured Work</h2>
							<div className={styles.buttonGroup}>
								<button
									type="button"
									onClick={handleAddWork}
									className={styles.sectionButton}
								>
									Add Work
								</button>
							</div>
							{artistWorks.length === 0 ? (
								<p>No works added yet. Click Add Work to create one.</p>
							) : (
								artistWorks.map((work, index) => (
									<div
										className={styles.formGrid}
										key={work.id ?? `new-${index}`}
									>
										<div className={`${styles.formGroup} ${styles.fullWidth}`}>
											<label
												className={styles.formLabel}
												htmlFor={`work_upload_${index}`}
											>
												Work Image
											</label>
											<div className={styles.workPreview}>
												{work.image_url ? (
													<Image
														src={work.image_url}
														alt={`${artist.name || "Artist"} featured work`}
														width={220}
														height={220}
														className={styles.workImage}
													/>
												) : (
													<div className={styles.workPlaceholder}>
														No work image uploaded
													</div>
												)}
												<div className={styles.avatarControls}>
													<input
														type="file"
														id={`work_upload_${index}`}
														accept="image/png,image/jpeg,image/webp"
														onChange={(e) => handleWorkImageUpload(index, e)}
														disabled={workUploading || saving}
														className={styles.formInput}
													/>
													<p className={styles.avatarHelpText}>
														Optional. This image will show on your public artist
														page.
													</p>
												</div>
											</div>
										</div>
										<div className={styles.formGroup}>
											<label
												className={styles.formLabel}
												htmlFor={`work_title_${index}`}
											>
												Work Title
											</label>
											<input
												type="text"
												id={`work_title_${index}`}
												value={work.title}
												onChange={(e) =>
													handleWorkFieldChange(index, "title", e.target.value)
												}
												className={styles.formInput}
											/>
										</div>
										<div className={styles.formGroup}>
											<label
												className={styles.formLabel}
												htmlFor={`work_medium_${index}`}
											>
												Medium
											</label>
											<input
												type="text"
												id={`work_medium_${index}`}
												value={work.medium}
												onChange={(e) =>
													handleWorkFieldChange(index, "medium", e.target.value)
												}
												className={styles.formInput}
											/>
										</div>
										<div className={styles.formGroup}>
											<label
												className={styles.formLabel}
												htmlFor={`work_link_${index}`}
											>
												Work Link
											</label>
											<input
												type="url"
												id={`work_link_${index}`}
												value={work.link_url}
												onChange={(e) =>
													handleWorkFieldChange(
														index,
														"link_url",
														e.target.value,
													)
												}
												className={styles.formInput}
											/>
										</div>
										<div className={`${styles.formGroup} ${styles.fullWidth}`}>
											<label
												className={styles.formLabel}
												htmlFor={`work_description_${index}`}
											>
												Work Description
											</label>
											<textarea
												id={`work_description_${index}`}
												value={work.description}
												onChange={(e) =>
													handleWorkFieldChange(
														index,
														"description",
														e.target.value,
													)
												}
												className={styles.formTextarea}
												rows={4}
											/>
										</div>
										<div className={styles.buttonGroup}>
											<button
												type="button"
												onClick={() => handleDeleteWork(index)}
												className={`${styles.sectionButton} ${styles.deleteWorkButton}`}
												disabled={saving || workUploading}
											>
												Delete Work
											</button>
										</div>
									</div>
								))
							)}
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
								disabled={saving || avatarUploading || workUploading}
							>
								{avatarUploading || workUploading
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
									<strong>Member Since:</strong> {memberSinceYear || "Not set"}
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

						<div className={styles.profileSection}>
							<h2 className={styles.sectionTitle}>Featured Work</h2>
							{artistWorks.length > 0 ? (
								artistWorks.map((work, index) => {
									const workLinkUrl = normalizeExternalUrl(work.link_url);

									return (
										<div
											className={styles.workCard}
											key={work.id ?? `work-${index}`}
										>
											<div className={styles.workMedia}>
												{work.image_url ? (
													workLinkUrl ? (
														<a
															href={workLinkUrl}
															target="_blank"
															rel="noopener noreferrer"
															className={styles.workImageLink}
														>
															<Image
																src={work.image_url}
																alt={`${artist.name || "Artist"} featured work`}
																width={240}
																height={240}
																className={styles.workImage}
															/>
														</a>
													) : (
														<Image
															src={work.image_url}
															alt={`${artist.name || "Artist"} featured work`}
															width={240}
															height={240}
															className={styles.workImage}
														/>
													)
												) : (
													<div className={styles.workPlaceholder}>
														No work image set
													</div>
												)}
											</div>
											<div className={styles.workContent}>
												<strong>Title:</strong> {work.title || "Not set"}
												<div>
													<strong>Medium:</strong> {work.medium || "Not set"}
												</div>
												<div>
													<strong>Description:</strong>{" "}
													{work.description || "Not set"}
												</div>
												<div>
													<strong>Link:</strong>{" "}
													{workLinkUrl ? (
														<a
															href={workLinkUrl}
															target="_blank"
															rel="noopener noreferrer"
														>
															{workLinkUrl}
														</a>
													) : (
														"Not set"
													)}
												</div>
											</div>
										</div>
									);
								})
							) : (
								<p>No featured work added yet.</p>
							)}
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
