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
