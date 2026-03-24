import styles from "./[slug]/project.module.css";

export default function CauseSection({
  causeSection,
}: {
  causeSection?: { text: string };
}) {
  if (!causeSection) return null;

  return (
    <section className={styles.causeSection}>
      <h2>The Cause</h2>
      <p>{causeSection.text}</p>
    </section>
  );
}