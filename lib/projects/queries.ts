import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
	CauseSectionType,
	Collaborator,
	CollaboratorRole,
	Project,
	Source,
} from "@/lib/projects/types";

type JsonRecord = Record<string, unknown>;

const VALID_ROLES: ReadonlySet<string> = new Set([
	"Artists",
	"Organizers",
	"Preparation",
	"Media",
	"Technical Production",
]);

function isRecord(value: unknown): value is JsonRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim().length > 0
		? value.trim()
		: undefined;
}

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

function normalizeCauseSection(row: JsonRecord): CauseSectionType | undefined {
	const rawCause = row.cause_section ?? row.causeSection;

	if (isRecord(rawCause)) {
		const text = asString(rawCause.text);
		if (!text) return undefined;

		const sources = normalizeSources(rawCause.sources);
		return sources ? { text, sources } : { text };
	}

	const text = asString(row.cause_text) ?? asString(row.causeText);
	if (!text) return undefined;

	const sources = normalizeSources(row.cause_sources ?? row.causeSources);
	return sources ? { text, sources } : { text };
}

function normalizeCollaborators(value: unknown): Collaborator[] | undefined {
	if (!Array.isArray(value)) return undefined;

	const collaborators = value
		.filter(isRecord)
		.map((entry) => {
			const name = asString(entry.name);
			if (!name) return null;

			const rawRole = asString(entry.role);
			const role =
				rawRole && VALID_ROLES.has(rawRole)
					? (rawRole as CollaboratorRole)
					: undefined;

			return {
				name,
				role,
				slug: asString(entry.slug),
				username: asString(entry.username),
			};
		})
		.filter((entry): entry is Exclude<typeof entry, null> => entry !== null);

	return collaborators.length > 0 ? collaborators : undefined;
}

function mapProjectRow(row: JsonRecord): Project | null {
	const slug = asString(row.slug);
	const title = asString(row.title);
	const date = asString(row.date);
	const img =
		asString(row.img) ?? asString(row.image_url) ?? asString(row.poster_url);

	if (!slug || !title || !date || !img) return null;

	const description = asString(row.description) ?? "";
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

function getSortOrder(row: JsonRecord, fallbackIndex: number): number {
	const rawSortOrder = row.sort_order ?? row.sortOrder;
	return typeof rawSortOrder === "number" ? rawSortOrder : fallbackIndex;
}

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

	return mapped;
}

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

	return mapProjectRow(data);
}
