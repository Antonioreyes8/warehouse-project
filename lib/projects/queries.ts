import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
	CauseSectionType,
	Collaborator,
	CollaboratorRole,
	Project,
	Source,
} from "@/lib/projects/types";

/**
 * Generic safe JSON object type.
 * Supabase returns `unknown`/`any` so we normalize everything through this.
 */
type JsonRecord = Record<string, unknown>;

/**
 * Whitelist of valid collaborator roles.
 * Prevents bad data from database (typos, unexpected roles, etc.)
 */
const VALID_ROLES: ReadonlySet<string> = new Set([
	"Artists",
	"Organizers",
	"Preparation",
	"Media",
	"Technical Production",
]);

/**
 * Type guard:
 * Ensures a value is a plain object (not array/null/primitive)
 */
function isRecord(value: unknown): value is JsonRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Safely extracts a non-empty string.
 * Converts numbers to strings. Returns undefined if invalid or empty.
 */
function asString(value: unknown): string | undefined {
	if (typeof value === "number") return String(value);
	return typeof value === "string" && value.trim().length > 0
		? value.trim()
		: undefined;
}

/**
 * Normalizes "sources" arrays inside cause_section.
 * Ensures every source has valid {title, url}.
 */
function normalizeSources(value: unknown): Source[] | undefined {
	if (!Array.isArray(value)) return undefined;

	const sources = value
		.filter(isRecord)
		.map((entry) => {
			const title = asString(entry.title);
			const url = asString(entry.url);

			if (!title || !url) return null;

			return { title, url };
		})
		.filter((entry): entry is Source => entry !== null);

	return sources.length > 0 ? sources : undefined;
}

/**
 * Normalizes the "cause_section" field from multiple possible shapes:
 * - JSON object with { text, sources }
 * - legacy flat fields like cause_text / cause_sources
 */
function normalizeCauseSection(row: JsonRecord): CauseSectionType | undefined {
	const rawCause = row.cause_section ?? row.causeSection;

	// Case 1: structured JSON format
	if (isRecord(rawCause)) {
		const text = asString(rawCause.text);
		if (!text) return undefined;

		const sources = normalizeSources(rawCause.sources);

		return sources ? { text, sources } : { text };
	}

	// Case 2: legacy flat columns fallback
	const text = asString(row.cause_text) ?? asString(row.causeText);
	if (!text) return undefined;

	const sources = normalizeSources(row.cause_sources ?? row.causeSources);

	return sources ? { text, sources } : { text };
}

/**
 * Normalizes collaborators coming from Supabase JSON column.
 */
function normalizeCollaborators(value: unknown): Collaborator[] | undefined {
	if (!Array.isArray(value)) return undefined;

	const collaborators = value
		.filter(isRecord)
		.map((entry) => {
			const profile_id =
				asString(entry.profile_id) ?? asString(entry.profileId);
			const name = asString(entry.name);

			// If there's no ID and no fallback name, skip it
			if (!profile_id && !name) return null;

			// Validate role against whitelist
			const rawRole = asString(entry.role);
			const role =
				rawRole && VALID_ROLES.has(rawRole)
					? (rawRole as CollaboratorRole)
					: undefined;

			return {
				profile_id,
				name,
				role,
				slug: asString(entry.slug),
				username: asString(entry.username),
			};
		})
		.filter((entry): entry is Exclude<typeof entry, null> => entry !== null);

	return collaborators.length > 0 ? collaborators : undefined;
}

/**
 * Converts a raw Supabase row → clean Project object
 */
function mapProjectRow(row: JsonRecord): Project | null {
	const slug = asString(row.slug);
	const title = asString(row.title);
	const date = asString(row.date);

	// Image fallback chain (multiple DB column possibilities)
	const img =
		asString(row.img) ?? asString(row.image_url) ?? asString(row.poster_url);

	// If required fields are missing, skip project entirely
	if (!slug || !title || !date || !img) return null;

	const description = asString(row.description) ?? "";

	// Nested structured sections
	const causeSection = normalizeCauseSection(row);
	const collaboratorsSection = normalizeCollaborators(
		row.collaborators_section ?? row.collaboratorsSection,
	);

	return {
		slug,
		title,
		date,
		img,
		description,
		causeSection,
		collaboratorsSection,
	};
}

/**
 * Reads sort order safely from DB.
 * Defaults to array index if missing.
 */
function getSortOrder(row: JsonRecord, fallbackIndex: number): number {
	const rawSortOrder = row.sort_order ?? row.sortOrder;
	return typeof rawSortOrder === "number" ? rawSortOrder : fallbackIndex;
}

/**
 * HELPER: Takes an array of projects, extracts all profile_ids,
 * fetches the live profile data, and attaches name/username back to the collaborators.
 */
async function enrichProjectsWithProfiles(
	projects: Project[],
): Promise<Project[]> {
	const supabase = await createSupabaseServerClient();
	const profileIds = new Set<string>();

	// 1. Gather all unique profile IDs
	projects.forEach((p) => {
		p.collaboratorsSection?.forEach((c) => {
			if (c.profile_id) profileIds.add(c.profile_id);
		});
	});

	if (profileIds.size === 0) return projects;

	// 2. Fetch all matching profiles in one go
	const { data: profiles, error } = await supabase
		.from("profiles")
		.select("id, name, username")
		.in("id", Array.from(profileIds));

	if (error || !profiles) {
		console.error("Error fetching profiles for collaborators:", error);
		return projects; // fail gracefully, return unenriched projects
	}

	// Create a lookup map for fast access (Forcing ID to string)
	const profileMap = new Map(profiles.map((p) => [String(p.id), p]));

	// 3. Merge the live profile data back into the project objects
	return projects.map((p) => {
		if (!p.collaboratorsSection) return p;

		const enrichedCollaborators = p.collaboratorsSection.map((c) => {
			// Force the lookup key to be a string too
			const profile = c.profile_id
				? profileMap.get(String(c.profile_id))
				: null;

			return {
				...c,
				// Use live profile data, fallback to whatever was in the JSON if missing
				name: profile?.name || c.name,
				username: profile?.username || c.username,
			};
		});

		return { ...p, collaboratorsSection: enrichedCollaborators };
	});
}

/**
 * Fetch ALL projects from Supabase
 */
export async function getProjects(): Promise<Project[]> {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase.from("projects").select("*");

	if (error) {
		console.error("Error fetching projects:", error);
		return [];
	}

	const mapped = (data ?? [])
		.filter(isRecord)
		.map((row, index) => ({
			project: mapProjectRow(row),
			sortOrder: getSortOrder(row, index),
		}))
		.filter(
			(entry): entry is { project: Project; sortOrder: number } =>
				entry.project !== null,
		)
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.map((entry) => entry.project);

	// Enriches projects before sending to the frontend
	return enrichProjectsWithProfiles(mapped);
}

/**
 * Fetch single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase
		.from("projects")
		.select("*")
		.eq("slug", slug)
		.maybeSingle();

	if (error) {
		console.error("Error fetching project by slug:", error);
		return null;
	}

	if (!data || !isRecord(data)) return null;

	const project = mapProjectRow(data);
	if (!project) return null;

	// Enriches single project before sending to the frontend
	const enriched = await enrichProjectsWithProfiles([project]);
	return enriched[0];
}
