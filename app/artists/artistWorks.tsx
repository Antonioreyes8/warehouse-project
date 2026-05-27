import Image from "next/image";
import { Artist, ArtistWork } from "../../lib/artists/queries";
import styles from "./works-section.module.css";

interface ArtistWorksProps {
	profile: Artist;
	works: ArtistWork[];
}

function hasText(value: string | null | undefined): boolean {
	return Boolean(value?.trim());
}

function normalizeExternalUrl(value?: string | null): string | null {
	if (!value?.trim()) return null;

	const trimmedValue = value.trim();
	return trimmedValue.startsWith("http://") ||
		trimmedValue.startsWith("https://")
		? trimmedValue
		: `https://${trimmedValue}`;
}

export default function ArtistWorks({ profile, works }: ArtistWorksProps) {
	if (!works.length) return null;

	return (
		<section className={styles.worksSection}>
			<h2 className={styles.workHeading}>Works</h2>
			<p className={styles.instruction}>
				Select an image to check out the work
			</p>
			<div className={styles.workList}>
				{works.map((work) => {
					const workLinkUrl = normalizeExternalUrl(work.link_url);
					return (
						<div className={styles.workSection} key={work.id}>
							<div className={styles.workInner}>
								<div className={styles.workArtwork}>
									{work.image_url &&
										(workLinkUrl ? (
											<a
												href={workLinkUrl}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.workImageLink}
											>
												<Image
													src={work.image_url}
													alt={work.title || `${profile.name} featured work`}
													width={320}
													height={320}
													className={styles.workImage}
												/>
											</a>
										) : (
											<Image
												src={work.image_url}
												alt={work.title || `${profile.name} featured work`}
												width={320}
												height={320}
												className={styles.workImage}
											/>
										))}
								</div>
								<div className={styles.workCopy}>
									<div className={styles.workRow}>
										<h3>Title:</h3>
										<p>{work.title || "Untitled"}</p>
									</div>
									{hasText(work.medium) && (
										<div className={styles.workRow}>
											<h3>Medium:</h3>
											<p>{work.medium}</p>
										</div>
									)}
									<div className={styles.workRow}>
										<h3>Description:</h3>
										<p>{hasText(work.description) ? work.description : "—"}</p>
									</div>
									{workLinkUrl && (
										<a
											href={workLinkUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.workLink}
										>
											View Work
										</a>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
