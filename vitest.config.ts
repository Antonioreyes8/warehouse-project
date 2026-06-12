/**
 * File: vitest.config.ts
 * Purpose: Configures the Vitest test runner for this Next.js project.
 * Responsibilities:
 *   - Set the jsdom environment for component-like tests
 *   - Load shared setup files and enable global test APIs
 *   - Configure coverage reporting and file alias resolution
 * Key Concepts:
 *   - Central test environment configuration for consistent test execution
 */
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		globals: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: [
				"lib/artists/**/*.ts",
				"lib/auth/**/*.ts",
				"lib/projects/**/*.ts",
			],
			exclude: [
				"**/*.d.ts",
				"lib/artists/profileFieldDescriptions.ts",
				"lib/projects/**/*.ts",
			],
			thresholds: {
				lines: 25,
				statements: 25,
				functions: 77,
				branches: 78,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
