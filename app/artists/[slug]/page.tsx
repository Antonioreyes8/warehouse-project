/**
 * File: app/artists/[slug]/page.tsx
 */

import AboutSection from "../aboutSection";
import Image from "next/image";
import pageStyles from "../page-layout.module.css";
import worksStyles from "../works-section.module.css";
import emptyStateStyles from "../empty-state.module.css";
import {
    getArtistByUsername,
    getArtistWorksByProfileId,
} from "../../../lib/artists/queries";

interface ArtistPageProps {
    params: Promise<{ slug: string }> | { slug: string };
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

export default async function ArtistPage(props: ArtistPageProps) {
    const { params } = props;
    const resolvedParams = params instanceof Promise ? await params : params;
    const { slug } = resolvedParams;
    const profile = await getArtistByUsername(slug.trim());

    if (!profile) {
        return (
            <div className={emptyStateStyles.emptyStateWrap}>
                <section className={emptyStateStyles.emptyStateCard}>
                    <p className={emptyStateStyles.emptyStateEyebrow}>Artist Profile</p>
                    <h1 className={emptyStateStyles.emptyStateTitle}>
                        Page not set up yet
                    </h1>
                    <p className={emptyStateStyles.emptyStateText}>
                        This artist has not created their public page yet. Check back later
                        for updates.
                    </p>
                </section>
            </div>
        );
    }

    const works = await getArtistWorksByProfileId(profile.id);
    const visibleWorks = works.filter(
        (work) =>
            hasText(work.image_url) ||
            hasText(work.title) ||
            hasText(work.description),
    );

    return (
        <div className={pageStyles.artistPage}>
            <AboutSection profile={profile} works={[]} />
            {visibleWorks.length > 0 && (
                <section className={worksStyles.worksSection}>
                    <h2 className={worksStyles.workHeading}>Works</h2>
                    {/* Added instruction text to match project guidance patterns */}
                    <p className={worksStyles.instruction}>Select an image to check out the work</p>
                    
                    <div className={worksStyles.workList}>
                        {visibleWorks.map((work) => {
                            const workLinkUrl = normalizeExternalUrl(work.link_url);

                            return (
                                <div className={worksStyles.workSection} key={work.id}>
                                    <div className={worksStyles.workInner}>
                                        <div className={worksStyles.workArtwork}>
                                            {work.image_url ? (
                                                workLinkUrl ? (
                                                    <a
                                                        href={workLinkUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={worksStyles.workImageLink}
                                                    >
                                                        <Image
                                                            src={work.image_url}
                                                            alt={`${profile.name} featured work`}
                                                            width={320}
                                                            height={320}
                                                            className={worksStyles.workImage}
                                                        />
                                                    </a>
                                                ) : (
                                                    <Image
                                                        src={work.image_url}
                                                        alt={`${profile.name} featured work`}
                                                        width={320}
                                                        height={320}
                                                        className={worksStyles.workImage}
                                                    />
                                                )
                                            ) : null}
                                        </div>
                                        <div className={worksStyles.workCopy}>
                                            <div className={worksStyles.workRow}>
                                                <h3>Title:</h3>
                                                <p>{work.title || "Untitled"}</p>
                                            </div>{" "}
                                            {hasText(work.medium) && (
                                                <div className={worksStyles.workRow}>
                                                    <h3>Medium:</h3>
                                                    <p>{work.medium}</p>
                                                </div>
                                            )}{" "}
                                            <div className={worksStyles.workRow}>
                                                <h3>Description:</h3>
                                                <p>
                                                    {hasText(work.description) ? work.description : "—"}
                                                </p>
                                            </div>
                                            {workLinkUrl && (
                                                <a
                                                    href={workLinkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={worksStyles.workLink}
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
            )}
        </div>
    );
}