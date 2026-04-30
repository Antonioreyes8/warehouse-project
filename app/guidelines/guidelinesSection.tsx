/**
 * File: app/guidelines/guidelinesSection.tsx
 * Purpose: Renders the complete governance and conduct framework for the community.
 */

import styles from "./guidelines.module.css";

export default function GuidelinesSection() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h1 className={styles.mainTitle}>Community Guidelines</h1>

				<div className={styles.basic_content}>
					{/* Article I */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article I. Our Mission & Shared Responsibility
						</h3>
						<p className={styles.text}>
							The Diaspora Project's community shares its commitment to offering
							a safe space for its performers, organizers, and audience. By
							choosing to attend any events you must actively take on the
							responsiblity of upholding the values of this community and by
							respecting others and the space itself.
						</p>
					</article>

					<br />

					{/* Article II */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article II. Media, Privacy & Public Visibility
						</h3>
						<p className={styles.text}>
							The nature of this community involves the documentation and
							celebration of our collective work.
						</p>

						<h4 className={styles.subHeader}>Public Environment:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							This space is a public-facing environment. By entering and
							participating at events, members acknowledge that they may be
							actively photographed and filmed, and that their likeness may be
							captured. Active collaboration is encouraged with the primary goal
							to facilitate cross-disciplanary newtworking and portfolio
							building.
						</p>

						<h4 className={styles.subHeader}>Privacy:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							For content published via official organization accounts, the
							leadership will take reasonable precautions and will consider
							requests for privacy on a case-by-case basis. However, the
							organization does not assume liability for the actions of third
							parties or individual members.
						</p>
					</article>

					<br />

					{/* Article III */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article III. Stewardship of Space & Resources
						</h3>
						<p className={styles.text}>
							To ensure the longevity of our facilities, members must adhere to
							the following:
						</p>

						<h4 className={styles.subHeader}>Equipment Integrity:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							All tools, technology, and hardware must be used solely for their
							intended purposes. Destruction, negligent misuse, or unauthorized
							modification of equipment will not be tolerated.
						</p>

						<h4 className={styles.subHeader}>Zonal Respect:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							Dedicated areas are optimized for specific activities. Members
							must respect the boundaries of these zones to ensure the safety
							and functionality of the space for all.
						</p>

						<h4 className={styles.subHeader}>Operational Flow:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							To provide the best experience for all, members must follow the
							established flow of events and activities. This includes adhering
							to scheduled times and respecting the structure of events as
							outlined.
						</p>
					</article>

					<br />

					{/* Article IV */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article IV. Commitment to Safety & Inclusion
						</h3>
						<p className={styles.text}>
							We are a community that actively prioritizes the safety, dignity,
							and equity of women, LGBTQ+ individuals, immigrants, and working
							class artists. We are committed to fostering an environment where
							all members feel empowered to express themselves without fear of
							discrimination or marginalization.
						</p>

						<h4 className={styles.subHeader}>Zero-Tolerance Policy:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							Harassment, discrimination, intimidation, or the intentional
							exclusion of any member based on identity or background is a
							fundamental breach of this contract. We expect all interactions to
							be rooted in professional courtesy and radical respect.
						</p>
					</article>

					<br />

					{/* Article V */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article V. Governance and Structural Authority
						</h3>
						<p className={styles.text}>
							The sustainability of our community relies on respect for its
							leadership and operational structure.
						</p>

						<h4 className={styles.subHeader}>Facilitator Authority:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							Organizers and facilitators are the designated leads for safety
							and scheduling. Their instructions regarding the use of the space
							must be followed immediately and without exception. Decisions made
							by leadership regarding the protection of the community are final.
						</p>
					</article>

					<br />

					{/* Article VI */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article VI. Prohibited Use and Legal Compliance
						</h3>
						<p className={styles.text}>
							The space exists for the advancement of our community’s core
							mission.
						</p>

						<h4 className={styles.subHeader}>Authorized Use Only:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							The exploitation, manipulation, or misrepresentation of the space
							for personal gain outside of its intended purpose is prohibited.
						</p>

						<h4 className={styles.subHeader}>Illegal Activity:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							The possession, sale, or distribution of illegal substances and
							any engagement in illegal activities are strictly prohibited.
						</p>
					</article>

					<br />

					{/* Article VII */}
					<article className={styles.articleBox}>
						<h3 className={styles.articleHeader}>
							Article VII. Accountability and Enforcement
						</h3>
						<p className={styles.text}>
							We hold our members to a high standard of conduct.
						</p>

						<h4 className={styles.subHeader}>Corrective Action:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							Any individual found in violation of these guidelines may be asked
							to vacate the space immediately.
						</p>

						<h4 className={styles.subHeader}>Permanent Removal:</h4>
						<p className={`${styles.text} ${styles.indented}`}>
							Repeated or severe violations will result in the permanent ban
							from all future events and community platforms.
						</p>
					</article>
				</div>
			</div>
		</section>
	);
}
