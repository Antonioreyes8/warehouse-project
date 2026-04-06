/**
 * File: next.config.ts
 * Purpose: Next.js configuration file for build and runtime settings.
 * Responsibilities:
 *   - Configure image domains for remote loading
 *   - Set up Next.js build options
 * Key Concepts:
 *   - Next.js configuration object
 * Dependencies:
 *   - None
 * How It Fits:
 *   - Used by Next.js build system for application configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "sshdocgpnnptiftcccei.supabase.co",
			},
		],
	},
};

module.exports = nextConfig;
