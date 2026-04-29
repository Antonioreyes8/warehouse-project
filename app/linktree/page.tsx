/**
 * File: app/linktree/page.tsx
 * Purpose: Provides a curated link hub for project information, forms, and social channels.
 * Responsibilities:
 *   - Render categorized internal and external links
 *   - Offer one-click sharing via clipboard
 *   - Keep link updates centralized in typed arrays
 * Key Concepts:
 *   - Client component for clipboard and alert interactions
 *   - Typed link configuration with icon metadata
 * Dependencies:
 *   - FontAwesome icons
 *   - linktree.module.css styles
 * How It Fits:
 *   - Acts as a lightweight navigation hub optimized for mobile and social distribution
 */

"use client";

import styles from "./linktree.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
// import { faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"; // Example for future additions
import {
    faPaperPlane,
    faHeart,
    faQuestion,
    faCircleExclamation,
    faStar,
    faCrown,
    faCoins,
} from "@fortawesome/free-solid-svg-icons";

type LinkItem = {
    title: string;
    url: string;
    icon: IconProp;
};

const aboutLinks: LinkItem[] = [
    { title: "Manifesto", url: "/manifesto", icon: faHeart },
    { title: "Community Guidelines", url: "/guidelines", icon: faCrown },
    { title: "Financial Breakdown", url: "/financial", icon: faCoins },
    { title: "FAQ", url: "/FAQ", icon: faQuestion },
];

const contactLinks: LinkItem[] = [
    {
        title: "Application to join",
        url: "https://docs.google.com/forms/d/...",
        icon: faStar,
    },
    {
        title: "Tip line",
        url: "https://docs.google.com/forms/d/...",
        icon: faCircleExclamation,
    },
];

const socialLinks: LinkItem[] = [
    {
        title: "Instagram",
        url: "https://www.instagram.com/diaspora.sound",
        icon: faInstagram,
    },
    // Add future socials here
];

export default function LinksPage() {
    const handleShare = (url: string) => {
        const fullUrl = url.startsWith("http") ? url : window.location.origin + url;
        navigator.clipboard.writeText(fullUrl);
        alert("Link copied!");
    };

    const renderLinks = (links: LinkItem[]) =>
        links.map((link, i) => (
            <div key={i} className={styles.linkRow}>
                <a href={link.url} className={styles.link}>
                    <span className={styles.icon}>
                        <FontAwesomeIcon icon={link.icon} />
                    </span>
                    <span className={styles.text}>{link.title}</span>
                </a>
                <button className={styles.share} onClick={() => handleShare(link.url)}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        ));

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>LinkTree</h1>

                {/* Social Icons Section */}
                <div className={styles.socialHeader}>
                    {socialLinks.map((social, i) => (
                        <a 
                            key={i} 
                            href={social.url} 
                            className={styles.socialIcon} 
                            title={social.title}
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={social.icon} />
                        </a>
                    ))}
                </div>

                <p className={styles.subtitle}>About</p>
                <div className={styles.links}>{renderLinks(aboutLinks)}</div>

                <p className={styles.subtitle}>Forms</p>
                <div className={styles.links}>{renderLinks(contactLinks)}</div>
            </div>
        </div>
    );
}