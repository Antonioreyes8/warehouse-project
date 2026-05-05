"use client";
import { useEffect, useState } from 'react';
import { MaxHeap } from '@/lib/discovery/maxHeap';
import { QUESTIONS } from '@/lib/discovery/questions'; 
import styles from './result.module.css';

interface ExtendedScoredArtist {
  id: string;
  name: string;
  score: number;
  shared: string[];
}

const MOCK_ARTISTS = [
  { id: '1', name: 'Luna Vex', bio: 'Synth-pop producer with a dark edge.', hot_takes: { q1: true, q2: false, q3: true, q17: true, q21: true } },
  { id: '2', name: 'Marcus Stone', bio: 'Traditional oil painter focused on realism.', hot_takes: { q1: false, q10: true, q12: true, q14: true, q19: true } },
  { id: '3', name: 'DJ Void', bio: 'Experimental noise artist.', hot_takes: { q3: false, q4: false, q8: true, q15: true, q18: true } },
  { id: '4', name: 'Sora Kim', bio: 'Digital illustrator and concept designer.', hot_takes: { q1: true, q2: true, q6: true, q15: false, q16: true } },
  { id: '5', name: 'The Architect', bio: 'Minimalist techno producer.', hot_takes: { q4: true, q9: false, q11: true, q17: true, q20: false } }
];

export default function ResultPage() {
  const [topMatch, setTopMatch] = useState<ExtendedScoredArtist | null>(null);
  const [sharedBeliefs, setSharedBeliefs] = useState<string[]>([]);

  useEffect(() => {
    const rawAnswers = localStorage.getItem('user_answers');
    if (!rawAnswers) return;
    const userAnswers = JSON.parse(rawAnswers);

    const heap = new MaxHeap();
    
    MOCK_ARTISTS.forEach(artist => {
      let score = 0;
      let matches: string[] = []; 

      Object.entries(userAnswers).forEach(([qId, userVal]) => {
        const artistVal = artist.hot_takes[qId as keyof typeof artist.hot_takes];
        if (userVal !== null && userVal === artistVal) {
          score += 1;
          const questionObj = QUESTIONS.find(q => q.id === qId);
          if (questionObj) matches.push(questionObj.text);
        }
      });
      
      heap.insert({ id: artist.id, name: artist.name, score, shared: matches } as any);
    });

    const winner = heap.extractMax() as ExtendedScoredArtist | null;
    if (winner) {
      setTopMatch(winner);
      setSharedBeliefs(winner.shared.slice(0, 4));
    }
  }, []);

  if (!topMatch) return <div className={styles.loading}>Calculating your creative DNA...</div>;

  return (
    <div className={styles.container}>
      <main className={styles.contentArea}>
        
        <header className={styles.header}>
          <p className={styles.title}>You aligned with</p>
          <h1 className={styles.winnerName}>{topMatch.name}</h1>
        </header>

        <section className={styles.winnerCard}>
          <p className={styles.winnerBio}>
            {MOCK_ARTISTS.find(a => a.id === topMatch.id)?.bio}
          </p>
        </section>

        <section className={styles.beliefsSection}>
          <h3 className={styles.beliefsTitle}>Shared Perspectives</h3>
          <p className={styles.beliefsIntro}>Key areas where you and {topMatch.name} see eye-to-eye:</p>
          
          <ul className={styles.beliefsList}>
            {sharedBeliefs.map((text, index) => (
              <li key={index} className={styles.beliefItem}>
                <span className={styles.check}>✓</span> {text}
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.actions}>
          <button className={styles.profileBtn}>View Profile</button>
          <button 
            onClick={() => window.location.href='/discovery/quiz'} 
            className={styles.retryBtn}
          >
            Try Again
          </button>
        </footer>

      </main>
    </div>
  );
}