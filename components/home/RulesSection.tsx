import Image from "next/image";

export default function RulesSection() {
	return (
		<section className="rules_section">
			<div className="rules_left">
				<Image
					src="https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/party.gif"
					alt="Party"
					width={600}
					height={400}
					style={{height: "auto" }}
					unoptimized
				/>
			</div>

			<div className="rules_right">
				<h2>Read before you come</h2>
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
