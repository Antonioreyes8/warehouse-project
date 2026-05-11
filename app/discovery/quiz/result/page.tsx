"use client";
import { useState } from "react";
import { MaxHeap } from "@/lib/discovery/maxHeap";
import { QUESTIONS } from "@/lib/discovery/questions";
import styles from "./result.module.css";

interface ExtendedScoredArtist {
	id: string;
	name: string;
	score: number;
	shared: string[];
}

const MOCK_ARTISTS = [
	{
		id: "1",
		name: "Luna Vex",
		bio: "Synth-pop producer with a dark edge.",
		hot_takes: { q1: true, q2: false, q3: true, q17: true, q21: true },
	},
	{
		id: "2",
		name: "Marcus Stone",
		bio: "Traditional oil painter focused on realism.",
		hot_takes: { q1: false, q10: true, q12: true, q14: true, q19: true },
	},
	{
		id: "3",
		name: "DJ Void",
		bio: "Experimental noise artist.",
		hot_takes: { q3: false, q4: false, q8: true, q15: true, q18: true },
	},
	{
		id: "4",
		name: "Sora Kim",
		bio: "Digital illustrator and concept designer.",
		hot_takes: { q1: true, q2: true, q6: true, q15: false, q16: true },
	},
	{
		id: "5",
		name: "The Architect",
		bio: "Minimalist techno producer.",
		hot_takes: { q4: true, q9: false, q11: true, q17: true, q20: false },
	},
	{
		id: "6",
		name: "Zara Bloom",
		bio: "Botanical painter exploring nature and sustainability.",
		hot_takes: { q1: true, q5: true, q7: true, q14: false, q19: true },
	},
	{
		id: "7",
		name: "Kai Rivera",
		bio: "Street artist and muralist with political messages.",
		hot_takes: { q2: true, q4: true, q8: false, q13: true, q18: true },
	},
	{
		id: "8",
		name: "Nova Chen",
		bio: "Ambient composer and sound designer.",
		hot_takes: { q3: true, q9: true, q11: false, q15: true, q20: true },
	},
	{
		id: "9",
		name: "Jasper Stone",
		bio: "Sculptor working with recycled materials.",
		hot_takes: { q1: false, q5: false, q10: true, q16: true, q21: false },
	},
	{
		id: "10",
		name: "Indie Quinn",
		bio: "DIY musician and experimental artist.",
		hot_takes: { q2: false, q3: false, q6: false, q17: true, q19: false },
	},
];

