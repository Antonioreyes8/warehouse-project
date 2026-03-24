import { Media } from "./data";
import styles from "./[slug]/project.module.css";

export default function RecapSection({
  recapSection,
}: {
  recapSection?: Media[];
}) {
  return (
    <section className={styles.recapSection}>
      <h2>Recap</h2>

      {recapSection?.length ? (
        <div className={styles.recapGrid}>
          {recapSection.map((item, i) => (
            <div key={item.src} className={styles.recapItem}>
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={`Recap ${i + 1}`}
                  loading="lazy"
                />
              ) : (
                <video controls playsInline>
                  <source src={item.src} />
                </video>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No recap items yet.</p>
      )}
    </section>
  );
}