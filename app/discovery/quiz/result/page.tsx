"use client";
import { useState, useEffect, useMemo } from "react";
import {
	MaxHeap,
	ArtistSearchTree,
	ScoredArtist,
} from "@/lib/discovery/maxHeap";
import { QUESTIONS } from "@/lib/discovery/questions";
import styles from "./result.module.css";

interface ExtendedScoredArtist extends ScoredArtist {
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
	{
		id: "11",
		name: "Pixel Forge",
		bio: "Game developer and pixel art specialist.",
		hot_takes: { q1: true, q5: true, q6: true, q15: false, q16: true },
	},
	{
		id: "12",
		name: "Echo Collective",
		bio: "Collaborative sound art installation creators.",
		hot_takes: { q2: true, q3: true, q9: false, q11: true, q18: false },
	},
	{
		id: "13",
		name: "Sage Winters",
		bio: "Poet and spoken word artist.",
		hot_takes: { q4: true, q7: false, q11: true, q13: true, q21: true },
	},
	{
		id: "14",
		name: "Flux Capacitor",
		bio: "Electronic musician blending vintage and modern synthesis.",
		hot_takes: { q3: true, q8: true, q15: false, q17: true, q20: false },
	},
	{
		id: "15",
		name: "Terra Nova",
		bio: "Environmental photographer and climate activist.",
		hot_takes: { q1: true, q5: true, q11: true, q12: true, q19: true },
	},
	{
		id: "16",
		name: "Code Canvas",
		bio: "Generative art programmer and algorithm artist.",
		hot_takes: { q1: true, q5: true, q6: true, q14: true, q15: false },
	},
	{
		id: "17",
		name: "Rhythm Weaver",
		bio: "World music fusion composer and multi-instrumentalist.",
		hot_takes: { q2: true, q4: true, q8: false, q9: true, q13: true },
	},
	{
		id: "18",
		name: "Shadow Play",
		bio: "Theater director specializing in avant-garde productions.",
		hot_takes: { q3: false, q7: false, q11: true, q17: true, q18: true },
	},
	{
		id: "19",
		name: "Crystal Clear",
		bio: "Glassblower and installation artist.",
		hot_takes: { q1: false, q10: true, q12: true, q14: true, q21: false },
	},
	{
		id: "20",
		name: "Byte Bender",
		bio: "Digital media artist and VR experience creator.",
		hot_takes: { q1: true, q5: true, q6: true, q15: false, q16: true },
	},
	{
		id: "21",
		name: "Harmony Lane",
		bio: "Choral conductor and composer for contemporary ensembles.",
		hot_takes: { q2: true, q4: true, q9: true, q11: false, q20: true },
	},
	{
		id: "22",
		name: "Urban Canvas",
		bio: "Graffiti artist and community mural coordinator.",
		hot_takes: { q2: true, q4: true, q7: true, q13: true, q18: false },
	},
	{
		id: "23",
		name: "Quantum Quill",
		bio: "Science fiction author and world-builder.",
		hot_takes: { q3: true, q5: true, q11: true, q15: false, q21: true },
	},
	{
		id: "24",
		name: "Sonic Boom",
		bio: "Heavy metal guitarist and songwriter.",
		hot_takes: { q3: false, q4: false, q8: true, q17: true, q18: true },
	},
	{
		id: "25",
		name: "Fiber Arts",
		bio: "Textile artist specializing in sustainable weaving techniques.",
		hot_takes: { q1: true, q5: true, q10: false, q12: true, q19: true },
	},
];

