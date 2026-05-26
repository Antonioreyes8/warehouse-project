"use client";
import { useState, useEffect, useRef, startTransition } from "react";
import {
	MaxHeap,
	ArtistSearchTree,
	ScoredArtist,
} from "@/lib/discovery/maxHeap";
import { QUESTIONS } from "@/lib/discovery/questions";
import { fetchDiscoveryArtists } from "@/lib/discovery/apis";
import styles from "./result.module.css";

interface ExtendedScoredArtist extends ScoredArtist {
	shared: string[];
}

interface QuizResult {
	topMatch: ExtendedScoredArtist | null;
	runnerUps: ExtendedScoredArtist[];
	sharedBeliefs: string[];
	debugInfo: string;
	searchTree: ArtistSearchTree;
}

// We'll load artists from Supabase instead of using mock data.

export default function ResultPage() {
	const [result, setResult] = useState<QuizResult | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [foundArtist, setFoundArtist] = useState<ScoredArtist | null>(null);
	const [artists, setArtists] = useState<
		Array<{
			id: string;
			name?: string | null;
			username?: string | null;
			bio?: string | null;
			hot_takes?: Record<string, boolean> | null;
			score?: number;
		}>
	>([]);

	useEffect(() => {
		// We wrap the logic in a function and call it via setTimeout.
		// This makes the state update asynchronous, which prevents "cascading renders"
		// and satisfies the React Compiler lint rules.
		const timer = setTimeout(() => {
			const rawAnswers = localStorage.getItem("user_answers");
			if (!rawAnswers) {
				setResult({
					topMatch: null,
					runnerUps: [],
					sharedBeliefs: [],
					debugInfo: "",
					searchTree: new ArtistSearchTree(),
				});
				return;
			}

			const userAnswers = JSON.parse(rawAnswers);

			// --- INITIALIZE CONSOLE LOGS ---
			console.log("🚀 STARTING COMPLEXITY ANALYSIS...");
			let debug =
				"🎯 QUIZ RESULTS - ANALYZING MATCHES\n=====================================\n\n";

			const heap = new MaxHeap();
			const tree = new ArtistSearchTree();
			const artistScores: Array<ExtendedScoredArtist> = [];

			(async () => {
				const fetched = await fetchDiscoveryArtists();

				fetched.forEach((artist) => {
					const name = artist.name ?? "Unknown";
					let score = 0;
					const matches: string[] = [];
					let artistDebug = `👤 ${name}:\\n`;

					Object.entries(userAnswers).forEach(([qId, userVal]) => {
						const artistVal =
							artist.hot_takes?.[qId as keyof typeof artist.hot_takes];
						if (userVal !== null && userVal === artistVal) {
							score += 1;
							const questionObj = QUESTIONS.find((q) => q.id === qId);
							if (questionObj) {
								matches.push(questionObj.text);
								artistDebug += `  ✓ Q${qId}: "${questionObj.text}" (Both answered: ${userVal})\\n`;
							}
						}
					});

					artistDebug += `  📈 Final Score: ${score} matches\\n\\n`;
					debug += artistDebug;

					const scoredArtist: ExtendedScoredArtist = {
						id: String(artist.id),
						name,
						score,
						shared: matches,
					};

					artistScores.push(scoredArtist);

					console.log(
						`✨ Inserting ${name} into MaxHeap and AVL Tree (Score: ${score})`,
					);
					heap.insert(scoredArtist);
					tree.insert(scoredArtist);
				});

				// Attach computed scores back onto the fetched artist rows so the UI
				// can show name + score and link to the public profile when available.
				const scoreById: Record<string, number> = {};
				artistScores.forEach((s) => {
					scoreById[s.id] = s.score;
				});

				const artistsWithScores = fetched.map((a) => ({
					id: String(a.id),
					name: a.name,
					username: (a as any).username ?? null,
					bio: a.bio,
					hot_takes: a.hot_takes,
					score: scoreById[String(a.id)] ?? 0,
				}));

				setArtists(artistsWithScores);

				const sortedArtists = [...artistScores].sort(
					(a, b) => b.score - a.score,
				);
				const winner = sortedArtists[0] ?? null;

				if (winner) {
					debug += `🏆 TOP MATCH IDENTIFIED: ${winner.name} (Score: ${winner.score})\\n`;
					console.log("🏆 TOP MATCH:", winner);
				}

				setResult({
					topMatch: winner,
					runnerUps: winner ? sortedArtists.slice(1, 4) : [],
					sharedBeliefs: winner ? winner.shared.slice(0, 4) : [],
					debugInfo: debug,
					searchTree: tree,
				});
			})();
		}, 0);

		return () => clearTimeout(timer);
	}, []);

	// debounce timer for live search
	const searchTimer = useRef<number | null>(null);

	const handleLiveSearch = (term: string) => {
		setFoundArtist(null);
		if (!term || !result) return;
		if (searchTimer.current) window.clearTimeout(searchTimer.current);
		searchTimer.current = window.setTimeout(() => {
			try {
				const r = result.searchTree.search(term);
				setFoundArtist(r || null);
			} catch (e) {
				console.warn("Search error:", e);
			}
		}, 150);
	};

	useEffect(() => {
		return () => {
			if (searchTimer.current) window.clearTimeout(searchTimer.current);
		};
	}, []);

	const handleSearch = () => {
		if (!result) return;
		console.log(`🔍 Searching AVL Tree for: "${searchTerm}"`);
		const searchResult = result.searchTree.search(searchTerm);

		if (searchResult) {
			console.log("✅ Match found in tree:", searchResult);
		} else {
			console.log("❌ No match found for:", searchTerm);
		}

		setFoundArtist(searchResult || null);
	};

	if (!result || !result.topMatch) {
		return (
			<div className={styles.loading}>Calculating your creative DNA...</div>
		);
	}

	const { topMatch, runnerUps, sharedBeliefs, debugInfo } = result;

	return (
		<div className={styles.container}>
			<main className={styles.contentArea}>
				<header className={styles.header}>
					<p className={styles.title}>You aligned with</p>
					<h1 className={styles.winnerName}>{topMatch.name}</h1>
				</header>

				<section className={styles.winnerCard}>
					<p className={styles.winnerBio}>
						{artists.find((a) => String(a.id) === topMatch.id)?.bio}
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
					<div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
						<input
							type="text"
							placeholder="Enter artist name..."
							value={searchTerm}
							onChange={(e) => {
								const v = e.target.value;
								setSearchTerm(v);
								handleLiveSearch(v);
							}}
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
							Search
						</button>
					</div>

					{/* Live suggestions based on typed letters */}
					{searchTerm && artists.length > 0 && (
						<div style={{ marginBottom: "12px" }}>
							{artists
								.filter(
									(a) =>
										a.name &&
										a.name.toLowerCase().includes(searchTerm.toLowerCase()),
								)
								.slice(0, 6)
								.map((a) => (
									<button
										key={a.id}
										onClick={() => {
											setSearchTerm(a.name || "");
											handleLiveSearch(a.name || "");
										}}
										style={{
											padding: "6px 10px",
											borderRadius: "6px",
											border: "1px solid #ddd",
											background: "#fff",
											cursor: "pointer",
											margin: "4px 6px 0 0",
										}}
									>
										{a.name}
									</button>
								))}
						</div>
					)}

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
								Best Match:
							</p>
							<p style={{ margin: "5px 0" }}>
								{foundArtist.name}: <strong>{foundArtist.score}</strong> matches
							</p>
							<div style={{ marginTop: 8 }}>
								<button
									onClick={() => {
										const a = artists.find(
											(x) => String(x.id) === String(foundArtist.id),
										);
										const profileUrl = a?.username
											? `/artists/${a.username}`
											: `/artists/${foundArtist.id}`;
										window.location.href = profileUrl;
									}}
									style={{
										padding: "8px 12px",
										borderRadius: "8px",
										border: "none",
										background: "#007bff",
										color: "#fff",
										cursor: "pointer",
									}}
								>
									View Profile
								</button>
							</div>
						</div>
					) : (
						searchTerm && (
							<p style={{ fontSize: "14px", color: "#6c757d" }}>
								No result found for "{searchTerm}".
							</p>
						)
					)}
				</section>

				<footer className={styles.actions}>
					<button
						onClick={() => {
							const topArtist = artists.find(
								(a) => String(a.id) === topMatch.id,
							);
							const profileUrl = topArtist?.username
								? `/artists/${topArtist.username}`
								: `/artists/${topMatch.id}`;
							window.location.href = profileUrl;
						}}
						className={styles.profileBtn}
					>
						View Profile
					</button>
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
