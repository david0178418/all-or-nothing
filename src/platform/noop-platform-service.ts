import type { PlatformService } from './types';

export function createNoopPlatformService(): PlatformService {
	return {
		isAvailable: false,
		init: async () => false,
		submitScore: async () => false,
		fetchLeaderboard: async () => [],
		getPlayerName: () => null,
	};
}
