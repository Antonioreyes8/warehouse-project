import { supabase } from "./supabaseClient";

export type Artist = {
	id: string;
	name: string;
	username: string;
	bio: string | null;
	avatar_url: string | null;
	instagram?: string | null;
};

export async function getArtistByUsername(
	username: string,
): Promise<Artist | null> {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", username)
		.maybeSingle();

	if (error) {
		console.error("Error fetching artist:", error);
		return null;
	}

	return data;
}
