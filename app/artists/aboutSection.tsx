/**
 * File: app/artists/aboutSection.tsx
 * Purpose: Renders the artist profile section with bio, info, and links.
 * Responsibilities:
 *   - Display artist avatar, name, username
 *   - Show personal info in columns
 *   - Render bio and social links
 * Key Concepts:
 *   - React component with props
 *   - Next.js Image component for optimization
 *   - CSS Modules for styling
 * Dependencies:
 *   - Artist type, styles from about-section.module.css
 * How It Fits:
 *   - Used in artist pages to display profile information
 */

import { Artist, type ArtistWork } from "../../lib/artists/queries";
import styles from "./about-section.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faYoutube,
    faPatreon,
    faFacebook,
    faTiktok,
    faEtsy,
    faSoundcloud,
    faBandcamp,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface AboutSectionProps {
    profile: Artist;
    works: ArtistWork[];
}

// --- HELPERS ---

/**
 * Standardizes social media URLs.
 * Handles: 
 * 1. Accidental double prefixes (https://instgram.com/https://...)
 * 2. Bare handles (myusername -> https://site.com/myusername)
 * 3. Existing full links
 */
function normalizeSocialUrl(value: string | null | undefined, domain: string): string | null {
    if (!value || !value.trim()) return null;
    
    let input = value.trim();

    // Fix double-prefixing issue (e.g., https://site.com/https://site.com/user)
    if (input.includes(`${domain}/http`)) {
        input = input.split(`${domain}/`).pop() || input;
    }

    // If it's already a full URL, return it
    if (input.startsWith("http")) return input;

    // Remove '@' if user included it in a handle
    const cleanHandle = input.startsWith("@") ? input.slice(1) : input;

    // Construct the correct URL
    return `https://www.${domain}/${cleanHandle}`;
}

function calculateAgeFromBirthday(birthday: string | null | undefined): string | null {
    if (!birthday) return null;
    const birth = new Date(birthday);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }
    return age >= 0 ? String(age) : null;
}

function hasText(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
}

function normalizeExternalUrl(value?: string | null): string | null {
    if (!value?.trim()) return null;
    const trimmedValue = value.trim();
    return trimmedValue.startsWith("http") ? trimmedValue : `https://${trimmedValue}`;
}

// --- COMPONENT ---

export default function AboutSection({ profile, works }: AboutSectionProps) {
    const age = calculateAgeFromBirthday(profile.birthday);
    const hasBasedIn = hasText(profile.based_in);
    const hasMediums = hasText(profile.mediums);
    const hasPastProjects = hasText(profile.past_projects);
    const hasEthnicBackground = hasText(profile.ethnic_background);
    const hasContact = hasText(profile.contact);
    const hasStatus = hasText(profile.status);
    const hasMemberSince = hasText(profile.member_since);
    
    const visibleWorks = works.filter(
        (work) => hasText(work.image_url) || hasText(work.title) || hasText(work.description),
    );

    const hasLeftColumn = Boolean(age || hasBasedIn || hasMediums || hasPastProjects);
    const hasRightColumn = Boolean(hasEthnicBackground || hasContact || hasStatus || hasMemberSince);
    const hasAnyInfo = hasLeftColumn || hasRightColumn;

    return (
        <section className={styles.aboutSection}>
            <div className={styles.headerContainer}>
                {profile.avatar_url && (
                    <Image src={profile.avatar_url} alt={profile.name || "Artist"} width={100} height={100} className={styles.avatar} />
                )}
                <h2>{profile.name}</h2>
                <p>@{profile.username}</p>
            </div>

            <div className={styles.infoAndLinksContainer}>
                {hasAnyInfo && (
                    <div className={styles.infoContainer}>
                        {hasLeftColumn && (
                            <div className={`${styles.leftColumn} ${!hasRightColumn ? styles.singleColumn : ""}`}>
                                {age && <div className={styles.infoRow}><h3>Age:</h3><p>{age}</p></div>}
                                {hasBasedIn && <div className={styles.infoRow}><h3>Based in:</h3><p>{profile.based_in}</p></div>}
                                {hasMediums && <div className={styles.infoRow}><h3>Mediums:</h3><p>{profile.mediums}</p></div>}
                                {hasPastProjects && <div className={styles.infoRow}><h3>Past Projects:</h3><p>{profile.past_projects}</p></div>}
                            </div>
                        )}
                        {hasRightColumn && (
                            <div className={styles.rightColumn}>
                                {hasEthnicBackground && <div className={styles.infoRow}><h3>Ethnic background:</h3><p>{profile.ethnic_background}</p></div>}
                                {hasContact && <div className={styles.infoRow}><h3>Contact:</h3><p>{profile.contact}</p></div>}
                                {hasStatus && <div className={styles.infoRow}><h3>Status:</h3><p>{profile.status}</p></div>}
                                {hasMemberSince && <div className={styles.infoRow}><h3>Member since:</h3><p>{profile.member_since}</p></div>}
                            </div>
                        )}
                    </div>
                )}
                {hasText(profile.bio) && (
                    <div className={styles.bioContainer}>
                        <h3>Bio:</h3>
                        <p>{profile.bio}</p>
                    </div>
                )}
            </div>

            {/* SOCIAL LINKS SECTION - Fixed and Normalized */}
            <div className={styles.linksContainer}>
                {[
                    { val: profile.instagram, dom: "instagram.com", icon: faInstagram },
                    { val: profile.youtube, dom: "youtube.com", icon: faYoutube },
                    { val: profile.patreon, dom: "patreon.com", icon: faPatreon },
                    { val: profile.facebook, dom: "facebook.com", icon: faFacebook },
                    { val: profile.tik_tok, dom: "tiktok.com", icon: faTiktok },
                    { val: profile.etsy, dom: "etsy.com", icon: faEtsy },
                    { val: profile.soundcloud, dom: "soundcloud.com", icon: faSoundcloud },
                    { val: profile.bandcamp, dom: "bandcamp.com", icon: faBandcamp },
                ].map((social, i) => {
                    const url = normalizeSocialUrl(social.val, social.dom);
                    return url ? (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <FontAwesomeIcon icon={social.icon} size="4x" />
                        </a>
                    ) : null;
                })}
                
                {profile.personal_website && (
                    <a href={normalizeExternalUrl(profile.personal_website)!} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        <FontAwesomeIcon icon={faGlobe} size="4x" />
                    </a>
                )}
            </div>

            {/* FEATURED WORKS LIST */}
            {visibleWorks.length > 0 && (
                <div className={styles.workList}>
                    {visibleWorks.map((work) => {
                        const workLinkUrl = normalizeExternalUrl(work.link_url);
                        return (
                            <div className={styles.workSection} key={work.id}>
                                <div className={styles.workArtwork}>
                                    {work.image_url && (
                                        workLinkUrl ? (
                                            <a href={workLinkUrl} target="_blank" rel="noopener noreferrer" className={styles.workImageLink}>
                                                <Image src={work.image_url} alt={work.title || "Work"} width={320} height={320} className={styles.workImage} />
                                            </a>
                                        ) : (
                                            <Image src={work.image_url} alt={work.title || "Work"} width={320} height={320} className={styles.workImage} />
                                        )
                                    )}
                                </div>
                                <div className={styles.workCopy}>
                                    <h3>{work.title || "Featured Work"}</h3>
                                    {hasText(work.description) && <p>{work.description}</p>}
                                    {workLinkUrl && (
                                        <a href={workLinkUrl} target="_blank" rel="noopener noreferrer" className={styles.workLink}>
                                            View Work
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}