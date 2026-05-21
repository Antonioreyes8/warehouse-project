import React from 'react';
import styles from "./manifesto.module.css";
// Import our newly created specialized text layout system sub-component
import InteractiveCanvas from "@/lib/manifesto/interactiveCanvas";

export default function ManifestoSection() {
    return (
        <section className={styles.section}>
            {/* Background Layers — Kept completely pristine from your original design setup */}
            <div className={styles.aura}></div>
            <div className={styles.watermark}>Manifesto</div>

            {/* Foreground: Full-width Glass Canvas Container Wrapper */}
            <div className={styles.glassCanvas}>
                {/* Centered Reading Column Layout */}
                <div className={styles.textContent}>
                    {/* Native semantic HTML header stays in place for SEO mapping */}
                    <h1 className={styles.mainTitle}>Our Manifesto</h1>

                    {/* We swap the hardcoded, static <p> typography tags with the new component.
                      The interactive canvas engine parses and styles your paragraphs, rendering 
                      movable celestial star nodes that fluidly warp your text configurations in real time.
                    */}
                    <InteractiveCanvas />
                </div>
            </div>
        </section>
    );
}