/**
 * File: app/FAQ/faqSection.tsx
 * Purpose: Provides categorized, quick answers to recurring community questions.
 */

import styles from "./faq.module.css";

// Data grouped by category for the sidebar and content mapping
const faqData = [
	{
		category: "General Rules",
		id: "general",
		items: [
			{
				q: "What exactly is The Diaspora Project?",
				a: "We are a community driven collective. We host events that bring together performative and stationary artists, media personnel, and the community. We hope our projects can not only move people but make an impact locally and globally by distributing resources back to the artists, charities and community.",
			},
			{
				q: "Are there age restrictions for your events?",
				a: "Most of our events are 21+. Age requirements will always be clearly stated before purchasing tickets.",
			},
			{
				q: "What is your policy on alcohol and outside substances?",
				a: "The possession, sale, or distribution of illegal substances is strictly prohibited. For alcohol, please refer to the specific event details to see if a bar is provided or if the venue is BYOB. Any irresponsible behavior will result in removal from the space.",
			},
			{
				q: "What will happen if I lose something at an event?",
				a: "We will do our best to help you find it. Please contact us as soon as possible with a description. At the Warehouse, we have cameras, but we cannot guarantee that we will be able to find your item. We encourage everyone to keep track of their belongings.",
			},
		],
	},
	{
		category: "Joining & Participation",
		id: "joining",
		items: [
			{
				q: "How can I participate in events?",
				a: "We have an application process for new members. We have a team who coordinates media, a team who organizes the entire event, a team who helps setup and clean the space the day after, and artists who can be both performative or stationary.  Please fill out the form linked in the footer to apply.",
			},
			{
				q: "What is expected of me as a member?",
				a: "All members share responsibility for maintaining a respectful, inclusive, and collaborative environment. Participation means actively contributing to a safe and supportive space.",
			},
			{
				q: "Can I sell or promote things here?",
				a: "No. Unauthorized commercial activity is not permitted within the space. We encourage networking and collaboration, but all sales and promotions must be conducted through approved channels.",
			},
		],
	},
	{
		category: "Media & Privacy",
		id: "media",
		items: [
			{
				q: "Will I be photographed or recorded?",
				a: "Yes. This is a public-facing environment where photography and video recording will occur. By participating, you acknowledge that your likeness may be captured.",
			},
			{
				q: "Can I request for images to be taken down?",
				a: "Yes. We will do our best to respect individual requests for privacy, but we cannot guarantee that individuals and 3rd parties will comply. We encourage guests keep in mind that this is a public-facing environment and to take precautions accordingly.",
			},
			{
				q: "How can I be part of the media team?",
				a: "We have an application process for anyone interested in joining the media team. Please fill out the form linked in the footer to apply.",
			},
			{
				q: "Can I bring recording equipment without being on the media team?",
				a: "Yes. Anyone can bring equipment to record or photograph currently, but the media team members will have access to the projects collaborative Google drive, have more opportunities to network and meet others, and will be informed on setup and flow for the event. We encourage anyone interested in recording to apply to be on the media team.",
			},
		],
	},
	{
		category: "Ticketing",
		id: "ticketing",
		items: [
			{
				q: "Where does the money from ticket sales go?",
				a: "We try to pay off anything we invested into the event first, and then then we split the rest between everyone involved in the event and the charity we choose to support for that project. We want to be as transparent as possible, so we will share the financial breakdown for each event on our website.",
			},
			{
				q: "I want to go to an event but I can't get a ticket, what should I do?",
				a: "DM us on Instagram or contact us and we will do our best. We want everyone to be able to attend.",
			},
			{
				q: "If I can't attend, can I transfer my ticket to someone else?",
				a: "Yes. we make sure each ticket is scanned at the door, so as long as the ticket is valid and has not been used, you can transfer it to someone else. Just make sure to let us know if you do so we can update our records.",
			},
		],
	},
	{
		category: "Safety & Conduct",
		id: "safety",
		items: [
			{
				q: "How do you ensure the safety of everyone at your events?",
				a: "We will consistently post reminders about conduct during out events. Our community members will be prompted to maintain communication during the event. Use all tools as intended, respect designated areas, and follow community flow to maintain a safe and clean environment.",
			},
			{
				q: "Will there be designated smoking areas?",
				a: "Yes. Smoking is only allowed in designated areas. Please ask an organizer for more information on smoking areas. Please be mindful of others and dispose of cigarette waste properly.",
			},
			{
				q: "What happens if guidelines are violated?",
				a: "Violations may result in removal from the space. Severe or repeated issues can lead to permanent bans. Please report any concerns to our team immediately so we can address them promptly and maintain a safe environment for everyone. We take all reports seriously and will do our best to handle them with care and discretion.",
			},
		],
	},
];

export default function FAQSection() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h1 className={styles.mainTitle}>Community FAQ</h1>

				<div className={styles.layout}>
					{/* Sticky Sidebar Navigation */}
					<nav className={styles.sidebar}>
						<h3 className={styles.sidebarTitle}>Jump to section</h3>
						{faqData.map((group) => (
							<a
								key={group.id}
								href={`#${group.id}`}
								className={styles.navLink}
							>
								{group.category}
							</a>
						))}
					</nav>

					{/* Main Content Area */}
					<div className={styles.content}>
						{faqData.map((group) => (
							<div
								key={group.id}
								id={group.id}
								className={styles.categoryBlock}
							>
								<h2 className={styles.categoryTitle}>{group.category}</h2>

								{group.items.map((faq, index) => (
									<article key={index} className={styles.faqCard}>
										<h3 className={styles.question}>{faq.q}</h3>
										<p className={styles.answer}>{faq.a}</p>
									</article>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
