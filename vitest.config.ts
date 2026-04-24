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
			exclude: ["**/*.d.ts"],
			thresholds: {
				branches: 90,
				functions: 90,
				lines: 90,
				statements: 90,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
