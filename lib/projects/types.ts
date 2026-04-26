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
	name: string;
	role?: CollaboratorRole;
	slug?: string;
	username?: string;
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
