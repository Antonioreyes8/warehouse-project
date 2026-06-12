/**
 * File: lib/projects/types.ts
 * Purpose: Shared data type definitions for project-related pages and helpers.
 * Responsibilities:
 *   - Define structured types for project content, media, and collaborators
 *   - Provide a single source of truth for project data shapes
 * Key Concepts:
 *   - TypeScript type annotations for improved IDE and compile-time safety
 *   - Shared model definitions used across query helpers and React components
 */

export type Source = {
	title: string;
	url: string;
};

export type CauseSectionType = {
	text: string;
	sources?: Source[];
};

export type Media = {
	type: "image" | "video";
	src: string;
};

export type CollaboratorRole =
	| "Artists"
	| "Organizers"
	| "Preparation"
	| "Media"
	| "Technical Production";

export type Collaborator = {
	profile_id?: string;
	role?: CollaboratorRole;
	name?: string;
	username?: string;
	slug?: string;
};

export type Project = {
	slug: string;
	title: string;
	date: string;
	img: string;
	description: string;
	causeSection?: CauseSectionType;
	collaboratorsSection?: Collaborator[];
	recapSection?: Media[];
	sources?: Source[];
};
