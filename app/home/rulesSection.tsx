import Image from "next/image";
import styles from "./home.module.css"; // 1. Import your module

export default function RulesSection() {
    return (
        <section className={styles.rules_section}>
            <div className={styles.rules_left}>
                <Image
                    src="https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/party.gif"
                    alt="Party"
                    width={700}
                    height={400}
                    style={{ height: "auto" }} // Keeps it responsive
                    unoptimized
                />
            </div>

            <div className={styles.rules_right}>
                <h2>BEFORE YOU COME</h2>
                <ol className={styles.rules_list}>
                    <li>Be open to unfamiliar art</li>
                    <li>Respect everybody</li>
                    <li>Dress to express yourself</li>
                    <li>You may be recorded</li>
                    <li>Dance your heart out</li>
                </ol>
            </div>
        </section>
    );
}