import type { PlatformService } from './types';

export function createNoopPlatformService(): PlatformService {
	return {
		get isAvailable() {
			return false;
		},

		async init() {
			return false;
		},

		async submitScore() {
			return false;
		},

		async fetchLeaderboard() {
			return [];
		},

		async getPlayerName() {
			return null;
		},
	};
}