export default function ResultPage() {
	const [showDebug, setShowDebug] = useState(false);

	const result = (() => {
		if (typeof window === "undefined") {
			return {
				topMatch: null,
				runnerUps: [] as ExtendedScoredArtist[],
				sharedBeliefs: [] as string[],
				debugInfo: "",
			};
		}

		const rawAnswers = localStorage.getItem("user_answers");
		if (!rawAnswers) {
			return {
				topMatch: null,
				runnerUps: [] as ExtendedScoredArtist[],
				sharedBeliefs: [] as string[],
				debugInfo: "",
			};
		}

		const userAnswers = JSON.parse(rawAnswers) as Record<string, boolean | null>;
		let debug = "🎯 QUIZ RESULTS - ANALYZING MATCHES\n";
		debug += "=====================================\n\n";

		const heap = new MaxHeap();
		const artistScores: Array<ExtendedScoredArtist> = [];

		MOCK_ARTISTS.forEach((artist) => {
			let score = 0;
			const matches: string[] = [];
			let artistDebug = `👤 ${artist.name}:\n`;

			Object.entries(userAnswers).forEach(([qId, userVal]) => {
				const artistVal =
					artist.hot_takes[qId as keyof typeof artist.hot_takes];
				if (userVal !== null && userVal === artistVal) {
					score += 1;
					const questionObj = QUESTIONS.find((q) => q.id === qId);
					if (questionObj) {
						matches.push(questionObj.text);
						artistDebug += `  ✓ Q${qId}: "${questionObj.text}" (Both answered: ${userVal})\n`;
					}
				}
			});

			artistDebug += `  📈 Final Score: ${score} matches\n\n`;
			debug += artistDebug;

			const scoredArtist: ExtendedScoredArtist = {
				id: artist.id,
				name: artist.name,
				score,
				shared: matches,
			};
			artistScores.push(scoredArtist);

			heap.insert({
				id: artist.id,
				name: artist.name,
				score,
				hotTakes: matches,
			});
		});

		const sortedArtists = [...artistScores].sort((a, b) => b.score - a.score);
		const winner = sortedArtists[0] ?? null;
		const runners = sortedArtists.slice(1, 3);

		if (winner) {
			debug += "🏆 EXTRACTING TOP MATCH...\n";
			debug += `🏆 TOP MATCH: ${winner.name} with score ${winner.score}\n`;
		}

		return {
			topMatch: winner,
			runnerUps: winner ? runners : [],
			sharedBeliefs: winner ? winner.shared.slice(0, 4) : [],
			debugInfo: debug,
		};
	})();

	const { topMatch, runnerUps, sharedBeliefs, debugInfo } = result;

	if (!topMatch)
		return (
			<div className={styles.loading}>Calculating your creative DNA...</div>
		);

	return (
		<div className={styles.container}>
			<main className={styles.contentArea}>
				<header className={styles.header}>
					<p className={styles.title}>You aligned with</p>
					<h1 className={styles.winnerName}>{topMatch.name}</h1>
				</header>

				<section className={styles.winnerCard}>
					<p className={styles.winnerBio}>
						{MOCK_ARTISTS.find((a) => a.id === topMatch.id)?.bio}
					</p>
				</section>

				<section className={styles.beliefsSection}>
					<h3 className={styles.beliefsTitle}>Shared Perspectives</h3>
					<p className={styles.beliefsIntro}>
						Key areas where you and {topMatch.name} see eye-to-eye:
					</p>

					<ul className={styles.beliefsList}>
						{sharedBeliefs.map((text, index) => (
							<li key={index} className={styles.beliefItem}>
								<span className={styles.check}>✓</span> {text}
							</li>
						))}
					</ul>
				</section>

				{runnerUps.length > 0 && (
					<section style={{ marginTop: "30px", paddingTop: "20px" }}>
						<h3 className={styles.beliefsTitle}>Close Contenders</h3>
						<p className={styles.beliefsIntro}>
							Other artists you have a strong connection with:
						</p>
						<div
							style={{
								display: "flex",
								gap: "12px",
								flexDirection: "column",
							}}
						>
							{runnerUps.map((artist, idx) => (
								<div
									key={artist.id}
									style={{
										background: "#f9f9f9",
										padding: "12px",
										borderRadius: "6px",
										borderLeft: "3px solid #ddd",
									}}
								>
									<p
										style={{
											margin: "0 0 4px 0",
											fontWeight: "600",
											fontSize: "14px",
										}}
									>
										#{idx + 2} - {artist.name}
									</p>
									<p
										style={{
											margin: "0",
											fontSize: "12px",
											color: "#666",
										}}
									>
										{artist.score} shared{" "}
										{artist.score === 1 ? "belief" : "beliefs"}
									</p>
								</div>
							))}
						</div>
					</section>
				)}

				<section
					style={{
						marginTop: "30px",
						borderTop: "1px solid #eee",
						paddingTop: "20px",
					}}
				>
					<button
						onClick={() => setShowDebug(!showDebug)}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							fontSize: "14px",
							color: "#666",
							textDecoration: "underline",
							padding: "8px 0",
						}}
					>
						{showDebug ? "Hide" : "Show"} Ranking Analysis
					</button>
					{showDebug && (
						<pre
							style={{
								background: "#f5f5f5",
								padding: "12px",
								borderRadius: "6px",
								fontSize: "12px",
								lineHeight: "1.6",
								overflow: "auto",
								maxHeight: "300px",
								marginTop: "10px",
								fontFamily: "monospace",
							}}
						>
							{debugInfo}
						</pre>
					)}
				</section>

				<footer className={styles.actions}>
					<button className={styles.profileBtn}>View Profile</button>
					<button
						onClick={() => (window.location.href = "/discovery/quiz")}
						className={styles.retryBtn}
					>
						Try Again
					</button>
				</footer>
			</main>
		</div>
	);
}
