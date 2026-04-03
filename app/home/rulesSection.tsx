import Image from "next/image";
import styles from "./home.module.css";

export default function RulesSection() {
	return (
		<section className={styles.rules_section}>
			<div className={styles.rules_media}>
				<Image
					src="https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/party.gif"
					alt="Party"
					width={700}
					height={400}
					style={{ height: "auto", width: "100%" }}
					unoptimized
				/>

				<div className={styles.rules_overlay}>
					<h3>BEFORE YOU COME</h3>
					<ol className={styles.rules_list}>
						<li>Be open to unfamiliar art</li>
						<li>Respect everybody</li>
						<li>Dress to express yourself</li>
						<li>You may be recorded</li>
						<li>Dance your heart out</li>
					</ol>
				</div>
			</div>
		</section>
	);
}
