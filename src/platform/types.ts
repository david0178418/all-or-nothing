import type { Enum } from '@/types';

export const LeaderboardName = { Score: 'score', Time: 'time', Combo: 'combo' } as const;
export type LeaderboardName = Enum<typeof LeaderboardName>;

export const LeaderboardFetchType = { Global: 'global', AroundUser: 'around-user', Friends: 'friends' } as const;
export type LeaderboardFetchType = Enum<typeof LeaderboardFetchType>;

export interface LeaderboardEntry {
	readonly rank: number;
	readonly playerName: string;
	readonly score: number;
}

export interface LeaderboardFetchOptions {
	readonly leaderboard: LeaderboardName;
	readonly fetchType: LeaderboardFetchType;
	readonly rangeStart: number;
	readonly rangeEnd: number;
}

export interface GameCompletionData {
	readonly score: number;
	readonly time: number;
	readonly maxCombo: number;
}

export interface PlatformService {
	readonly isAvailable: boolean;
	init(): Promise<boolean>;
	submitScore(data: GameCompletionData): Promise<boolean>;
	fetchLeaderboard(options: LeaderboardFetchOptions): Promise<readonly LeaderboardEntry[]>;
	getPlayerName(): string | null;
}
