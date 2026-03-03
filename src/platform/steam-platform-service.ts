import type { PlatformService, LeaderboardFetchOptions, GameCompletionData } from './types';

export function createSteamPlatformService(): PlatformService {
	const api = window.electronAPI?.steam;
	let initialized = false;

	return {
		get isAvailable() {
			return initialized;
		},

		async init() {
			if (!api) return false;
			try {
				initialized = await api.init();
				return initialized;
			} catch {
				console.warn('Steam initialization failed');
				return false;
			}
		},

		async submitScore(data: GameCompletionData) {
			if (!api || !initialized) return false;
			try {
				return await api.submitScore(data);
			} catch {
				console.warn('Score submission failed');
				return false;
			}
		},

		async fetchLeaderboard(options: LeaderboardFetchOptions) {
			if (!api || !initialized) return [];
			try {
				return await api.fetchLeaderboard(options);
			} catch {
				console.warn('Leaderboard fetch failed');
				return [];
			}
		},

		async getPlayerName() {
			if (!api || !initialized) return null;
			try {
				return await api.getPlayerName() ?? null;
			} catch {
				return null;
			}
		},
	};
}
