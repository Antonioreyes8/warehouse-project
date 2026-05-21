"use client"; // Instructs Next.js to compile and execute this file purely on the client side (browser) to support Canvas rendering and React state hooks

import React, { useEffect, useRef, useState } from "react";
// Import Pretext's layout and rendering mechanics alongside its structural tracking cursor type
import {
	prepareWithSegments,
	layoutNextLineRange,
	materializeLineRange,
	type LayoutCursor,
} from "@chenglou/pretext";

/**
 * Type interface defining our structured text layout nodes.
 */
interface ManifestoParagraph {
	type: "body" | "emphasis" | "questions" | "radical-title";
	text: string;
}

/**
 * Type interface for tracking individual star vector objects.
 */
interface CelestialStar {
	id: number;
	xRatio: number; // Percentage offset across the screen width (0.1 = left, 0.9 = right)
	y: number; // Static pixel depth position down the layout column
	outerRadius: number;
	innerRadius: number;
	collisionRadius: number; // The push forcefield radius that forces typography to wrap out of the way
	color: string;
}

// Full semantic manifesto copy blocks integrated with your graphic identity texts
const MANIFESTO_PARAGRAPHS: ManifestoParagraph[] = [
	{
		type: "radical-title", // Bold sans-serif title header block from your image layout
		text: "What is The Diaspora Project?",
	},
	{
		type: "body",
		text: "We want to be part of a movement that reclaims social spaces from systems that extract, isolate, and commodify human expression. For us artistic expression is far from neutral, it's a form of resistence. We use our spaces to hold solidarity with oppressed communities and give a voice to marginalized communities. We are committed to building a digital and ambulant space.",
	},
	{
		type: "emphasis",
		text: "Diaspora is a digital and itinerant space dedicated to incentivize the creation of community and mutual care through art and its various expressions.",
	},
	{
		type: "body",
		text: "As creative work becomes shaped by market demands, art risks losing the freedom and meaning that give it power. Our mission is to redistribute influence within our community and empower those who have been systemically marginalized. We want to use our space as an instrument for the voices in our communities and we believe in art as a powerful tool for social change.",
	},
	{
		type: "emphasis",
		text: "Respect is an active choice. Unification, healing, and empowerment.",
	},
	{
		type: "radical-title", // Bold sans-serif title header block from your image layout
		text: "How to represent Diaspora?",
	},
	{
		type: "body",
		text: "We believe art and artist are inseparable. The art you support exists within a broader context, one that is often abstracted or erased. Neutrality and complicity allow harmful cycles to continue. In our effort to create change, we acknowledge our duty not only to be transparent and speak out, but to actively participate in the change we want to see. Who makes the art we consume and how do we feel about the art we consume?",
	},
	{
		type: "questions", // Handled with custom scaling logic below to step from small to big
		text: "???????",
	},
	{
		type: "radical-title", // Bold sans-serif title header block from your image layout
		text: "we deconstruct and reshape",
	},
	{
		type: "body",
		text: "Take an effort to reject your biases, put yourself in the context of another. It's often times those closest to us that we forget to make an effort for. The star symbol holds distinct meanings across deep contexts—it is the emblem of the state of Texas, a symbol used by liberatory movements worldwide, and a universal signifier of hope and power.",
	},
	{
		type: "emphasis",
		text: "our social conviction is radical. We claim emancipation.",
	},
	{
		type: "emphasis",
		text: "Support local art",
	},
];

/**
 * Procedural math helper to draw crisp, geometric 5-pointed wireframe star outlines.
 */
function drawGeometricStarOutline(
	ctx: CanvasRenderingContext2D,
	cx: number, // Center X vector
	cy: number, // Center Y vector
	spikes: number, // Set to 5 points
	outerRadius: number,
	innerRadius: number,
	color: string,
): void {
	let rot = (Math.PI / 2) * 3;
	let x = cx;
	let y = cy;
	const step = Math.PI / spikes;

	ctx.beginPath();
	ctx.moveTo(cx, cy - outerRadius);

	for (let i = 0; i < spikes; i++) {
		x = cx + Math.cos(rot) * outerRadius;
		y = cy + Math.sin(rot) * outerRadius;
		ctx.lineTo(x, y);
		rot += step;

		x = cx + Math.cos(rot) * innerRadius;
		y = cy + Math.sin(rot) * innerRadius;
		ctx.lineTo(x, y);
		rot += step;
	}

	ctx.lineTo(cx, cy - outerRadius);
	ctx.closePath();

	ctx.strokeStyle = color;
	ctx.lineWidth = 1.5; // Keeps outlines thin and elegant
	ctx.stroke();
}

