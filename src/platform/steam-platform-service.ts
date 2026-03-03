import type { PlatformService, LeaderboardFetchOptions, GameCompletionData } from './types';

export function createSteamPlatformService(): PlatformService {
	const api = window.electronAPI?.steam;

	return {
		async init() {
			if (!api) return false;
			try {
				return await api.init();
			} catch {
				console.warn('Steam initialization failed');
				return false;
			}
		},

		async submitScore(data: GameCompletionData) {
			if (!api) return false;
			try {
				return await api.submitScore(data);
			} catch {
				console.warn('Score submission failed');
				return false;
			}
		},

		async fetchLeaderboard(options: LeaderboardFetchOptions) {
			if (!api) return [];
			try {
				return await api.fetchLeaderboard(options);
			} catch {
				console.warn('Leaderboard fetch failed');
				return [];
			}
		},

		async getPlayerName() {
			if (!api) return null;
			try {
				return await api.getPlayerName() ?? null;
			} catch {
				return null;
			}
		},
	};
}