export default function ResultPage() {
	const [isMounted, setIsMounted] = useState(false);
	const [showDebug, setShowDebug] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [foundArtist, setFoundArtist] = useState<ScoredArtist | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const result = useMemo(() => {
		if (typeof window === "undefined") {
			return {
				topMatch: null,
				runnerUps: [],
				sharedBeliefs: [],
				debugInfo: "",
				searchTree: new ArtistSearchTree(),
			};
		}

		const rawAnswers = localStorage.getItem("user_answers");
		if (!rawAnswers) {
			return {
				topMatch: null,
				runnerUps: [],
				sharedBeliefs: [],
				debugInfo: "",
				searchTree: new ArtistSearchTree(),
			};
		}

		const userAnswers = JSON.parse(rawAnswers);

		// --- INITIALIZE CONSOLE LOGS ---
		console.log("🚀 STARTING COMPLEXITY ANALYSIS...");
		let debug =
			"🎯 QUIZ RESULTS - ANALYZING MATCHES\n=====================================\n\n";

		const heap = new MaxHeap();
		const tree = new ArtistSearchTree();
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

			// Console logging for data structure insertion
			console.log(
				`✨ Inserting ${artist.name} into MaxHeap and AVL Tree (Score: ${score})`,
			);
			heap.insert(scoredArtist);
			tree.insert(scoredArtist);
		});

		const sortedArtists = [...artistScores].sort((a, b) => b.score - a.score);
		const winner = sortedArtists[0] ?? null;

		if (winner) {
			debug += `🏆 TOP MATCH IDENTIFIED: ${winner.name} (Score: ${winner.score})\n`;
			console.log("🏆 TOP MATCH:", winner);
		}

		return {
			topMatch: winner,
			runnerUps: winner ? sortedArtists.slice(1, 4) : [],
			sharedBeliefs: winner ? winner.shared.slice(0, 4) : [],
			debugInfo: debug,
			searchTree: tree,
		};
	}, []);

	const { topMatch, runnerUps, sharedBeliefs, debugInfo, searchTree } = result;

	const handleSearch = () => {
		console.log(`🔍 Searching AVL Tree for: "${searchTerm}"`);
		const searchResult = searchTree.search(searchTerm);

		if (searchResult) {
			console.log("✅ Match found in tree:", searchResult);
		} else {
			console.log("❌ No match found for:", searchTerm);
		}

		setFoundArtist(searchResult || null);
	};

	if (!isMounted || !topMatch) {
		return (
			<div className={styles.loading}>Calculating your creative DNA...</div>
		);
	}

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
					<ul className={styles.beliefsList}>
						{sharedBeliefs.map((text, index) => (
							<li key={index} className={styles.beliefItem}>
								<span className={styles.check}>✓</span> {text}
							</li>
						))}
					</ul>
				</section>

				{/* --- RUNNERS --- */}
				{runnerUps.length > 0 && (
					<section style={{ marginTop: "30px", paddingTop: "20px" }}>
						<h3 className={styles.beliefsTitle}>Close Contenders</h3>
						<div
							style={{ display: "flex", gap: "12px", flexDirection: "column" }}
						>
							{runnerUps.map((artist, idx) => (
								<div
									key={artist.id}
									style={{
										background: "#fff",
										padding: "12px",
										borderRadius: "8px",
										border: "1px solid #eee",
									}}
								>
									<p style={{ margin: "0", fontWeight: "600" }}>
										#{idx + 2} - {artist.name}
									</p>
									<p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
										{artist.score} shared beliefs
									</p>
								</div>
							))}
						</div>
					</section>
				)}

				{/* --- SEARCH SECTION --- */}
				<section
					style={{
						marginTop: "40px",
						padding: "20px",
						background: "#f8f9fa",
						borderRadius: "12px",
						border: "1px solid #e9ecef",
					}}
				>
					<h3 className={styles.beliefsTitle}>Check Other Artist Scores</h3>
					<div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
						<input
							type="text"
							placeholder="Enter artist name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{
								flex: 1,
								padding: "12px",
								borderRadius: "8px",
								border: "1px solid #ced4da",
							}}
						/>
						<button
							onClick={handleSearch}
							style={{
								padding: "10px 20px",
								background: "#007bff",
								color: "#fff",
								borderRadius: "8px",
								border: "none",
								cursor: "pointer",
							}}
						>
							Search Tree
						</button>
					</div>

					{foundArtist ? (
						<div
							style={{
								background: "#e7f3ff",
								padding: "15px",
								borderRadius: "8px",
								border: "1px solid #b8daff",
							}}
						>
							<p style={{ margin: "0", color: "#004085", fontWeight: "bold" }}>
								AVL Tree Search Result:
							</p>
							<p style={{ margin: "5px 0" }}>
								{foundArtist.name}: <strong>{foundArtist.score}</strong> matches
							</p>
						</div>
					) : (
						searchTerm && (
							<p style={{ fontSize: "14px", color: "#6c757d" }}>
								No result found in search tree.
							</p>
						)
					)}
				</section>

				{/* --- DEBUG PANEL --- */}
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
							color: "#6c757d",
							textDecoration: "underline",
							cursor: "pointer",
						}}
					>
						{showDebug ? "Hide" : "Show"} Detailed Log Analysis
					</button>
					{showDebug && (
						<pre
							style={{
								background: "#222",
								color: "#0f0",
								padding: "15px",
								marginTop: "10px",
								borderRadius: "6px",
								fontSize: "11px",
								overflow: "auto",
								maxHeight: "300px",
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
						Retry Quiz
					</button>
				</footer>
			</main>
		</div>
	);
}
