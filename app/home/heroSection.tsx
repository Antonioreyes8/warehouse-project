import Image from "next/image";
import styles from "./home.module.css";

export default function HeroSection() {
	return (
		<section className={styles.heroSection}>
			<div className={styles.heroMedia}>
				<div className={styles.heroBackground}>
					<Image
						src="https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/party.gif"
						alt="Party"
						fill
						className={styles.heroImage}
						sizes="100vw"
						unoptimized
					/>
				</div>
			</div>
		</section>
	);
}