export default function InteractiveCanvas(): React.JSX.Element {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Monitors container width to adjust layout dynamically on screens (caps at a readable 900px on desktop)
	const [lineWidthWidth, setLineWidthWidth] = useState<number>(900);

	// Five responsive white star outlines scattered evenly throughout your manifesto layout depth.
	const [stars, setStars] = useState<CelestialStar[]>([
		{
			id: 1,
			xRatio: 0.14,
			y: 160,
			outerRadius: 24,
			innerRadius: 9,
			collisionRadius: 44,
			color: "#ffffff",
		}, // Top left
		{
			id: 2,
			xRatio: 0.84,
			y: 380,
			outerRadius: 24,
			innerRadius: 9,
			collisionRadius: 44,
			color: "#ffffff",
		}, // Upper right
		{
			id: 3,
			xRatio: 0.2,
			y: 640,
			outerRadius: 24,
			innerRadius: 9,
			collisionRadius: 44,
			color: "#ffffff",
		}, // Center left
		{
			id: 4,
			xRatio: 0.76,
			y: 880,
			outerRadius: 24,
			innerRadius: 9,
			collisionRadius: 44,
			color: "#ffffff",
		}, // Lower right
		{
			id: 5,
			xRatio: 0.35,
			y: 1100,
			outerRadius: 24,
			innerRadius: 9,
			collisionRadius: 44,
			color: "#ffffff",
		}, // Bottom left (Safe from edge clipping)
	]);

	const [activeStarId, setActiveStarId] = useState<number | null>(null);

	// Recalibrates container scales cleanly when viewports shift or mobile devices tilt
	useEffect(() => {
		function handleResize() {
			if (containerRef.current) {
				const parentWidth = containerRef.current.getBoundingClientRect().width;
				setLineWidthWidth(Math.min(900, parentWidth));
			}
		}

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Support crisp Retina/High-DPI display resolutions
		const dpr = window.devicePixelRatio || 1;
		const logicalWidth = lineWidthWidth;
		const isMobile = logicalWidth < 500;

		const paragraphSpacing = isMobile ? 28 : 42;

		// =========================================================================
		// PASS 1: SYSTEM HEIGHT SIMULATION (Ghost Layout Processing Loop)
		// =========================================================================
		let dummyYOffset = 40;

		MANIFESTO_PARAGRAPHS.forEach((paragraph) => {
			// FIX: If this is the question block, add height manually and skip standard text loops
			if (paragraph.type === "questions") {
				const lineAdvance = isMobile ? 52 : 76; // Accommodate the height of the largest question mark
				dummyYOffset += lineAdvance + paragraphSpacing;
				return;
			}

			let fontSetting = `300 ${isMobile ? "16px" : "19.5px"} Inter, Georgia, serif`;
			let lineAdvance = isMobile ? 26 : 32;

			if (paragraph.type === "emphasis") {
				fontSetting = `italic 600 ${isMobile ? "20px" : "24px"} Inter, system-ui, sans-serif`;
				lineAdvance = isMobile ? 32 : 40;
			} else if (paragraph.type === "radical-title") {
				fontSetting = `900 ${isMobile ? "26px" : "36px"} Inter, system-ui, sans-serif`;
				lineAdvance = isMobile ? 36 : 46;
			}

			ctx.font = fontSetting;
			const preparedText = prepareWithSegments(paragraph.text, fontSetting);
			let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

			while (true) {
				let leftIndentMargin = 0;
				let rightIndentMargin = 0;

				stars.forEach((star) => {
					const actualX = star.xRatio * logicalWidth;
					const verticalIntersection =
						dummyYOffset > star.y - star.collisionRadius &&
						dummyYOffset < star.y + star.collisionRadius;
					if (verticalIntersection) {
						if (actualX < logicalWidth / 2) {
							leftIndentMargin = Math.max(
								leftIndentMargin,
								actualX + star.collisionRadius - 15,
							);
						} else {
							rightIndentMargin = Math.max(
								rightIndentMargin,
								logicalWidth - (actualX - star.collisionRadius) - 15,
							);
						}
					}
				});

				const sidePadding = isMobile ? 20 : 50;
				const dynamicLineWidth =
					logicalWidth - sidePadding - leftIndentMargin - rightIndentMargin;

				const range = layoutNextLineRange(
					preparedText,
					cursor,
					dynamicLineWidth,
				);
				if (range === null) break;

				cursor = range.end;
				dummyYOffset += lineAdvance;
			}
			dummyYOffset += paragraphSpacing;
		});

		// =========================================================================
		// CONTAINER RE-ALLOCATION (Resizing Content Nodes Safely Before Rendering)
		// =========================================================================
		const finalCalculatedHeight = dummyYOffset + 40;
		canvas.width = logicalWidth * dpr;
		canvas.height = finalCalculatedHeight * dpr;
		canvas.style.width = `${logicalWidth}px`;
		canvas.style.height = `${finalCalculatedHeight}px`;

		ctx.scale(dpr, dpr);
		ctx.clearRect(0, 0, logicalWidth, finalCalculatedHeight);

		// =========================================================================
		// PASS 2: GRAPHICS AND TYPE RENDERING (Drawing Content To Frame Outputs)
		// =========================================================================
		let yOffset = 40;

		MANIFESTO_PARAGRAPHS.forEach((paragraph) => {
			// UPDATE: Custom progressive scaling renderer for the raw identity question marks
			if (paragraph.type === "questions") {
				const numChars = paragraph.text.length;
				const startSize = isMobile ? 24 : 36; // Smallest size on the left
				const endSize = isMobile ? 54 : 78; // Largest size on the right
				const sizeStep = (endSize - startSize) / (numChars - 1);

				let leftIndentMargin = 0;
				let rightIndentMargin = 0;

				// Check collision forcefields at the current vertical marker line
				stars.forEach((star) => {
					const actualX = star.xRatio * logicalWidth;
					const verticalIntersection =
						yOffset > star.y - star.collisionRadius &&
						yOffset < star.y + star.collisionRadius;
					if (verticalIntersection) {
						if (actualX < logicalWidth / 2) {
							leftIndentMargin = Math.max(
								leftIndentMargin,
								actualX + star.collisionRadius - 15,
							);
						} else {
							rightIndentMargin = Math.max(
								rightIndentMargin,
								logicalWidth - (actualX - star.collisionRadius) - 15,
							);
						}
					}
				});

				const sidePadding = isMobile ? 10 : 25;
				const totalPaddingSpace = isMobile ? 20 : 50;
				const dynamicXOffset = sidePadding + leftIndentMargin;
				const dynamicLineWidth =
					logicalWidth -
					totalPaddingSpace -
					leftIndentMargin -
					rightIndentMargin;

				// Loop 1: Calculate cumulative width of all custom characters combined to center the cluster cleanly
				let totalWidth = 0;
				for (let i = 0; i < numChars; i++) {
					const currentSize = startSize + i * sizeStep;
					ctx.font = `900 ${currentSize}px Inter, system-ui, sans-serif`;
					totalWidth += ctx.measureText("?").width + (isMobile ? 2 : 5);
				}

				let currentX = dynamicXOffset + (dynamicLineWidth - totalWidth) / 2;

				// Loop 2: Draw each individual question mark character with an increasing font matrix step
				for (let i = 0; i < numChars; i++) {
					const currentSize = startSize + i * sizeStep;
					ctx.font = `500 ${currentSize}px Inter, system-ui, sans-serif`;
					ctx.fillStyle = "#ffffff"; // Faded raw aesthetic layer from your identity design layout

					// We adjust the baseline slightly down as size increases to keep them visually balanced
					ctx.fillText("?", currentX, yOffset + currentSize / 4);
					currentX += ctx.measureText("?").width + (isMobile ? 2 : 5);
				}

				const lineAdvance = isMobile ? 52 : 76;
				yOffset += lineAdvance + paragraphSpacing;
				return;
			}

			let fontSetting = `300 ${isMobile ? "16px" : "19.5px"} Inter, Georgia, serif`;
			let lineAdvance = isMobile ? 26 : 32;

			if (paragraph.type === "emphasis") {
				fontSetting = `italic 600 ${isMobile ? "20px" : "24px"} Inter, system-ui, sans-serif`;
				lineAdvance = isMobile ? 32 : 40;
				ctx.fillStyle = "#ffffff";
			} else if (paragraph.type === "radical-title") {
				fontSetting = `900 ${isMobile ? "26px" : "36px"} Inter, system-ui, sans-serif`;
				lineAdvance = isMobile ? 36 : 46;
				ctx.fillStyle = "#ffffff";
			} else {
				ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
			}

			ctx.font = fontSetting;
			const preparedText = prepareWithSegments(paragraph.text, fontSetting);
			let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

			while (true) {
				let leftIndentMargin = 0;
				let rightIndentMargin = 0;

				stars.forEach((star) => {
					const actualX = star.xRatio * logicalWidth;
					const verticalIntersection =
						yOffset > star.y - star.collisionRadius &&
						yOffset < star.y + star.collisionRadius;

					if (verticalIntersection) {
						if (actualX < logicalWidth / 2) {
							leftIndentMargin = Math.max(
								leftIndentMargin,
								actualX + star.collisionRadius - 15,
							);
						} else {
							rightIndentMargin = Math.max(
								rightIndentMargin,
								logicalWidth - (actualX - star.collisionRadius) - 15,
							);
						}
					}
				});

				const sidePadding = isMobile ? 10 : 25;
				const totalPaddingSpace = isMobile ? 20 : 50;

				const dynamicXOffset = sidePadding + leftIndentMargin;
				const dynamicLineWidth =
					logicalWidth -
					totalPaddingSpace -
					leftIndentMargin -
					rightIndentMargin;

				const range = layoutNextLineRange(
					preparedText,
					cursor,
					dynamicLineWidth,
				);
				if (range === null) break;

				const materializedLine = materializeLineRange(preparedText, range);
				ctx.fillText(materializedLine.text, dynamicXOffset, yOffset);

				cursor = range.end;
				yOffset += lineAdvance;
			}
			yOffset += paragraphSpacing;
		});

		// Draw all five standard star outlines seamlessly over text layout bounds
		stars.forEach((star) => {
			const actualX = star.xRatio * logicalWidth;
			drawGeometricStarOutline(
				ctx,
				actualX,
				star.y,
				5,
				star.outerRadius,
				star.innerRadius,
				star.color,
			);
		});
	}, [stars, lineWidthWidth]);

	/**
	 * Universal Selection Input Capturer (Touch + Mouse Unified)
	 */
	const processInputStart = (clientX: number, clientY: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const clickX = clientX - rect.left;
		const clickY = clientY - rect.top;

		const targetStar = stars.find((star) => {
			const actualX = star.xRatio * lineWidthWidth;
			const distance = Math.hypot(actualX - clickX, star.y - clickY);
			return distance < star.outerRadius + 22;
		});

		if (targetStar) {
			setActiveStarId(targetStar.id);
		}
	};

	/**
	 * Universal Transformation Move Capturer (Touch + Mouse Unified)
	 */
	const processInputMove = (clientX: number, clientY: number) => {
		if (activeStarId === null || !canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const currentX = clientX - rect.left;
		const currentY = clientY - rect.top;

		const boundedX = Math.max(20, Math.min(lineWidthWidth - 20, currentX));
		const boundedY = Math.max(40, Math.min(1300, currentY));

		const updatedXRatio = boundedX / lineWidthWidth;

		setStars((prevStars) =>
			prevStars.map((star) =>
				star.id === activeStarId
					? { ...star, xRatio: updatedXRatio, y: boundedY }
					: star,
			),
		);
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) =>
		processInputStart(e.clientX, e.clientY);
	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) =>
		processInputMove(e.clientX, e.clientY);

	const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
		const touch = e.touches[0];
		processInputStart(touch.clientX, touch.clientY);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
		const touch = e.touches[0];
		processInputMove(touch.clientX, touch.clientY);
	};

	const handleInputRelease = () => setActiveStarId(null);

	return (
		<div ref={containerRef} style={{ width: "100%", display: "block" }}>
			<canvas
				ref={canvasRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleInputRelease}
				onMouseLeave={handleInputRelease}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleInputRelease}
				style={{
					cursor: activeStarId ? "grabbing" : "grab",
					display: "block",
					margin: "0 auto",
					width: "100%",
					maxWidth: "900px",
					background: "transparent",
					touchAction: "none",
				}}
			/>
		</div>
	);
}
