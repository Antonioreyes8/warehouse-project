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
                q: "What is expected of me as a member?",
                a: "All members share responsibility for maintaining a respectful, inclusive, and collaborative environment. Participation means actively contributing to a safe and supportive space."
            },
            {
                q: "Can I sell or promote things here?",
                a: "No. Unauthorized commercial activity is not permitted within the space."
            }
        ]
    },
    {
        category: "Media & Privacy",
        id: "media",
        items: [
            {
                q: "Will I be photographed or recorded?",
                a: "Yes. This is a public-facing environment where photography and video recording may occur. By participating, you acknowledge that your likeness may be captured."
            },
            {
                q: "How is media used in the community?",
                a: "Media is used to celebrate work, support collaboration, and help members build professional portfolios."
            },
            {
                q: "Can I request privacy?",
                a: "Yes. Members are expected to respect privacy requests, especially in sensitive or focused settings. Communicate your preferences clearly."
            },
            {
                q: "Who is responsible for consent in media?",
                a: "Leadership takes reasonable steps for official content, but individual members are responsible for their own media practices."
            }
        ]
    },
    {
        category: "Safety & Conduct",
        id: "safety",
        items: [
            {
                q: "How should I treat equipment and space?",
                a: "Use all tools as intended, respect designated areas, and follow community flow to maintain a safe and efficient environment."
            },
            {
                q: "What behavior is not tolerated?",
                a: "Harassment, discrimination, intimidation, or exclusion of any kind is strictly prohibited. We enforce a zero-tolerance policy."
            },
            {
                q: "Who do I follow during events?",
                a: "Organizers and facilitators oversee safety and operations. Their instructions must be followed at all times."
            },
            {
                q: "What happens if guidelines are violated?",
                a: "Violations may result in removal from the space. Severe or repeated issues can lead to permanent bans."
            }
        ]
    }
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
                            <div key={group.id} id={group.id} className={styles.categoryBlock}>
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