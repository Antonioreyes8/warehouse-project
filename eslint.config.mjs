/**
 * File: eslint.config.mjs
 * Purpose: Defines the project's ESLint configuration using Next.js recommended rules.
 * Responsibilities:
 *   - Extend Next.js core web vitals and TypeScript linting presets
 *   - Customize global ignore patterns for build artifacts
 * Key Concepts:
 *   - Shared linting config for consistent code quality
 *   - Integration with Next.js ESLint presets
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"coverage/**",
		"next-env.d.ts",
	]),
]);

export default eslintConfig;
