import { supabase } from "@/lib/supabaseClient";
import { Media } from "@/app/projects/data";

export async function getProjectMedia(slug: string): Promise<Media[]> {
  const { data, error } = await supabase.storage
    .from("projects")       // bucket name
    .list(slug, {           // folder = project slug
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    console.error("Supabase error fetching recap images:", error);
    return [];
  }

  return data.map((file) => ({
    type: file.name.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
    src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${slug}/${file.name}`,
  }));
}