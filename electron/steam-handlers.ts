import { ipcMain } from 'electron';

const STEAM_LEADERBOARD_NAMES = {
	score: 'Highscores',
	time: 'BestTimes',
	combo: 'MaxCombo',
} as const;

const SORT_METHODS = {
	score: 'Descending',
	time: 'Ascending',
	combo: 'Descending',
} as const;

const FETCH_TYPE_MAP = {
	global: 'Global',
	'around-user': 'GlobalAroundUser',
	friends: 'Friends',
} as const;

interface SteamClient {
	leaderboard: {
		uploadScore(name: string, score: number, sortMethod: string): Promise<boolean>;
		getScores(name: string, fetchType: string, start: number, end: number): Promise<Array<{
			globalRank: number;
			steamId: { personaName: string };
			score: number;
		}>>;
	};
	localplayer: {
		getName(): string;
	};
}

let steamClient: SteamClient | null = null;

export function registerSteamHandlers(appId: number) {
	ipcMain.handle('steam:init', async () => {
		try {
			const steamworks = await import('steamworks.js');
			steamClient = steamworks.init(appId) as unknown as SteamClient;
			return true;
		} catch {
			console.warn('Failed to initialize Steamworks');
			return false;
		}
	});

	ipcMain.handle('steam:submitScore', async (_event, data: { score: number; time: number; maxCombo: number }) => {
		if (!steamClient) return false;
		try {
			const results = await Promise.all([
				steamClient.leaderboard.uploadScore(STEAM_LEADERBOARD_NAMES.score, data.score, SORT_METHODS.score),
				steamClient.leaderboard.uploadScore(STEAM_LEADERBOARD_NAMES.time, data.time, SORT_METHODS.time),
				steamClient.leaderboard.uploadScore(STEAM_LEADERBOARD_NAMES.combo, data.maxCombo, SORT_METHODS.combo),
			]);
			return results.every(Boolean);
		} catch {
			return false;
		}
	});

	ipcMain.handle('steam:fetchLeaderboard', async (_event, options: { leaderboard: string; fetchType: string; rangeStart: number; rangeEnd: number }) => {
		if (!steamClient) return [];
		try {
			const boardKey = options.leaderboard as keyof typeof STEAM_LEADERBOARD_NAMES;
			const fetchKey = options.fetchType as keyof typeof FETCH_TYPE_MAP;
			const steamName = STEAM_LEADERBOARD_NAMES[boardKey];
			const fetchType = FETCH_TYPE_MAP[fetchKey];
			if (!steamName || !fetchType) return [];

			const entries = await steamClient.leaderboard.getScores(steamName, fetchType, options.rangeStart, options.rangeEnd);
			return entries.map(entry => ({
				rank: entry.globalRank,
				playerName: entry.steamId.personaName,
				score: entry.score,
			}));
		} catch {
			return [];
		}
	});

	ipcMain.handle('steam:getPlayerName', () => {
		if (!steamClient) return null;
		try {
			return steamClient.localplayer.getName();
		} catch {
			return null;
		}
	});
}
