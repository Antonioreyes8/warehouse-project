import AboutSection from "../aboutSection";
import { getArtistByUsername } from "../../../lib/getArtists";

interface ArtistPageProps {
	params: Promise<{ slug: string }> | { slug: string };
}

export default async function ArtistPage(props: ArtistPageProps) {
	const { params } = props;
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;
	const profile = await getArtistByUsername(slug.trim());

	if (!profile) {
		return <div>This artist hasn’t created their page yet.</div>;
	}

	return <AboutSection profile={profile} />;
}
