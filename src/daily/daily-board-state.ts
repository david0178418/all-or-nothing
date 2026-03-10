import { formatDate } from './daily-streaks';
import { getPacificDate } from './pacific-date';

const STORAGE_KEY_PREFIX = 'daily-board-state-';

interface DailyBoardState {
	flippedCardIds: string[];
	setsFound: number;
}

function todayKey(): string {
	return `${STORAGE_KEY_PREFIX}${formatDate(getPacificDate())}`;
}

export
function saveDailyBoardState(flippedCardIds: ReadonlySet<string>, setsFound: number): void {
	const state: DailyBoardState = {
		flippedCardIds: [...flippedCardIds],
		setsFound,
	};
	localStorage.setItem(todayKey(), JSON.stringify(state));
}

export
function loadDailyBoardState(): { flippedCardIds: Set<string>; setsFound: number } | null {
	const raw = localStorage.getItem(todayKey());
	if (!raw) return null;

	try {
		const parsed: unknown = JSON.parse(raw);

		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			'flippedCardIds' in parsed &&
			'setsFound' in parsed &&
			Array.isArray((parsed as DailyBoardState).flippedCardIds) &&
			typeof (parsed as DailyBoardState).setsFound === 'number'
		) {
			const state = parsed as DailyBoardState;
			return {
				flippedCardIds: new Set(state.flippedCardIds),
				setsFound: state.setsFound,
			};
		}

		return null;
	} catch {
		return null;
	}
}

export
function clearDailyBoardState(): void {
	localStorage.removeItem(todayKey());
}
