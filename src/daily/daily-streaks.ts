import { getPacificDate } from './pacific-date';

const STREAK_STORAGE_KEY = 'daily-streak-data';

interface DailyStreakData {
	currentStreak: number;
	lastCompletionDate: string; // "YYYY-MM-DD"
}

export
function formatDate(date: Date): string {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function todayPacific(): string {
	return formatDate(getPacificDate());
}

function parseDailyStreakData(raw: string | null): DailyStreakData | null {
	if (!raw) return null;

	try {
		const parsed: unknown = JSON.parse(raw);

		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			'currentStreak' in parsed &&
			'lastCompletionDate' in parsed &&
			typeof (parsed as DailyStreakData).currentStreak === 'number' &&
			typeof (parsed as DailyStreakData).lastCompletionDate === 'string'
		) {
			return parsed as DailyStreakData;
		}

		return null;
	} catch {
		return null;
	}
}

function daysBetween(dateStrA: string, dateStrB: string): number {
	const a = new Date(dateStrA + 'T00:00:00');
	const b = new Date(dateStrB + 'T00:00:00');
	return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export
function getDailyStreakData(): DailyStreakData {
	const raw = localStorage.getItem(STREAK_STORAGE_KEY);
	const data = parseDailyStreakData(raw);

	if (!data) {
		return { currentStreak: 0, lastCompletionDate: '' };
	}

	// Streak is broken if last completion was more than 1 day ago
	const today = todayPacific();
	const gap = data.lastCompletionDate ? daysBetween(today, data.lastCompletionDate) : Infinity;

	if (gap > 1) {
		return { currentStreak: 0, lastCompletionDate: data.lastCompletionDate };
	}

	return data;
}

export
function recordDailyCompletion(): DailyStreakData {
	const today = todayPacific();
	const existing = getDailyStreakData();

	// Already completed today
	if (existing.lastCompletionDate === today) {
		return existing;
	}

	const gap = existing.lastCompletionDate ? daysBetween(today, existing.lastCompletionDate) : Infinity;
	const newStreak = gap === 1 ? existing.currentStreak + 1 : 1;

	const updated: DailyStreakData = {
		currentStreak: newStreak,
		lastCompletionDate: today,
	};

	localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));

	return updated;
}

export
function isDailyCompletedToday(): boolean {
	const data = getDailyStreakData();
	const today = todayPacific();
	return data.lastCompletionDate === today;
}

export
function getCurrentStreak(): number {
	return getDailyStreakData().currentStreak;
}
