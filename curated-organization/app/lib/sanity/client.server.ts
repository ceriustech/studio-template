import { createClient, type SanityClient } from '@sanity/client';

let client: SanityClient | null = null;
let warnedUnconfigured = false;

if (import.meta.env.DEV) {
	try {
		process.loadEnvFile();
	} catch {
		// No .env file in development; rely on the shell environment.
	}
}

export function getSanityClient(): SanityClient | null {
	if (client) return client;

	const projectId = process.env.SANITY_PROJECT_ID;
	if (!projectId) {
		if (!warnedUnconfigured) {
			console.warn('[sanity] Sanity is not configured (SANITY_PROJECT_ID missing), serving fallback content');
			warnedUnconfigured = true;
		}
		return null;
	}

	client = createClient({
		projectId,
		dataset: process.env.SANITY_DATASET || 'production',
		apiVersion: '2026-09-01',
		useCdn: true,
		perspective: 'published',
		// Keeps a slow Sanity response from stalling every page render.
		timeout: 2000,
	});
	return client;
}
