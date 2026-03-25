import styles from "./project.module.css";

// Define Source type
export type Source = {
  title: string;
  url: string;
};

// Define CauseSection type with optional sources
export type CauseSectionType = {
  text: string;
  sources?: Source[];
};

// Component receives only causeSection prop
export default function CauseSection({
  causeSection,
}: {
  causeSection?: CauseSectionType;
}) {
  if (!causeSection) return null;

  return (
    <section className={styles.causeSection}>
      <h2>The Cause</h2>

      {/* Split text into paragraphs */}
      {causeSection.text.split("\n\n").map((p, i) => (
        <p key={i} style={{ marginBottom: "16px" }}>
          {p}
        </p>
      ))}

      {/* Render sources if any */}
      {causeSection.sources && causeSection.sources.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3>Sources</h3>
          <ul>
            {causeSection.sources.map((source: Source, i: number) => (
              <li key={i}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}