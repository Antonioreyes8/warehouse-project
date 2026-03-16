import Image from "next/image";

export default function RulesSection() {
	const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

	return (
		<section className="rules_section">
			<div className="rules_left">
				<Image
					src={`${baseUrl}/storage/v1/object/public/posters/party.gif`}
					alt="Party"
					width={600} // intrinsic width
					height={400} // intrinsic height
					style={{height: "auto" }} // scales automatically
					unoptimized
				/>
			</div>
			<div className="rules_right">
				<h2>Rules</h2>
				<ol>
					<li>Come for the music</li>
					<li>Be open to unfamiliar art</li>
					<li>Respect everybody</li>
					<li>Dress to express yourself</li>
					<li>Dance your heart out</li>
				</ol>
			</div>
		</section>
	);
}
