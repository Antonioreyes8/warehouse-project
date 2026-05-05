"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/discovery/questions';
import styles from './quiz.module.css';

export default function QuizPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const router = useRouter();

  const handleAnswer = (value: boolean | null) => {
    const qId = QUESTIONS[currentStep].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('user_answers', JSON.stringify(newAnswers));
      router.push('/discovery/quiz/result');
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  // INITIAL "GET STARTED" VIEW
  if (!isStarted) {
    return (
      <div className={styles.container}>
        <main className={styles.contentArea}>
          <header className={styles.header}>
            <p className={styles.count}>Creative DNA</p>
            <h1 className={styles.heroTitle}>Let’s play <br /> 21 Questions.</h1>
          </header>
          <p className={styles.description}>
            Answer honestly to discover your creative alignment 
            and match with an artist who sees the world the way you do.
          </p>
          <button 
            onClick={() => setIsStarted(true)} 
            className={styles.agreeBtn}
            style={{ marginTop: '20px' }}
          >
            Get Started
          </button>
        </main>
      </div>
    );
  }

  // ACTIVE QUIZ VIEW
  return (
    <div className={styles.container}>
      <main className={styles.contentArea}>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <header className={styles.header}>
          <span className={styles.count}>
            Question {currentStep + 1} / {QUESTIONS.length}
          </span>
          <h2 className={styles.questionText}>
            {QUESTIONS[currentStep].text}
          </h2>
        </header>
        
        <div className={styles.buttonGroup}>
          <button onClick={() => handleAnswer(true)} className={styles.agreeBtn}>
            I Agree
          </button>
          <button onClick={() => handleAnswer(false)} className={styles.disagreeBtn}>
            Disagree
          </button>
          <button onClick={() => handleAnswer(null)} className={styles.skipBtn}>
            Skip this question
          </button>
        </div>

      </main>
    </div>
  );
}